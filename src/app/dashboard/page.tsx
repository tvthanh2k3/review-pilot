import { getReviews } from "@/features/reviews/queries/getReviews";
import { ReviewCard } from "@/features/reviews/components/ReviewCard";
import { FetchReviewsForm } from "@/features/reviews/components/FetchReviewsForm";

export default async function DashboardPage() {
  const reviews = await getReviews();

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b">
        <div className="max-w-5xl mx-auto px-6 py-4">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h1 className="text-xl font-semibold">ReviewPilot</h1>
              <p className="text-sm text-muted-foreground">
                {reviews.length} review{reviews.length !== 1 ? "s" : ""}
              </p>
            </div>
            <FetchReviewsForm />
          </div>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-6 py-8">
        {reviews.length === 0 ? (
          <p className="text-center text-sm text-muted-foreground py-16">
            No reviews yet. Enter a Google Place ID above to fetch reviews.
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
