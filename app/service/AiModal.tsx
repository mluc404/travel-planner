"use server";

import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({
  apiKey: process.env.GOOGLE_GEMINI_API_KEY,
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

  return response.text;
}
