
import { GoogleGenAI, Type } from "@google/genai";
import { ChatMessage, StudyPlanItem } from "./types";

// Fixed: Always use process.env.API_KEY directly for initialization
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const getMentorResponse = async (messages: ChatMessage[]) => {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: messages.map(m => ({
        role: m.role === 'user' ? 'user' : 'model',
        parts: [{ text: m.content }]
      })),
      config: {
        systemInstruction: "You are 'Mentor', a friendly student AI assistant for CampusFlow. You help students with study planning and academic advice. RULES: 1. Keep responses very clean and concise. 2. NEVER use double quotes or special markdown characters like backticks unless essential for code. 3. Do not use bold/italic formatting. 4. If suggesting a study plan, always end by asking: Should I add this plan to your calendar?",
      },
    });
    // Property access .text is correct according to SDK documentation
    return response.text;
  } catch (error) {
    console.error("Gemini Error:", error);
    return "Something went wrong with my brain. Try again soon.";
  }
};

export const generateStudyPlan = async (subjects: string[], examDates: string[]): Promise<StudyPlanItem[]> => {
  try {
    const prompt = `Generate a daily study plan for: ${subjects.join(', ')} with exams on ${examDates.join(', ')}. Format: JSON array of objects with id, subject, time, tasks, difficulty.`;
    
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              id: { type: Type.STRING },
              subject: { type: Type.STRING },
              time: { type: Type.STRING },
              tasks: { type: Type.ARRAY, items: { type: Type.STRING } },
              difficulty: { type: Type.NUMBER }
            },
            required: ["id", "subject", "time", "tasks", "difficulty"]
          }
        }
      }
    });

    // Property access .text is correct according to SDK documentation
    return JSON.parse(response.text || "[]");
  } catch (error) {
    return [];
  }
};
