# Phase 2: Database, auth, household

## Goal
Real backend: migrations for the full data model, RLS on every table, magic-link auth, and household creation/invite — enough for two people to share one household.

## Scope
- Migrations in `supabase/migrations/`: households, household_members, household_invites, dogs, plans, entries, supplement_checks, weights, prices, settings. RLS enabled everywhere; a row is visible/writable only to members of its household.
- `create_household()` and `join_household_with_invite()` Postgres functions (`SECURITY DEFINER`) — household/membership rows are never inserted directly by clients, only through these, so a direct `user_id = auth.uid()` policy can't be used to join any household by id, and invite codes can't be enumerated via a broad `SELECT` policy.
- pgTAP RLS tests in `supabase/tests/`, run via `supabase test db --local`.
- Generated types at `src/data/supabase/database.types.ts`.
- `HouseholdRepository` interface (`src/data/repositories/household.ts`) + Supabase implementation (`src/data/supabase/household-repository.ts`). Other repositories (Entry/Plan/Weight/Price) deferred until a feature actually needs them (Phase 3+) — adding unused interfaces now would be speculative.
- Minimal `src/features/auth` (magic-link login) and `src/features/household` (create/join, member list) screens — functional, pt-BR via `src/i18n/pt-BR.ts`, no design polish.
- CI: `supabase start` + `supabase test db --local` added to `.github/workflows/ci.yml`.

## Out of scope
- Real cloud Supabase project / production email — user's manual step.
- Hoje/Histórico/Plano/Peso/Compras features, routing, TanStack Query — Phase 3+ (not installed this phase since nothing uses them yet).
- Offline outbox, realtime sync — Phase 8.

## Verification
- `npx supabase start`, `npx supabase db reset` apply all migrations cleanly.
- `npx supabase test db --local` — 16 pgTAP assertions pass (household + dog-scoped RLS, including non-member-denied and invite-redemption cases).
- `npm run lint`, `npm run typecheck`, `npm run test` (55 tests, core still 100% coverage), `npm run build` all pass.
- Manually verified end-to-end through the real local Auth + REST API (not just pgTAP): Leo requests a magic link, creates a household via `create_household`, generates an invite; Ana requests her own magic link, joins via `join_household_with_invite`, and both then see the same household, dog, and member list through the actual RLS-protected REST endpoints.

## Notes for the next person
- Local Supabase ports are shifted +1000 from the CLI's defaults (`supabase/config.toml`) to avoid colliding with another local Supabase project already running on this machine. `npx supabase status` prints the actual URLs/keys.
- `.env.test` (committed, no secrets — just local dev placeholder values) lets Vitest construct the Supabase client without crashing; nothing in the test suite hits the network.
