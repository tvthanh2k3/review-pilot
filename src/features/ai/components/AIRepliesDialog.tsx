"use client";

import { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/cn";
import { approveReply } from "@/features/reviews/queries/approveReply";
import type { AIResponse, Tone } from "@/types";

const TONE_LABELS: Record<Tone, string> = {
  standard: "Standard",
  friendly: "Friendly",
  apologetic: "Apologetic",
};

interface AIRepliesDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  replies: AIResponse[];
  reviewId: string;
}

export function AIRepliesDialog({
  open,
  onOpenChange,
  replies,
  reviewId,
}: AIRepliesDialogProps) {
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [approving, setApproving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!open) {
      setSelectedId(null);
      setError(null);
    }
  }, [open]);

  async function handleApprove() {
    if (!selectedId) return;
    setApproving(true);
    setError(null);
    try {
      await approveReply(selectedId, reviewId);
      onOpenChange(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to approve reply");
    } finally {
      setApproving(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>AI Reply Suggestions</DialogTitle>
          <DialogDescription>
            Select one of the 3 AI-generated replies.
          </DialogDescription>
        </DialogHeader>

        {replies.length === 0 ? (
          <p className="py-6 text-center text-sm text-muted-foreground">
            No replies available. Please try again.
          </p>
        ) : (
          <>
            <div className="flex flex-col gap-3">
              {replies.map((reply) => (
                <button
                  key={reply.id}
                  type="button"
                  onClick={() => setSelectedId(reply.id)}
                  className={cn(
                    "w-full rounded-lg border p-3 text-left text-sm transition-colors",
                    selectedId === reply.id
                      ? "border-primary bg-primary/5"
                      : "border-border hover:bg-muted"
                  )}
                >
                  <span className="mb-1 block text-xs font-medium uppercase tracking-wide text-muted-foreground">
                    {TONE_LABELS[reply.tone]}
                  </span>
                  <p className="leading-relaxed">{reply.content}</p>
                </button>
              ))}
            </div>

            {error && <p className="text-sm text-destructive">{error}</p>}

            <div className="flex justify-end">
              <Button
                disabled={!selectedId || approving}
                onClick={handleApprove}
              >
                {approving ? "Approving…" : "Approve"}
              </Button>
            </div>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}
