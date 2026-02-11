
import { GoogleGenAI, Type } from "@google/genai";
import { HealthLog, User } from "./types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const getHealthSuggestions = async (user: User, logs: HealthLog[]) => {
  if (logs.length === 0) return "Add some health logs to get personalized AI suggestions.";

  const latestLog = logs[logs.length - 1];
  const prompt = `
    User Profile: ${user.gender}, ${user.age} years old, ${user.height}cm.
    Latest Health Data:
    - Weight: ${latestLog.weight}kg (BMI: ${latestLog.bmi.toFixed(1)})
    - BP: ${latestLog.systolic}/${latestLog.diastolic} mmHg
    - Sugar: ${latestLog.sugarLevel} mg/dL
    - Heart Rate: ${latestLog.heartRate} bpm
    - Activity: ${latestLog.activityMinutes} mins/day

    Provide a short, professional health summary and 3 actionable suggestions.
  `;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: prompt,
      config: {
        systemInstruction: "You are a supportive health assistant. Be concise and prioritize safety. Always include a disclaimer that this is not medical advice.",
        temperature: 0.7,
      }
    });

    return response.text || "Unable to generate suggestions at this time.";
  } catch (error) {
    console.error("Gemini Error:", error);
    return "Health assistant is currently offline. Please try again later.";
  }
};

export const getAiFirstAid = async (topic: string, lang: string) => {
  const prompt = `Provide first aid instructions for: "${topic}". 
  Language: ${lang}. 
  Format as JSON with:
  {
    "title": "Title",
    "steps": ["step 1", "step 2", ...],
    "dos": ["do 1", ...],
    "donts": ["dont 1", ...]
  }`;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: prompt,
      config: {
        systemInstruction: "You are an emergency medical expert. Provide clear, numbered steps. Prioritize life-saving actions. Add a disclaimer.",
        responseMimeType: "application/json"
      }
    });
    return JSON.parse(response.text || '{}');
  } catch (error) {
    console.error("AI First Aid Error:", error);
    return null;
  }
};

export const getDailyHealthTip = async () => {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: "Provide a one-sentence daily health tip or first aid reminder. It should be practical and encouraging.",
      config: {
        systemInstruction: "You are a wellness expert. Your tips are brief, professional, and vary between nutrition, exercise, sleep, and first aid safety.",
        temperature: 0.9,
      }
    });
    return response.text?.trim() || "Stay hydrated and move for at least 30 minutes today!";
  } catch (error) {
    return "Remember to take deep breaths and stay mindful of your posture.";
  }
};

export const chatWithAI = async (message: string, history: {role: string, parts: {text: string}[]}[]) => {
  try {
    const chat = ai.chats.create({
      model: "gemini-3-flash-preview",
      config: {
        systemInstruction: "You are 'myCare Assistant', a friendly and expert health bot. You help with first aid, tracking explanations, and general wellness. If an emergency is mentioned, ALWAYS advise calling 911 immediately. You do not replace doctors. Keep responses helpful and under 3 sentences unless asked for instructions.",
      }
    });

    const response = await chat.sendMessage({
       message: message
    });
    return response.text;
  } catch (error) {
    console.error("Chat Error:", error);
    return "I'm having trouble connecting right now. Please try again later.";
  }
};

export const getLocationSuggestions = async (input: string) => {
  if (!input || input.length < 2) return [];
  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `Suggest 5 specific areas or medical districts in India related to: "${input}". 
      Include area and city (e.g., 'Gachibowli, Hyderabad'). 
      Return ONLY a comma-separated list.`,
      config: {
        systemInstruction: "You are a precise location suggestor for a health app. Focus on well-known residential or medical hubs.",
      }
    });
    return response.text?.split(',').map(s => s.trim()) || [];
  } catch (error) {
    return [];
  }
};

export const getNearbyFacilities = async (type: 'pharmacy' | 'doctor', lat?: number, lng?: number, locationName?: string) => {
  const typeLabel = type === 'pharmacy' ? 'pharmacies' : 'doctors, clinics, and specialists';
  let query = `Find the 5 most highly-rated ${typeLabel}`;
  if (locationName) {
    query += ` specifically in or near ${locationName}.`;
  }
  query += ` For each result, I need:
  - Name of the Facility/Doctor
  - Specialization (e.g. General Physician, Pediatrician, 24/7 Pharmacy)
  - Public Contact Number
  - Brief Address.
  Ensure you provide Google Maps links for each using your grounding tools.`;

  try {
    const config: any = {
      tools: [{ googleMaps: {} }],
    };

    if (lat !== undefined && lng !== undefined) {
      config.toolConfig = {
        retrievalConfig: {
          latLng: {
            latitude: lat,
            longitude: lng
          }
        }
      };
    }

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: query,
      config: config,
    });

    return {
      text: response.text,
      chunks: response.candidates?.[0]?.groundingMetadata?.groundingChunks || []
    };
  } catch (error) {
    console.error("Maps grounding error:", error);
    return { text: "Could not find nearby facilities.", chunks: [] };
  }
};
