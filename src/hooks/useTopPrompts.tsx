import React, { createContext, useContext, useEffect, useState, useCallback } from 'react'
import { supabase } from '../lib/supabase'

interface TopPromptsContextValue {
  topIds: Set<string>
  refreshTopIds: () => void
}

const TopPromptsContext = createContext<TopPromptsContextValue | undefined>(undefined)

export const TopPromptsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [topIds, setTopIds] = useState<Set<string>>(new Set())

  const fetchTop = useCallback(async () => {
    const { data, error } = await supabase
      .from('prompts')
      .select('id, total_likes, total_uses')
      .order('total_uses', { ascending: false })
      .order('total_likes', { ascending: false })
      .limit(10)

    if (error) {
      console.error('Failed to fetch top prompts', error)
      return
    }
    setTopIds(new Set((data || []).map(d => d.id as string)))
  }, [])

  useEffect(() => {
    fetchTop()
  }, [fetchTop])

  return (
    <TopPromptsContext.Provider value={{ topIds, refreshTopIds: fetchTop }}>
      {children}
    </TopPromptsContext.Provider>
  )
}

export function useTopPrompts() {
  const ctx = useContext(TopPromptsContext)
  if (!ctx) throw new Error('useTopPrompts must be used within TopPromptsProvider')
  return ctx
} 