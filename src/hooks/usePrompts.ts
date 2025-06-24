import { useState, useEffect, useCallback, useMemo } from 'react'
import { supabase } from '../lib/supabase'
import type { Prompt, FilterState } from '../types'

interface UsePromptsOptions extends FilterState {
  limit?: number
}

interface UsePromptsReturn {
  prompts: Prompt[]
  loading: boolean
  error: string | null
  hasMore: boolean
  loadMore: () => void
  refresh: () => void
  setPrompts: React.Dispatch<React.SetStateAction<Prompt[]>>
}

export function usePrompts(options?: UsePromptsOptions): UsePromptsReturn {
  const { 
    category = '', 
    search = '', 
    sortBy = 'newest', 
    difficulty,
    model,
    verified,
    limit = 20 
  } = options || {}

  const [prompts, setPrompts] = useState<Prompt[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [offset, setOffset] = useState(0)
  const [hasMore, setHasMore] = useState(true)

  const queryParams = useMemo(() => ({
    category,
    search: search.trim(),
    sortBy,
    difficulty,
    model,
    verified
  }), [category, search, sortBy, difficulty, model, verified])

  const fetchPrompts = useCallback(async (isNewQuery: boolean) => {
    try {
      setLoading(true)
      setError(null)

      const currentOffset = isNewQuery ? 0 : offset

      let query = supabase
        .from('prompts')
        .select(`
          *,
          categories!prompts_category_id_fkey (
            name,
            color,
            icon
          ),
          prompt_tags (
            tag
          )
        `)

      if (sortBy === 'newest') {
        query = query.order('created_at', { ascending: false })
      } else if (sortBy === 'popular') {
        query = query
          .order('total_uses', { ascending: false })
          .order('total_likes', { ascending: false })
      }

      if (category) {
        // This assumes category is an ID. If it's a name, we need a join or a subquery.
        // For now, let's assume the filter component will provide an ID.
        // A better implementation would be to fetch category id from name.
        query = query.eq('category_id', category)
      }

      if (search) {
        const likeStr = `%${search}%`
        query = query.or(`title.ilike.${likeStr},content.ilike.${likeStr}`)
                     .or(`tag.ilike.${likeStr}`, { foreignTable: 'prompt_tags' })

        // Extra: if search matches difficulty level or model id, filter exactly
        const difficulties = ['beginner', 'intermediate', 'advanced']
        const models = ['chatgpt', 'claude', 'dalle', 'midjourney', 'gpt-4', 'gemini', 'perplexity', 'grok', 'other']
        const lower = search.toLowerCase().trim()
        if (difficulties.includes(lower)) {
          query = query.eq('difficulty_level', lower)
        }
        if (models.includes(lower)) {
          query = query.eq('primary_model', lower)
        }
      }

      if (difficulty) {
        query = query.eq('difficulty_level', difficulty)
      }

      if (model) {
        query = query.eq('primary_model', model)
      }

      if (verified === true) {
        query = query.eq('is_verified', true)
      }

      query = query.range(currentOffset, currentOffset + limit - 1)

      const { data, error: fetchError } = await query

      if (fetchError) {
        throw fetchError
      }

      const newPrompts = (data || []) as Prompt[]

      if (isNewQuery) {
        setPrompts(newPrompts)
      } else {
        setPrompts(prev => [...prev, ...newPrompts])
      }
      
      setOffset(currentOffset + newPrompts.length)
      setHasMore(newPrompts.length === limit)

    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch prompts'
      setError(errorMessage)
      console.error('Error fetching prompts:', err)
    } finally {
      setLoading(false)
    }
  }, [queryParams, offset, limit])

  const refresh = useCallback(() => {
    setOffset(0)
    setPrompts([])
    setHasMore(true)
    fetchPrompts(true)
  }, [fetchPrompts])

  const loadMore = useCallback(() => {
    if (!loading && hasMore) {
      fetchPrompts(false)
    }
  }, [loading, hasMore, fetchPrompts])

  useEffect(() => {
    refresh()
  }, [queryParams])

  return {
    prompts,
    loading,
    error,
    hasMore,
    loadMore,
    refresh,
    setPrompts
  }
}