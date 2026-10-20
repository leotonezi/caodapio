# CLAUDE.md

**Cãodápio** (repo: `caodapio`). Shared web app for logging Ares's (dog) daily food against a vet nutritionist's plan. Full plan: `IMPLEMENTATION_PLAN.md`. Current phase spec: `docs/phases/`.

## Principles
- Prefer the simplest solution that works.
- No new dependencies unless necessary.
- No abstractions until there are 2+ real use cases.
- Don't add features, config, or error handling that wasn't requested.
- Ask before refactoring unrelated code.

## Language
- Everything in the repo is in English: code, identifiers, files, comments, commits, PRs, docs, tests.
- Everything the user sees is in Brazilian Portuguese (pt-BR), from `src/i18n/pt-BR.ts` via `t()`. Never hardcode UI text in components.
- pt-BR formats: comma decimal separator, dd/mm/yyyy, timezone America/Sao_Paulo.

## Architecture rules
- `src/core` is pure TypeScript: no React, no Supabase, no DOM, no Date.now() without injection. It returns data and alert codes, never UI strings.
- Features use repository interfaces from `src/data/repositories`, never the Supabase client directly.
- Plan documents are validated with the Zod schema in `src/core/plan`. Item ids are stable English slugs; labels are pt-BR.
- Amounts in grams, weighed after cooking, unless a field says raw.
- Client-generated UUIDs for all inserts. Soft delete with `deleted_at`.

## Database
- Schema changes only via new files in `supabase/migrations`. Never edit a merged migration.
- Every table has RLS: access only for members of the row's household. Add RLS tests for every new table.
- Regenerate types after migrations.

## Workflow
- Work only on the current phase. Start in plan mode and wait for approval.
- Small, focused commits.
- Before opening a PR: lint, typecheck, unit tests, build all pass. Run E2E when UI changed.
- Open the PR, summarize what changed and anything you decided on your own, then stop.
- If a spec is ambiguous or conflicts with this file, ask instead of guessing.

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
