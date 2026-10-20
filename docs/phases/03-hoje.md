# Phase 3: Hoje

## Goal
Daily logging screen: per-category given/target/remaining, meal selector, quick-add inputs, alerts, "quem registrou", edit/delete. Optimistic updates via TanStack Query.

## Scope
- `PlanRepository`, `EntryRepository`, `SupplementCheckRepository`, `SettingsRepository` (+ Supabase implementations).
- `src/features/hoje/`: `HojePage` (orchestrator), `MealSelector`, `CategorySection` (Carb/Protein/Vegetables — multi-item, uses `core/progress`), `ScalarCategorySection` (Lard/Treats — single target), `FoodDogCard` (checkbox against `core/supplements`' computed dose), `EntryList` (edit/delete, who logged it).
- `HouseholdScreen` now renders `HojePage` directly once a household exists (`HouseholdSummaryView` deleted, folded into Hoje's header).
- `@tanstack/react-query` added and wired in `src/main.tsx`; all entry/check mutations use `onMutate`/`onError`/`onSettled` for optimistic updates.
- `src/i18n/pt-BR.ts` extended with Hoje strings and one message per `AlertCode`.

## Out of scope
- Forbidden-food UI (no free-text field in the data model).
- Dedicated swap UX (carb/protein item switch, 70g organ/egg substitution) — items are logged directly, alerts surface after the fact.
- Histórico/Plano/Peso/Compras, routing, offline/realtime.

## Acceptance criteria
- `npm run lint`, `npm run typecheck`, `npm run test`, `npm run build` all pass.
- Verified against the real local Auth + REST API in an actual browser (Playwright, ad hoc — not committed as a repo E2E test since it needs a seeded session): login, create household, log carb entries across two items (triggers `CARB_ALREADY_LOGGED`), check Food Dog, see "quem registrou", edit grams, delete an entry. All optimistic UI updates held correctly without snapping back while the network request was in flight.

## Notes for the next person
- `supabase/config.toml`'s `auth.site_url`/`additional_redirect_urls` now list both `localhost` and `127.0.0.1` forms — some environments only resolve one of the two on the loopback interface, and a magic-link redirect to the unreachable one silently breaks login.
