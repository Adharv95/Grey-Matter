
import { GoogleGenAI } from "@google/genai";
import { SystemState } from '../types';

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const getAIAssistance = async (prompt: string, state: SystemState) => {
  const context = `
    SYSTEM STATUS REPORT (AEGIS-7 STATION):
    - Oxygen: ${state.oxygen}% (CRITICAL THRESHOLD: 30%)
    - Power: ${state.power}%
    - Structural Integrity: ${state.integrity}%
    - CO2 Levels: ${state.co2Levels} ppm (Danger above 2000)
    - Temp: ${state.temperature}°C

    ROLE: You are AEGIS-7 Mission Control AI. You are analytical, cold, but prioritizing survival.
    Keep responses short, urgent, and technically precise.
    User is a crew member in a failing sector.
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
      config: {
        systemInstruction: context,
        temperature: 0.9,
      },
    });
    return response.text || "AI COMMUNICATION LINK UNSTABLE. RE-ATTEMPTING...";
  } catch (error) {
    console.error("Gemini Error:", error);
    return "CORE PROCESSOR OVERLOAD. AI OFFLINE.";
  }
};
