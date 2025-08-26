import { GoogleGenAI } from "@google/genai";
import { StudentProfile } from "@shared/schema";

const ai = new GoogleGenAI({ apiKey: process.env.GOOGLE_API_KEY_NEW || "" });

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

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      config: {
        systemInstruction: systemPrompt,
        maxOutputTokens: 800,
        temperature: 0.7,
      },
      contents: message,
    });

    return response.text || "I apologize, but I couldn't generate a response. Please try asking your question again.";
  } catch (error) {
    console.error("Error getting chat response:", error);
    
    // Check for specific API errors
    const errorMessage = error instanceof Error ? error.message : String(error);
    const errorCode = (error as any)?.code;
    
    if (errorCode === 'insufficient_quota') {
      return "I'm temporarily unavailable due to API limits. Please try again later.";
    } else if (errorCode === 'invalid_api_key') {
      return "There's a configuration issue with my AI service. Please contact support.";
    } else if (errorCode === 'model_not_found') {
      return "I'm having trouble with my AI model. Please try again in a moment.";
    }
    
    return "I'm having trouble connecting to my AI service right now. Please try again in a moment, and if the issue persists, contact support.";
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

    const response = await ai.models.generateContent({
      model: "gemini-2.5-pro",
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: "object",
          properties: {
            overall: { type: "number" },
            academic: { type: "number" },
            extracurricular: { type: "number" },
            testPrep: { type: "number" },
            recommendations: {
              type: "array",
              items: { type: "string" }
            }
          },
          required: ["overall", "academic", "extracurricular", "testPrep", "recommendations"],
        },
        temperature: 0.3,
      },
      contents: prompt,
    });

    const result = JSON.parse(response.text || "{}");
    
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
