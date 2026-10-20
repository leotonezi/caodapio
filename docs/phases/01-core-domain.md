# Phase 1: Core domain

## Goal
Pure TypeScript domain logic for progress, alerts, supplements, shopping, and plan validation, independent of React/Supabase/DOM.

## Scope
- `src/core/time`: day-boundary math in America/Sao_Paulo.
- `src/core/plan`: Zod plan schema, validation, seed, protein/lard/organ-swap rules.
- `src/core/progress`: fraction-based category progress and remaining amounts.
- `src/core/alerts`: `CARB_ALREADY_LOGGED`, `VEG_TYPES_OUT_OF_RANGE`, `TREATS_OVER_LIMIT`, `OVER_TARGET`, forbidden-food matching.
- `src/core/supplements`: Food Dog dose schedule.
- `src/core/shopping`: raw-weight conversion, item cost, monthly cost.

## Out of scope
- DB/repositories, Supabase types, migrations (Phase 2).
- UI/features/i18n (Phase 3+).
- Real vet plan numbers — `src/core/plan/seed.ts` uses placeholders flagged in a comment; schema/logic are final, numbers are not.

## Acceptance criteria
- `npm run lint`, `npm run typecheck`, `npm run test`, `npm run build` all pass.
- 100% statement/branch/function/line coverage on `src/core` (`npx vitest run --coverage`).
- Every rule in `IMPLEMENTATION_PLAN.md` section 5 has a corresponding test.
