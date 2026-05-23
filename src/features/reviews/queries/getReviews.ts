import { createClient } from "@/lib/supabase/server";
import type { Review, ReviewStatus } from "@/types";

export async function getReviews(status?: ReviewStatus): Promise<Review[]> {
  const supabase = await createClient();

  const query = supabase
    .from("reviews")
    .select("*")
    .order("review_time", { ascending: false });

  const { data, error } = status
    ? await query.eq("status", status)
    : await query;

  if (error) throw new Error(error.message);

  return data;
}
