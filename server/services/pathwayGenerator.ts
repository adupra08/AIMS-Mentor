import OpenAI from "openai";
import { StudentProfile } from "@shared/schema";

const openai = new OpenAI({ 
  apiKey: process.env.OPENAI_API_KEY || ""
});

export async function generateAcademicPathway(studentProfile: StudentProfile): Promise<{
  grade9: any[];
  grade10: any[];
  grade11: any[];
  grade12: any[];
}> {
  try {
    const prompt = `Generate a comprehensive 4-year academic pathway for a student with the following profile:

Current Grade: ${studentProfile.currentGrade}
Current GPA: ${studentProfile.currentGpa || "Not provided"}
Dream Colleges: ${studentProfile.dreamColleges?.join(", ") || "Top Universities"}
Academic Interests: ${studentProfile.academicInterests?.join(", ") || "General"}
Career Goals: ${studentProfile.careerGoals || "Not specified"}
Current Subjects: ${studentProfile.currentSubjects?.join(", ") || "Standard curriculum"}
Interested Subjects: ${studentProfile.interestedSubjects?.join(", ") || "Various"}
Location: ${studentProfile.location || "Not specified"}
School District: ${studentProfile.schoolDistrict || "Not specified"}

Create a detailed academic pathway with specific, actionable tasks for each grade level (9-12). Each grade should include:
- Core academic courses (including specific AP/IB recommendations)
- Extracurricular activities and leadership opportunities
- Competitions and contests relevant to their interests
- Test preparation milestones
- Summer activities (internships, programs, etc.)
- Volunteer work and community service
- Research projects or independent studies
- Skills development activities

Provide realistic, achievable goals that build upon each other and align with their dream colleges and career interests.

Respond with JSON in this exact format:
{
  "grade9": [
    {
      "title": "Course/Activity Name",
      "category": "academic|extracurricular|competition|volunteer|summer|test_prep",
      "description": "Detailed description",
      "timeline": "When to complete (e.g., Fall, Spring, Summer)",
      "priority": "high|medium|low",
      "status": "completed|in_progress|not_started"
    }
  ],
  "grade10": [...],
  "grade11": [...],
  "grade12": [...]
}`;

    const response = await openai.chat.completions.create({
      model: "gpt-4o", // the newest OpenAI model is "gpt-4o" which was released May 13, 2024. do not change this unless explicitly requested by the user
      messages: [{ role: "user", content: prompt }],
      response_format: { type: "json_object" },
      temperature: 0.4,
    });

    const pathwayData = JSON.parse(response.choices[0].message.content || "{}");
    
    // Validate the response structure
    const grades = ['grade9', 'grade10', 'grade11', 'grade12'];
    const validatedPathway: any = {};
    
    for (const grade of grades) {
      validatedPathway[grade] = Array.isArray(pathwayData[grade]) ? pathwayData[grade] : [];
    }
    
    return validatedPathway;
  } catch (error) {
    console.error("Error generating academic pathway:", error);
    
    // Return a fallback pathway structure
    return {
      grade9: [
        {
          title: "Build Strong Academic Foundation",
          category: "academic",
          description: "Focus on core subjects and maintain high GPA",
          timeline: "Year-round",
          priority: "high",
          status: "in_progress"
        },
        {
          title: "Join Academic Clubs",
          category: "extracurricular",
          description: "Participate in Math, Science, or relevant subject clubs",
          timeline: "Fall",
          priority: "medium",
          status: "not_started"
        }
      ],
      grade10: [
        {
          title: "Take First AP Course",
          category: "academic",
          description: "Enroll in AP course aligned with interests",
          timeline: "Year-round",
          priority: "high",
          status: "not_started"
        },
        {
          title: "PSAT Preparation",
          category: "test_prep",
          description: "Begin standardized test preparation",
          timeline: "Spring",
          priority: "medium",
          status: "not_started"
        }
      ],
      grade11: [
        {
          title: "Advanced Course Load",
          category: "academic",
          description: "Take multiple AP/IB courses",
          timeline: "Year-round",
          priority: "high",
          status: "not_started"
        },
        {
          title: "SAT/ACT Preparation",
          category: "test_prep",
          description: "Intensive test preparation and taking",
          timeline: "Fall/Spring",
          priority: "high",
          status: "not_started"
        }
      ],
      grade12: [
        {
          title: "College Applications",
          category: "academic",
          description: "Complete and submit college applications",
          timeline: "Fall",
          priority: "high",
          status: "not_started"
        },
        {
          title: "Final Transcript",
          category: "academic",
          description: "Maintain strong grades through graduation",
          timeline: "Year-round",
          priority: "high",
          status: "not_started"
        }
      ]
    };
  }
}

export async function generateTodosFromPathway(pathwayData: any, currentGrade: number): Promise<{
  title: string;
  description: string;
  priority: string;
  category: string;
  dueDate?: Date;
}[]> {
  try {
    const currentGradeKey = `grade${currentGrade}`;
    const currentGradeTasks = pathwayData[currentGradeKey] || [];
    
    const todos = currentGradeTasks
      .filter((task: any) => task.status === "not_started" || task.status === "in_progress")
      .slice(0, 5) // Limit to 5 most important tasks
      .map((task: any) => ({
        title: task.title,
        description: task.description,
        priority: task.priority,
        category: task.category,
        dueDate: task.timeline === "Fall" ? new Date(new Date().getFullYear(), 11, 31) : // December 31
                 task.timeline === "Spring" ? new Date(new Date().getFullYear() + 1, 4, 31) : // May 31
                 task.timeline === "Summer" ? new Date(new Date().getFullYear() + 1, 7, 31) : // August 31
                 undefined
      }));
    
    return todos;
  } catch (error) {
    console.error("Error generating todos from pathway:", error);
    return [];
  }
}
