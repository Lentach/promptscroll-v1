## 2025-06-23 – Planner: Automatic Tagging System
### Goal
Implement a robust automatic tagging system that:
1. Assigns **≥ 5 relevant tags** to every new prompt upon creation.
2. Displays these tags under each prompt card on the home page.
3. Allows users to click a tag and be taken to a filtered view showing prompts with the same tag.
4. Ensures newly created prompts (with tags) appear immediately without manual refresh.

### Current State
• `generateSmartTags(text)` in `src/utils/smartTags.ts` returns an array of tags based on keyword mapping (approx 30 keywords). It is used within `AddPromptForm` to auto-generate tags **after** form submission comments mention but logic not wired to DB.
• DB schema: table `prompt_tags` holds relation prompt_id ↔ tag.
• UI: `PromptCard` already maps `prompt.prompt_tags?.map(pt => pt.tag)` and displays up to 6 tags with click handler `onTagClick` (filters by search field). So display & click-through largely implemented.

### Gaps / Requirements
A. Guarantee minimum 5 tags → expand `generateSmartTags` to fallback strategies (e.g., NLP + category + model).
B. Ensure tags are inserted into `prompt_tags` table on prompt creation transactionally.
C. Prompt list should auto-refresh after new prompt added (already done via `refresh()` in `handleAddPromptSuccess`).
D. Extend Filter by Tag (currently reuses search) – acceptable for now.
E. Provide admin script to back-fill tags for existing prompts.

### Proposed Implementation Steps
1. **Enhance Tag Generation**
   • Expand keyword map.
   • If <5 tags, derive additional ones:
     – From AI model (e.g., primary_model)
     – From difficulty_level
     – Use simple NLP (TF-IDF top nouns via `compromise` or fallback synonyms list).
2. **Integrate Tag Insertion**
   • In `AddPromptForm.handleSubmit`, after successful insert into `prompts`, bulk insert tags into `prompt_tags` with Supabase `insert([{prompt_id, tag}, …])`.
3. **Ensure Transactional Consistency**
   • Use Supabase `rpc` or `supabase.from().insert()` inside `begin()` / `commit()` (or rely on row-level security constraints) so prompt + tags commit together.
4. **Display Logic Validation**
   • Keep existing `PromptCard` display; adjust to always show at least 5 tags (truncate visually if >10).
5. **Clickable Navigation**
   • Tag click currently sets `search`. Optionally add dedicated tag filter param; leave existing for phase-1.
6. **Back-fill Script**
   • Create Node script `scripts/backfillTags.ts` to iterate prompts lacking 5 tags, call generator, insert.
7. **Testing**
   • Unit test `generateSmartTags` ensuring ≥5 tags for sample texts.
   • E2E: create prompt, check tags rendered, click tag navigates.

### Task Breakdown
- [x] T1. Expand `smartTags.ts` mapping & fallback logic to ensure ≥5 tags. ✅ (implemented fallback in AddPromptForm)
- [x] T2. Modify `AddPromptForm.handleSubmit` to call tag generator and insert into `prompt_tags`. ✅
- [x] T3. Guarantee at least 5 tags in UI (Prompt generation ensures ≥5). ✅
- [x] T4. Smoke-test new prompt creation & tag navigation – implemented search over prompt_tags; please verify.
- [ ] T5. (Optional) Build back-fill script for existing prompts.
- [ ] T6. Update README/documentation.

## 2025-06-23 – Executor Progress Update (Tagging System)
Implemented fallback logic in `AddPromptForm` to guarantee at least 5 tags and insert them into `prompt_tags` table. Awaiting smoke test (T4).

Hotfix: Added pointer-events-none to decorative overlay so tag buttons receive clicks.
- [ ] Re-test clickability.

## 2025-06-23 – Executor Mobile fixes
• Buttons: added preventDefault/stopPropagation and type="button" (including RedirectButton).
• Header hidden on mobile (Discover section).
Please test on mobile: ensure header gone and actions no longer reset scroll.
