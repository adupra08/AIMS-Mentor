import OpenAI from "openai";
import { StudentProfile } from "@shared/schema";

const openai = new OpenAI({ 
  apiKey: process.env.OPENAI_API_KEY || process.env.OPENAI_API_KEY_ENV_VAR || "default_key"
});

export async function getChatResponse(message: string, studentProfile: StudentProfile): Promise<string> {
  try {
    const systemPrompt = `You are AIMS (Artificial Intelligence Mentor for Students), a specialized AI academic mentor designed exclusively to guide high school students towards their dream colleges and academic success.

IMPORTANT: You are strictly an EDUCATIONAL chatbot. Only respond to questions related to:
- Academic planning and coursework
- College preparation and admissions
- Educational opportunities and competitions
- Study strategies and test preparation
- Career guidance related to education
- Extracurricular activities for academic growth
- Scholarship and financial aid for education

If a user asks about topics unrelated to education (entertainment, personal life, general topics, etc.), respond with:
"I'm an educational AI mentor focused solely on helping students with their academic journey. I'd be happy to help you with questions about college preparation, course selection, study strategies, academic opportunities, or any other education-related topics. What educational question can I assist you with today?"

Student Profile:
- Name: Student (Grade ${studentProfile.currentGrade})
- Current GPA: ${studentProfile.currentGpa || "Not provided"}
- Dream Colleges: ${studentProfile.dreamColleges?.join(", ") || "Not specified"}
- Academic Interests: ${studentProfile.academicInterests?.join(", ") || "Not specified"}
- Career Goals: ${studentProfile.careerGoals || "Not specified"}
- Current Subjects: ${studentProfile.currentSubjects?.join(", ") || "Not specified"}
- Interested Subjects: ${studentProfile.interestedSubjects?.join(", ") || "Not specified"}

Your educational role includes:
1. Provide personalized academic guidance based on their profile
2. Suggest relevant educational opportunities, competitions, and courses
3. Help with college preparation strategies
4. Motivate and encourage academic growth
5. Answer questions about academic pathways and extracurriculars
6. Offer study tips and test preparation advice

Response formatting guidelines:
- Use proper markdown formatting with **bold** for emphasis and bullet points for lists
- Structure responses with clear sections using line breaks
- Include numbered steps for action items
- Use bullet points (•) for key recommendations
- Format examples with proper indentation
- Keep paragraphs concise but informative

Be encouraging, specific, and actionable in your educational responses. Always format your responses professionally with clear structure and proper indentation.`;

    const response = await openai.chat.completions.create({
      model: "gpt-4o", // Current model - change this to: "gpt-4o-mini", "gpt-4-turbo", "gpt-4", or "gpt-3.5-turbo"
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: message }
      ],
      max_tokens: 800,
      temperature: 0.7,
    });

    return response.choices[0].message.content || "I apologize, but I couldn't generate a response. Please try asking your question again.";
  } catch (error) {
    console.error("Error getting chat response:", error);
    return "I'm having trouble connecting right now. Please try again in a moment.";
  }
}

export async function analyzeStudentProgress(studentProfile: StudentProfile): Promise<{
  overall: number;
  academic: number;
  extracurricular: number;
  testPrep: number;
  recommendations: string[];
}> {
  try {
    const prompt = `Analyze this student's academic progress and provide scores (0-100) for different categories and specific recommendations.

Student Profile:
- Grade: ${studentProfile.currentGrade}
- GPA: ${studentProfile.currentGpa || "Not provided"}
- Dream Colleges: ${studentProfile.dreamColleges?.join(", ") || "Not specified"}
- Academic Interests: ${studentProfile.academicInterests?.join(", ") || "Not specified"}
- Current Subjects: ${studentProfile.currentSubjects?.join(", ") || "Not specified"}
- Completed APs: ${studentProfile.completedAPs?.join(", ") || "None"}
- Planned APs: ${studentProfile.plannedAPs?.join(", ") || "None"}
- Extracurriculars: ${studentProfile.extracurricularActivities?.join(", ") || "Not specified"}
- Test Scores: ${JSON.stringify(studentProfile.testScores || {})}

Provide a JSON response with:
- overall: overall progress score (0-100)
- academic: academic performance score (0-100)
- extracurricular: extracurricular involvement score (0-100)
- testPrep: test preparation progress score (0-100)
- recommendations: array of 3-5 specific, actionable recommendations`;

    const response = await openai.chat.completions.create({
      model: "gpt-4o", // Current model - change this to: "gpt-4o-mini", "gpt-4-turbo", "gpt-4", or "gpt-3.5-turbo"
      messages: [{ role: "user", content: prompt }],
      response_format: { type: "json_object" },
      temperature: 0.3,
    });

    const result = JSON.parse(response.choices[0].message.content || "{}");
    
    return {
      overall: Math.max(0, Math.min(100, result.overall || 50)),
      academic: Math.max(0, Math.min(100, result.academic || 50)),
      extracurricular: Math.max(0, Math.min(100, result.extracurricular || 30)),
      testPrep: Math.max(0, Math.min(100, result.testPrep || 20)),
      recommendations: result.recommendations || []
    };
  } catch (error) {
    console.error("Error analyzing student progress:", error);
    return {
      overall: 50,
      academic: 60,
      extracurricular: 30,
      testPrep: 25,
      recommendations: ["Focus on maintaining strong GPA", "Explore extracurricular activities", "Begin test preparation"]
    };
  }
}
