import Groq from "groq-sdk";

// Server-only — GROQ_API_KEY must never be exposed to the browser.
let _client: Groq | undefined;

export function getGroqClient(): Groq {
  if (!_client) {
    const apiKey = process.env.GROQ_API_KEY;
    if (!apiKey) throw new Error("GROQ_API_KEY is not configured");
    _client = new Groq({ apiKey });
  }
  return _client;
}
