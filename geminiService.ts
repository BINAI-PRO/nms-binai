
import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });

export const getIncidentSuggestion = async (description: string) => {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `Based on this incident description: "${description}", suggest a category (one word: Mantenimiento, Ruido, Limpieza, Seguridad) and a priority (Baja, Media, Alta). Return in JSON format.`,
      config: {
        responseMimeType: "application/json"
      }
    });
    return JSON.parse(response.text || '{}');
  } catch (error) {
    console.error("Gemini Error:", error);
    return null;
  }
};

export const summarizeAnnouncement = async (text: string) => {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `Summarize this community announcement into a single catchy sentence for a mobile app feed: ${text}`,
    });
    return response.text;
  } catch (error) {
    console.error("Gemini Error:", error);
    return text;
  }
};
