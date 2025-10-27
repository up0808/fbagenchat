"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.modelConfig = exports.geminiFlash = exports.google = void 0;
/**
 * AI Provider Configuration
 * Google Gemini 2.5-Flash setup with safety and defaults
 */
var google_1 = require("@ai-sdk/google");
var genai_1 = require("@google/genai");
exports.google = (0, google_1.createGoogleGenerativeAI)({
    apiKey: process.env.GOOGLE_API_KEY,
});
exports.geminiFlash = exports.google.generativeModel({
    model: 'gemini-2.5-flash',
    safetySettings: [
        { category: genai_1.HarmCategory.HARM_CATEGORY_HARASSMENT, threshold: genai_1.HarmBlockThreshold.BLOCK_NONE },
        { category: genai_1.HarmCategory.HARM_CATEGORY_HATE_SPEECH, threshold: genai_1.HarmBlockThreshold.BLOCK_NONE },
    ],
});
// ✅ Optional: Default config for generation calls
exports.modelConfig = {
    temperature: 0.7,
    topP: 0.95,
    maxOutputTokens: 2048,
};
