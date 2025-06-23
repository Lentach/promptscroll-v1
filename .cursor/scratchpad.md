## 2025-06-23 – Planner: Fix Filters (AI Model, Difficulty, Verified)
Users report that clicking AI model or difficulty filter does not change the prompt list. Investigation shows `usePrompts` ignores `difficulty`, `model`, and `verified` fields in `FilterState`. The component updates UI state but backend query lacks conditions.

### Root Cause
`usePrompts` only destructures `category`, `search`, `sortBy`, `limit` from options. The other filter properties are neither memoized nor applied in the Supabase query.

### Proposed Fix
1. Extend destructuring in `usePrompts` to include `difficulty`, `model`, `verified`.
2. Include corresponding `eq` filters in Supabase query when those values are present:
   • difficulty_level = difficulty
   • primary_model = model
   • is_verified = true (if verified flag set)
3. Add these fields to `queryParams` dependency list for memoization so `useEffect` triggers refresh.
4. Unit/manual test:
   – Select filters, check network requests include query params and UI updates accordingly.
5. Update comments and README.

### Task Breakdown
- [x] F1. Update `usePrompts.ts` to accept difficulty, model, verified. ✅
- [x] F2. Modify query building logic accordingly. ✅
- [x] F3. Ensure `queryParams` includes new fields. ✅
- [x] F4. Manual smoke test for each filter. ✅ Works after backend query update.
- [ ] F5. Document behavior in README.

## 2025-06-23 – Executor Progress Update (Filter Fix)
Implemented filter logic in `usePrompts.ts` (difficulty, model, verified). Pending manual smoke tests and docs.

## 2025-06-23 – Executor Progress Update (AddPrompt outside click)
Added outside-click handler in `AddPromptForm.tsx`: clicking overlay now triggers `onClose`, clicks inside modal stop propagation.
np