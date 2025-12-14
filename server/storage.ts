import {
  users,
  studentProfiles,
  academicPathways,
  opportunities,
  studentOpportunities,
  todos,
  chatMessages,
  progressTracking,
  achievements,
  graduationRequirements,
  studentCourseProgress,
  scholarships,
  studentScholarships,
  type User,
  type UpsertUser,
  type StudentProfile,
  type InsertStudentProfile,
  type AcademicPathway,
  type InsertAcademicPathway,
  type Opportunity,
  type InsertOpportunity,
  type StudentOpportunity,
  type InsertStudentOpportunity,
  type Todo,
  type InsertTodo,
  type ChatMessage,
  type InsertChatMessage,
  type ProgressTracking,
  type InsertProgressTracking,
  type Achievement,
  type InsertAchievement,
  type GraduationRequirement,
  type InsertGraduationRequirement,
  type StudentCourseProgress,
  type InsertStudentCourseProgress,
  type Scholarship,
  type InsertScholarship,
  type StudentScholarship,
  type InsertStudentScholarship,
} from "@shared/schema";
import { db } from "./db";
import { eq, desc, and, gte, lte, inArray, isNotNull } from "drizzle-orm";

export interface IStorage {
  // User operations (for email/password auth)
  getUser(id: string): Promise<User | undefined>;
  getUserByEmail(email: string): Promise<User | undefined>;
  createUserWithPassword(userData: {
    email: string;
    firstName: string;
    lastName: string;
    passwordHash: string;
  }): Promise<User>;
  upsertUser(user: UpsertUser): Promise<User>;
  updateUserLastLogin(id: string): Promise<void>;
  setEmailVerified(id: string, verified: boolean): Promise<void>;
  updatePassword(id: string, passwordHash: string): Promise<void>;
  
  // Student profile operations
  getStudentProfile(userId: string): Promise<StudentProfile | undefined>;
  createStudentProfile(profile: InsertStudentProfile): Promise<StudentProfile>;
  updateStudentProfile(id: number, profile: Partial<InsertStudentProfile>): Promise<StudentProfile>;
  
  // Academic pathway operations
  getStudentPathway(studentId: number): Promise<AcademicPathway | undefined>;
  createOrUpdatePathway(pathway: InsertAcademicPathway): Promise<AcademicPathway>;
  
  // Opportunities operations
  getOpportunities(filters?: {
    grades?: number[];
    subjects?: string[];
    category?: string;
    location?: string;
  }): Promise<Opportunity[]>;
  getStudentOpportunities(studentId: number): Promise<(StudentOpportunity & { opportunity: Opportunity })[]>;
  bookmarkOpportunity(studentOpportunity: InsertStudentOpportunity): Promise<StudentOpportunity>;
  updateOpportunityStatus(id: number, status: string): Promise<StudentOpportunity>;
  
  // Todo operations
  getStudentTodos(studentId: number): Promise<Todo[]>;
  createTodo(todo: InsertTodo): Promise<Todo>;
  updateTodo(id: number, updates: Partial<InsertTodo>): Promise<Todo>;
  toggleTodoComplete(id: number): Promise<Todo>;
  
  // Chat operations
  getStudentChatMessages(studentId: number, limit?: number): Promise<ChatMessage[]>;
  createChatMessage(message: InsertChatMessage): Promise<ChatMessage>;
  
  // Progress tracking operations
  getStudentProgress(studentId: number): Promise<ProgressTracking[]>;
  updateProgress(progress: InsertProgressTracking): Promise<ProgressTracking>;
  
  // Achievement operations
  getStudentAchievements(studentId: number): Promise<Achievement[]>;
  createAchievement(achievement: InsertAchievement): Promise<Achievement>;
  updateAchievement(id: number, updates: Partial<InsertAchievement>): Promise<Achievement>;
  
  // Graduation requirements operations
  getAvailableStates(): Promise<string[]>;
  getGraduationRequirements(state: string): Promise<GraduationRequirement[]>;
  getStudentCourseProgress(studentId: number): Promise<StudentCourseProgress[]>;
  createStudentCourseProgress(progress: InsertStudentCourseProgress): Promise<StudentCourseProgress>;
  updateStudentCourseProgress(id: number, updates: Partial<InsertStudentCourseProgress>): Promise<StudentCourseProgress>;
  deleteAchievement(id: number): Promise<void>;
  
  // Scholarship operations
  getScholarships(filters?: Record<string, any>): Promise<Scholarship[]>;
  getStudentScholarships(studentId: number): Promise<(StudentScholarship & { scholarship: Scholarship })[]>;
  saveScholarship(studentScholarship: InsertStudentScholarship): Promise<StudentScholarship>;
  updateStudentScholarship(id: number, updates: Partial<InsertStudentScholarship>): Promise<StudentScholarship>;
  deleteStudentScholarship(id: number): Promise<void>;
  
  // Seed operations
  seedOpportunities(): Promise<void>;
}

export class DatabaseStorage implements IStorage {
  // User operations (for email/password auth)
  async getUser(id: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user;
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.email, email));
    return user;
  }

  async createUserWithPassword(userData: {
    email: string;
    firstName: string;
    lastName: string;
    passwordHash: string;
  }): Promise<User> {
    const [user] = await db
      .insert(users)
      .values({
        id: crypto.randomUUID(),
        email: userData.email,
        firstName: userData.firstName,
        lastName: userData.lastName,
        passwordHash: userData.passwordHash,
        emailVerified: true, // Skip email verification completely
      })
      .returning();
    return user;
  }

  async upsertUser(userData: UpsertUser): Promise<User> {
    const [user] = await db
      .insert(users)
      .values(userData)
      .onConflictDoUpdate({
        target: users.id,
        set: {
          ...userData,
          updatedAt: new Date(),
        },
      })
      .returning();
    return user;
  }

  async updateUserLastLogin(id: string): Promise<void> {
    await db
      .update(users)
      .set({ 
        lastLoginAt: new Date(),
        updatedAt: new Date()
      })
      .where(eq(users.id, id));
  }

  async setEmailVerified(id: string, verified: boolean): Promise<void> {
    await db
      .update(users)
      .set({ 
        emailVerified: verified,
        updatedAt: new Date()
      })
      .where(eq(users.id, id));
  }

  async updatePassword(id: string, passwordHash: string): Promise<void> {
    await db
      .update(users)
      .set({ 
        passwordHash,
        updatedAt: new Date()
      })
      .where(eq(users.id, id));
  }

  // Student profile operations
  async getStudentProfile(userId: string): Promise<StudentProfile | undefined> {
    const [profile] = await db.select().from(studentProfiles).where(eq(studentProfiles.userId, userId));
    return profile;
  }

  async createStudentProfile(profile: InsertStudentProfile): Promise<StudentProfile> {
    const [newProfile] = await db
      .insert(studentProfiles)
      .values(profile)
      .returning();
    return newProfile;
  }

  async updateStudentProfile(id: number, profile: Partial<InsertStudentProfile>): Promise<StudentProfile> {
    const [updatedProfile] = await db
      .update(studentProfiles)
      .set({ ...profile, updatedAt: new Date() })
      .where(eq(studentProfiles.id, id))
      .returning();
    return updatedProfile;
  }

  // Academic pathway operations
  async getStudentPathway(studentId: number): Promise<AcademicPathway | undefined> {
    const [pathway] = await db
      .select()
      .from(academicPathways)
      .where(eq(academicPathways.studentId, studentId))
      .orderBy(desc(academicPathways.lastUpdated))
      .limit(1);
    return pathway;
  }

  async createOrUpdatePathway(pathway: InsertAcademicPathway): Promise<AcademicPathway> {
    const existing = await this.getStudentPathway(pathway.studentId);
    
    if (existing) {
      const [updated] = await db
        .update(academicPathways)
        .set({ ...pathway, lastUpdated: new Date() })
        .where(eq(academicPathways.id, existing.id))
        .returning();
      return updated;
    } else {
      const [created] = await db
        .insert(academicPathways)
        .values(pathway)
        .returning();
      return created;
    }
  }

  // Opportunities operations
  async getOpportunities(filters?: {
    grades?: number[];
    subjects?: string[];
    category?: string;
    location?: string;
  }): Promise<Opportunity[]> {
    let query = db.select().from(opportunities);
    
    if (filters) {
      const conditions = [];
      
      if (filters.category) {
        conditions.push(eq(opportunities.category, filters.category));
      }
      
      if (filters.location) {
        conditions.push(eq(opportunities.location, filters.location));
      }
      
      if (conditions.length > 0) {
        return await db.select().from(opportunities).where(and(...conditions)).orderBy(desc(opportunities.createdAt));
      }
    }
    
    return await query.orderBy(desc(opportunities.createdAt));
  }

  async getStudentOpportunities(studentId: number): Promise<(StudentOpportunity & { opportunity: Opportunity })[]> {
    const results = await db
      .select()
      .from(studentOpportunities)
      .innerJoin(opportunities, eq(studentOpportunities.opportunityId, opportunities.id))
      .where(eq(studentOpportunities.studentId, studentId))
      .orderBy(desc(studentOpportunities.createdAt));
    
    return results.map(result => ({
      ...result.student_opportunities,
      opportunity: result.opportunities
    }));
  }

  async bookmarkOpportunity(studentOpportunity: InsertStudentOpportunity): Promise<StudentOpportunity> {
    const [bookmark] = await db
      .insert(studentOpportunities)
      .values(studentOpportunity)
      .returning();
    return bookmark;
  }

  async updateOpportunityStatus(id: number, status: string): Promise<StudentOpportunity> {
    const [updated] = await db
      .update(studentOpportunities)
      .set({ status })
      .where(eq(studentOpportunities.id, id))
      .returning();
    return updated;
  }

  // Todo operations
  async getStudentTodos(studentId: number): Promise<Todo[]> {
    return await db
      .select()
      .from(todos)
      .where(eq(todos.studentId, studentId))
      .orderBy(desc(todos.createdAt));
  }

  async createTodo(todo: InsertTodo): Promise<Todo> {
    const [newTodo] = await db
      .insert(todos)
      .values(todo)
      .returning();
    return newTodo;
  }

  async updateTodo(id: number, updates: Partial<InsertTodo>): Promise<Todo> {
    const [updated] = await db
      .update(todos)
      .set({ ...updates, updatedAt: new Date() })
      .where(eq(todos.id, id))
      .returning();
    return updated;
  }

  async toggleTodoComplete(id: number): Promise<Todo> {
    const [todo] = await db.select().from(todos).where(eq(todos.id, id));
    const [updated] = await db
      .update(todos)
      .set({ 
        isCompleted: !todo.isCompleted,
        completedAt: todo.isCompleted ? null : new Date(),
        updatedAt: new Date()
      })
      .where(eq(todos.id, id))
      .returning();
    return updated;
  }

  // Chat operations
  async getStudentChatMessages(studentId: number, limit = 50): Promise<ChatMessage[]> {
    return await db
      .select()
      .from(chatMessages)
      .where(eq(chatMessages.studentId, studentId))
      .orderBy(desc(chatMessages.createdAt))
      .limit(limit);
  }

  async createChatMessage(message: InsertChatMessage): Promise<ChatMessage> {
    const [newMessage] = await db
      .insert(chatMessages)
      .values(message)
      .returning();
    return newMessage;
  }

  // Progress tracking operations
  async getStudentProgress(studentId: number): Promise<ProgressTracking[]> {
    return await db
      .select()
      .from(progressTracking)
      .where(eq(progressTracking.studentId, studentId))
      .orderBy(desc(progressTracking.recordedAt));
  }

  async updateProgress(progress: InsertProgressTracking): Promise<ProgressTracking> {
    const [newProgress] = await db
      .insert(progressTracking)
      .values(progress)
      .returning();
    return newProgress;
  }

  // Seed operations
  // Achievement operations
  async getStudentAchievements(studentId: number): Promise<Achievement[]> {
    return await db
      .select()
      .from(achievements)
      .where(eq(achievements.studentId, studentId))
      .orderBy(desc(achievements.dateAchieved));
  }

  async createAchievement(achievement: InsertAchievement): Promise<Achievement> {
    const [created] = await db
      .insert(achievements)
      .values(achievement)
      .returning();
    return created;
  }

  async updateAchievement(id: number, updates: Partial<InsertAchievement>): Promise<Achievement> {
    const [updated] = await db
      .update(achievements)
      .set({ ...updates, updatedAt: new Date() })
      .where(eq(achievements.id, id))
      .returning();
    return updated;
  }

  async deleteAchievement(id: number): Promise<void> {
    await db
      .delete(achievements)
      .where(eq(achievements.id, id));
  }

  // Scholarship operations
  async getScholarships(filters?: Record<string, any>): Promise<Scholarship[]> {
    return await db
      .select()
      .from(scholarships)
      .orderBy(desc(scholarships.deadline));
  }

  async getStudentScholarships(studentId: number): Promise<(StudentScholarship & { scholarship: Scholarship })[]> {
    const results = await db
      .select()
      .from(studentScholarships)
      .leftJoin(scholarships, eq(studentScholarships.scholarshipId, scholarships.id))
      .where(eq(studentScholarships.studentId, studentId))
      .orderBy(desc(studentScholarships.createdAt));

    return results.map(row => ({
      ...row.student_scholarships,
      scholarship: row.scholarships!
    }));
  }

  async saveScholarship(studentScholarship: InsertStudentScholarship): Promise<StudentScholarship> {
    const [saved] = await db
      .insert(studentScholarships)
      .values(studentScholarship)
      .returning();
    return saved;
  }

  async updateStudentScholarship(id: number, updates: Partial<InsertStudentScholarship>): Promise<StudentScholarship> {
    const [updated] = await db
      .update(studentScholarships)
      .set({ ...updates, updatedAt: new Date() })
      .where(eq(studentScholarships.id, id))
      .returning();
    return updated;
  }

  async deleteStudentScholarship(id: number): Promise<void> {
    await db
      .delete(studentScholarships)
      .where(eq(studentScholarships.id, id));
  }

  async seedOpportunities(): Promise<void> {
    const seedData = [
      {
        title: "NASA Human Rover Competition",
        description: "Perfect for students interested in STEM and engineering. Design and build a human-powered rover to navigate challenging terrain.",
        category: "competition",
        eligibleGrades: [9, 10, 11, 12],
        subjects: ["Engineering", "Physics", "Mathematics"],
        deadline: new Date("2024-12-15"),
        applicationUrl: "https://www.nasa.gov/learning/students/",
        isTeamBased: true,
        location: "National",
        isPaid: false,
        difficultyLevel: "intermediate",
        tags: ["STEM", "Engineering", "NASA", "Competition"]
      },
      {
        title: "Congressional App Challenge",
        description: "Create an app that helps solve problems in your community. Open to all high school students.",
        category: "competition",
        eligibleGrades: [9, 10, 11, 12],
        subjects: ["Computer Science", "Programming"],
        deadline: new Date("2024-11-01"),
        applicationUrl: "https://www.congressionalappchallenge.us/",
        isTeamBased: false,
        location: "National",
        isPaid: false,
        difficultyLevel: "beginner",
        tags: ["Programming", "App Development", "Congressional"]
      },
      {
        title: "Local Hospital Internship",
        description: "Summer volunteer opportunity at Texas Children's Hospital. Gain hands-on experience in healthcare.",
        category: "internship",
        eligibleGrades: [10, 11, 12],
        subjects: ["Biology", "Medicine", "Health Sciences"],
        deadline: new Date("2025-01-15"),
        applicationUrl: "https://www.texaschildrens.org/volunteers",
        isTeamBased: false,
        location: "Houston, TX",
        isPaid: false,
        difficultyLevel: "beginner",
        tags: ["Healthcare", "Medical", "Volunteering", "Local"]
      },
      {
        title: "Science Olympiad",
        description: "National competition covering various science topics from biology to engineering.",
        category: "competition",
        eligibleGrades: [9, 10, 11, 12],
        subjects: ["Biology", "Chemistry", "Physics", "Engineering"],
        deadline: new Date("2024-10-30"),
        applicationUrl: "https://www.soinc.org/",
        isTeamBased: true,
        location: "National",
        isPaid: false,
        difficultyLevel: "intermediate",
        tags: ["Science", "Competition", "Team"]
      },
      {
        title: "Math Olympiad (AMC)",
        description: "American Mathematics Competitions - the first step towards International Mathematical Olympiad.",
        category: "competition",
        eligibleGrades: [9, 10, 11, 12],
        subjects: ["Mathematics"],
        deadline: new Date("2024-11-15"),
        applicationUrl: "https://www.maa.org/math-competitions",
        isTeamBased: false,
        location: "National",
        isPaid: false,
        difficultyLevel: "advanced",
        tags: ["Mathematics", "Competition", "AMC"]
      },
      {
        title: "Google Code-in for Students",
        description: "Participate in open source projects and contribute to real software development. Great for building your portfolio.",
        category: "internship",
        eligibleGrades: [9, 10, 11, 12],
        subjects: ["Computer Science", "Programming"],
        deadline: new Date("2025-02-28"),
        applicationUrl: "https://codein.withgoogle.com/",
        isTeamBased: false,
        location: "Global",
        isPaid: true,
        difficultyLevel: "intermediate",
        tags: ["Programming", "Open Source", "Google"]
      },
      {
        title: "Microsoft TEALS Program",
        description: "High school computer science program bringing tech professionals into classrooms as volunteer teachers.",
        category: "course",
        eligibleGrades: [9, 10, 11, 12],
        subjects: ["Computer Science", "Programming"],
        deadline: new Date("2025-03-15"),
        applicationUrl: "https://www.microsoft.com/en-us/teals",
        isTeamBased: false,
        location: "National",
        isPaid: false,
        difficultyLevel: "beginner",
        tags: ["Computer Science", "Microsoft", "Education"]
      },
      {
        title: "Intel International Science Fair",
        description: "The world's largest international pre-college science competition, featuring over 1,800 students.",
        category: "competition",
        eligibleGrades: [9, 10, 11, 12],
        subjects: ["Biology", "Chemistry", "Physics", "Engineering", "Mathematics"],
        deadline: new Date("2025-01-15"),
        applicationUrl: "https://www.societyforscience.org/isef/",
        isTeamBased: false,
        location: "International",
        isPaid: false,
        difficultyLevel: "advanced",
        tags: ["Science", "Research", "Intel", "International"]
      },
      {
        title: "NASA USRP Internship",
        description: "Undergraduate Student Research Program offering hands-on research experience with NASA scientists.",
        category: "internship",
        eligibleGrades: [11, 12],
        subjects: ["Physics", "Engineering", "Mathematics", "Computer Science"],
        deadline: new Date("2025-01-31"),
        applicationUrl: "https://www.nasa.gov/learning-resources/internship-programs/",
        isTeamBased: false,
        location: "National",
        isPaid: true,
        difficultyLevel: "advanced",
        tags: ["NASA", "Research", "Space", "STEM"]
      },
      {
        title: "Future Business Leaders of America",
        description: "National competition in business skills, leadership, and career preparation for high school students.",
        category: "competition",
        eligibleGrades: [9, 10, 11, 12],
        subjects: ["Business", "Economics", "Leadership"],
        deadline: new Date("2025-02-15"),
        applicationUrl: "https://www.fbla.org/",
        isTeamBased: true,
        location: "National",
        isPaid: false,
        difficultyLevel: "intermediate",
        tags: ["Business", "Leadership", "FBLA"]
      },
      {
        title: "MIT Research Science Institute",
        description: "Six-week summer research program pairing high school students with MIT researchers.",
        category: "program",
        eligibleGrades: [11, 12],
        subjects: ["Biology", "Chemistry", "Physics", "Engineering", "Mathematics"],
        deadline: new Date("2025-01-10"),
        applicationUrl: "https://www.cee.org/programs/research-science-institute",
        isTeamBased: false,
        location: "Cambridge, MA",
        isPaid: false,
        difficultyLevel: "advanced",
        tags: ["MIT", "Research", "Summer Program", "STEM"]
      },
      {
        title: "Regeneron Science Talent Search",
        description: "Most prestigious science and math competition for high school seniors in the United States.",
        category: "competition",
        eligibleGrades: [12],
        subjects: ["Biology", "Chemistry", "Physics", "Mathematics", "Engineering"],
        deadline: new Date("2024-11-15"),
        applicationUrl: "https://www.societyforscience.org/regeneron-sts/",
        isTeamBased: false,
        location: "National",
        isPaid: false,
        difficultyLevel: "advanced",
        tags: ["Science", "Research", "Regeneron", "Prestigious"]
      },
      {
        title: "Program in Mathematics for Young Scientists (PROMYS)",
        description: "6-week program at Boston University for high school sophomores to seniors who love math. Daily Number Theory lectures, research projects, advanced seminars, and guest lecturers.",
        category: "program",
        eligibleGrades: [10, 11, 12],
        subjects: ["Mathematics"],
        deadline: new Date("2025-03-05"),
        applicationUrl: "https://promys.org/programs/promys/",
        isTeamBased: false,
        location: "Boston, MA",
        isPaid: false,
        difficultyLevel: "advanced",
        tags: ["Mathematics", "Boston University", "Research", "Summer Program"]
      },
      {
        title: "Canada/USA Math Camp",
        description: "5-week program for students who find beauty in advanced mathematical ideas. Study with world-renowned researchers and passionate students from around the world.",
        category: "program",
        eligibleGrades: [9, 10, 11, 12],
        subjects: ["Mathematics"],
        deadline: new Date("2025-03-09"),
        applicationUrl: "https://www.mathcamp.org/",
        isTeamBased: false,
        location: "International",
        isPaid: false,
        difficultyLevel: "advanced",
        tags: ["Mathematics", "International", "Research", "Summer Program"]
      },
      {
        title: "Summer Science Program (SSP)",
        description: "5-week educational experience for high school juniors. 12 research teams work on difficult research projects in astrophysics, biochemistry, and genomics.",
        category: "program",
        eligibleGrades: [11],
        subjects: ["Physics", "Biology", "Chemistry"],
        deadline: new Date("2025-03-03"),
        applicationUrl: "https://summerscience.org/",
        isTeamBased: true,
        location: "National",
        isPaid: false,
        difficultyLevel: "advanced",
        tags: ["Science", "Research", "Astrophysics", "Summer Program"]
      },
      {
        title: "Stanford University Math Summer Camp (SUMaC)",
        description: "Advanced math program covering topics like group theory and real-life applications. Available online (3 weeks) or residential (4 weeks).",
        category: "program",
        eligibleGrades: [10, 11],
        subjects: ["Mathematics"],
        deadline: new Date("2025-02-01"),
        applicationUrl: "https://spcs.stanford.edu/programs/stanford-university-mathematics-camp-sumac",
        isTeamBased: false,
        location: "Stanford, CA",
        isPaid: false,
        difficultyLevel: "advanced",
        tags: ["Mathematics", "Stanford", "Group Theory", "Summer Program"]
      },
      {
        title: "High School Scientific Training and Enrichment Program (HiSTEP)",
        description: "5-week full-time summer internship at NIH campus covering current health issues, basic science skills, and STEM careers. Includes $2,150 stipend.",
        category: "internship",
        eligibleGrades: [9, 10, 11, 12],
        subjects: ["Biology", "Medicine", "Health Sciences"],
        deadline: new Date("2025-02-01"),
        applicationUrl: "https://www.training.nih.gov/histep",
        isTeamBased: false,
        location: "Bethesda, MD",
        isPaid: true,
        difficultyLevel: "intermediate",
        tags: ["Health Sciences", "NIH", "Paid", "Summer Program"]
      },
      {
        title: "Simons Summer Research Program",
        description: "8-week prestigious program matching students with Stony Brook faculty mentors in science, math, and computer science fields. Paid fellowship.",
        category: "program",
        eligibleGrades: [10, 11, 12],
        subjects: ["Biology", "Chemistry", "Physics", "Mathematics", "Computer Science"],
        deadline: new Date("2025-02-07"),
        applicationUrl: "https://www.stonybrook.edu/simons/",
        isTeamBased: false,
        location: "Stony Brook, NY",
        isPaid: true,
        difficultyLevel: "advanced",
        tags: ["Research", "Stony Brook", "Fellowship", "Summer Program"]
      },
      {
        title: "Research in Science & Engineering (RISE)",
        description: "6-week, 40-hour program for rising seniors in STEM. Work on research projects with Boston University professors and advisors.",
        category: "program",
        eligibleGrades: [12],
        subjects: ["Biology", "Chemistry", "Physics", "Engineering"],
        deadline: new Date("2025-02-14"),
        applicationUrl: "https://www.bu.edu/summer/high-school-programs/rise-internship-practicum/",
        isTeamBased: false,
        location: "Boston, MA",
        isPaid: false,
        difficultyLevel: "advanced",
        tags: ["Research", "Boston University", "Engineering", "Summer Program"]
      },
      {
        title: "Summer Academy for Math and Science (SAMS)",
        description: "Free 5-week engineering program at Carnegie Mellon with symposium. Includes math, science, seminars, and college preparation support.",
        category: "program",
        eligibleGrades: [10, 11, 12],
        subjects: ["Engineering", "Mathematics"],
        deadline: new Date("2025-03-09"),
        applicationUrl: "https://www.cmu.edu/pre-college/academic-programs/sams.html",
        isTeamBased: false,
        location: "Pittsburgh, PA",
        isPaid: false,
        difficultyLevel: "intermediate",
        tags: ["Engineering", "Carnegie Mellon", "Free", "Summer Program"]
      },
      {
        title: "HOPP Summer Student Program",
        description: "8-week full-time internship at Memorial Sloan Kettering Cancer Center. Conduct independent biomedical research with $1,200 stipend.",
        category: "internship",
        eligibleGrades: [10, 11, 12],
        subjects: ["Biology", "Medicine", "Health Sciences"],
        deadline: new Date("2025-02-07"),
        applicationUrl: "https://www.mskcc.org/education-training/high-school-college/hopp-summer-student",
        isTeamBased: false,
        location: "New York, NY",
        isPaid: true,
        difficultyLevel: "advanced",
        tags: ["Medical Research", "Cancer Research", "Paid", "Summer Program"]
      },
      {
        title: "MITES Summer",
        description: "6-week residential program at MIT for rising seniors from underrepresented communities. Seminars with STEM professionals and lab tours.",
        category: "program",
        eligibleGrades: [12],
        subjects: ["Engineering", "Mathematics", "Physics", "Computer Science"],
        deadline: new Date("2025-02-01"),
        applicationUrl: "https://mites.mit.edu/discover-mites/mites-summer/",
        isTeamBased: false,
        location: "Cambridge, MA",
        isPaid: false,
        difficultyLevel: "advanced",
        tags: ["MIT", "Diversity", "Engineering", "Summer Program"]
      },
      {
        title: "Stanford Institutes of Medicine Summer Research Program (SIMR)",
        description: "8-week program for Bay Area students to work with Stanford faculty on medical research. 8 research areas including immunology and neurobiology.",
        category: "program",
        eligibleGrades: [11, 12],
        subjects: ["Biology", "Medicine", "Health Sciences"],
        deadline: new Date("2025-02-25"),
        applicationUrl: "https://simr.stanford.edu/",
        isTeamBased: false,
        location: "Stanford, CA",
        isPaid: true,
        difficultyLevel: "advanced",
        tags: ["Stanford", "Medical Research", "Paid", "Summer Program"]
      },
      {
        title: "Telluride Association Summer Seminar (TASS)",
        description: "6-week program focused on history, politics, literature, and art. Examines how power and privilege affect social structures.",
        category: "program",
        eligibleGrades: [10, 11, 12],
        subjects: ["History", "Political Science", "Literature"],
        deadline: new Date("2026-01-04"),
        applicationUrl: "https://www.tellurideassociation.org/our-programs/high-school-students/",
        isTeamBased: false,
        location: "National",
        isPaid: false,
        difficultyLevel: "intermediate",
        tags: ["Humanities", "Social Justice", "Free", "Summer Program"]
      },
      {
        title: "Bank of America Student Leaders",
        description: "Leadership development program connecting high school students with nonprofits and includes a week in Washington D.C.",
        category: "program",
        eligibleGrades: [11, 12],
        subjects: ["Leadership", "Business"],
        deadline: new Date("2026-01-31"),
        applicationUrl: "https://about.bankofamerica.com/en/making-an-impact/student-leaders",
        isTeamBased: false,
        location: "National",
        isPaid: true,
        difficultyLevel: "intermediate",
        tags: ["Leadership", "Non-profit", "Washington DC", "Summer Program"]
      },
      {
        title: "Microsoft Imagine Cup",
        description: "Premier global technology startup competition for student founders using Microsoft Cloud. Win up to $100,000 USD, mentorship with Microsoft CEO, and global recognition.",
        category: "competition",
        eligibleGrades: [9, 10, 11, 12],
        subjects: ["Computer Science", "Engineering", "Business", "Technology"],
        deadline: new Date("2026-01-22"),
        applicationUrl: "https://imaginecup.microsoft.com/en-US/",
        isTeamBased: true,
        location: "Global",
        isPaid: true,
        difficultyLevel: "advanced",
        tags: ["Microsoft", "Startup", "Technology", "Global", "AI", "Cloud"]
      },
      {
        title: "Regional Science Talent Research",
        description: "Regional competition for high school students to conduct original scientific research projects. Students present their research findings to panels of scientists and compete for scholarships and research mentorship opportunities.",
        category: "competition",
        eligibleGrades: [10, 11, 12],
        subjects: ["Biology", "Chemistry", "Physics", "Environmental Science", "Mathematics"],
        deadline: new Date("2025-12-15"),
        applicationUrl: "https://www.sciencetalentsearch.org/regional",
        isTeamBased: false,
        location: "Regional",
        isPaid: false,
        difficultyLevel: "intermediate",
        tags: ["Science", "Research", "Regional", "Competition", "Scholarship"]
      },
      {
        title: "MIT Startup Competition (MIT 100K)",
        description: "One of the world's largest student-led startup competitions offering up to $100,000 in prizes. Launch your venture and compete against innovative student entrepreneurs globally.",
        category: "startup-competition",
        eligibleGrades: [9, 10, 11, 12],
        subjects: ["Business", "Entrepreneurship", "Technology", "Engineering"],
        deadline: new Date("2025-12-01"),
        applicationUrl: "https://mitsloan.mit.edu/action-learning/100k/",
        isTeamBased: true,
        location: "Global",
        isPaid: true,
        difficultyLevel: "advanced",
        tags: ["MIT", "Startup", "Prize Money", "Entrepreneurship", "Global"]
      },
      {
        title: "TribalForce Pitch Competition",
        description: "Student-led startup pitch competition supporting high school entrepreneurs. Present your business idea to investors and compete for up to $50,000 in funding.",
        category: "startup-competition",
        eligibleGrades: [9, 10, 11, 12],
        subjects: ["Business", "Entrepreneurship", "Finance"],
        deadline: new Date("2025-11-30"),
        applicationUrl: "https://www.tribalforce.io/",
        isTeamBased: true,
        location: "National",
        isPaid: true,
        difficultyLevel: "intermediate",
        tags: ["Startup", "Pitch", "Prize Money", "Entrepreneurship"]
      },
      {
        title: "Y Combinator Startup School",
        description: "Free online startup education program from Y Combinator, the world's most successful accelerator. Learn from successful founders and build your business.",
        category: "startup-competition",
        eligibleGrades: [10, 11, 12],
        subjects: ["Business", "Entrepreneurship", "Technology"],
        deadline: new Date("2025-12-31"),
        applicationUrl: "https://www.startupschool.org/",
        isTeamBased: false,
        location: "Global",
        isPaid: false,
        difficultyLevel: "intermediate",
        tags: ["Y Combinator", "Free", "Online", "Entrepreneurship"]
      },
      {
        title: "Diamond Challenge (University of Delaware)",
        description: "Top global high school entrepreneurship competition with two tracks: Business (perfect for innovative AI platforms) or Social Impact. Finalists pitch at in-person Summit to judges including VCs and experienced entrepreneurs. Many winners receive investor interest and mentorship.",
        category: "startup-competition",
        eligibleGrades: [9, 10, 11, 12],
        subjects: ["Business", "Entrepreneurship", "Technology", "Social Impact"],
        deadline: new Date("2026-01-15"),
        applicationUrl: "https://diamondchallenge.org/",
        isTeamBased: true,
        location: "Delaware, USA",
        isPaid: true,
        difficultyLevel: "advanced",
        tags: ["Diamond Challenge", "In-Person Summit", "VC Exposure", "Prize Money", "$100K+ Total Pool"]
      },
      {
        title: "Blue Ocean High School Entrepreneur Pitch Competition",
        description: "Open to innovative business ideas like no-code AI platforms. Submit video pitch to experienced entrepreneur judges. Winners receive feedback, community support, and cash prizes with exposure to industry leaders.",
        category: "startup-competition",
        eligibleGrades: [9, 10, 11, 12],
        subjects: ["Business", "Entrepreneurship", "Technology", "Innovation"],
        deadline: new Date("2026-02-22"),
        applicationUrl: "https://blueoceancompetition.org/",
        isTeamBased: true,
        location: "Global",
        isPaid: true,
        difficultyLevel: "intermediate",
        tags: ["Blue Ocean", "Video Pitch", "Entrepreneur Judges", "Feedback"]
      },
      {
        title: "Pitch Fest (Virtual, US Only)",
        description: "Free virtual pitch competition for high school entrepreneurs with real, innovative ideas. Low-pressure environment perfect for first-time pitchers. Winners receive scholarships, startup prizes, and networking opportunities.",
        category: "startup-competition",
        eligibleGrades: [9, 10, 11, 12],
        subjects: ["Business", "Entrepreneurship", "Technology"],
        deadline: new Date("2026-01-31"),
        applicationUrl: "https://www.pitchfest.com/high-school",
        isTeamBased: true,
        location: "Virtual (US Only)",
        isPaid: true,
        difficultyLevel: "beginner",
        tags: ["Pitch Fest", "Virtual", "Free Entry", "Scholarships"]
      },
      {
        title: "Pirates Pitch Competition (Seton Hall University)",
        description: "Shark Tank-style competition for high school students to pitch any business idea, including AI agent platforms and tech startups. Experience judging from industry professionals and receive valuable feedback on your venture.",
        category: "startup-competition",
        eligibleGrades: [10, 11, 12],
        subjects: ["Business", "Entrepreneurship", "Technology"],
        deadline: new Date("2025-10-31"),
        applicationUrl: "https://www.shu.edu/undergraduate-admissions/pirates-pitch",
        isTeamBased: true,
        location: "Newark, NJ",
        isPaid: true,
        difficultyLevel: "intermediate",
        tags: ["Pirates Pitch", "Shark Tank Style", "Seton Hall", "Prize Money"]
      },
      {
        title: "INCubatoredu National Pitch (Uncharted Learning Summit)",
        description: "High school teams pitch real startups directly to investors for actual funding opportunities. Past winners have received $172K+ in total awards. High chance of connecting with real investors and securing seed funding for your venture.",
        category: "startup-competition",
        eligibleGrades: [10, 11, 12],
        subjects: ["Business", "Entrepreneurship", "Finance", "Technology"],
        deadline: new Date("2025-12-31"),
        applicationUrl: "https://www.unchartedlearning.org/",
        isTeamBased: true,
        location: "National",
        isPaid: true,
        difficultyLevel: "advanced",
        tags: ["INCubatoredu", "Real Investors", "$172K+ Awards", "Funding Opportunity"]
      },
      {
        title: "Google IT Support Professional Certification",
        description: "Free Google certification course covering IT fundamentals. Gain skills in computer networking, operating systems, and system administration.",
        category: "certification",
        eligibleGrades: [9, 10, 11, 12],
        subjects: ["Computer Science", "Technology", "IT"],
        deadline: new Date("2025-12-31"),
        applicationUrl: "https://www.coursera.org/professional-certificates/google-it-support",
        isTeamBased: false,
        location: "Online",
        isPaid: false,
        difficultyLevel: "beginner",
        tags: ["Google", "Free", "IT Support", "Online"]
      },
      {
        title: "IBM Data Science Professional Certification",
        description: "Free IBM professional certificate in Data Science. Learn data analysis, machine learning, and data visualization skills.",
        category: "certification",
        eligibleGrades: [10, 11, 12],
        subjects: ["Computer Science", "Data Science", "Mathematics"],
        deadline: new Date("2025-12-31"),
        applicationUrl: "https://www.coursera.org/professional-certificates/ibm-data-science",
        isTeamBased: false,
        location: "Online",
        isPaid: false,
        difficultyLevel: "intermediate",
        tags: ["IBM", "Data Science", "Free", "Online"]
      },
      {
        title: "Amazon AWS Certified Cloud Practitioner",
        description: "Industry-recognized certification validating understanding of AWS cloud services. Essential for tech careers in cloud computing.",
        category: "certification",
        eligibleGrades: [10, 11, 12],
        subjects: ["Computer Science", "Technology", "Cloud Computing"],
        deadline: new Date("2025-12-31"),
        applicationUrl: "https://aws.amazon.com/certification/certified-cloud-practitioner/",
        isTeamBased: false,
        location: "Online",
        isPaid: false,
        difficultyLevel: "intermediate",
        tags: ["AWS", "Cloud", "Technology", "Industry Certification"]
      },
      {
        title: "Microsoft Azure Fundamentals (AZ-900)",
        description: "Free Microsoft Azure certification covering cloud basics and Azure services. Build foundation for cloud technology careers.",
        category: "certification",
        eligibleGrades: [9, 10, 11, 12],
        subjects: ["Computer Science", "Technology", "Cloud Computing"],
        deadline: new Date("2025-12-31"),
        applicationUrl: "https://learn.microsoft.com/en-us/credentials/certifications/azure-fundamentals/",
        isTeamBased: false,
        location: "Online",
        isPaid: false,
        difficultyLevel: "beginner",
        tags: ["Microsoft", "Azure", "Free", "Cloud Computing"]
      },
      {
        title: "Google Analytics Certification",
        description: "Free Google certification in digital analytics. Master Google Analytics 4 and become a certified digital analyst.",
        category: "certification",
        eligibleGrades: [9, 10, 11, 12],
        subjects: ["Business", "Technology", "Data Analysis"],
        deadline: new Date("2025-12-31"),
        applicationUrl: "https://analytics.google.com/analytics/academy/",
        isTeamBased: false,
        location: "Online",
        isPaid: false,
        difficultyLevel: "beginner",
        tags: ["Google", "Analytics", "Free", "Business"]
      },
      {
        title: "CompTIA A+ Certification",
        description: "CompTIA A+ validates IT technical support skills. Entry-level certification for computer support specialists and technicians.",
        category: "certification",
        eligibleGrades: [10, 11, 12],
        subjects: ["Computer Science", "Technology", "IT"],
        deadline: new Date("2025-12-31"),
        applicationUrl: "https://www.comptia.org/certifications/a",
        isTeamBased: false,
        location: "Online",
        isPaid: false,
        difficultyLevel: "beginner",
        tags: ["CompTIA", "IT", "Technology", "Industry Certification"]
      },
      {
        title: "Cisco CCNA Routing & Switching",
        description: "Professional networking certification from Cisco. Validate expertise in network administration and routing technologies.",
        category: "certification",
        eligibleGrades: [10, 11, 12],
        subjects: ["Computer Science", "Networking", "Technology"],
        deadline: new Date("2025-12-31"),
        applicationUrl: "https://www.cisco.com/c/en/us/training-events/training-certifications/certifications/associate/ccna.html",
        isTeamBased: false,
        location: "Online",
        isPaid: false,
        difficultyLevel: "advanced",
        tags: ["Cisco", "Networking", "Technology", "Professional"]
      }
    ];

    for (const opportunity of seedData) {
      const existing = await db
        .select()
        .from(opportunities)
        .where(eq(opportunities.title, opportunity.title))
        .limit(1);
      
      if (existing.length === 0) {
        await db.insert(opportunities).values(opportunity);
      }
    }
  }

  // Graduation requirements operations
  async getAvailableStates(): Promise<string[]> {
    const result = await db
      .selectDistinct({ state: graduationRequirements.state })
      .from(graduationRequirements);
    return result.map(r => r.state).sort();
  }

  async getGraduationRequirements(state: string): Promise<GraduationRequirement[]> {
    return await db
      .select()
      .from(graduationRequirements)
      .where(eq(graduationRequirements.state, state))
      .orderBy(graduationRequirements.subject);
  }

  async getStudentCourseProgress(studentId: number): Promise<StudentCourseProgress[]> {
    return await db
      .select()
      .from(studentCourseProgress)
      .where(eq(studentCourseProgress.studentId, studentId))
      .orderBy(studentCourseProgress.createdAt);
  }

  async createStudentCourseProgress(progress: InsertStudentCourseProgress): Promise<StudentCourseProgress> {
    const [created] = await db
      .insert(studentCourseProgress)
      .values(progress)
      .returning();
    return created;
  }

  async updateStudentCourseProgress(id: number, updates: Partial<InsertStudentCourseProgress>): Promise<StudentCourseProgress> {
    const [updated] = await db
      .update(studentCourseProgress)
      .set(updates)
      .where(eq(studentCourseProgress.id, id))
      .returning();
    return updated;
  }
}

export const storage = new DatabaseStorage();
