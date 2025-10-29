import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { setupAuth, isAuthenticated } from "./localAuth";
import { 
  insertStudentProfileSchema, 
  insertTodoSchema, 
  insertChatMessageSchema,
  insertAchievementSchema,
  insertStudentCourseProgressSchema,
  registerUserSchema,
  loginUserSchema,
  verifyEmailSchema,
  requestPasswordSetupSchema,
  completePasswordSetupSchema,
  changePasswordSchema,
  type SafeUser
} from "@shared/schema";
import { generateAcademicPathway } from "./services/pathwayGenerator";
import { getChatResponse } from "./services/openai";
import type { User } from "@shared/schema";

// Development-only token cache (stores raw tokens for testing)

// Convert full user to safe user for client responses
function toSafeUser(user: User): SafeUser {
  return {
    id: user.id,
    email: user.email,
    firstName: user.firstName,
    lastName: user.lastName,
    profileImageUrl: user.profileImageUrl,
    emailVerified: user.emailVerified,
    lastLoginAt: user.lastLoginAt,
    createdAt: user.createdAt,
    updatedAt: user.updatedAt,
  };
}

export async function registerRoutes(app: Express): Promise<Server> {
  // Auth middleware
  await setupAuth(app);

  // Rate limiting for authentication endpoints
  const rateLimit = (await import('express-rate-limit')).default;
  const authLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 5, // Limit each IP to 5 requests per windowMs
    message: {
      message: "Too many authentication attempts, please try again later."
    },
    standardHeaders: true,
    legacyHeaders: false,
  });

  const strictAuthLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 3, // Limit each IP to 3 requests per windowMs for verification
    message: {
      message: "Too many verification attempts, please try again later."
    },
    standardHeaders: true,
    legacyHeaders: false,
  });

  // Authentication routes (email/password)
  app.post('/api/auth/register', authLimiter, async (req, res) => {
    try {
      const validatedData = registerUserSchema.parse(req.body);
      
      // Check if user already exists
      const existingUser = await storage.getUserByEmail(validatedData.email);
      if (existingUser) {
        return res.status(400).json({ message: "Email address is already registered" });
      }

      // Hash password
      const { hashPassword } = await import('./localAuth');
      const passwordHash = await hashPassword(validatedData.password);

      // Create user with email already verified
      const user = await storage.createUserWithPassword({
        email: validatedData.email,
        firstName: validatedData.firstName || '',
        lastName: validatedData.lastName || '',
        passwordHash,
        emailVerified: true, // Skip email verification
      });
      
      res.json({ 
        message: "Registration successful! You can now log in.",
        userId: user.id 
      });
    } catch (error) {
      console.error("Registration error:", error);
      res.status(400).json({ 
        message: "Registration failed", 
        error: error instanceof Error ? error.message : "Unknown error"
      });
    }
  });

  app.post('/api/auth/login', authLimiter, async (req, res) => {
    try {
      const validatedData = loginUserSchema.parse(req.body);
      
      // Use passport local strategy
      const passport = await import('passport');
      passport.default.authenticate('local', (err: any, user: any, info: any) => {
        if (err) {
          console.error("Login error:", err);
          return res.status(500).json({ message: "Login failed" });
        }
        
        if (!user) {
          return res.status(401).json({ message: info?.message || "Invalid credentials" });
        }

        req.logIn(user, (err) => {
          if (err) {
            console.error("Session error:", err);
            return res.status(500).json({ message: "Login failed" });
          }
          
          res.json({ 
            message: "Login successful",
            user: {
              id: user.id,
              email: user.email,
              firstName: user.firstName,
              lastName: user.lastName
            }
          });
        });
      })(req, res);
    } catch (error) {
      console.error("Login validation error:", error);
      res.status(400).json({ 
        message: "Invalid login data", 
        error: error instanceof Error ? error.message : "Unknown error"
      });
    }
  });


  app.post('/api/auth/logout', (req, res) => {
    req.logout((err) => {
      if (err) {
        console.error("Logout error:", err);
        return res.status(500).json({ message: "Logout failed" });
      }
      res.json({ message: "Logout successful" });
    });
  });

  // Change password for authenticated users
  app.post('/api/auth/change-password', authLimiter, isAuthenticated, async (req: any, res) => {
    try {
      const validatedData = changePasswordSchema.parse(req.body);
      const userId = req.user.id;
      
      // Get user from database
      const user = await storage.getUser(userId);
      if (!user || !user.passwordHash) {
        return res.status(400).json({ message: "Unable to change password" });
      }

      // Verify current password
      const { verifyPassword } = await import('./localAuth');
      const isCurrentPasswordValid = await verifyPassword(user.passwordHash, validatedData.currentPassword);
      if (!isCurrentPasswordValid) {
        return res.status(400).json({ message: "Current password is incorrect" });
      }

      // Hash new password and update
      const { hashPassword } = await import('./localAuth');
      const newPasswordHash = await hashPassword(validatedData.newPassword);
      await storage.updatePassword(userId, newPasswordHash);

      res.json({ message: "Password changed successfully" });
    } catch (error) {
      console.error("Password change error:", error);
      res.status(400).json({ 
        message: "Failed to change password", 
        error: error instanceof Error ? error.message : "Unknown error"
      });
    }
  });



  // User info route
  app.get('/api/auth/user', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.id;
      const user = await storage.getUser(userId);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      res.json(toSafeUser(user));
    } catch (error) {
      console.error("Error fetching user:", error);
      res.status(500).json({ message: "Failed to fetch user" });
    }
  });

  // Student profile routes
  app.get('/api/student/profile', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.id;
      const profile = await storage.getStudentProfile(userId);
      res.json(profile);
    } catch (error) {
      console.error("Error fetching student profile:", error);
      res.status(500).json({ message: "Failed to fetch student profile" });
    }
  });

  app.post('/api/student/profile', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.id;
      
      // Properly format array fields for JSONB storage
      const {
        currentSubjects,
        interestedSubjects,
        dreamColleges,
        academicInterests,
        extracurricularActivities,
        completedAPs,
        plannedAPs,
        ...otherFields
      } = req.body;

      const profileData = {
        ...otherFields,
        userId,
        isOnboardingComplete: true,
        currentSubjects: Array.isArray(currentSubjects) ? currentSubjects : [],
        interestedSubjects: Array.isArray(interestedSubjects) ? interestedSubjects : [],
        dreamColleges: Array.isArray(dreamColleges) ? dreamColleges : [],
        academicInterests: Array.isArray(academicInterests) ? academicInterests : [],
        extracurricularActivities: Array.isArray(extracurricularActivities) ? extracurricularActivities : [],
        completedAPs: Array.isArray(completedAPs) ? completedAPs : [],
        plannedAPs: Array.isArray(plannedAPs) ? plannedAPs : []
      };
      
      const validatedData = insertStudentProfileSchema.parse(profileData);
      const profile = await storage.createStudentProfile(validatedData);
      
      // Generate initial academic pathway
      if (profile.dreamColleges && profile.dreamColleges.length > 0) {
        const pathwayData = await generateAcademicPathway(profile);
        await storage.createOrUpdatePathway({
          studentId: profile.id,
          pathwayData,
          targetCollege: profile.dreamColleges[0],
          overallProgress: "0"
        });
      }
      
      res.json(profile);
    } catch (error) {
      console.error("Error creating student profile:", error);
      res.status(400).json({ 
        message: "Failed to create student profile", 
        error: error instanceof Error ? error.message : String(error)
      });
    }
  });

  app.put('/api/student/profile/:id', isAuthenticated, async (req: any, res) => {
    try {
      const { id } = req.params;
      const updates = req.body;
      const profile = await storage.updateStudentProfile(parseInt(id), updates);
      res.json(profile);
    } catch (error) {
      console.error("Error updating student profile:", error);
      res.status(400).json({ message: "Failed to update student profile" });
    }
  });

  // Academic pathway routes
  app.get('/api/student/pathway', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.id;
      const profile = await storage.getStudentProfile(userId);
      if (!profile) {
        return res.status(404).json({ message: "Student profile not found" });
      }
      
      const pathway = await storage.getStudentPathway(profile.id);
      res.json(pathway);
    } catch (error) {
      console.error("Error fetching pathway:", error);
      res.status(500).json({ message: "Failed to fetch pathway" });
    }
  });

  app.post('/api/student/pathway/regenerate', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.id;
      const profile = await storage.getStudentProfile(userId);
      if (!profile) {
        return res.status(404).json({ message: "Student profile not found" });
      }
      
      const pathwayData = await generateAcademicPathway(profile);
      const pathway = await storage.createOrUpdatePathway({
        studentId: profile.id,
        pathwayData,
        targetCollege: profile.dreamColleges?.[0] || "Top University",
        overallProgress: "0"
      });
      
      res.json(pathway);
    } catch (error) {
      console.error("Error regenerating pathway:", error);
      res.status(500).json({ message: "Failed to regenerate pathway" });
    }
  });

  // Opportunities routes
  app.get('/api/opportunities', isAuthenticated, async (req: any, res) => {
    try {
      const { grades, subjects, category, location, recommended } = req.query;
      const filters = {
        grades: grades ? grades.split(',').map(Number) : undefined,
        subjects: subjects ? subjects.split(',') : undefined,
        category: category as string,
        location: location as string
      };
      
      const opportunities = await storage.getOpportunities(filters);
      
      // If recommended=true, apply smart matching
      if (recommended === 'true') {
        const userId = req.user.id;
        const studentProfile = await storage.getStudentProfile(userId);
        if (studentProfile) {
          const { matchOpportunities } = await import("./services/opportunityMatcher");
          const matches = matchOpportunities(studentProfile, opportunities);
          res.json(matches.map(match => ({
            ...match.opportunity,
            matchScore: match.score,
            matchReasons: match.reasons
          })));
          return;
        }
      }
      
      res.json(opportunities);
    } catch (error) {
      console.error("Error fetching opportunities:", error);
      res.status(500).json({ message: "Failed to fetch opportunities" });
    }
  });

  app.get('/api/student/opportunities', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.id;
      const profile = await storage.getStudentProfile(userId);
      if (!profile) {
        return res.status(404).json({ message: "Student profile not found" });
      }
      
      const opportunities = await storage.getStudentOpportunities(profile.id);
      res.json(opportunities);
    } catch (error) {
      console.error("Error fetching student opportunities:", error);
      res.status(500).json({ message: "Failed to fetch student opportunities" });
    }
  });

  app.post('/api/student/opportunities/:opportunityId/bookmark', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.id;
      const { opportunityId } = req.params;
      const profile = await storage.getStudentProfile(userId);
      if (!profile) {
        return res.status(404).json({ message: "Student profile not found" });
      }
      
      const bookmark = await storage.bookmarkOpportunity({
        studentId: profile.id,
        opportunityId: parseInt(opportunityId),
        status: "bookmarked"
      });
      
      res.json(bookmark);
    } catch (error) {
      console.error("Error bookmarking opportunity:", error);
      res.status(400).json({ message: "Failed to bookmark opportunity" });
    }
  });

  // Get recommended opportunities for current student
  app.get('/api/student/recommended-opportunities', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.id;
      const studentProfile = await storage.getStudentProfile(userId);
      if (!studentProfile) {
        return res.status(404).json({ message: "Student profile not found" });
      }

      const allOpportunities = await storage.getOpportunities({});
      const { matchOpportunities, getUpcomingOpportunities } = await import("./services/opportunityMatcher");
      
      const matches = matchOpportunities(studentProfile, allOpportunities);
      const upcoming = getUpcomingOpportunities(allOpportunities);
      
      res.json({
        recommended: matches.slice(0, 6).map(match => ({
          ...match.opportunity,
          matchScore: match.score,
          matchReasons: match.reasons
        })),
        upcoming: upcoming,
        totalMatches: matches.length
      });
    } catch (error) {
      console.error("Error fetching recommended opportunities:", error);
      res.status(500).json({ message: "Failed to fetch recommended opportunities" });
    }
  });

  // Todo routes
  app.get('/api/student/todos', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.id;
      const profile = await storage.getStudentProfile(userId);
      if (!profile) {
        return res.status(404).json({ message: "Student profile not found" });
      }
      
      const todos = await storage.getStudentTodos(profile.id);
      res.json(todos);
    } catch (error) {
      console.error("Error fetching todos:", error);
      res.status(500).json({ message: "Failed to fetch todos" });
    }
  });

  app.post('/api/student/todos', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.id;
      console.log("Creating todo for user:", userId);
      console.log("Request body:", req.body);
      
      const profile = await storage.getStudentProfile(userId);
      if (!profile) {
        console.log("Student profile not found for user:", userId);
        return res.status(404).json({ message: "Student profile not found" });
      }
      
      console.log("Found profile:", profile.id);
      
      const todoData = {
        ...req.body,
        studentId: profile.id,
        // Convert string date to Date object if provided
        dueDate: req.body.dueDate ? new Date(req.body.dueDate) : null
      };
      console.log("Todo data before validation:", todoData);
      
      const validatedData = insertTodoSchema.parse(todoData);
      console.log("Validated data:", validatedData);
      
      const todo = await storage.createTodo(validatedData);
      console.log("Created todo:", todo);
      res.json(todo);
    } catch (error) {
      console.error("Error creating todo:", error);
      if (error instanceof Error) {
        console.error("Error message:", error.message);
        console.error("Error stack:", error.stack);
      }
      res.status(400).json({ 
        message: "Failed to create todo",
        error: error instanceof Error ? error.message : "Unknown error"
      });
    }
  });

  app.put('/api/student/todos/:id/toggle', isAuthenticated, async (req: any, res) => {
    try {
      const { id } = req.params;
      const todo = await storage.toggleTodoComplete(parseInt(id));
      res.json(todo);
    } catch (error) {
      console.error("Error toggling todo:", error);
      res.status(400).json({ message: "Failed to toggle todo" });
    }
  });

  // Notifications endpoint - get upcoming deadlines
  app.get('/api/student/notifications', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.id;
      const profile = await storage.getStudentProfile(userId);
      if (!profile) {
        return res.status(404).json({ message: "Student profile not found" });
      }

      // Get current date (start of today) and date 7 days from now (end of day)
      const now = new Date();
      now.setHours(0, 0, 0, 0); // Start of today
      const sevenDaysFromNow = new Date();
      sevenDaysFromNow.setDate(sevenDaysFromNow.getDate() + 7);
      sevenDaysFromNow.setHours(23, 59, 59, 999); // End of the day 7 days from now

      // Get all opportunities and filter for upcoming deadlines
      const allOpportunities = await storage.getOpportunities({});
      const upcomingOpportunities = allOpportunities.filter(opp => {
        if (!opp.deadline) return false;
        const deadline = new Date(opp.deadline);
        return deadline >= now && deadline <= sevenDaysFromNow;
      });

      // Get student's bookmarked opportunities
      const bookmarkedOpportunities = await storage.getStudentOpportunities(profile.id);
      const bookmarkedIds = new Set(bookmarkedOpportunities.map(o => o.opportunityId));

      // Use current timestamp for accurate day calculations
      const currentTime = new Date();

      // Filter to only show notifications for bookmarked opportunities
      const opportunityNotifications = upcomingOpportunities
        .filter(opp => bookmarkedIds.has(opp.id))
        .map(opp => ({
          id: `opportunity-${opp.id}`,
          type: 'opportunity',
          title: opp.title,
          deadline: opp.deadline,
          daysRemaining: Math.ceil((new Date(opp.deadline!).getTime() - currentTime.getTime()) / (1000 * 60 * 60 * 24)),
          priority: new Date(opp.deadline!).getTime() - currentTime.getTime() < 3 * 24 * 60 * 60 * 1000 ? 'high' : 'medium'
        }));

      // Get incomplete todos with upcoming due dates
      const allTodos = await storage.getStudentTodos(profile.id);
      const todoNotifications = allTodos
        .filter(todo => !todo.isCompleted && todo.dueDate)
        .filter(todo => {
          const dueDate = new Date(todo.dueDate!);
          return dueDate >= now && dueDate <= sevenDaysFromNow;
        })
        .map(todo => ({
          id: `todo-${todo.id}`,
          type: 'todo',
          title: todo.title,
          deadline: todo.dueDate,
          daysRemaining: Math.ceil((new Date(todo.dueDate!).getTime() - currentTime.getTime()) / (1000 * 60 * 60 * 24)),
          priority: todo.priority === 'high' ? 'high' : 
                   new Date(todo.dueDate!).getTime() - currentTime.getTime() < 3 * 24 * 60 * 60 * 1000 ? 'high' : 'medium'
        }));

      // Combine and sort by deadline
      const notifications = [...opportunityNotifications, ...todoNotifications]
        .sort((a, b) => new Date(a.deadline!).getTime() - new Date(b.deadline!).getTime());

      res.json({
        notifications,
        count: notifications.length
      });
    } catch (error) {
      console.error("Error fetching notifications:", error);
      res.status(500).json({ message: "Failed to fetch notifications" });
    }
  });

  // Chat routes
  app.get('/api/student/chat', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.id;
      const profile = await storage.getStudentProfile(userId);
      if (!profile) {
        return res.status(404).json({ message: "Student profile not found" });
      }
      
      const messages = await storage.getStudentChatMessages(profile.id);
      res.json(messages);
    } catch (error) {
      console.error("Error fetching chat messages:", error);
      res.status(500).json({ message: "Failed to fetch chat messages" });
    }
  });

  app.post('/api/student/chat', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.id;
      const profile = await storage.getStudentProfile(userId);
      if (!profile) {
        return res.status(404).json({ message: "Student profile not found" });
      }
      
      const { message } = req.body;
      
      // Save user message
      const userMessage = await storage.createChatMessage({
        studentId: profile.id,
        message,
        sender: "user"
      });
      
      // Get AI response
      const aiResponse = await getChatResponse(message, profile);
      
      // Save AI response
      const aiMessage = await storage.createChatMessage({
        studentId: profile.id,
        message: aiResponse,
        sender: "ai"
      });
      
      res.json({ userMessage, aiMessage });
    } catch (error) {
      console.error("Error processing chat message:", error);
      res.status(500).json({ message: "Failed to process chat message" });
    }
  });

  // Graduation requirements routes
  app.get('/api/student/graduation-requirements', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.id;
      const profile = await storage.getStudentProfile(userId);
      if (!profile) {
        return res.status(404).json({ message: "Student profile not found" });
      }
      
      const requirements = await storage.getGraduationRequirements(profile.state || 'California');
      const progress = await storage.getStudentCourseProgress(profile.id);
      
      res.json({ requirements, progress });
    } catch (error) {
      console.error("Error fetching graduation requirements:", error);
      res.status(500).json({ message: "Failed to fetch graduation requirements" });
    }
  });

  app.post('/api/student/course-progress', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.id;
      const profile = await storage.getStudentProfile(userId);
      if (!profile) {
        return res.status(404).json({ message: "Student profile not found" });
      }
      
      const progressData = {
        ...req.body,
        studentId: profile.id
      };
      
      const validatedData = insertStudentCourseProgressSchema.parse(progressData);
      const progress = await storage.createStudentCourseProgress(validatedData);
      res.json(progress);
    } catch (error) {
      console.error("Error creating course progress:", error);
      res.status(400).json({ message: "Failed to create course progress" });
    }
  });

  app.put('/api/student/course-progress/:id', isAuthenticated, async (req: any, res) => {
    try {
      const { id } = req.params;
      const progress = await storage.updateStudentCourseProgress(parseInt(id), req.body);
      res.json(progress);
    } catch (error) {
      console.error("Error updating course progress:", error);
      res.status(400).json({ message: "Failed to update course progress" });
    }
  });

  // User profile update route
  app.patch('/api/auth/user', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.id;
      const { firstName, lastName } = req.body;
      
      // Update user profile
      const updatedUser = await storage.upsertUser({
        id: userId,
        firstName,
        lastName,
        email: req.user.email,
        profileImageUrl: req.user.profileImageUrl
      });
      
      res.json(updatedUser);
    } catch (error) {
      console.error("Error updating user profile:", error);
      res.status(500).json({ message: "Failed to update profile" });
    }
  });

  // Progress routes
  app.get('/api/student/progress', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.id;
      const profile = await storage.getStudentProfile(userId);
      if (!profile) {
        return res.status(404).json({ message: "Student profile not found" });
      }
      
      const progress = await storage.getStudentProgress(profile.id);
      res.json(progress);
    } catch (error) {
      console.error("Error fetching progress:", error);
      res.status(500).json({ message: "Failed to fetch progress" });
    }
  });

  // Achievement routes
  app.get('/api/student/achievements', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.id;
      const profile = await storage.getStudentProfile(userId);
      if (!profile) {
        return res.status(404).json({ message: "Student profile not found" });
      }
      
      const achievements = await storage.getStudentAchievements(profile.id);
      res.json(achievements);
    } catch (error) {
      console.error("Error fetching achievements:", error);
      res.status(500).json({ message: "Failed to fetch achievements" });
    }
  });

  app.post('/api/student/achievements', isAuthenticated, async (req: any, res) => {
    try {
      console.log("Creating achievement for user:", req.user.id);
      console.log("Request body:", req.body);
      
      const userId = req.user.id;
      const profile = await storage.getStudentProfile(userId);
      if (!profile) {
        return res.status(404).json({ message: "Student profile not found" });
      }
      
      const achievementData = {
        ...req.body,
        studentId: profile.id,
        dateAchieved: req.body.dateAchieved ? new Date(req.body.dateAchieved) : null,
        skills: Array.isArray(req.body.skills) ? req.body.skills : []
      };
      
      console.log("Achievement data before validation:", achievementData);
      
      const validatedData = insertAchievementSchema.parse(achievementData);
      console.log("Validated data:", validatedData);
      
      const achievement = await storage.createAchievement(validatedData);
      console.log("Created achievement:", achievement);
      
      res.json(achievement);
    } catch (error) {
      console.error("Error creating achievement:", error);
      res.status(500).json({ message: "Failed to create achievement" });
    }
  });

  app.patch('/api/student/achievements/:id', isAuthenticated, async (req: any, res) => {
    try {
      const achievementId = parseInt(req.params.id);
      const updates = {
        ...req.body,
        dateAchieved: req.body.dateAchieved ? new Date(req.body.dateAchieved) : undefined,
        skills: Array.isArray(req.body.skills) ? req.body.skills : undefined
      };
      
      const achievement = await storage.updateAchievement(achievementId, updates);
      res.json(achievement);
    } catch (error) {
      console.error("Error updating achievement:", error);
      res.status(500).json({ message: "Failed to update achievement" });
    }
  });

  app.delete('/api/student/achievements/:id', isAuthenticated, async (req: any, res) => {
    try {
      const achievementId = parseInt(req.params.id);
      await storage.deleteAchievement(achievementId);
      res.json({ message: "Achievement deleted successfully" });
    } catch (error) {
      console.error("Error deleting achievement:", error);
      res.status(500).json({ message: "Failed to delete achievement" });
    }
  });

  // General opportunities route
  app.get('/api/opportunities', async (req, res) => {
    try {
      const opportunities = await storage.getOpportunities();
      res.json(opportunities);
    } catch (error) {
      console.error("Error fetching opportunities:", error);
      res.status(500).json({ message: "Failed to fetch opportunities" });
    }
  });

  // Seed data route (for development)
  app.post('/api/seed/opportunities', async (req, res) => {
    try {
      await storage.seedOpportunities();
      res.json({ message: "Opportunities seeded successfully" });
    } catch (error) {
      console.error("Error seeding opportunities:", error);
      res.status(500).json({ message: "Failed to seed opportunities" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
