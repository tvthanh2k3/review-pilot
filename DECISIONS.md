# Technical Decisions

Key architectural choices and their trade-offs.

---

## Next.js App Router (over Pages Router)

**Chose:** Next.js 16 with App Router

**Reason:** Server Components allow fetching data from Supabase directly without writing extra API routes. Route Handlers handle secret API calls (Google Places, Groq) server-side. Single codebase for frontend + backend — no separate Express server needed.

**Trade-off:** App Router has a steeper learning curve than Pages Router, and some ecosystem libraries lag behind in compatibility.

---

## Supabase (over Firebase)

**Chose:** Supabase (PostgreSQL)

**Reason:** The `reviews ↔ ai_responses` relationship is naturally relational — SQL foreign keys and joins fit better than NoSQL documents. Supabase also provides Auth, Row Level Security, and a generous free tier out of the box.

**Trade-off:** Firebase has better real-time and mobile SDKs, but this use case (dashboard CRUD) doesn't need them.

---

## Groq API (over Gemini / OpenAI)

**Chose:** Groq (`llama-3.3-70b-versatile`)

**Reason:** Gemini's free tier requires billing pre-payment in Vietnam (quota = 0 without it). OpenAI has no free tier. Groq provides 14,400 free requests/day with no billing required, and supports `response_format: { type: "json_object" }` natively — making structured AI output reliable without extra prompt engineering.

**Trade-off:** Groq is an inference provider, not a model owner — model availability depends on Groq's partnerships. Mitigated by using a stable, widely-supported model (`llama-3.3-70b-versatile`).

---

## shadcn/ui (over building from scratch)

**Chose:** shadcn/ui + Tailwind CSS 4

**Reason:** Pre-built accessible components (Dialog, Card, Badge, Button) saved ~2 days of UI work without locking into a heavy component library. Components are copied into the codebase — fully customizable.

**Trade-off:** More boilerplate files than a traditional component library. Acceptable for this scope.

---

## Zod (for validation)

**Chose:** Zod for input and AI response validation

**Reason:** LLM responses can be malformed JSON. Zod schema validates the structure before saving to DB, preventing runtime crashes. Also validates API route inputs (`place_id`, `review_id`).

**Trade-off:** Adds a dependency and some boilerplate, but the safety guarantee on AI output is worth it.

---

## TypeScript strict mode

**Chose:** `strict: true`

**Reason:** Catches type errors early, especially useful under 7-day time pressure where manual testing coverage is limited.

**Trade-off:** More verbose code in places, but the reduction in runtime bugs outweighs this.
