-- Seed 20 demo prompts for testing UI
-- Only insert if a prompt with same title does not exist

insert into prompts (
  title, content, description, category_id,
  compatible_models, primary_model,
  is_verified, is_featured, quality_score,
  total_uses, total_likes, total_dislikes,
  author_name, difficulty_level, moderation_status
)
select * from (values
  ('Creative Story Starter', 'Write the first paragraph of a fantasy story featuring a lost dragon egg.', 'Generates a captivating fantasy opening.', (select id from categories where name=''Creative Writing'' limit 1), array[''chatgpt''], ''chatgpt'', true, false, 4, 3, 2, 0, ''Alice'', ''beginner'', ''approved''),
  ('SQL Query Generator', 'Generate an SQL query to fetch top 10 customers by revenue.', 'Helps analysts quickly craft SQL.', (select id from categories where name=''Code Generation'' limit 1), array[''chatgpt'',''gpt-4''], ''gpt-4'', false, false, 5, 1, 0, 0, ''Bob'', ''intermediate'', ''approved''),
  ('Email Apology', 'Write a professional apology email for a delayed shipment.', 'Business email template.', (select id from categories where name=''AI Assistant'' limit 1), array[''chatgpt''], ''chatgpt'', true, false, 4, 5, 4, 0, ''Clara'', ''beginner'', ''approved''),
  ('Marketing Slogan', 'Come up with 5 catchy slogans for an eco-friendly water bottle.', 'Creative marketing copy.', (select id from categories where name=''Marketing'' limit 1), array[''claude''], ''claude'', false, false, 3, 0, 0, 0, ''Dave'', ''beginner'', ''approved''),
  ('Python Refactor', 'Refactor this Python function to improve readability:\n```python\n...```', 'Suggests cleaner code.', (select id from categories where name=''Code Generation'' limit 1), array[''chatgpt''], ''chatgpt'', false, false, 4, 0, 0, 0, ''Eve'', ''advanced'', ''approved''),
  ('Data Insights', 'Explain the trend shown in this sales data CSV summary.', 'Narrative data analysis.', (select id from categories where name=''Data Analysis'' limit 1), array[''gpt-4''], ''gpt-4'', true, false, 5, 2, 1, 0, ''Frank'', ''intermediate'', ''approved''),
  ('Translate to French', 'Translate the following paragraph into formal French.', 'Accurate translation.', (select id from categories where name=''Translation'' limit 1), array[''chatgpt''], ''chatgpt'', true, false, 4, 1, 1, 0, ''Grace'', ''beginner'', ''approved''),
  ('Daily Workout Plan', 'Create a 30-minute full-body workout without equipment.', 'Health & fitness guidance.', (select id from categories where name=''Health'' limit 1), array[''chatgpt''], ''chatgpt'', false, false, 3, 0, 0, 0, ''Hank'', ''beginner'', ''approved''),
  ('Logo Color Suggestions', 'Suggest modern color palettes for a fintech logo.', 'Design inspiration.', (select id from categories where name=''Design'' limit 1), array[''chatgpt''], ''chatgpt'', false, false, 4, 0, 0, 0, ''Ivy'', ''beginner'', ''approved''),
  ('Financial Risk Summary', 'Summarize key risks in this annual report.', 'Finance analysis.', (select id from categories where name=''Finance'' limit 1), array[''gpt-4''], ''gpt-4'', true, false, 5, 0, 0, 0, ''Jack'', ''advanced'', ''approved''),
  ('SEO Keywords', 'Generate 15 long-tail SEO keywords for a travel blog about Iceland.', 'SEO content ideas.', (select id from categories where name=''SEO'' limit 1), array[''chatgpt''], ''chatgpt'', false, false, 3, 0, 0, 0, ''Kate'', ''beginner'', ''approved''),
  ('Legal Clause Draft', 'Draft a confidentiality clause for an NDA.', 'Legal writing.', (select id from categories where name=''Legal'' limit 1), array[''gpt-4''], ''gpt-4'', true, false, 5, 0, 0, 0, ''Leo'', ''advanced'', ''approved''),
  ('Recipe Generator', 'Create a vegetarian dinner recipe using sweet potato and chickpeas.', 'Cooking ideas.', (select id from categories where name=''Cooking'' limit 1), array[''chatgpt''], ''chatgpt'', false, false, 4, 0, 0, 0, ''Mia'', ''beginner'', ''approved''),
  ('Resume Bullet Points', 'Rewrite my job duties into impactful resume bullets.', 'Career help.', (select id from categories where name=''Resume'' limit 1), array[''chatgpt''], ''chatgpt'', false, false, 4, 0, 0, 0, ''Ned'', ''beginner'', ''approved''),
  ('Behavioral Interview Q&A', 'Give STAR-method answers for "Tell me about a time you failed".', 'Interview prep.', (select id from categories where name=''Interview'' limit 1), array[''claude''], ''claude'', false, false, 4, 0, 0, 0, ''Olga'', ''intermediate'', ''approved''),
  ('Productivity Hack', 'Provide a 5-step Pomodoro schedule for study sessions.', 'Boost productivity.', (select id from categories where name=''Productivity'' limit 1), array[''chatgpt''], ''chatgpt'', false, false, 3, 0, 0, 0, ''Paul'', ''beginner'', ''approved''),
  ('Translate Idioms', 'Translate English idioms to Spanish while keeping meaning.', 'Complex translation.', (select id from categories where name=''Translation'' limit 1), array[''gpt-4''], ''gpt-4'', true, false, 5, 0, 0, 0, ''Quinn'', ''advanced'', ''approved''),
  ('Sales Pitch', 'Write a persuasive 2-minute sales pitch for a SaaS CRM.', 'Marketing copy.', (select id from categories where name=''Marketing'' limit 1), array[''chatgpt''], ''chatgpt'', false, false, 4, 0, 0, 0, ''Rick'', ''intermediate'', ''approved''),
  ('Explain Code Snippet', 'Explain what this JavaScript function does:\n```js\n...```', 'Code explanation.', (select id from categories where name=''Code Generation'' limit 1), array[''chatgpt''], ''chatgpt'', true, false, 4, 0, 0, 0, ''Sara'', ''beginner'', ''approved''),
  ('Mindfulness Exercise', 'Guide me through a 5-minute breathing meditation.', 'Well-being.', (select id from categories where name=''Health'' limit 1), array[''chatgpt''], ''chatgpt'', false, false, 3, 0, 0, 0, ''Tom'', ''beginner'', ''approved'')
) as s(title,content,description,cat_id,models,primary_m,is_verified,is_featured,qscore,uses,likes,dislikes,author,diff,mod)
where not exists (select 1 from prompts p where p.title = s.title); 