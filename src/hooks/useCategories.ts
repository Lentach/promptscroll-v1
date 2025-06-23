import { useState } from 'react'

export function useCategories() {
  const [categories, setCategories] = useState<any[]>([])
  const [error, setError] = useState<string | null>(null)

  // Placeholder: no backend logic
  return {
    categories,
    error,
    refresh: () => {},
    setCategories
  }
}