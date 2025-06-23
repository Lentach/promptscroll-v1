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
  totalCount: number
}

// DODANA funkcja pomocnicza do sprawdzania UUID
function isValidUUID(str: string): boolean {
  const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i
  return uuidRegex.test(str)
}

export function usePrompts(options: UsePromptsOptions = {}): UsePromptsReturn {
  const { 
    category = '', 
    search = '', 
    sortBy = 'newest', 
    difficulty,
    model,
    verified,
    limit = 12 
  } = options

  const [prompts, setPrompts] = useState<Prompt[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [hasMore, setHasMore] = useState(true)
  const [offset, setOffset] = useState(0)
  const [totalCount, setTotalCount] = useState(0)

  // Memoize the query parameters to prevent unnecessary re-fetches
  const queryParams = useMemo(() => ({
    category,
    search: search.trim(),
    sortBy,
    difficulty,
    model,
    verified,
    limit
  }), [category, search, sortBy, difficulty, model, verified, limit])

  const buildQuery = useCallback(async (currentOffset: number) => {
    let query = supabase
      .from('prompts')
      .select(`
        *,
        categories (
          name,
          color,
          icon
        ),
        prompt_tags (
          tag
        )
      `, { count: 'exact' })
      .eq('moderation_status', 'approved')

    // Apply sorting
    if (sortBy === 'newest') {
      query = query.order('created_at', { ascending: false })
    } else if (sortBy === 'popular') {
      // Sort by popularity: total_uses first, then total_likes, then newest
      query = query
        .order('total_uses', { ascending: false })
        .order('total_likes', { ascending: false })
        .order('created_at', { ascending: false })
    } else if (sortBy === 'trending') {
      // NEW: Trending sort - prompts from last 14 days sorted by engagement
      const fourteenDaysAgo = new Date()
      fourteenDaysAgo.setDate(fourteenDaysAgo.getDate() - 14)
      
      query = query
        .gte('created_at', fourteenDaysAgo.toISOString())
        .order('total_likes', { ascending: false })
        .order('total_uses', { ascending: false })
        .order('created_at', { ascending: false })
    }

    // POPRAWIONY FILTR KATEGORII - niezależny od wyszukiwania
    if (category) {
      console.log('🔍 Looking for category:', category)
      
      // Try exact match first (case-insensitive)
      const { data: exactCategoryData, error: exactError } = await supabase
        .from('categories')
        .select('id, name')
        .ilike('name', category)
        .single()
      
      if (exactError) {
        console.log('❌ Exact category match failed:', exactError.message)
      }
      
      if (exactCategoryData) {
        console.log('✅ Found exact category match:', exactCategoryData)
        query = query.eq('category_id', exactCategoryData.id)
      } else {
        // Try partial matching
        console.log('🔍 Trying partial match for category:', category)
        const { data: partialCategoryData, error: partialError } = await supabase
          .from('categories')
          .select('id, name')
          .ilike('name', `%${category}%`)
          .limit(1)
          .single()
        
        if (partialError) {
          console.log('❌ Partial category match failed:', partialError.message)
        }
        
        if (partialCategoryData) {
          console.log('✅ Found partial category match:', partialCategoryData)
          query = query.eq('category_id', partialCategoryData.id)
        } else {
          console.log('❌ No category found for:', category)
          // Return empty results if no category found
          return supabase
            .from('prompts')
            .select('*', { count: 'exact' })
            .eq('id', 'non-existent-id') // This will return no results
        }
      }
    }

    // POPRAWIONE WYSZUKIWANIE - obsługuje UUID i tekst
    if (search) {
      console.log('🔍 Searching for:', search)
      
      // NOWA LOGIKA: Sprawdź czy search to UUID
      if (isValidUUID(search)) {
        console.log('🆔 UUID search detected for:', search)
        // Wyszukaj bezpośrednio po ID
        query = query.eq('id', search)
      } else {
        // Check if this looks like a tag search (starts with # or is a single word)
        const isTagSearch = search.startsWith('#') || (!search.includes(' ') && search.length > 2)
        const searchTerm = search.startsWith('#') ? search.substring(1) : search
        
        if (isTagSearch) {
          console.log('🏷️ Tag search detected for:', searchTerm)
          
          // First, get prompt IDs that have this tag
          const { data: taggedPrompts, error: tagError } = await supabase
            .from('prompt_tags')
            .select('prompt_id')
            .ilike('tag', `%${searchTerm}%`)
          
          if (tagError) {
            console.error('❌ Tag search error:', tagError)
          } else if (taggedPrompts && taggedPrompts.length > 0) {
            console.log('✅ Found prompts with tag:', taggedPrompts.length)
            const promptIds = taggedPrompts.map(tp => tp.prompt_id)
            
            // Search in both content AND tagged prompts
            query = query.or(`title.ilike.%${search}%,description.ilike.%${search}%,content.ilike.%${search}%,id.in.(${promptIds.join(',')})`)
          } else {
            console.log('❌ No prompts found with tag:', searchTerm)
            // Still search in content as fallback
            query = query.or(`title.ilike.%${search}%,description.ilike.%${search}%,content.ilike.%${search}%`)
          }
        } else {
          // POPRAWIONE: Regular text search - bez dodawania category_id
          console.log('📝 Regular text search for:', search)
          
          // Search only in prompt content, title, description - NO category matching here
          query = query.or(`title.ilike.%${search}%,description.ilike.%${search}%,content.ilike.%${search}%`)
        }
      }
    }

    if (difficulty) {
      query = query.eq('difficulty_level', difficulty)
    }

    if (model) {
      query = query.eq('primary_model', model)
    }

    if (verified !== undefined) {
      query = query.eq('is_verified', verified)
    }

    // Apply pagination - all sort options now support infinite scroll
    query = query.range(currentOffset, currentOffset + limit - 1)

    return query
  }, [queryParams])

  const fetchPrompts = useCallback(async (reset = false) => {
    try {
      setLoading(true)
      setError(null)

      const currentOffset = reset ? 0 : offset
      const query = await buildQuery(currentOffset)
      const { data, error: fetchError, count } = await query

      if (fetchError) {
        throw fetchError
      }

      const newPrompts = data || []
      
      console.log('📊 Fetched prompts:', {
        search: search,
        category: category,
        sortBy: sortBy,
        offset: currentOffset,
        count: newPrompts.length,
        total: count,
        prompts: newPrompts.map(p => ({ 
          id: p.id, 
          title: p.title, 
          category_id: p.category_id,
          total_uses: p.total_uses,
          total_likes: p.total_likes,
          tags: p.prompt_tags?.map(pt => pt.tag) || []
        }))
      })
      
      if (reset) {
        setPrompts(newPrompts)
        setOffset(newPrompts.length)
      } else {
        setPrompts(prev => [...prev, ...newPrompts])
        setOffset(prev => prev + newPrompts.length)
      }

      // Update total count
      if (count !== null) {
        setTotalCount(count)
      }

      // Determine if there are more prompts - all sort options support infinite scroll now
      const currentTotal = reset ? newPrompts.length : offset + newPrompts.length
      setHasMore(newPrompts.length === limit && currentTotal < (count || 0))

    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch prompts')
      console.error('Error fetching prompts:', err)
    } finally {
      setLoading(false)
    }
  }, [buildQuery, offset, limit, sortBy, category, search])

  const loadMore = useCallback(() => {
    // All sort options now support infinite scroll
    if (!loading && hasMore) {
      fetchPrompts(false)
    }
  }, [fetchPrompts, loading, hasMore])

  const refresh = useCallback(() => {
    setOffset(0)
    setPrompts([])
    setHasMore(true)
    fetchPrompts(true)
  }, [fetchPrompts])

  // Reset and fetch when query parameters change
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
    totalCount
  }
}