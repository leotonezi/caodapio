# Cãodápio

Shared web app for logging Ares's daily food against a vet nutritionist's plan.

Full plan: [`IMPLEMENTATION_PLAN.md`](./IMPLEMENTATION_PLAN.md). Current phase spec: [`docs/phases/`](./docs/phases/). Project conventions: [`CLAUDE.md`](./CLAUDE.md).

## Setup

```
npm install
cp .env.example .env   # fill in Supabase URL + anon key
npm run dev
```

## Commands

```
npm run dev
npm run lint
npm run typecheck
npm run test
npm run test:e2e
npx supabase start
npx supabase db reset
```

## Manual setup still needed (Phase 0)

This phase only scaffolds local config. To get a working preview + backend:

1. Create a Supabase project (dev + prod), copy its URL/anon key into `.env` and into Vercel's project env vars.
2. Run `vercel link` to connect this repo to a Vercel project, then `vercel --prod` once, or just open a PR — Vercel will build previews automatically once linked.
3. Add the same `VITE_SUPABASE_URL` / `VITE_SUPABASE_ANON_KEY` to the Vercel project settings.
