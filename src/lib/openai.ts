import OpenAI from "openai";

// Server-only — OPENAI_API_KEY must never be exposed to the browser
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export default openai;
