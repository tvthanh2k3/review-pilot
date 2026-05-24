"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";

export function FetchReviewsForm() {
  const [placeId, setPlaceId] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);
  const router = useRouter();

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const trimmed = placeId.trim();
    if (!trimmed) return;

    setLoading(true);
    setMessage(null);

    try {
      const res = await fetch("/api/reviews/fetch", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ place_id: trimmed }),
      });

      const data: { inserted?: number; error?: string } = await res.json();

      if (!res.ok) {
        throw new Error(data.error ?? "Không thể lấy đánh giá");
      }

      const count = data.inserted ?? 0;
      setMessage({
        type: "success",
        text: count > 0
          ? `Đã thêm ${count} đánh giá mới.`
          : "Không có đánh giá mới (tất cả đã được lưu).",
      });
      setPlaceId("");
      router.refresh();
    } catch (err) {
      setMessage({
        type: "error",
        text: err instanceof Error ? err.message : "Đã có lỗi xảy ra",
      });
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-2 sm:flex-row sm:items-center sm:gap-3">
      <input
        type="text"
        value={placeId}
        onChange={(e) => setPlaceId(e.target.value)}
        placeholder="Nhập Google Place ID…"
        disabled={loading}
        className="flex-1 rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
      />
      <Button type="submit" disabled={loading || !placeId.trim()} size="sm">
        {loading ? "Đang tải…" : "Lấy đánh giá"}
      </Button>
      {message && (
        <p
          className={`text-xs ${message.type === "error" ? "text-destructive" : "text-green-600"}`}
        >
          {message.text}
        </p>
      )}
    </form>
  );
}
