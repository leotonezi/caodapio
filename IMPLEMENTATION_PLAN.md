# Cãodápio: Implementation Plan

Repo: `caodapio`. App title in the UI: "Cãodápio".

Shared web app for Leo and Ana to log Ares's daily food against the vet nutritionist's plan, see what's left, track his weight, and plan shopping and cost. Web first (installable PWA), mobile later.

Built with Claude Code in phases. One phase = one branch = one PR. Each phase ends with CI green, a Vercel preview, and a stop for review.

---

## 1. Product scope

### Users
- One household (Leo + Ana), one dog (Ares). The schema supports more of both, but the UI doesn't need to.
- Both members have the same permissions.
- Every entry records who logged it, so the "Hoje" screen shows "Ana · 12:40".

### Features (v1)
| Area | What it does |
|---|---|
| Hoje | Per category: given / target / remaining, progress bar, alternatives label under each input, meal 1/2/3, edit/delete |
| Histórico | Day list: complete / incomplete / over target, tap into a day |
| Plano | Versioned plans (one per vet consultation), edit items, targets, alternatives, validity |
| Peso | Log Ares's weight, chart over time, current vs. plan weight |
| Compras | Shopping list for N days from the plan, raw weights with cooking loss, cost per item, monthly spend |
| Sync | Live updates between Leo's and Ana's devices; logging still works offline |
| Backup | JSON export/import |

### Out of scope for v1
Native apps, notifications, multiple dogs in the UI, recipes, vet sharing.

---

## 2. Stack

| Layer | Choice | Why |
|---|---|---|
| Frontend | Vite + React + TypeScript (strict) | Simple, fast, portable logic |
| Styling | Tailwind CSS | Quick mobile-first UI |
| Routing | React Router | Plain SPA routing |
| Server state | TanStack Query | Caching, optimistic updates, offline persistence |
| Validation | Zod | One schema shared by core, DB layer and forms |
| Backend | Supabase (Postgres, Auth, RLS, Realtime) | Shared data, magic-link login, live sync |
| Offline | Dexie (IndexedDB) outbox + TanStack Query persister | Log meals with no connection, sync later |
| Charts | Recharts | Weight chart |
| Tests | Vitest (unit), Playwright (E2E), pgTAP or SQL tests for RLS | |
| CI | GitHub Actions | Lint, typecheck, unit, E2E, migration check |
| Deploy | Vercel (preview per PR, production on `main`) | |
| PWA | vite-plugin-pwa | Manifest, service worker, install prompt |

Mobile path later: wrap with Capacitor (no code changes), or port UI to React Native and reuse `src/core` and the repository interfaces.

---

## 3. Architecture

```
src/
  core/            # pure TypeScript, no React, no Supabase, no DOM
    plan/          # plan schema (zod), seed, versioning helpers
    progress/      # fraction-based progress, remaining amounts
    alerts/        # alert codes (CARB_ALREADY_LOGGED, VEG_TYPES_OUT_OF_RANGE, ...)
    supplements/   # Food Dog adaptation dose
    shopping/      # raw-weight conversion, list, cost
    time/          # "day" in America/Sao_Paulo
  data/
    repositories/  # interfaces: EntryRepository, PlanRepository, WeightRepository, PriceRepository
    supabase/      # implementations + generated DB types
    offline/       # Dexie outbox, sync worker
  features/        # hoje, historico, plano, peso, compras, auth, household
  i18n/            # pt-BR.ts dictionary + t()
  ui/              # shared components
supabase/
  migrations/
  tests/           # RLS tests
docs/phases/       # one spec per phase
```

Rules:
- `core` returns data and alert codes, never UI text.
- Features talk to repositories, never to Supabase directly.
- All UI strings come from `src/i18n/pt-BR.ts`.

---

## 4. Data model

The plan is stored as a JSONB document validated by the core's Zod schema, so the core owns its shape and the DB doesn't need a table per category.

```
households        id, name, created_at
household_members household_id, user_id, display_name, joined_at
household_invites id, household_id, code, expires_at, used_by
dogs              id, household_id, name, breed, birth_date
plans             id, dog_id, version, valid_from, valid_to, vet_name, document jsonb, created_by, created_at
entries           id, dog_id, plan_id, date, item_id, grams, meal, logged_by, created_at, updated_at, deleted_at
supplement_checks id, dog_id, date, item_id, checked_by, created_at, deleted_at
weights           id, dog_id, measured_at, kg, note, logged_by
prices            id, household_id, item_id, price_per_kg, cooking_loss_pct, updated_at
settings          household_id, food_dog_start_date, protein_rule, ...
```

Notes:
- `entries.id` is a client-generated UUID, so offline inserts are idempotent.
- Soft delete (`deleted_at`) so deletions sync correctly.
- Edits use last-write-wins on `updated_at`. Entries are small and rarely edited, so that's enough.
- `date` is computed client-side in America/Sao_Paulo by `core/time`.
- RLS on every table: a row is visible and writable only to members of its household.

---

## 5. Core rules (Phase 1 test cases)

- **Fraction progress:** progress per category = sum of (grams / item target) across items. Remaining is expressed in the currently selected item. Example: 90 g sweet potato (0.5 of 180) then rice: remaining 0.5 × 150 = 75 g.
- **Carbohydrate:** one type per day. Logging a second returns `CARB_ALREADY_LOGGED` with a proportional swap suggestion.
- **Vegetables:** total target 350 g; `VEG_TYPES_OUT_OF_RANGE` if the day ends with fewer than 2 or more than 3 types.
- **Protein:** 1 or 2 options; fractions add to 1.0 (configurable via `settings.protein_rule`). Lard target follows the protein fractions. 70 g organ/egg swap reduces one meat target by 70 g.
- **Food Dog:** 1/4 dose days 1–2, 1/2 days 3–4, full after, from `food_dog_start_date`.
- **Treats:** `TREATS_OVER_LIMIT` above 15 g.
- **Over target:** `OVER_TARGET` above 110% of a category (threshold configurable).
- **Forbidden foods:** case- and accent-insensitive match on pt-BR terms in free text.
- **Shopping:** raw grams = cooked grams / (1 − loss). Chicken breast loss defaults to 40%. Cost = raw kg × price/kg. Monthly = daily × 30.
- **Day boundary:** midnight America/Sao_Paulo, including around DST-free edge cases and late-night entries.

---

## 6. Phases

Each phase has a spec in `docs/phases/NN-name.md` (goal, scope, out of scope, acceptance criteria). Claude Code starts each phase in plan mode, proposes the approach, then implements after approval.

### Phase 0: Foundation
- Vite + React + TS strict, Tailwind, ESLint, Prettier, Vitest, Playwright.
- GitHub Actions: lint, typecheck, unit tests on every PR.
- Vercel project linked, preview deploys on PRs.
- Supabase dev and prod projects, `.env.example`, Supabase CLI for local dev.
- `CLAUDE.md` committed.
- **Done when:** empty app deploys to a preview URL and CI is green.

### Phase 1: Core domain
- Plan Zod schema, seed for the 2026-09-21 → 2026-11-21 plan.
- Progress, alerts, supplements, shopping, time modules.
- Unit tests for every rule in section 5, aiming for ~100% coverage of `core`.
- **Done when:** all rules are tested, no UI yet.

### Phase 2: Database, auth, household
- Migrations for section 4, RLS policies, generated TS types.
- RLS tests: a non-member can't read or write anything.
- Magic-link login, create household, invite by code (Ana joins with a link).
- Repository interfaces + Supabase implementations, seed plan on household creation.
- CI: run migrations and RLS tests against local Supabase.
- **Done when:** Leo and Ana can both log in and see the same (empty) household.

### Phase 3: Hoje
- Category sections, inputs with +10/+50, meal selector, alternatives label, swap.
- Alerts mapped to pt-BR messages, "who logged it".
- Optimistic updates via TanStack Query.
- E2E: log a full day and see everything complete.

### Phase 4: Histórico
- Day list with status, day detail (read-only, edit allowed).

### Phase 5: Plano
- Edit current plan, create a new version for a new consultation (copy previous), validity dates.
- Entries keep their `plan_id`, so past days are judged against the plan of their day.

### Phase 6: Peso
- Log weight, chart, note field, latest weight on Hoje.

### Phase 7: Compras + custo
- Prices and cooking loss per item (shared by the household).
- Shopping list for N days (default 15, matching the vet's freezer guidance), based on the current selected options.
- Daily and monthly cost, per item and total.
- Option: compute from the plan, or from actual logged entries over the last 30 days.

### Phase 8: Sync + offline
- Supabase Realtime subscription for entries and checks.
- Dexie outbox: writes queue offline, flush on reconnect, idempotent by UUID.
- Offline indicator, pending-sync badge.
- E2E: log offline, reconnect, entry appears on the second device.

### Phase 9: PWA + polish
- vite-plugin-pwa, icons, install prompt, offline shell.
- JSON export/import.
- Accessibility pass, empty states, loading states, dark mode.
- **Done when:** installed on both phones, used for a real week.

---

## 7. CI/CD

| Trigger | Jobs |
|---|---|
| PR | lint, typecheck, unit, build, migrations + RLS tests (local Supabase), E2E on preview |
| Merge to `main` | apply migrations to prod Supabase, Vercel production deploy |

- Branch protection on `main`: CI must pass.
- Migrations only through `supabase/migrations`, never edited after merge.

---

## 8. Workflow with Claude Code

1. Leo writes or approves `docs/phases/NN-*.md`.
2. New branch `phase/NN-name`. Claude Code reads `CLAUDE.md` and the spec, starts in plan mode.
3. Leo approves the plan; Claude implements with small commits.
4. Claude runs lint, typecheck and tests locally, opens the PR, and stops.
5. Leo reviews the preview, merges.

---

## 9. Open questions

- Should the shopping list follow the plan's chosen options, or let us pick (e.g. chicken this batch, beef next)?
- Is offline logging a must for v1, or can Phase 8 slip after a first real week of use?
- Should Ana get a different display name or color in the UI so entries are easy to tell apart?
