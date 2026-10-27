# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project

BudgetGrub ("Food Delivery Finder - UK") is a Next.js 15 / React 19 app. Users enter a UK postcode, a budget range (GBP), and meal categories, and get back a list of meal recommendations. It's an early prototype: the data comes from a hardcoded mock list, not from real delivery platforms.

## Commands

```bash
npm install     # fresh checkout / new worktree setup (no env vars needed yet)
npm run dev     # dev server at http://localhost:3000
npm run dev -- -p 3001   # dev server on a specific port (use for parallel worktrees)
npm run build   # production build
npm run start   # serve production build
npm run lint    # next lint (ESLint 9 flat config in eslint.config.mjs)
```

There's no test framework set up yet. Until one exists, `npm run lint` and `npm run build` are the checks to run.

## Software factory (`factory/`)

The repo also holds a "software factory": an agent workflow that builds features from `factory/backlog.md`. `README 2.md` documents it, and `BUILD_PROMPT.md` is the original prompt it was built from. That prompt is out of date: it describes a single `board.json`, but each job now gets its own `jobs/<id>/job.json`.

- `/factory <feature>` and `/factory next` (the first unchecked backlog item) run a pipeline: spec-writer, then builder, then four parallel reviewers (security, ux, ui, code), then approver. Each job runs on a `factory/<job-id>` branch in its own worktree at `../budgetgrub-factory/<job-id>/`.
- Agents take context from files only, and each one writes only its own file in `factory/jobs/<id>/`. Every review starts with `VERDICT: PASS` or `VERDICT: CHANGES`, and `decision.md` starts with `APPROVE` or `ESCALATE`. Only the orchestrator writes `job.json`.
- Dashboard: `cd factory && python3 -m http.server`, then open `http://localhost:8000/dashboard.html`. It polls the `jobs/*/job.json` files.
- The backlog's first items are the fixes listed under "Known structural issues" below.
- Setup is incomplete: `.claude/skills/factory/` and `.claude/agents/` are not in this repo yet.

## Architecture

- **App Router** (`src/app/`). `src/app/page.js` only renders `src/app/pages/Index.js`, a client component (`'use client'`) that owns all state (`recommendations`, `loading`, `error`, `searchParams`) and calls `POST /api/recommendations`.
- **Components** (`src/app/components/`) are presentational and get their state through props from `Index.js`. `SearchForm` validates the UK postcode regex and the budget on the client side, then calls `onSearch({ postcode, budgetMin, budgetMax, mealOptions })`. They don't declare `'use client'` themselves; they work because only `Index.js` imports them.
- **Recommendations API** (`src/app/pages/api/recommendations.js`) is written as a Pages Router handler `(req, res)`. It checks the request body, waits 2s to simulate latency, filters `mockRecommendations` by price range and by fuzzy-matching `mealOptions` against categories, dish name, and description, keeps at most 8 results, then sorts by `rating*10 + (budgetMax - price)`. The comments in the file describe the planned real pipeline: postcode lookup, then Deliveroo / Just Eat / Uber Eats APIs, then LLM ranking.
- **Mock data** (`src/app/utils/MockData.js`) has these item fields: `restaurantName, dishName, description, price, rating, reviewCount, deliveryTime, distance, platforms[], categories[], orderUrl, originalPrice?, specialOffer?`. `RecommendationList` renders these fields. It maps platform names to badge colours by lowercased key (`deliveroo`, `just-eat`, `uber-eats`, `local`).
- The path alias `@/*` points to `src/*` (see `jsconfig.json`).

## Known structural issues

These are in the current code. Be aware of them before you make changes:

- **The API route is in the wrong place.** Under the App Router, `src/app/pages/api/recommendations.js` is not served as `/api/recommendations`, so the fetch in `Index.js` will 404. To make it a real route, either move it to `src/pages/api/recommendations.js` (Pages Router API, same handler signature) or rewrite it as `src/app/api/recommendations/route.js` with `export async function POST(request)` that returns `Response.json(...)`.
- **The mock data import has the wrong case.** The API imports `../../utils/mockData`, but the file is `MockData.js`. This works on macOS and fails on case-sensitive filesystems such as Linux CI and Vercel.
- **`next/head` in `Index.js` does nothing in the App Router.** Page title and meta are set through the `metadata` export in `src/app/layout.js`, which still has the create-next-app defaults.
- **Tailwind is v4**, configured in CSS with `@import "tailwindcss"` and `@theme` in `globals.css` and the `@tailwindcss/postcss` plugin. `tailwind.config.js` is a v3-style file that v4 doesn't load. Its content globs don't match `src/`, and it also has stray `next.config` content pasted at the end. The real Next config is `next.config.mjs`.
- `axios`, `clsx`, and `@headlessui/react` are installed but not used yet.
