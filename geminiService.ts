
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
        systemInstruction: "You are Mentor, a study assistant for CampusFlow. Your job is to help students understand concepts and study effectively using simple, clear steps. RULES: 1. Keep responses clean and concise. 2. Prefer short numbered steps (Step 1, Step 2, Step 3). 3. Ask 1 quick clarifying question if needed. 4. Give a tiny practice task or example at the end when helpful. 5. Do not use markdown styling like bold/italics or backticks unless essential for code.",
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
