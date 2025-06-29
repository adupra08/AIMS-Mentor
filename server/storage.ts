import {
  users,
  studentProfiles,
  academicPathways,
  opportunities,
  studentOpportunities,
  todos,
  chatMessages,
  progressTracking,
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
} from "@shared/schema";
import { db } from "./db";
import { eq, desc, and, gte, lte, inArray } from "drizzle-orm";

export interface IStorage {
  // User operations (mandatory for Replit Auth)
  getUser(id: string): Promise<User | undefined>;
  upsertUser(user: UpsertUser): Promise<User>;
  
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
  
  // Seed operations
  seedOpportunities(): Promise<void>;
}

export class DatabaseStorage implements IStorage {
  // User operations (mandatory for Replit Auth)
  async getUser(id: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
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
}

export const storage = new DatabaseStorage();
