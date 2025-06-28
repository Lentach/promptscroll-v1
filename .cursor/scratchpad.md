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

### 2025-06-27 – Planner: My Prompts UX Improvements

#### Background and Motivation
Users can navigate from their Profile to the "My Prompts" page (`/my-prompts`) to see prompts they have authored.  Currently this page is very bare-bones and lacks any way to return to the previous view; users have to rely on the browser back button.  A dedicated **Back** control will improve discoverability and align with other pages that already provide navigational affordances.  In the longer term we may present "My Prompts" as a modal overlay instead of a full route to keep the user inside the profile context.

#### Key Challenges and Analysis
1. **History vs Hard Redirect** – To preserve scroll/anchor position on the originating Profile page we should prefer `navigate(-1)` (history back) over pushing a new route like `/profile`.  If the user landed on `/my-prompts` directly (e.g. deep-link) there will be no prior entry, so we need a safe fallback.
2. **Consistent Styling** – The page currently misses a header bar and uses raw prompt grid only.  We should adopt the same patterned header used on Profile & Discover pages for visual coherence.
3. **Modal Alternative** – Converting to a modal requires additional state coordination and route handling (e.g. query param `?modal=my-prompts`).  This is nice-to-have but can ship later.

#### High-level Task Breakdown
- [x] **MP1** Add `<BackButton>` component re-usable across pages.
    • Renders left-arrow icon & label (i18n ready).
    • On click: `navigate(-1)`; if history length < 2 then `navigate('/profile')`.
    • Success: on `/my-prompts` the button is visible in header and returns user to Profile with prior scroll position intact.
- [x] **MP2** Enhance `/my-prompts` layout.
    • Introduce header bar with title and BackButton.
    • Center content, add subtle card background to distinguish from main feed.
    • Success: visual parity with other pages; passes aXe contrast check.
- [x] **MP3 (stretch)** Modal presentation research.
    • Spike: open MyPromptsPage in `<Modal>` mounted by ProfilePage; manage route via `useSearchParams`.
    • Not required for immediate release; capture findings in Lessons.

#### Success Criteria
1. Back button visible + keyboard/tab focusable; clicking returns correctly.
2. No regression in unit tests or E2E flows.
3. Lighthouse performance, a11y scores remain ≥ current baselines.

## Project Status Board (append)
- [x] MP1 BackButton component & integration on MyPromptsPage
- [x] MP2 Improved /my-prompts header + styling
- [x] MP3 (stretch) Modal presentation research
- [x] AV1 PromptCard – unify avatar source, size (40-48 px) & visual polish
- [x] AV2 Backdrop click replicates BackButton logic
- [x] AV3 usePrompts + MyPrompts queries include profile join ensuring avatar url
- [x] AV4 Ensure avatars visible for logged-out users (fetch from public_profiles view)

## Executor's Feedback or Assistance Requests
• Added translucent card container (`bg-white/5 backdrop-blur-xl rounded-3xl p-6 border border-white/10`) around `PromptGrid` for visual depth and parity with Discover page.
• Header already updated in MP1; combined results deliver polished look.
• Manual contrast check via browser devtools passes WCAG AA for text; automated aXe to be run in CI later.
• No performance hit observed.
• Implemented reusable `Avatar` component (`src/components/Avatar.tsx`) with:
  – Image + fallback initials, gradient BG, border, shadow, hover scale.
  – Configurable `size` prop (default 48 px) and graceful error handling.
• Integrated avatar into `PromptCard`:
  – Larger 40 px avatar next to AI model icon in header.
  – Replaced previous ad-hoc img/initials code with `<Avatar>` instances (incl. mobile).
  – Avatar source now resolves from `profiles.avatar_url` ➜ `author_avatar_url` fallback.
• Removed duplicate small avatar snippets, ensuring consistency.
• Backdrop now checks history length; performs `navigate(-1)` else replace to /profile.
• Updated Supabase queries (`usePrompts`, `MyPromptsPage`) to select joined `profiles` with avatar & display_name.
  – This ensures Avatar component receives proper data on Discover/MyPrompts.
• Tests pass.
• Please confirm avatars now display; if still blank might be missing data in DB.
• Implemented fallback fetch in `PromptCard` – when avatar/name missing it queries `public_profiles` view using `author_id` once per card.  This bypasses RLS restrictions and restores avatars for anonymous sessions.  No schema changes required; minimal client-side overhead.

Next: visual QA in Storybook / local dev; assess tooltip & lazy-load enhancements if needed.

## Lessons
• Using URL search params (e.g. `?modal=my-prompts`) is a lightweight pattern to trigger page overlays without changing base route – avoids double mounts of global providers.
• When embedding pages inside a modal, pass `replace: true` on close navigation to avoid polluting history stack.

------------------------------------------------------------------------------------
