---
name: git-workflow
description: Git workflow skill for review-pilot. Use this whenever the user wants to create a branch, commit, push, create a PR, or do anything related to Git in this project. Always follow these conventions when suggesting git commands or branch names.
---

# Git Workflow — ReviewPilot

## Branch Naming Convention

Branches must follow this pattern based on the area of work:

| Area | Pattern | Example |
|---|---|---|
| Feature | `feature/<name>` | `feature/fetch-reviews` |
| Bugfix | `fix/<name>` | `fix/json-parse-error` |
| Refactor | `refactor/<name>` | `refactor/api-routes` |
| Chore / config | `chore/<name>` | `chore/update-deps` |

**Rules:**
- Use **kebab-case** (lowercase, hyphens) — no spaces, no underscores
- **Keep names short and to the point** — 2 to 4 words max, no filler words
- Always branch off from `main`

**Good vs Bad branch names:**
```
✅ feature/fetch-reviews
✅ feature/ai-generate
✅ fix/json-parse-error

❌ feature/implement-fetching-reviews-from-google-places-api
❌ feature/add-new-ai-generation-with-three-tones
❌ fix/fixing-the-issue-with-json-parsing-from-openai
```

```bash
# Always start from main
git checkout main
git pull origin main
git checkout -b feature/<name>
```

**Rule: always create the branch before writing any code.** Do not start coding until the branch exists.

**Exception — gitignored files:** Changes to files matched by `.gitignore` (e.g. `.env`, `.env.*`, `node_modules/`, `.next/`, `*.local`) require **no branch and no commit**. These files must never be pushed to GitHub as they may contain secrets or generated output. Apply changes directly without any git ceremony.

---

## Claude's Role in Git

**Claude must never run git commands directly.** All git operations (branch creation, staging, committing, pushing) are performed manually by the user.

After completing each logical unit of work, Claude outputs the exact commands to copy-paste in this format:

```
Files to commit:
  git add src/app/api/reviews/route.ts
  git add src/lib/supabase.ts

Commit message:
  feat(reviews): add fetch endpoint

Reason: one line explaining why these files belong together.
```

**Claude must then stop and wait.** Do not implement the next task until the user has committed manually and explicitly asks to continue.

**Exception:** Terminal commands run purely for verification (e.g. `npm run build`, `npm run lint`) are diagnostic only — they do not produce a commit suggestion.

Commit after every logical unit — a component, an endpoint, a fix. Do not accumulate changes across multiple units before committing.

---

## Commit Message Convention

Follow **Conventional Commits** format:

```
<type>(<scope>): <short description>
```

### Types

| Type | When to use |
|---|---|
| `feat` | Adding a new feature |
| `fix` | Fixing a bug |
| `refactor` | Code restructure, no behavior change |
| `style` | Formatting, CSS, UI tweaks (no logic change) |
| `chore` | Config, dependencies, tooling |
| `docs` | Documentation changes |
| `test` | Adding or updating tests |
| `perf` | Performance improvements |

### Scope (optional but recommended)

Scope should answer **"which feature/module?"** — use the feature or module name directly:

- `reviews` — review CRUD, Google Places integration
- `ai` — OpenAI integration, prompts, replies
- `ui` — Dashboard, components, styling
- `db` — Supabase schema, migrations, queries
- `api` — API routes
- `config` — Setup, env vars, deployment

### Examples

```bash
feat(reviews): add fetch endpoint
feat(ai): integrate openai sdk
feat(ui): add review card
feat(db): add reviews schema
fix(api): handle invalid place id
fix(ai): parse json safely
refactor(reviews): extract supabase client
chore: update dependencies
```

**Rules:**
- Use **present tense**, imperative mood: "add" not "added" or "adds"
- Description must be **2–4 words maximum** — if you need more words, the commit is doing too much; split it
- **No comma** — a comma means two actions; split into two commits instead
- No period at the end
- **No filler words** — avoid "implement", "update", "some", "various", "misc"

**Good vs Bad commit messages:**
```
✅ feat(reviews): add fetch endpoint
✅ feat(ai): integrate openai sdk
✅ fix(api): handle invalid place id

❌ feat(reviews): add endpoint to fetch reviews from Google Places API
❌ feat(ai): implement OpenAI integration for generating replies
❌ feat(ui): add review card, fix lint errors, update styles
```

If a description naturally needs more than 4 words, it means the commit contains too many unrelated changes. Split into smaller commits, each described in 2–4 words.

---

## Atomic Commits — Always Split Your Work

**NEVER commit a pile of unrelated files in one go.** Each commit must represent one logical, self-contained change.

### Why atomic commits matter
- Makes code review faster and clearer
- Easier to revert a specific change without affecting others
- Git history becomes a readable story of what was built and why

### How to think about splitting commits

Ask yourself: *"Can I describe this commit in 2–4 words without using 'and'?"*
If you need "and", or need more than 4 words, it should be two (or more) commits.

### Build/lint fixes are always a separate commit

After completing a feature commit, if `npm run build` or `npm run lint` reveals errors, the fixes **must go in their own commit** — never mixed back into the feature commit.

```
✅ Correct flow:
  feat(reviews): add fetch endpoint       ← feature work
  fix(reviews): remove unused import      ← build/lint fix, separate commit

❌ Wrong — mixing feature + fix in one commit:
  feat(reviews): add fetch endpoint, fix lint errors
```

This keeps the feature commit clean and makes the fix traceable on its own.

```
❌ feat: add ai generation and fix json parsing and update styles
✅ feat(ai): add reply generation
✅ fix(ai): parse json safely
✅ style(ui): adjust card spacing
```

### Stage selectively — never use `git add .` blindly

```bash
# Add only related files
git add src/app/api/reviews/route.ts
git add src/lib/supabase.ts
git commit -m "feat(reviews): add fetch endpoint"

# Then commit the next logical change separately
git add src/lib/openai.ts
git commit -m "feat(ai): add openai client"

# Use interactive staging to pick specific lines/hunks
git add -p src/someFile.tsx
```

### Practical examples of splitting commits

**Scenario: Building the AI reply generation feature**
```bash
# ✅ Split into logical units
git commit -m "feat(ai): add openai client"
git commit -m "feat(ai): add prompt builder"
git commit -m "feat(ai): add zod schema"
git commit -m "feat(api): add generate route"
git commit -m "feat(ui): add generate button"

# ❌ Never do this
git add .
git commit -m "feat: ai integration"  # ← meaningless, unreviewable
```

---

## PR & Merge Workflow

**No commits directly to `main`.** Every change must go through a Pull Request.

### Standard flow

```bash
# 1. Create branch from main
git checkout main && git pull origin main
git checkout -b feature/<name>

# 2. Work and commit
git add .
git commit -m "feat(<scope>): <description>"

# 3. Push branch
git push origin feature/<name>

# 4. Create PR on GitHub
# Base branch: main
# Title: same format as commit message
# Add description of what changed and why
```

### Before creating a PR, always:
- [ ] Pull latest `main` and rebase if needed
- [ ] Make sure the app builds without errors
- [ ] Remove console.logs and debug code
- [ ] PR title follows Conventional Commits format

```bash
# Rebase onto latest main before PR
git fetch origin
git rebase origin/main
```

### PR Title format
Same as commit message convention:
```
feat(reviews): add fetch endpoint
fix(api): handle invalid place id
```

### Merge strategy
- Merge PRs into `main` via Pull Request only — never push directly to `main`
- Use **Squash and Merge** to keep history clean
- Delete the branch after merge

---

## Branch Protection Summary

```
main      ← production, protected — never push directly
feature/* ← your working branches
fix/*     ← bugfix branches
```

---

## Quick Reference

```bash
# Start new feature
git checkout main && git pull origin main
git checkout -b feature/<name>

# Stage selectively — never blindly add everything
git add <only related files>
git commit -m "feat(<scope>): <what you did>"
# Repeat for each logical change

# Push and open PR
git push origin feature/<name>
# → Go to GitHub → New Pull Request → base: main

# Update branch with latest main
git fetch origin
git rebase origin/main
```
