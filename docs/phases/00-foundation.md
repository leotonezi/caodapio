# Phase 0: Foundation

## Goal
Scaffold the project so an empty app builds, tests, lints, and deploys to a preview URL with green CI.

## Scope
- Vite + React + TypeScript (strict).
- Tailwind CSS.
- ESLint + Prettier.
- Vitest + Testing Library (unit), Playwright (E2E), one smoke test each.
- GitHub Actions: lint, typecheck, unit test, build on every PR.
- `supabase/` scaffolded locally (`config.toml`, empty `migrations/`), `.env.example`.
- `vercel.json` so the repo is ready to link.

## Out of scope
- Creating the actual Supabase/Vercel cloud projects (manual, browser-based — done by the repo owner after this PR).
- Branch protection rules on `main`.
- Any domain code (`src/core`, `src/data`, `src/features`) — starts in Phase 1.

## Acceptance criteria
- `npm run lint`, `npm run typecheck`, `npm run test`, `npm run build` all pass.
- `npm run test:e2e` passes against the local dev server.
- CI is green on the PR.
- App shell renders "Cãodápio" as a placeholder.
