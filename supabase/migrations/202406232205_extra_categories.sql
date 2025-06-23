-- Extra categories seed
insert into categories (name, icon, color)
select * from (values
  ('Legal', 'Gavel', '#ef4444'),
  ('SEO', 'Search', '#facc15'),
  ('Cooking', 'UtensilsCrossed', '#fb923c'),
  ('Resume', 'FileText', '#6b7280'),
  ('Interview', 'Mic', '#10b981')
) as t(name, icon, color)
where not exists (select 1 from categories c where c.name = t.name); 