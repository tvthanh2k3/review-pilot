"use client";

import { useState } from "react";
import type { AIResponse } from "@/types";

interface UseGenerateRepliesResult {
  replies: AIResponse[];
  loading: boolean;
  error: string | null;
  dialogOpen: boolean;
  setDialogOpen: (open: boolean) => void;
  generate: (reviewId: string) => Promise<void>;
}

export function useGenerateReplies(): UseGenerateRepliesResult {
  const [replies, setReplies] = useState<AIResponse[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);

  async function generate(reviewId: string): Promise<void> {
    setLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/ai/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ review_id: reviewId }),
      });

      const data: { replies?: AIResponse[]; error?: string } = await res.json();

      if (!res.ok) {
        throw new Error(data.error ?? "Failed to generate replies");
      }

      setReplies(data.replies ?? []);
      setDialogOpen(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setLoading(false);
    }
  }

  return { replies, loading, error, dialogOpen, setDialogOpen, generate };
}
