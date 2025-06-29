import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { setupAuth, isAuthenticated } from "./replitAuth";
import { 
  insertStudentProfileSchema, 
  insertTodoSchema, 
  insertChatMessageSchema 
} from "@shared/schema";
import { generateAcademicPathway } from "./services/pathwayGenerator";
import { getChatResponse } from "./services/openai";

export async function registerRoutes(app: Express): Promise<Server> {
  // Auth middleware
  await setupAuth(app);

  // Auth routes
  app.get('/api/auth/user', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const user = await storage.getUser(userId);
      res.json(user);
    } catch (error) {
      console.error("Error fetching user:", error);
      res.status(500).json({ message: "Failed to fetch user" });
    }
  });

  // Student profile routes
  app.get('/api/student/profile', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const profile = await storage.getStudentProfile(userId);
      res.json(profile);
    } catch (error) {
      console.error("Error fetching student profile:", error);
      res.status(500).json({ message: "Failed to fetch student profile" });
    }
  });

  app.post('/api/student/profile', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      
      const profileData = {
        ...req.body,
        userId,
        isOnboardingComplete: true
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
      const userId = req.user.claims.sub;
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
      const userId = req.user.claims.sub;
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
      const { grades, subjects, category, location } = req.query;
      const filters = {
        grades: grades ? grades.split(',').map(Number) : undefined,
        subjects: subjects ? subjects.split(',') : undefined,
        category: category as string,
        location: location as string
      };
      
      const opportunities = await storage.getOpportunities(filters);
      res.json(opportunities);
    } catch (error) {
      console.error("Error fetching opportunities:", error);
      res.status(500).json({ message: "Failed to fetch opportunities" });
    }
  });

  app.get('/api/student/opportunities', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
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
      const userId = req.user.claims.sub;
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

  // Todo routes
  app.get('/api/student/todos', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
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
      const userId = req.user.claims.sub;
      const profile = await storage.getStudentProfile(userId);
      if (!profile) {
        return res.status(404).json({ message: "Student profile not found" });
      }
      
      const validatedData = insertTodoSchema.parse({
        ...req.body,
        studentId: profile.id
      });
      
      const todo = await storage.createTodo(validatedData);
      res.json(todo);
    } catch (error) {
      console.error("Error creating todo:", error);
      res.status(400).json({ message: "Failed to create todo" });
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

  // Chat routes
  app.get('/api/student/chat', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
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
      const userId = req.user.claims.sub;
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

  // Progress routes
  app.get('/api/student/progress', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
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
