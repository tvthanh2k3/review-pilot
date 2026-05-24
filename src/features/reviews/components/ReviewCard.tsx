import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/cn";
import { GenerateButton } from "@/features/ai/components/GenerateButton";
import type { Review } from "@/types";

interface ReviewCardProps {
  review: Review;
}

function StarRating({ rating }: { rating: number }) {
  return (
    <span className="text-amber-400 text-sm">
      {"★".repeat(rating)}
      <span className="text-muted-foreground">{"★".repeat(5 - rating)}</span>
    </span>
  );
}

export function ReviewCard({ review }: ReviewCardProps) {
  const date = new Date(review.review_time).toLocaleDateString("en-GB");

  return (
    <Card>
      <CardHeader className="pb-2">
        <div className="flex items-start justify-between gap-2">
          <div className="flex flex-col gap-1">
            <span className="font-medium text-sm">{review.author_name}</span>
            <StarRating rating={review.rating} />
          </div>
          <Badge
            className={cn(
              review.status === "resolved"
                ? "bg-green-100 text-green-800 hover:bg-green-100"
                : "bg-amber-100 text-amber-800 hover:bg-amber-100"
            )}
          >
            {review.status === "resolved" ? "Resolved" : "Pending"}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="flex flex-col gap-3">
        <p className="text-sm text-muted-foreground leading-relaxed">
          {review.review_text}
        </p>
        <div className="flex items-center justify-between">
          <span className="text-xs text-muted-foreground">{date}</span>
          {review.status === "pending" && (
            <GenerateButton reviewId={review.id} />
          )}

        </div>
      </CardContent>
    </Card>
  );
}
