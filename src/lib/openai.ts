import OpenAI from "openai";

// Server-only — OPENAI_API_KEY must never be exposed to the browser.
// Lazy singleton: client is created on first use, not at module load time,
// so the build doesn't throw when the env var is absent.
let _client: OpenAI | undefined;

export function getOpenAIClient(): OpenAI {
  if (!_client) {
    _client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
  }
  return _client;
}
