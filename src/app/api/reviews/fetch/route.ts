import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { fetchPlaceReviews } from "@/lib/google-places";
import { createClient } from "@/lib/supabase/server";

const bodySchema = z.object({
  place_id: z.string().min(1, "place_id is required"),
});

export async function POST(req: NextRequest): Promise<NextResponse> {
  try {
    const parsed = bodySchema.safeParse(await req.json());
    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.issues[0].message },
        { status: 400 }
      );
    }

    const { place_id } = parsed.data;

    const reviews = await fetchPlaceReviews(place_id);

    if (reviews.length === 0) {
      return NextResponse.json({ inserted: 0 });
    }

    const supabase = await createClient();

    const rows = reviews.map((r) => ({
      place_id,
      source_review_id: r.googleReviewId,
      author_name: r.name,
      rating: r.rating,
      review_text: r.text,
      review_time: r.publishTime,
      status: "pending" as const,
    }));

    // upsert on source_review_id to dedupe re-fetches
    const { error, count } = await supabase
      .from("reviews")
      .upsert(rows, { onConflict: "source_review_id", ignoreDuplicates: true })
      .select("id");

    if (error) throw new Error(error.message);

    return NextResponse.json({ inserted: count ?? 0 });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Internal server error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
