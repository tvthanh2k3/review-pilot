import { NextRequest, NextResponse } from "next/server";
import { getGroqClient } from "@/lib/groq";
import { createClient } from "@/lib/supabase/server";
import { aiRepliesSchema, buildPrompt } from "@/features/ai/queries/aiSchema";
import type { Tone } from "@/types";

export async function POST(request: NextRequest): Promise<NextResponse> {
  try {
    const body = await request.json().catch(() => null);

    if (!body || typeof body.review_id !== "string" || !body.review_id) {
      return NextResponse.json({ error: "review_id is required" }, { status: 400 });
    }

    const { review_id } = body as { review_id: string };

    const supabase = await createClient();

    const { data: review, error: reviewError } = await supabase
      .from("reviews")
      .select("author_name, rating, review_text")
      .eq("id", review_id)
      .single();

    if (reviewError || !review) {
      return NextResponse.json({ error: "Review not found" }, { status: 404 });
    }

    const prompt = buildPrompt(review.review_text, review.author_name, review.rating);

    let raw: string | null = null;

    for (let attempt = 0; attempt < 2; attempt++) {
      const completion = await getGroqClient().chat.completions.create({
        model: "llama-3.3-70b-versatile",
        messages: [{ role: "user", content: prompt }],
        response_format: { type: "json_object" },
        max_tokens: 600,
      });
      raw = completion.choices[0]?.message?.content ?? null;
      if (raw) break;
    }

    if (!raw) {
      return NextResponse.json({ error: "No response from AI" }, { status: 502 });
    }

    let parsedJson: unknown;
    try {
      parsedJson = JSON.parse(raw);
    } catch {
      return NextResponse.json({ error: "AI returned invalid JSON" }, { status: 502 });
    }

    const parsed = aiRepliesSchema.safeParse(parsedJson);
    if (!parsed.success) {
      return NextResponse.json({ error: "Invalid AI response format" }, { status: 502 });
    }

    const replies = parsed.data;

    await supabase.from("ai_responses").delete().eq("review_id", review_id);

    const tones: Tone[] = ["standard", "friendly", "apologetic"];

    const { data: aiResponses, error: insertError } = await supabase
      .from("ai_responses")
      .insert(
        tones.map((tone) => ({
          review_id,
          tone,
          content: replies[tone],
          is_approved: false,
        }))
      )
      .select();

    if (insertError) {
      return NextResponse.json({ error: "Failed to save replies" }, { status: 500 });
    }

    return NextResponse.json({ replies: aiResponses });
  } catch (err) {
    console.error("[/api/ai/generate]", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
