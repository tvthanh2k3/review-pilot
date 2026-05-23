// Server-only — GOOGLE_PLACES_API_KEY must never be exposed to the browser

export interface PlaceReview {
  googleReviewId: string;
  name: string;
  rating: number;
  text: string;
  publishTime: string;
}

const PLACES_API_BASE = "https://places.googleapis.com/v1";

export async function fetchPlaceReviews(
  placeId: string
): Promise<PlaceReview[]> {
  const apiKey = process.env.GOOGLE_PLACES_API_KEY;
  if (!apiKey) throw new Error("GOOGLE_PLACES_API_KEY is not configured");

  const res = await fetch(`${PLACES_API_BASE}/places/${placeId}`, {
    method: "GET",
    headers: {
      "X-Goog-Api-Key": apiKey,
      "X-Goog-FieldMask": "reviews",
    },
  });

  if (!res.ok) {
    const body = await res.text();
    throw new Error(`Google Places API error ${res.status}: ${body}`);
  }

  const data = (await res.json()) as {
    reviews?: Array<{
      name: string;
      rating: number;
      text?: { text: string };
      publishTime: string;
      authorAttribution?: { displayName: string };
    }>;
  };

  return (data.reviews ?? []).slice(0, 5).map((r) => ({
    // Places API (New) uses the resource name as the stable review ID
    googleReviewId: r.name,
    name: r.authorAttribution?.displayName ?? "Anonymous",
    rating: r.rating,
    text: r.text?.text ?? "",
    publishTime: r.publishTime,
  }));
}
