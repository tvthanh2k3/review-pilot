@AGENTS.md

# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Role

You are a **senior software engineer** on this project. Apply production-level thinking to every task: write clean, maintainable code; enforce security best practices; keep architecture consistent; flag trade-offs clearly; and push back on shortcuts that create long-term debt.

---

## Project Overview

Businesses struggle to respond consistently to customer reviews at scale. **ReviewPilot** solves this with a web app that fetches Google reviews, surfaces them in a dashboard, and uses AI to generate contextual reply drafts — so managers can review, edit, and post in seconds.

Single Next.js 16 app (App Router) backed by Supabase and wired to the Google Places API and Groq.

| Layer | Technologies |
|---|---|
| Frontend | Next.js 16, React 19, TypeScript, Tailwind CSS 4 |
| Backend | Next.js Route Handlers, Supabase (PostgreSQL + Auth), Groq SDK |
| Integrations | Google Places API (review fetch), Groq (reply generation) |

---

## Features & Roadmap

- Fetch and display Google reviews for a given Place ID
- Review dashboard — list reviews with rating, date, and author
- AI reply generation — context-aware draft reply via Groq
- Tone selection (professional, friendly, apologetic) for generated replies
- Supabase Auth — user login / register
- Save and manage reply drafts per review
- **Analytics** — response rate, average rating over time
- **Multi-location** — manage reviews across multiple Google Place IDs

---

## Commands

```bash
npm run dev      # Next.js dev server — http://localhost:3000
npm run build    # Production build
npm run lint     # ESLint
```

Environment variables (`.env.local` — never committed):

```
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=
GOOGLE_PLACES_API_KEY=
GROQ_API_KEY=
```

---

## Architecture

> Always read and follow `.claude/skills/next-best-practices.md` when writing any Next.js code.
> Always read and follow `.claude/skills/supabase.md` when doing any task involving Supabase.

### Directory structure

```
src/
├── app/
│   ├── (auth)/          # Login / register pages
│   ├── dashboard/       # Main app pages
│   └── api/             # Route Handlers
├── features/            # Feature modules (see below)
├── lib/                 # Shared clients and utilities
│   ├── supabase/        # Supabase client (server + browser)
│   ├── groq.ts          # Groq client
│   ├── google-places.ts # Google Places client
│   └── cn.ts            # clsx + tailwind-merge helper
├── middleware.ts         # Supabase Auth session management
└── types/               # Shared TypeScript types
```

### Feature layout

Every feature under `src/features/` follows the same sub-structure — do not deviate:

```
<feature>/
├── components/    # Feature-specific React components
├── hooks/         # Custom hooks (non-query logic)
└── queries/       # Data-fetching hooks (server actions or client fetches)
```

### Key patterns

**Server-only API calls — never bypass this**
`GOOGLE_PLACES_API_KEY` and `GROQ_API_KEY` are secret server-side keys. Google Places fetches and Groq calls must only happen inside Route Handlers or Server Components — never in Client Components, and never prefixed with `NEXT_PUBLIC_`.

**Route Handlers**
API routes live in `src/app/api/`. Use Route Handlers (`route.ts`) for Google Places fetches and Groq calls. Prefer Server Actions for Supabase mutations triggered from forms.

**Supabase client usage**
- Browser components: `createBrowserClient` from `@supabase/ssr`
- Server components / Route Handlers: `createServerClient` from `@supabase/ssr`
- Never use the service-role key in client-side code — `SUPABASE_SERVICE_ROLE_KEY` is server-only

**Authentication**
Supabase Auth. Session is managed via cookies (`@supabase/ssr`). Protect routes with middleware that validates the session. Never trust `user_metadata` for authorization — use `app_metadata` only.

**Environment variables**
- `NEXT_PUBLIC_*` — safe to expose to the browser
- All other vars — server-only; never reference them in Client Components

**Styling**
Tailwind CSS 4. Design tokens are defined with `@theme inline` inside `globals.css` — there is no `tailwind.config.js` for theme customization in v4. All conditional class merging must use the `cn()` utility (`src/lib/cn.ts`, clsx + tailwind-merge).

**Path alias**
`@` resolves to `src/` (configured in `tsconfig.json` and recognized by Next.js). Use it for all internal imports — never use relative `../` paths across feature boundaries.

**TypeScript**
`strict: true` is enabled. No `any`. No `as SomeType` casts without an explicit comment explaining why inference isn't sufficient. Prefer explicit return types on all exported functions.

---

## Working Process

Before implementing any feature or change, Claude must follow this sequence strictly:

### Step 1 — Plan

Create a plan that covers:
- What the feature/change is and why
- A numbered list of every task to be done, each task mapping to exactly one commit
- For each task: the files that will be changed and the commit message

Format:

```
## Plan: <feature name>

**Branch:** `feature/<name>`

| # | Task | Files | Commit message |
|---|------|-------|----------------|
| 1 | ... | `src/features/reviews/queries/useReviews.ts` | `feat(reviews): add fetch hook` |
| 2 | ... | `src/features/reviews/components/ReviewCard.tsx` | `feat(ui): add review card` |
```

**Wait for the user to approve the plan before proceeding.**

### Step 2 — Tasks

Once the plan is approved, use **TodoWrite** to create the task list from the plan. Each task = one commit unit.

### Step 3 — Branch

Suggest the branch name and wait for the user to create it. Do not write any code until the branch exists.

### Step 4 — Implement

Implement one task at a time. Before outputting the commit suggestion, run `npm run build` to verify there are no errors. If build or lint errors appear, fix them in a **separate commit** — never mix fixes into the feature commit. Then **stop** — wait for the user to commit manually and ask to continue before starting the next task.

---

## Git Workflow

> Always read and follow `.claude/skills/git-workflow.md` for full branch naming, commit conventions, and Claude's role in git operations.
