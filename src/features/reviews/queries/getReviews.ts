import { createClient } from "@/lib/supabase/server";
import type { Review } from "@/types";

export async function getReviews(): Promise<Review[]> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("reviews")
    .select("*")
    .order("review_time", { ascending: false });

  if (error) throw new Error(error.message);

  return data;
}
