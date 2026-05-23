"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";

export async function approveReply(
  responseId: string,
  reviewId: string
): Promise<void> {
  const supabase = await createClient();

  const { error: responseError } = await supabase
    .from("ai_responses")
    .update({ is_approved: true })
    .eq("id", responseId);

  if (responseError) throw new Error(responseError.message);

  const { error: reviewError } = await supabase
    .from("reviews")
    .update({ status: "resolved" })
    .eq("id", reviewId);

  if (reviewError) throw new Error(reviewError.message);

  revalidatePath("/dashboard");
}
