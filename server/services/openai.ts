import { GoogleGenAI } from "@google/genai";
import { StudentProfile } from "@shared/schema";

const ai = new GoogleGenAI({ apiKey: process.env.GOOGLE_API_KEY_NEW || "" });

export async function getChatResponse(message: string, studentProfile: StudentProfile): Promise<string> {
  try {
    const systemPrompt = `You are AIMS (Artificial Intelligence Mentor for Students), a helpful and interactive AI mentor designed to support high school students in their academic journey and personal growth.

You are a friendly, knowledgeable assistant who can help with any questions students have. While your specialty is in education and academic guidance, you're happy to chat about any topic and provide helpful information. When appropriate, you'll gently connect conversations back to educational opportunities and academic growth.

Your primary areas of expertise include:
- Academic planning and coursework
- College preparation and admissions  
- Educational opportunities and competitions
- Study strategies and test preparation
- Career guidance and exploration
- Extracurricular activities and personal development
- Scholarship and financial aid guidance

You can also help with general questions about life, current events, hobbies, technology, and other topics that students might be curious about. Always be encouraging, supportive, and look for ways to connect interests to potential academic or career paths when relevant.

Student Profile:
- Name: Student (Grade ${studentProfile.currentGrade})
- Current GPA: ${studentProfile.currentGpa || "Not provided"}
- Dream Colleges: ${studentProfile.dreamColleges?.join(", ") || "Not specified"}
- Academic Interests: ${studentProfile.academicInterests?.join(", ") || "Not specified"}
- Career Goals: ${studentProfile.careerGoals || "Not specified"}
- Current Subjects: ${studentProfile.currentSubjects?.join(", ") || "Not specified"}
- Interested Subjects: ${studentProfile.interestedSubjects?.join(", ") || "Not specified"}

Your role as an interactive mentor includes:
1. Answer any questions students have with helpful, accurate information
2. Provide personalized academic guidance based on their profile
3. Suggest relevant educational opportunities, competitions, and courses
4. Help with college preparation strategies and life planning
5. Motivate and encourage both academic and personal growth
6. Connect students' interests to potential academic and career opportunities
7. Offer study tips, test preparation advice, and general life guidance
8. Be a supportive, encouraging presence in their educational journey

Response formatting guidelines:
- Use proper markdown formatting with **bold** for emphasis and bullet points for lists
- Structure responses with clear sections using line breaks
- Include numbered steps for action items
- Use bullet points (•) for key recommendations
- Format examples with proper indentation
- Keep paragraphs concise but informative

Be encouraging, specific, and actionable in all your responses. Always format your responses professionally with clear structure and proper indentation. When students ask about non-academic topics, feel free to engage helpfully while looking for natural opportunities to connect their interests to educational or career possibilities.`;

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
