import { getReviews } from "@/features/reviews/queries/getReviews";
import { ReviewCard } from "@/features/reviews/components/ReviewCard";
import { FetchReviewsForm } from "@/features/reviews/components/FetchReviewsForm";
import { StatusFilter } from "@/features/reviews/components/StatusFilter";
import type { ReviewStatus } from "@/types";

type PageProps = {
  searchParams: Promise<{ status?: string }>;
};

function parseStatus(raw: string | undefined): ReviewStatus | undefined {
  if (raw === "pending" || raw === "resolved") return raw;
  return undefined;
}

export default async function DashboardPage({ searchParams }: PageProps) {
  const { status: rawStatus } = await searchParams;
  const status = parseStatus(rawStatus);
  const reviews = await getReviews(status);

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b">
        <div className="max-w-5xl mx-auto px-6 py-4">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h1 className="text-xl font-semibold">ReviewPilot</h1>
              <p className="text-sm text-muted-foreground">
                {reviews.length} đánh giá
              </p>
            </div>
            <FetchReviewsForm />
          </div>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-6 py-8">
        <div className="mb-6">
          <StatusFilter active={status} />
        </div>

        {reviews.length === 0 ? (
          <p className="text-center text-sm text-muted-foreground py-16">
            {status
              ? `Không có đánh giá ${status === "pending" ? "chờ xử lý" : "đã xử lý"}.`
              : "Chưa có đánh giá. Nhập Google Place ID ở trên để lấy đánh giá."}
          </p>
        ) : (
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            {reviews.map((review) => (
              <ReviewCard key={review.id} review={review} />
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
