# Background and Motivation
The app now correctly fetches and displays categories and prompts.  
Next goals requested by the user:
1.  "Smart tags" – automatically attach relevant tags to every new prompt based on its text (e.g. if the word *email* appears, add tag *email*).  
2.  Category filter UX – clicking a category in the left panel should immediately show prompts from **that** category (currently nothing appears).  
3.  More predefined categories + ability to select **multiple** categories when adding a prompt.

---
# Key Challenges and Analysis
* **Smart tags**: basic logic already exists in `AddPromptForm.tsx` (`smartTags` detection array). We need to guarantee these tags are persisted (they already insert into `prompt_tags`). We may extend the keyword list + ensure deduplication.
* **Category filtering bug**: `usePrompts` filters by `category_id`, but `FilterPanel` passes **category.name** (lower-cased). Either we change the filter to send `category_id` or adjust SQL query to join by name. Simpler and less breaking – pass the ID.
* **Multiple categories per prompt**: present schema supports single `category_id`. We should create a join table `prompt_categories(prompt_id uuid, category_id uuid)` and adjust UI + queries.  
  ↳ Requires small DB migration + update to `usePrompts` select (join and aggregate).
* **More categories**: easy seed insert; no code impact once multi-cat ready.

---
# High-level Task Breakdown
- [ ] **DB migration**
  - [ ] Create table `prompt_categories (prompt_id uuid references prompts, category_id uuid references categories)` with primary key `(prompt_id, category_id)`.
  - [ ] Move existing `category_id` data into this table, then (option A) keep `prompts.category_id` for default OR (option B) drop the column.  *Simplest now*: keep column for backward compatibility; multi-select will insert additional rows.
  - [ ] RLS policies: SELECT + INSERT on `prompt_categories` for anon key.

- [ ] **Category filter fix**
  - [ ] Update `FilterPanel` to pass **category_id** (instead of name) to `filters.category`.
  - [ ] Adjust UI active-state check accordingly.
  - [ ] Ensure `usePrompts` expects an ID and query remains as is (`eq('category_id', category)`), so prompts appear.

- [ ] **AddPromptForm multi-select**
  - [ ] Replace single `<select>` with multi-select (checkbox list) capturing an array of IDs.
  - [ ] On submit, keep first selected as `category_id` (for backward compat) and insert all selected IDs into `prompt_categories`.

- [ ] **Smart tags enhancement**
  - [ ] Move keyword list into util for reuse; extend set (email, social-media, marketing, coding, etc.).
  - [ ] Ensure tags are lower-cased and trimmed; deduplicate before insert.

- [ ] **Seed more categories** (optional after migration).

---
# Project Status Board
- [x] DB migration script prepared
- [x] Front-end filter fixed
- [x] Form multi-select implemented
- [x] Smart tag util refactored
- [x] Extra categories seeded

---
# Executor's Feedback or Assistance Requests
_(empty)_

---
# Lessons
- Always align the type of value passed through filter state with what the query expects (name vs id).
