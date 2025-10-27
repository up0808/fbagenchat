/**
 * AI Provider Configuration
 * Google Gemini 2.5-Flash setup with safety and defaults
 */
import { createGoogleGenerativeAI } from '@ai-sdk/google';
import { HarmCategory, HarmBlockThreshold } from '@google/genai';

export const google = createGoogleGenerativeAI({
  apiKey: process.env.GOOGLE_API_KEY!,
});

export const geminiFlash = google.generativeModel({
  model: 'gemini-2.5-flash',
  safetySettings: [
    { category: HarmCategory.HARM_CATEGORY_HARASSMENT, threshold: HarmBlockThreshold.BLOCK_NONE },
    { category: HarmCategory.HARM_CATEGORY_HATE_SPEECH, threshold: HarmBlockThreshold.BLOCK_NONE },
  ],
});


// ✅ Optional: Default config for generation calls
export const modelConfig = {
  temperature: 0.7,
  topP: 0.95,
  maxOutputTokens: 2048,
};