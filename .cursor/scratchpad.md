

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

### Additional Tasks
- [x] AV4 Ensure avatars visible for logged-out users (fetch from public_profiles view)
- [ ] UV1 Verified badge based on account age ≥ 3 days
- [ ] CB1 Copy button full clickable area
- [ ] CL1 "Use in Claude" button color & style fix

## Lessons
• Using URL search params (e.g. `?modal=my-prompts`) is a lightweight pattern to trigger page overlays without changing base route – avoids double mounts of global providers.
• When embedding pages inside a modal, pass `replace: true` on close navigation to avoid polluting history stack.

### Background and Motivation (Follow System)
The platform currently lacks social interaction between users beyond voting on prompts. Introducing a "follow" mechanism will:
• let users curate a feed of favourite creators,
• increase engagement by surfacing follower/following counts,
• pave the way for future features such as activity feeds or notifications.

### Key Challenges and Analysis (Follow System)
1. **Data modelling** – create a `follows` table with proper foreign-keys & unique constraints to avoid duplicates.
2. **Performance** – computing counts on the fly is expensive; keep counters (`followers_count`, `following_count`) denormalised in `profiles`.
3. **Consistency** – use Postgres triggers (or Supabase realtime functions) to increment/decrement counters atomically with insert/delete in `follows`.
4. **Security** – add RLS policies so users can only manage their own follow rows and read public data.
5. **UX** – integrate seamlessly into existing `ProfileModal` design, ensure modals are accessible and mobile friendly.
6. **Pagination** – large lists of followers require lazy loading (React Query + infinite scroll).

### High-level Task Breakdown (Follow System)
| # | Task | Success Criteria |
|---|------|-----------------|
| **FS1** | **DB Migration – schema**.<br/>• Create `follows` table.<br/>• Add `followers_count`, `following_count` columns to `profiles`.<br/>• Add unique(follower_id, following_id) constraint. | Migration runs locally & on Supabase; tables present. |
| **FS2** | **DB Migration – triggers**.<br/>Create trigger functions to keep counters in sync on INSERT/DELETE into `follows`. | Inserting/removing rows updates counters correctly in psql tests. |
| **FS3** | **RLS Policies** for `follows` & updated `profiles`. | Authenticated user can read all, insert/delete only their own rows. |
| **FS4** | **Supabase Types & Generated APIs**.<br/>Regenerate typescript types after migration. | `types/index.ts` includes Follow type; build passes. |
| **FS5** | **React Query hooks**: `useFollow`, `useUnfollow`, `useFollowerCounts`, `useFollowList`. | Hooks return correct data in unit tests & storybook. |
| **FS6** | **ProfileModal update** to show 3-column grid (Prompts / Followers / Following) & clickable counts opening modal. | UI reflects counts; clicking opens list modal. |
| **FS7** | **FollowListModal component** with lazy paginated list & skeleton loaders. | Displays users, shows empty state, closes correctly. |
| **FS8** | **FollowButton component** (profile header / PromptCard). | Button toggles follow state & updates counters instantly (optimistic). |
| **FS9** | **E2E & Unit Tests** for follow flows. | Cypress scenario passes: login → follow a user → counts increase. |
| **FS10** | **Docs & Readme update**. | README section "Social features" present. |

### Project Status Board (Follow System)
- [x] FS1 DB Migration – schema ✅
- [x] FS2 DB Migration – triggers ✅
- [x] FS3 RLS Policies ✅
- [x] FS4 Supabase Types & Generated APIs ✅
- [x] FS5 React Query hooks ✅
- [x] FS6 ProfileModal update ✅
- [x] FS7 FollowListModal component ✅
- [x] FS8 FollowButton component ✅
- [ ] FS9 Tests (unit + e2e)
- [ ] FS10 Docs & Readme update

## Executor's Feedback or Assistance Requests (Follow System)
• Batch FS3–FS8 completed: RLS migration, types update, hooks (counts, status, toggle), components (FollowListModal, FollowButton), ProfileModal integration.
• Pending: FS9 tests and FS10 docs. Let me know if you want to review UI or proceed to tests.

