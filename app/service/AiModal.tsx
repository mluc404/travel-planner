import { GoogleGenAI } from "@google/genai";

const myApiKey = process.env.GOOGLE_GEMINI_API_KEY;

const ai = new GoogleGenAI({
  apiKey: "AIzaSyBfPcSPEcM3mco8D020rLx7zWmGDq0v8qY",
});

export async function generateTrip(FINAL_PROMPT: string) {
  const response = await ai.models.generateContent({
    model: "gemini-2.0-flash",
    contents: FINAL_PROMPT,
    config: {
      systemInstruction: "You are a travel agent",
      //   maxOutputTokens: 500,
      responseMimeType: "application/json",
    },
  });
  //   console.log(response);

  return response.text;
}
