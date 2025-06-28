export function generateSmartTags(text: string): string[] {
  const t = text.toLowerCase();
  const tags: string[] = [];

  const add = (tag: string) => {
    if (!tags.includes(tag)) tags.push(tag);
  };

  // mapping keyword -> tag
  const map: Record<string, string> = {
    email: 'email',
    mail: 'email',
    social: 'social-media',
    instagram: 'social-media',
    linkedin: 'social-media',
    business: 'business',
    professional: 'business',
    marketing: 'marketing',
    campaign: 'marketing',
    code: 'coding',
    programming: 'coding',
    creative: 'creative',
    story: 'creative',
    analysis: 'analysis',
    analyze: 'analysis',
    strategy: 'strategy',
    strategic: 'strategy',
    content: 'content',
    blog: 'content',
    sales: 'sales',
    selling: 'sales',
    legal: 'legal',
    contract: 'legal',
    resume: 'resume',
    cv: 'resume',
    interview: 'interview',
    seo: 'seo',
    cooking: 'cooking',
    recipe: 'cooking',
  };

  for (const keyword in map) {
    if (t.includes(keyword)) add(map[keyword]);
  }

  return tags;
}
