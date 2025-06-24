ETAP 1 – Szybkie wygrane (≤ 2 godz.)
Monorepo-konfiguracja lint/format
Dodać prettier + eslint-config-prettier → jednolity styl.
Konsolidacja "konfigów"
src/constants/aiModels.ts, generateSmartTags, keywordMap scalone do src/constants/meta.ts.
Ekstrakcja komponentu ActionBar
Wydzielić z PromptCard przyciski Like/Dislike/Copy/Use.
hook useSupabaseQuery (DRY)
obsługa .from, paginacji, błędów, loading → uproszczenie usePrompts, useCategories.
Input validation – zod do formularza AddPromptForm.
Storybook – dodany do repo (opcja).
ETAP 2 – Architektura (2+ dni)
Feature-slices (FSD)
katalog features/prompts, features/categories itd.
React Query lub SWR zamiast custom hooków do cache'owania.
Testy jednostkowe + React Testing Library.
Cypress E2E w CI GitHub Actions.
SSR / SSG (Next.js) – długofalowo.

## Current Status / Progress Tracking

- S3 Consolidate constants ✅ – `src/constants/index.ts` added, imports updated in FilterPanel, AddPromptForm, PromptCard, useSessionVotes. Code compiles locally.
- [x] S4 Extract ActionBar component ✅
- [x] S5 Generic Supabase hooks ✅
- [x] S6 Zod validation & form errors ✅
- [x] S7 Storybook base setup – finished 2025-06-24

## Project Status Board

- [x] S3 Consolidate constants (Executor) – finished 2025-06-24

## Executor's Feedback or Assistance Requests

Storybook v7.6 configured with Vite builder. Scripts `storybook` and `build-storybook` added to package.json. Smoke-test run passes with no errors. Ready for A1.1 next.

Completed A1.1: Directories created. `npm run build` passed with no TypeScript path errors. Ready to start A1.2 (moving Prompt components).

Completed A1.3: moved usePrompts, useTopPrompts, usePromptActions to features/prompts/hooks; updated imports; build passes. Ready to clean old files and proceed to A2.1.

### Stage-2 (Architecture & Testing)

Goal: move towards scalable, testable architecture.

High-level tasks:
- A1. Introduce Feature-Slice Directory (FSD) structure (`features/prompts`, `features/categories` …).
- A2. Replace custom fetching hooks with React Query for caching & invalidation.
- A3. Unit Test setup with React Testing Library + Vitest; cover core hooks/components.
- A4. Cypress E2E config in GitHub Actions.
- A5. Optional: move to Next.js for SSR/SSG proof-of-concept.

Each task will have success criteria & sub-steps added when we start it.

## Background and Motivation

PromptScroll has reached a functional MVP state after Stage 1 clean-ups. The next step is to make the codebase production-ready:
1. Scalable folder structure so new contributors can navigate quickly.
2. Built-in caching, optimistic UI, and automatic re-validation for all data fetching.
3. Confidence by testing core behaviour at unit and E2E level.
4. CI pipeline that prevents regressions before merge.

## Key Challenges and Analysis (Stage-2)

1. Adopting Feature-Slice Directory structure without breaking existing imports – incremental migration required.
2. Replacing bespoke Supabase hooks with React Query while preserving SSR-friendliness and typesafety.
3. Writing tests around existing logic that currently lacks DI and may be hard to isolate.
4. Cypress & GitHub Actions integration on Windows + WSL; need headless browser dependencies in CI image.
5. Ensuring Storybook & Vitest configs coexist with Vite for zero-config DX.

## High-level Task Breakdown (Stage-2)

### A1 – Introduce Feature-Slice Directory (FSD)
- A1.1 Create `src/features` root with sub-folders (`prompts`, `categories`, `search`, `votes`).
  Success criteria: new folders committed; no TS path errors when running `pnpm dev`.
- A1.2 Move presentational components of prompts (e.g. `PromptCard`, `PromptGrid`, `ActionBar`) into `features/prompts/components`.
  Success criteria: Storybook renders `PromptCard`; app compiles without path errors.
- A1.3 Migrate hooks to feature slices
  Success criteria: `vitest` passes; no runtime warnings.

### A2 – Integrate React Query
- A2.1 Add `@tanstack/react-query` and configure `QueryClientProvider` in `App.tsx`.
  Success criteria: app compiles; DevTools show QueryClient running.
- A2.2 Rewrite `usePrompts` using `useInfiniteQuery` + Supabase fetcher.
  Success criteria: infinite scroll still works; network panel shows caching.
- A2.3 Rewrite remaining data hooks (`useTopPrompts`, `useCategories`, votes) with React Query.
  Success criteria: Like/Dislike + category filter still functional.

### A3 – Unit Test setup with RTL + Vitest
- A3.1 Install Vitest + React Testing Library presets.
  Success criteria: `pnpm test` runs sample test.
- A3.2 Add tests covering `FilterPanel` filtering logic.
  Success criteria: tests pass; mutation coverage > 80% for component.
- A3.3 Add tests for `usePrompts` hook with mocked query client.

### A4 – Cypress E2E & GitHub Actions
- A4.1 Add Cypress v13, configure baseUrl to Vite dev server.
  Success criteria: `pnpm cy:run` passes example spec locally.
- A4.2 Create GitHub Action workflow `ci-e2e.yml` spinning up Vite and Cypress headless.
  Success criteria: workflow passes on PR.

### A5 – (Optional) Next.js SSR PoC
- A5.1 Spike branch converting Vite SPA to Next.js pages/app router.
  Success criteria: home page renders prompts with SSR disabled caching.

## Project Status Board (updated)

```markdown
- [x] S3 Consolidate constants – finished 2025-06-24
- [x] S4 Extract ActionBar component – finished 2025-06-24
- [x] S5 Generic Supabase hooks – finished 2025-06-24
- [x] S6 Zod validation & form errors – finished 2025-06-24
- [x] S7 Storybook base setup – finished 2025-06-24

### Stage-2 Tasks
- [x] A1.1 Create features root directories
- [x] A1.2 Move Prompt components to feature folder
- [x] A1.3 Migrate hooks to feature slices
- [x] A2.1 Add React Query provider
- [ ] A2.2 Rewrite usePrompts with useInfiniteQuery
- [ ] A2.3 Rewrite remaining hooks to React Query
- [ ] A3.1 Vitest + RTL basic setup
- [ ] A3.2 FilterPanel unit tests
- [ ] A3.3 usePrompts hook tests
- [ ] A4.1 Cypress install & sample spec
- [ ] A4.2 GitHub Action for E2E
- [ ] A5.1 Next.js PoC branch
```

## Executor's Feedback or Assistance Requests

Task A2.1 completed: Installed `@tanstack/react-query` (+ devtools), wrapped `App` in `QueryClientProvider` in `src/main.tsx`; single `QueryClient` instance created; DevTools toggled in dev mode. Build passes. Ready to proceed to A2.2 (rewrite `usePrompts` with `useInfiniteQuery`).

## Lessons (Stage-2)

_To be filled as we progress._

## Planner Note – 2025-06-24
PromptScroll to obecnie SPA zbudowane na:
• React 18 + TypeScript / Vite
• Supabase (PostgreSQL + edge functions)
• TailwindCSS + PostCSS
• Zod (walidacja na froncie)
• Storybook 7 (Vite builder)

Podstawowy flow: wyświetlanie kart promptów (z liczeniem "like", "dislike", "uses"), filtrowanie po kategoriach, formularz dodawania promptów.  Dane trzymamy w tabelach `prompts`, `categories`, `prompt_tags`, etc.

### Potencjalne usprawnienia (poza roadmapą Stage-2)
1. Code-splitting / lazy loading dla dużych chunków (obecnie 1 MB po gzip).
2. Lighthouse: A11y (kontrast, rola przycisków) oraz SEO meta opisów.
3. Automatyczne generowanie OpenGraph (SSG/SSR lub at least prerender route snapshot).
4. Web Workers dla obliczeń analitycznych (np. generowanie smartTags) by nie blokować UI.
5. Feature "collections" – użytkownik zapisuje wybrane prompty.
6. Rate-limiting / Row-level Security w Supabase przed publicznym MVP.
7. GraphQL edge caches → rozważ Hasura jeżeli query stają się skomplikowane.

_Te punkty nie mają jeszcze priorytetu – do omówienia z właścicielem produktu._

### M1 – Mobile UI Improvements
- [x] M1.1 Increase opacity of search input background for better readability (SearchBar bg-white/20)
- [x] M1.2 Add copy button next to prompt text in PromptCard (clipboard)
- [x] M1.3 Remove search bar from settings overlay
- [x] M1.4 Fix "Show Less" scroll alignment in PromptCard
- [x] M1.5 Copy button: animated state + updates usesCount via API
- [x] M1.6 Increase SearchBar opacity to bg-white/30
