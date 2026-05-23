import { GoogleGenerativeAI } from "@google/generative-ai";

// Server-only — GEMINI_API_KEY must never be exposed to the browser.
let _client: GoogleGenerativeAI | undefined;

export function getGeminiClient(): GoogleGenerativeAI {
  if (!_client) {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) throw new Error("GEMINI_API_KEY is not configured");
    _client = new GoogleGenerativeAI(apiKey);
  }
  return _client;
}
