import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

// Google Gemini API configuration
const GEMINI_API_KEY = "AIzaSyDg3Yn5MomJnMjWayRnGTR3zekmSe_HLeA"
const GEMINI_API_URL = `https://generativelanguage.googleapis.com/v1/models/gemini-1.5-flash:generateContent?key=${GEMINI_API_KEY}`

// Search function for real-time internet data
const searchInternet = async (query: string): Promise<string> => {
  try {
    // Using DuckDuckGo Instant Answer API (free, no key required)
    const searchUrl = `https://api.duckduckgo.com/?q=${encodeURIComponent(query)}&format=json&no_html=1&skip_disambig=1`
    const response = await fetch(searchUrl)
    const data = await response.json()

    if (data.AbstractText) {
      return data.AbstractText
    } else if (data.RelatedTopics && data.RelatedTopics.length > 0) {
      return data.RelatedTopics[0].Text || ""
    }
    return ""
  } catch (error) {
    console.error('Search error:', error)
    return ""
  }
}

const EDUCATIONAL_KEYWORDS = [
  'math', 'mathematics', 'science', 'physics', 'chemistry', 'biology', 'history',
  'geography', 'literature', 'english', 'writing', 'reading', 'school', 'university',
  'college', 'learning', 'study', 'homework', 'assignment', 'exam', 'test', 'quiz',
  'teacher', 'student', 'education', 'academic', 'research', 'thesis', 'essay',
  'course', 'curriculum', 'degree', 'grade', 'scholarship', 'tutor', 'lecture',
  'seminar', 'lab', 'experiment', 'project', 'presentation', 'career', 'major',
  'subject', 'topic', 'concept', 'theory', 'analysis', 'solve', 'explain',
  'understand', 'learn', 'teach', 'practice', 'review', 'memorize', 'comprehend'
];

const isEducationalQuery = (message: string): boolean => {
  const lowercaseMessage = message.toLowerCase();

  // More flexible educational query detection
  const hasEducationalKeyword = EDUCATIONAL_KEYWORDS.some(keyword =>
    lowercaseMessage.includes(keyword)
  );

  // Also check for educational patterns
  const educationalPatterns = [
    /how to (study|learn|understand|solve|practice)/,
    /what is.*?(theory|concept|formula|principle)/,
    /explain.*?(concept|theory|process|method)/,
    /help me (with|understand|learn)/,
    /(academic|educational|learning) (help|guidance|advice)/,
    /roadmap.*(college|university|career|education)/,
    /prepare for.*(exam|test|interview|college)/
  ];

  const hasEducationalPattern = educationalPatterns.some(pattern =>
    pattern.test(lowercaseMessage)
  );

  return hasEducationalKeyword || hasEducationalPattern;
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const { message } = await req.json()
    console.log('Received message:', message)

    // Check if query is educational
    const isEducational = isEducationalQuery(message)
    console.log('Is educational (server):', isEducational)

    if (!isEducational) {
      console.log('Query blocked by server-side filter')
      return new Response(
        JSON.stringify({
          response: "I can only assist with educational topics like school subjects, university courses, learning strategies, and academic guidance. Could you please ask a question related to learning or academics?"
        }),
        {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      )
    }

    // Search for real-time information if needed
    let searchContext = ""
    const searchKeywords = ['latest', 'recent', 'current', 'today', 'now', 'what is', 'define']
    const needsSearch = searchKeywords.some(keyword => message.toLowerCase().includes(keyword))

    if (needsSearch) {
      searchContext = await searchInternet(message)
    }

    // Prepare educational context prompt with search results
    const educationalPrompt = `As an AI Learning Mentor, provide helpful educational guidance. ${searchContext ? `Context: ${searchContext}. ` : ''}Question: ${message}`

    // Call Google Gemini API
    const response = await fetch(GEMINI_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents: [
          {
            parts: [
              { text: educationalPrompt }
            ]
          }
        ]
      })
    })

    if (!response.ok) {
      throw new Error(`Google Gemini API error: ${response.status}`)
    }

    const geminiData = await response.json()
    let aiResponse = ""

    if (geminiData.candidates && geminiData.candidates[0]?.content?.parts?.[0]?.text) {
      aiResponse = geminiData.candidates[0].content.parts[0].text
    } else {
      aiResponse = "I'm sorry, I couldn't generate a response. Please try again."
    }

    return new Response(
      JSON.stringify({
        response: aiResponse
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    )

  } catch (error) {
    console.error('Error:', error)
    return new Response(
      JSON.stringify({
        response: "I'm experiencing technical difficulties. Please try again in a moment."
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500,
      }
    )
  }
})