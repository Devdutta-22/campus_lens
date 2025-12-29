import { GoogleGenerativeAI } from "@google/generative-ai";

// ⚠️ IMPORTANT: In a real app, hide this key. For Hackathon, it's okay in code.
const API_KEY = "AIzaSyBhmdUhS5uFX0Ol1WZ_Q0IP_PZ7_oA0Jn8"; 
const genAI = new GoogleGenerativeAI(API_KEY);

export const getCampusTip = async (locationName) => {
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    
    const prompt = `I am a student at Galgotias University standing at the ${locationName}. 
    Give me one short, secret "Pro Tip" for this specific location. 
    Keep it under 20 words. Be helpful.`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    return response.text();
  } catch (error) {
    console.error("Gemini Error:", error);
    return "Check out this cool spot!"; // Fallback text
  }
};