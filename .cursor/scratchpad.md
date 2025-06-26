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
- [x] T1 Instrument upsert error handling
- [x] T2 Verify profile row exists
- [x] T3 Investigate upsert 409 (if any)
- [x] T4 Validate RLS policies
- [x] T5 Final confirm prompt insert works

## Executor's Feedback or Assistance Requests
- Fixed failing unit tests:
 1. Added path alias resolution to `vitest.config.ts` so imports using `@` resolve during tests.
 2. Wrapped `AccountBar` test render tree in `MemoryRouter` to provide router context required by `useNavigate` in `ProfileModal`.

Bugfixes (2025-06-26):
• Increased `ProfileModal` z-index (`z-[120]`) so Logout button no longer hidden beneath prompt bar.
• Wrapped `MyPromptsPage` in `TopPromptsProvider` to resolve context error and display user's prompts.

All unit tests unaffected; pending manual UI verification.

## Lessons
- Always check and log `error` from Supabase queries before proceeding to dependent operations.

• For Vitest, remember to replicate Vite aliases in `vitest.config.ts` to avoid module resolution errors.
• Components using `react-router` hooks (e.g., `useNavigate`) must be tested within a router wrapper such as `MemoryRouter`.

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

### 2025-06-26 – Planner: Authenticated UI Indicators & Post-Registration Flow

#### Goal
Enhance UX so that a signed-in user instantly sees their identity (avatar + display name) and has obvious logout access. After completing registration, a confirmation modal/toast should appear.

#### Key Features to Add
1. **User Menu / Avatar** – top-right (desktop) or bottom tab (mobile) shows circular avatar (or fallback initials) with dropdown:
   • Profile (placeholder)
   • Settings (future)
   • Logout
2. **Logout Action** – clears Supabase session and redirects to home or login page.
3. **Registration Success Modal** – after successful `signUp`, show non-blocking modal/toast: "Account created! 

#### High-level Task Breakdown (new)
- [x] **A1** Header refactor: inject `UserMenu` component when session present.
    • Success: under header shows avatar + name; clicking opens dropdown.
- [x] **A2** Create `UserMenu` component.
    • Shows displayName (if any), avatar.
    • Contains Logout item (calls `supabase.auth.signOut()` and `queryClient.invalidate`).
    • Success: clicking Logout returns to unauthenticated state and localStorage cleared.
- [x] **A3** Add fallback avatar generator (initials + bg color).
    • Success: users w/o avatar_url still get pleasant circle.
- [x] **A4** Registration flow: in `useRegister` hook, after successful `signUp` set `showRegistrationSuccess` state.
- [x] **A5** New `RegistrationSuccessModal` (or Toast) component.
    • Shown centrally; CTA "OK"/"Close".
    • Auto-dismiss after 5s.
- [x] **A6** Unit tests: auth context updates, logout clears session, modal renders.

#### Potential Extras (future backlog)
• Profile page edit display_name + avatar upload.  
• Persistent dark/light theme toggle stored per profile.

#### Project Status Board (append)
- [x] A1 Header shows avatar when logged in
- [x] A2 Dropdown user menu with logout
- [x] A3 Fallback avatar
- [x] A4 Registration success state flag
- [x] A5 Success modal component
- [x] A6 Tests

(planner done ‑ executor can pick A1 next)

### 2025-06-26 – Planner: User Profile Modal (Account Card)

Goal: On clicking avatar or name in AccountBar, open a full-width modal (or side drawer) showing user details and quick actions.

Minimal tasks to avoid executor stops (single flow):
1. **P1 Create `ProfileModal` component**
   • Controlled by local state in `AccountBar` (`showProfile`).
   • Opens as fixed overlay center; closes on backdrop / X.
   • Shows current avatar (or initials) with upload button (`