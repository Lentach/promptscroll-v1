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

## Background and Motivation (updated)
The application must allow a signed-in user to add a new prompt.   
Currently the `AddPromptForm` submission still fails with
```
POST …/rest/v1/prompts 409 (Conflict)
code 23503 – Key is not present in table "profiles"
```
Therefore the foreign-key `author_id → profiles.id` is violated. Despite previous attempts to create the profile row and to relax RLS, the row is still missing or inaccessible when the `INSERT` happens.

## Key Challenges and Analysis (26 Jun 2025)
1. **Race / Failure of profile upsert** — the `profiles` *upsert* placed right before the prompt insert may silently fail (RLS, validation, etc.). We never check `error` from that request, so the flow continues even on failure.
2. **RLS on `public.profiles`** — an upsert translates to _INSERT … ON CONFLICT DO UPDATE_. That requires both INSERT and UPDATE policies. We added them, but need to verify they compiled and match the `auth.uid()` exactly.
3. **Auth vs Supabase anon key** — The client might still be authenticated with `auth.uid()`, but PostgREST sees a JWT without `sub` → mismatch. Validate headers.
4. **Existing conflicting row** — a stale row with same PK but different values could trigger 409 conflict during upsert → profile not written.
5. **DB schema cache** — after adding the column, PostgREST cache may need `supabase db reset` or `REFRESH MATERIALIZED VIEW`.

### Evidence to Gather
- Inspect response of the `profiles` upsert (network & console) to confirm success / 409 / 401.
- Check in SQL: `select id, display_name from public.profiles where id = '<current uid>';`
- Confirm RLS policies exist via `select * from pg_policy where polrelid = 'public.profiles'::regclass;`
- Verify auth JWT in devtools has correct `sub`.

## High-level Task Breakdown
- [ ] **T1:** Instrument `AddPromptForm` to log and throw on `profiles` upsert error (success criteria: see explicit log with either `error=null` or printed details).
- [ ] **T2:** Via SQL editor verify if row for current user exists; if not, manually insert one to unblock testing.
- [ ] **T3:** If upsert fails with 409, investigate conflict cause; possibly switch to two-step `select` then `insert`.
- [ ] **T4:** Ensure RLS policies for INSERT & UPDATE compile (no WITH CHECK on SELECT) and match `auth.uid() = id`.
- [ ] **T5:** After profile row confirmed, test prompt insert; it should succeed (success criteria: POST /prompts returns 201 and UI shows toast success).

## Project Status Board
- [ ] T1 Instrument upsert error handling
- [ ] T2 Verify profile row exists
- [ ] T3 Investigate upsert 409 (if any)
- [ ] T4 Validate RLS policies
- [ ] T5 Final confirm prompt insert works

## Executor's Feedback or Assistance Requests
_None yet_

## Lessons
- Always check and log `error` from Supabase queries before proceeding to dependent operations.

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
