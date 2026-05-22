"use client";

import { Button } from "@/components/ui/button";
import { AIRepliesDialog } from "@/features/ai/components/AIRepliesDialog";
import { useGenerateReplies } from "@/features/ai/hooks/useGenerateReplies";

interface GenerateButtonProps {
  reviewId: string;
}

export function GenerateButton({ reviewId }: GenerateButtonProps) {
  const { replies, loading, error, dialogOpen, setDialogOpen, generate } =
    useGenerateReplies();

  return (
    <>
      <Button
        size="sm"
        variant="outline"
        disabled={loading}
        onClick={() => generate(reviewId)}
      >
        {loading ? "Generating…" : "Generate AI Reply"}
      </Button>

      {error && <p className="text-xs text-destructive">{error}</p>}

      <AIRepliesDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        replies={replies}
      />
    </>
  );
}
