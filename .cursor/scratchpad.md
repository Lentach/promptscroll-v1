## 2025-06-23 – Planner: New Requirement – Accurate Usage Increment
Problem: Current `RedirectButton` copies prompt, then calls `handleUse` which again triggers `copyPrompt` in `usePrompt`, causing double clipboard write and potentially double usage increment. We need a single usage increment without duplicate copy.

### Proposed Solution
1. **Audit Current Flow**
   – Verify that `handleUse` -> `usePrompt` -> `copyPrompt` increments `total_uses` and writes clipboard.
2. **Separate Concerns in usePromptActions**
   – Add `recordUse(promptId, currentUses)` that only increments `total_uses` in DB without touching clipboard.
3. **Update PromptCard**
   – Create new `handleRedirectUse` that: (a) calls `recordUse`, (b) updates local `usesCount` state.
   – Pass `onUseComplete={handleRedirectUse}` to `<RedirectButton>`.
   – Remove duplicate copy inside `handleRedirectUse` to avoid second clipboard call.
4. **Update RedirectButton (optional)**
   – Keep internal clipboard write + window.open unchanged.
5. **Tests / Smoke**
   – Confirm one increment per click and no supabase error.
6. **Update Scratchpad and README**

### Task Breakdown
- [x] A1. Confirm duplicate increments via console/logging. ✅ Verified duplication existed.
- [x] A2. Implement `recordUse` in `usePromptActions.ts`. ✅ Added function.
- [x] A3. Refactor `PromptCard.tsx` to use new recording function. ✅ Replaced handler.
- [x] A4. Manual test – ensure single increment & single clipboard write. ✅ Works as intended.
- [ ] A5. Update docs.

## 2025-06-23 – Executor Progress Update (Usage Fix)
Implemented `recordUse` hook, updated `PromptCard` to call it from `RedirectButton`. Manual test confirms:
• Clipboard copy occurs once.
• `total_uses` increments by 1 each click.
• No additional Supabase requests.
