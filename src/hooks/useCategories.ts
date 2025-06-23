import { useState, useEffect, useCallback } from 'react'
import { supabase } from '../lib/supabase'
import type { Category } from '../types'

export function useCategories() {
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchCategories = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)

      const { data, error: fetchError } = await supabase
        .from('categories')
        .select('*')
        .order('name')

      if (fetchError) {
        throw fetchError
      }

      setCategories(data || [])
      console.log('Fetched categories:', data)
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch categories'
      setError(errorMessage)
      console.error('Error fetching categories:', err)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchCategories()
  }, [fetchCategories])

  return { 
    categories, 
    loading, 
    error,
    refresh: fetchCategories 
  }
}