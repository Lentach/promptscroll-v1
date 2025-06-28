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

### Additional Tasks
- [x] AV4 Ensure avatars visible for logged-out users (fetch from public_profiles view)
- [ ] UV1 Verified badge based on account age ≥ 3 days
- [ ] CB1 Copy button full clickable area
- [ ] CL1 "Use in Claude" button color & style fix

## Lessons
• Using URL search params (e.g. `?modal=my-prompts`) is a lightweight pattern to trigger page overlays without changing base route – avoids double mounts of global providers.
• When embedding pages inside a modal, pass `replace: true` on close navigation to avoid polluting history stack.

## Executor's Feedback or Assistance Requests
• Implemented UV1, CB1, CL1 in code: 
   – UV1: Joined profiles.created_at, computed verification in PromptCard (≥3 days).
   – CB1: Added z-20 to copy button to ensure it sits above pre content.
   – CL1: Updated ActionBar gradient for Claude to orange tones (#da7756) with orange glow.
• Please verify visual & functional updates; mark tasks complete if satisfactory.

------------------------------------------------------------------------------------
