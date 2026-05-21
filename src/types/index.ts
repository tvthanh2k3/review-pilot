export type ReviewStatus = "pending" | "resolved";

export type Tone = "standard" | "friendly" | "apologetic";

export interface Review {
  id: string;
  place_id: string;
  source_review_id: string;
  author_name: string;
  rating: number;
  review_text: string;
  review_time: string;
  status: ReviewStatus;
  created_at: string;
}

export interface AIResponse {
  id: string;
  review_id: string;
  tone: Tone;
  content: string;
  is_approved: boolean;
  created_at: string;
}
