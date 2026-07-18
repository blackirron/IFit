# IFit — Fitness & Wellness Tracker

A full-stack fitness dashboard for tracking workouts, meals, sleep, and progress — built as a pnpm monorepo with a React frontend and an Express/Postgres backend.

**Live app:** https://ifit-static-site.onrender.com/
**API:** https://ifit-iib4.onrender.com/api/healthz

> Note: hosted on Render's free tier — the first request after a period of inactivity may take up to ~50 seconds while the instance spins back up.

## Features

- **Dashboard** — personalized daily overview: calories, active minutes, water intake, sleep, and macro progress at a glance
- **Meals** — log meals with full macro breakdown (protein, carbs, fat) and daily summaries
- **Exercises** — log workouts by type (cardio, strength, flexibility) with sets, reps, weight, and duration
- **Weekly Schedule** — a 7-day planner for workouts and meals, with completion tracking
- **Stories Feed** — community-style inspiration feed with likes and bookmarks
- **Progress** — weight trend chart, body measurements, and BMI calculator
- **Water & Sleep** — tap-to-add water tracker with an animated fill meter, plus a sleep log with quality ratings and a 7-day chart
- **Badges** — an achievement room with earned and locked milestones
- **Daily Tips** — categorized fitness, nutrition, and recovery tips
- **Dark Mode** — toggleable, persisted across sessions

## Tech Stack

**Frontend** (`artifacts/fitlife`)
- React + Vite
- Tailwind CSS
- Radix UI primitives

**Backend** (`artifacts/api-server`)
- Express 5
- Drizzle ORM
- PostgreSQL

**Shared packages** (`lib/`)
- `db` — Drizzle schema and database client
- `api-zod` — generated Zod validation types
- `api-spec` — OpenAPI specification
- `api-client-react` — typed API client used by the frontend

This is a pnpm workspace monorepo — every package above is independently versioned and built, and the frontend talks to the backend exclusively through the generated, typed `api-client-react` package rather than hand-written fetch calls.

## Running Locally

```bash
pnpm install

# Backend
cd artifacts/api-server
export DATABASE_URL="postgresql://..."
pnpm run dev

# Frontend (separate terminal)
cd artifacts/fitlife
export PORT=3000
export BASE_PATH=/
pnpm run dev
```

## Deployment

Deployed on [Render](https://render.com):
- **Database** — Render PostgreSQL
- **API** — Render Web Service, built from `artifacts/api-server`
- **Frontend** — Render Static Site, built from `artifacts/fitlife`, served from `dist/public`

See `replit-to-github-deploy-guide.md` for the full migration and deployment process this project followed, from Replit export through to a live Render deployment.

## Project Origin

Originally built as a Replit Agent project, migrated to a standalone GitHub repository and redeployed on Render for full ownership of the codebase and infrastructure.

<img width="1920" height="958" alt="image" src="https://github.com/user-attachments/assets/1c9a45f4-045e-4e34-b5cf-5044ff119244" />
