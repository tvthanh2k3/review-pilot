# Technical Decisions

Key architectural choices and their trade-offs.

---

## Next.js App Router (over Pages Router)

**Chose:** Next.js 16 with App Router

**Reason:** Server Components allow fetching data from Supabase directly without writing extra API routes. Route Handlers handle secret API calls (Google Places, Gemini) server-side. Single codebase for frontend + backend — no separate Express server needed.

**Trade-off:** App Router has a steeper learning curve than Pages Router, and some ecosystem libraries lag behind in compatibility.

---

## Supabase (over Firebase)

**Chose:** Supabase (PostgreSQL)

**Reason:** The `reviews ↔ ai_responses` relationship is naturally relational — SQL foreign keys and joins fit better than NoSQL documents. Supabase also provides Auth, Row Level Security, and a generous free tier out of the box.

**Trade-off:** Firebase has better real-time and mobile SDKs, but this use case (dashboard CRUD) doesn't need them.

---

## Gemini API (over OpenAI)

**Chose:** Google Gemini API (`gemini-2.0-flash`)

**Reason:** Gemini offers a free tier (1,500 requests/day) with no billing required — practical for an MVP and demo. PRD explicitly lists Gemini as an accepted option.

**Trade-off:** OpenAI's `response_format: json_object` is more stable for structured JSON output. Gemini requires prompt-level JSON instructions and response parsing. Mitigated with Zod validation.

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
