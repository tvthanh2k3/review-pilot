import { z } from "zod";

export const aiRepliesSchema = z.object({
  standard: z.string().min(1),
  friendly: z.string().min(1),
  apologetic: z.string().min(1),
});

export type AIRepliesPayload = z.infer<typeof aiRepliesSchema>;

export function buildPrompt(
  reviewText: string,
  authorName: string,
  rating: number
): string {
  return `You are a professional business manager responding to a customer review on Google Maps.

Review by ${authorName} (${rating}/5 stars):
"${reviewText}"

Write 3 reply options. Each must be under 120 words. Reply in the same language as the review.

Return only a valid JSON object with exactly these keys:
{
  "standard": "professional and polite reply",
  "friendly": "warm, personalized reply",
  "apologetic": "empathetic reply that acknowledges the customer feedback"
}`;
}
