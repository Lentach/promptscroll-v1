## 2025-06-23 – Planner: Remove Rating System (Star Icon & Score)
Goal: Remove all UI elements and logic related to prompt rating (quality_score star display). Database field can stay but should be ignored.

### Affected Areas
1. `PromptCard.tsx` – star icon and score displayed in header & mobile sections.
2. `AddPromptForm.tsx` – any inputs for rating? (likely none)
3. `FilterPanel.tsx` – verified/quality filter remains; rating star not used here.
4. Any hooks or logic referencing `quality_score`.
5. CSS / helper functions for rating visuals.

### Proposed Steps
1. Locate code sections rendering star icon and `quality_score` value in `PromptCard.tsx` (desktop and mobile variants).
2. Remove JSX blocks and associated helper logic (e.g., `shouldShowAward` may still use usesCount; rating star itself to be removed).
3. Ensure layout remains consistent after removal (adjust flex gaps/spans).
4. Search repo for `quality_score` usages; if only display, leave backend untouched.
5. Run ESLint & TypeScript to ensure no unused vars.
6. Manual test – cards render correctly without rating.
7. Update README/docs screenshots if applicable.

### Task Breakdown
- [x] R1. Identify rating JSX in `PromptCard.tsx` and comment reference lines.
- [x] R2. Remove star icon + score elements (desktop + mobile sections).
- [x] R3. Clean unused variables/constants (none needed).
- [x] R4. Search & remove other `quality_score` displays.
- [x] R5. Lint & type-check.
- [ ] R6. Manual smoke test in UI.
- [ ] R1. Identify rating JSX in `PromptCard.tsx` and comment reference lines.
- [ ] R2. Remove star icon + score elements (desktop + mobile sections).
- [ ] R3. Clean unused variables/constants (`difficultyColors` unaffected).
- [ ] R4. Search & remove other `quality_score` displays.
- [ ] R5. Lint & type-check.
- [ ] R6. Manual smoke test in UI.
- [ ] R7. Update docs (optional).