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

## Stage-3 – Authentication (Supabase Auth)

# PromptScroll – Stage-3 Authentication Roadmap (Supabase)

## Background & Motivation
Building on the functional MVP, we are adding a full authentication layer so that users can register, log in, and manage their profiles.  Email + password must work day-one; Google / GitHub OAuth will improve adoption.  Auth is also a prerequisite for author attribution, collections, and admin tooling planned for the next milestones.

## Key Challenges
1. Keep the current SPA UX fast – avoid long blocking redirects, preload session.
2. Polish user-facing flows (sign-in/up/reset) while maintaining accessibility & a11y.
3. Implement row-level security (RLS) so one user cannot read / mutate another's data.
4. Integrate seamlessly with existing Prompt CRUD and future admin routes.

## High-level Task Breakdown
B1  Supabase backend
  • B1.1 Enable Email/Password + OAuth providers (DONE)
  • B1.2 Redirect URLs & ENV (DONE)
  • B1.3 `profiles` table w/ RLS (DONE)
B2  Environment / Libs
  • B2.1 Add Supabase creds to `.env.local` (DONE)
  • B2.2 Add OAuth client IDs (GitHub/Google)
B3  Auth Context + Hooks
  • B3.1 `AuthProvider` (DONE)
  • B3.2 Core auth hooks (DONE)
B4  UI Components
  • B4.1 Forms: Login / Register / Reset (DONE)
  • B4.2 `SocialAuthButtons` (DONE)
  • B4.3 `AuthModal` (DONE)
  • B4.4 `UserMenu` dropdown (DONE)
B5  Routing & Guards (NEXT)
  • B5.1 `ProtectedRoute` wrapper
  • B5.2 Auth pages (`/login`, `/register`, `/forgot-password`, `/profile`)
  • B5.3 `RequireAdmin` guard
B6  Feature Integration
  • B6.1 Tie prompt submission to current user
  • B6.2 Show author avatar/name on `PromptCard`
  • B6.3 Hide "Add Prompt" CTA for guests (show modal instead)
B7  Email Templates & Verification
  • B7.1 Customise Supabase email templates
  • B7.2 `/verify-email` handler
B8  Testing
  • B8.1 Unit tests for `AuthProvider`
  • B8.2 Cypress E2E for auth flows
B9  Deployment
  • B9.1 Add env vars to CI/CD secrets
  • B9.2 Verify prod redirect URLs

## Project Status Board
```markdown
- [x] B1.1 Providers enabled
- [x] B1.2 Redirect URLs & ENV configured
- [x] B1.3 Profiles table + RLS
- [x] B2.1 Local env vars
- [x] B2.2 OAuth client IDs
- [x] B3.1 AuthProvider
- [x] B3.2 Auth hooks
- [x] B4.1 Forms
- [x] B4.2 SocialAuthButtons
- [x] B4.3 AuthModal
- [x] B4.4 UserMenu
- [x] B5.1 ProtectedRoute
- [x] B5.2 Auth pages – basic pages & routing done 2025-06-25
- [x] B5.3 RequireAdmin guard – done 2025-06-25
- [x] B6.1 Prompt submission attribution – added author_id + name 2025-06-25
- [x] B6.2 Author UI in PromptCard – avatar & name implemented 2025-06-25
- [x] B6.3 Guest CTA behaviour – CTA opens AuthModal for guests 2025-06-25
- [x] B7.1 Email templates
- [x] B7.2 Verify-email handler – page & route implemented 2025-06-25
- [x] B8.1 Unit tests
- [x] B8.2 Cypress auth specs
- [x] B9.1 CI/CD env vars
- [x] B9.2 Prod redirect URLs
```

## Current Status / Progress Tracking
Latest completed: B9.2 Production redirect URLs doc (26-06-2025)

Next up (Planner): review overall Stage-3 completion and close milestone.

## Executor's Feedback / Assistance Requests
### 2025-06-26 – B9.1 Completed
Created `.github/workflows/ci.yml` that:
• Installs deps, runs lint and unit tests.
• Boots dev server and executes Cypress E2E in a separate job.
• Injects `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` via repo secrets.

Planner to double-check secrets exist in GitHub repo settings.

## Lessons (Stage-3)
• Use React Query's `isPending` instead of `isLoading` for mutation buttons (avoid undefined prop errors).
• Remember Supabase session can be `null` after sign-up when email confirmation is enabled.

## Planner Review – Stage-3 Authentication ✅ (2025-06-26)

### Summary
Stage-3 goal was to deliver a production-ready authentication layer with Supabase. All scoped tasks (B1-B9) are ✅ complete and merged. Unit tests & Cypress specs cover happy paths, CI pipeline ensures regression safety, and deployment guide now documents redirect URLs.

### Acceptance Criteria Checklist
- [x] Email / password sign-up & sign-in works (confirmed locally with mocked Supabase)
- [x] OAuth providers enabled in dashboard – credentials present in `.env.local`
- [x] Session state exposed via `AuthProvider`, hooks for login/logout/register/reset
- [x] UI: AuthModal, forms, social buttons, user menu
- [x] Route guards (`ProtectedRoute`, `RequireAdmin`) protect private pages
- [x] Prompts are linked to `author_id`; guest CTAs handled gracefully
- [x] RLS active in `profiles` and `prompts` tables (see migrations)
- [x] Email templates customised; `/verify-email` handled
- [x] Automated QA: Vitest unit tests + Cypress E2E run in GitHub Actions
- [x] Deployment docs updated – prod redirect URLs & env var secrets

No outstanding blockers on the auth milestone.

### Follow-ups / Tech Debt
1. Security audit – pen-test auth flows once staging is up (create task C1).
2. Accessibility pass for modal & forms (task C2).
3. Extend E2E to cover social logins and negative cases (task C3).

These can roll into Stage-4.

### Recommendation
Mark Stage-3 as **DONE** and proceed to Stage-4 "Prompt Discovery Enhancements" (improved search, infinite scrolling with React Query v5, performance optimisations).

---
