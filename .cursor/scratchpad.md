## New task: Medal icon for TOP10 prompts
- Popularity metric: total_likes + total_uses (descending)
- Logic: fetch list of top 10 prompt IDs once (e.g. on app start / when likes/uses update) via Supabase RPC or query in usePrompts hook.
- Store this set in React state (context or within usePrompts) and pass boolean isTop to PromptCard.
- Remove previous isTopPrompt prop logic if obsolete.
- PromptCard renders medal icon only when isTop === true.
- Success criteria: exactly 10 prompts display medal, counts update after like/use changes, no extra DB reads per card.

- [ ] Medal icon logic implemented

### Medal Icon subtasks
- [ ] Create `src/hooks/useTopPrompts.ts`:
      - maintains state `topIds` and `refresh()`
      - on mount fetch `select id from prompts order by total_uses desc, total_likes desc limit 10`
- [ ] Provide context in `App.tsx` (TopPromptsProvider) so any card can access.
- [ ] Update `PromptCard.tsx`:
      - consume context, determine `isTop` boolean.
      - render medal icon only when `isTop`.
      - remove/ignore existing `isTopPrompt` prop.
- [ ] In `usePromptActions` after successful like/use increment call `refreshTopIds`.
- [ ] Ensure no extra DB call per card; only context fetches once + on refresh.
- [ ] Unit test: after hitting like multiple times to move prompt into top10, icon appears.
