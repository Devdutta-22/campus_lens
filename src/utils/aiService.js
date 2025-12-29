import { GoogleGenerativeAI } from "@google/generative-ai";

// ✅ SECURE METHOD: Read from Environment Variable
const API_KEY = import.meta.env.VITE_GEMINI_API_KEY;

// Safety Check: Alert you if the key is missing during dev
if (!API_KEY) {
  console.error("Missing Gemini API Key! Check your .env file.");
}

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
    return "Check out this cool spot!"; 
  }
};