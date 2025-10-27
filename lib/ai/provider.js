"use strict";
/**
 * AI Provider Configuration
 * Google Gemini 2.5-Flash setup with safety and defaults
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.modelConfig = exports.geminiFlash = exports.google = void 0;
var google_1 = require("@ai-sdk/google");
var generative_ai_1 = require("@google/generative-ai");
// ✅ Initialize provider with API key from .env
exports.google = (0, google_1.createGoogleGenerativeAI)({
    apiKey: process.env.GOOGLE_GENERATIVE_AI_API_KEY,
});
// ✅ Create Gemini 2.5 Flash model instance
exports.geminiFlash = exports.google.generativeModel({
    model: 'gemini-2.5-flash',
    safetySettings: [
        {
            category: generative_ai_1.HarmCategory.HARM_CATEGORY_HARASSMENT,
            threshold: generative_ai_1.HarmBlockThreshold.BLOCK_NONE,
        },
        {
            category: generative_ai_1.HarmCategory.HARM_CATEGORY_HATE_SPEECH,
            threshold: generative_ai_1.HarmBlockThreshold.BLOCK_NONE,
        },
    ],
});
// ✅ Optional: Default config for generation calls
exports.modelConfig = {
    temperature: 0.7,
    topP: 0.95,
    maxOutputTokens: 2048,
};
