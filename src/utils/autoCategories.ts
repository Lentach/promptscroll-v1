import type { Category } from '../types'

// Simple keyword map -> canonical category name.
// Extend as needed.
const keywordMap: Record<string, string> = {
  seo: 'SEO',
  backlink: 'SEO',
  marketing: 'Marketing',
  campaign: 'Marketing',
  email: 'AI Assistant',
  mail: 'AI Assistant',
  cooking: 'Cooking',
  recipe: 'Cooking',
  code: 'Code Generation',
  programming: 'Code Generation',
  analysis: 'Data Analysis',
  data: 'Data Analysis',
  creative: 'Creative Writing',
  story: 'Creative Writing'
}

export function detectCategories(fullText: string, availableCategories: Category[], max = 3): Category[] {
  const lower = fullText.toLowerCase()
  const matched: Category[] = []

  // direct name match
  for (const cat of availableCategories) {
    if (matched.length >= max) break
    if (lower.includes(cat.name.toLowerCase())) {
      matched.push(cat)
    }
  }
  if (matched.length >= max) return matched

  // keyword map
  for (const keyword in keywordMap) {
    if (matched.length >= max) break
    if (lower.includes(keyword)) {
      const catName = keywordMap[keyword]
      const cat = availableCategories.find(c => c.name.toLowerCase() === catName.toLowerCase())
      if (cat && !matched.some(m => m.id === cat.id)) {
        matched.push(cat)
      }
    }
  }

  // fallback to first category if still none
  if (matched.length === 0 && availableCategories.length) matched.push(availableCategories[0])

  return matched.slice(0, max)
} 