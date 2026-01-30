import { GoogleGenAI } from "@google/genai";
import { SystemState } from '../types';

export const getAIAssistance = async (prompt: string, state: SystemState) => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  
  const systemInstruction = `
    SYSTEM STATUS REPORT (AEGIS-7 STATION):
    - Oxygen: ${state.oxygen}% (CRITICAL THRESHOLD: 30%)
    - Power: ${state.power}%
    - Structural Integrity: ${state.integrity}%
    - CO2 Levels: ${state.co2Levels} ppm (Danger above 2000)
    - Temp: ${state.temperature}°C

    ROLE: You are AEGIS-7 Mission Control AI. You are analytical, urgent, and focused on crew survival.
    Keep responses short, technical, and precise. Avoid conversational fluff.
    User is a crew member currently managing the emergency terminal.
  `;

  try {
    const result = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: [{ parts: [{ text: prompt }] }],
      config: {
        systemInstruction,
        temperature: 0.8,
      },
    });
    
    return result.text || "AI COMMUNICATION LINK UNSTABLE. RE-ATTEMPTING...";
  } catch (error) {
    console.error("Gemini Error:", error);
    return "CORE PROCESSOR OVERLOAD. AI OFFLINE.";
  }
};