// Server-only — GOOGLE_PLACES_API_KEY must never be exposed to the browser

export interface PlaceReview {
  googleReviewId: string;
  name: string;
  rating: number;
  text: string;
  publishTime: string;
}

export async function fetchPlaceReviews(
  _placeId: string
): Promise<PlaceReview[]> {
  throw new Error("Google Places integration is not yet available");
}
