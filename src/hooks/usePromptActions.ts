import { useState, useCallback } from 'react'
import { supabase } from '../lib/supabase'
import type { Prompt } from '../types'

interface UsePromptActionsOptions {
  onUpdate?: (promptId: string, updates: Partial<Prompt>) => void
  canVote?: (promptId: string) => boolean
  recordVote?: (promptId: string, type: 'like' | 'dislike') => void
}

interface UsePromptActionsReturn {
  likePrompt: (promptId: string, currentLikes: number, currentDislikes: number) => Promise<{ likes: number; dislikes: number }>
  dislikePrompt: (promptId: string, currentLikes: number, currentDislikes: number) => Promise<{ likes: number; dislikes: number }>
  copyPrompt: (promptId: string, content: string, currentUses: number) => Promise<{ uses: number; copied: boolean }>
  usePrompt: (promptId: string, content: string, model: string, currentUses: number) => Promise<{ uses: number }>
  isLoading: (promptId: string, action: string) => boolean
}

export function usePromptActions({
  onUpdate,
  canVote,
  recordVote
}: UsePromptActionsOptions = {}): UsePromptActionsReturn {
  const [loadingStates, setLoadingStates] = useState<Record<string, Set<string>>>({})

  const setLoading = useCallback((promptId: string, action: string, loading: boolean) => {
    setLoadingStates(prev => {
      const newState = { ...prev }
      if (!newState[promptId]) {
        newState[promptId] = new Set()
      }
      
      if (loading) {
        newState[promptId].add(action)
      } else {
        newState[promptId].delete(action)
        if (newState[promptId].size === 0) {
          delete newState[promptId]
        }
      }
      
      return newState
    })
  }, [])

  const isLoading = useCallback((promptId: string, action: string) => {
    return loadingStates[promptId]?.has(action) || false
  }, [loadingStates])

  // Generate a simple session ID for rate limiting
  const getSessionId = useCallback(() => {
    let sessionId = localStorage.getItem('promptscroll-session-id')
    if (!sessionId) {
      sessionId = 'session_' + Math.random().toString(36).substr(2, 9) + '_' + Date.now()
      localStorage.setItem('promptscroll-session-id', sessionId)
    }
    return sessionId
  }, [])

  const likePrompt = useCallback(async (
    promptId: string, 
    currentLikes: number, 
    currentDislikes: number
  ) => {
    // Check if user can vote
    if (canVote && !canVote(promptId)) {
      throw new Error('You have already voted on this prompt. Please wait before voting again.')
    }

    setLoading(promptId, 'like', true)
    
    try {
      console.log('🔄 Calling increment_prompt_likes_with_rate_limit for prompt:', promptId)
      
      // Call the Supabase RPC function
      const { data, error } = await supabase.rpc('increment_prompt_likes_with_rate_limit', {
        prompt_id_param: promptId,
        user_session_id: getSessionId(),
        user_ip_param: null // Let server handle IP detection
      })

      if (error) {
        console.error('❌ RPC error:', error)
        throw error
      }

      if (!data || data.length === 0) {
        throw new Error('No response from server')
      }

      const result = data[0]
      console.log('✅ RPC response:', result)

      if (!result.success) {
        throw new Error(result.message || 'Failed to like prompt')
      }

      // Record vote in session
      recordVote?.(promptId, 'like')

      // Notify parent component
      onUpdate?.(promptId, { 
        total_likes: result.new_likes, 
        total_dislikes: result.new_dislikes 
      })

      return { likes: result.new_likes, dislikes: result.new_dislikes }
    } catch (error) {
      console.error('❌ Error in likePrompt:', error)
      throw error
    } finally {
      setLoading(promptId, 'like', false)
    }
  }, [canVote, recordVote, onUpdate, setLoading, getSessionId])

  const dislikePrompt = useCallback(async (
    promptId: string, 
    currentLikes: number, 
    currentDislikes: number
  ) => {
    // Check if user can vote
    if (canVote && !canVote(promptId)) {
      throw new Error('You have already voted on this prompt. Please wait before voting again.')
    }

    setLoading(promptId, 'dislike', true)
    
    try {
      console.log('🔄 Calling increment_prompt_dislikes_with_rate_limit for prompt:', promptId)
      
      // Call the Supabase RPC function
      const { data, error } = await supabase.rpc('increment_prompt_dislikes_with_rate_limit', {
        prompt_id_param: promptId,
        user_session_id: getSessionId(),
        user_ip_param: null // Let server handle IP detection
      })

      if (error) {
        console.error('❌ RPC error:', error)
        throw error
      }

      if (!data || data.length === 0) {
        throw new Error('No response from server')
      }

      const result = data[0]
      console.log('✅ RPC response:', result)

      if (!result.success) {
        throw new Error(result.message || 'Failed to dislike prompt')
      }

      // Record vote in session
      recordVote?.(promptId, 'dislike')

      // Notify parent component
      onUpdate?.(promptId, { 
        total_likes: result.new_likes, 
        total_dislikes: result.new_dislikes 
      })

      return { likes: result.new_likes, dislikes: result.new_dislikes }
    } catch (error) {
      console.error('❌ Error in dislikePrompt:', error)
      throw error
    } finally {
      setLoading(promptId, 'dislike', false)
    }
  }, [canVote, recordVote, onUpdate, setLoading, getSessionId])

  const copyPrompt = useCallback(async (
    promptId: string, 
    content: string, 
    currentUses: number
  ) => {
    setLoading(promptId, 'copy', true)
    
    try {
      // Copy to clipboard
      await navigator.clipboard.writeText(content)
      
      // Update uses count using the existing increment function
      const { data, error } = await supabase.rpc('increment_prompt_uses', {
        prompt_id_param: promptId
      })

      if (error) {
        console.error('Error updating uses:', error)
        // Don't throw error for uses update failure, clipboard copy succeeded
      }

      const newUses = data?.[0]?.new_uses || currentUses + 1
      
      // Notify parent component
      onUpdate?.(promptId, { total_uses: newUses })

      return { uses: newUses, copied: true }
    } catch (error) {
      console.error('Error copying to clipboard:', error)
      throw new Error('Failed to copy to clipboard')
    } finally {
      setLoading(promptId, 'copy', false)
    }
  }, [onUpdate, setLoading])

  const usePrompt = useCallback(async (
    promptId: string, 
    content: string, 
    model: string, 
    currentUses: number
  ) => {
    // First copy to clipboard
    const { uses } = await copyPrompt(promptId, content, currentUses)
    
    // Then open the appropriate platform
    const modelUrls: Record<string, string> = {
      'chatgpt': `https://chat.openai.com/?q=${encodeURIComponent(content)}`,
      'gpt-4': `https://chat.openai.com/?q=${encodeURIComponent(content)}`,
      'claude': 'https://claude.ai/chat',
      'dalle': 'https://labs.openai.com/',
      'midjourney': 'https://www.midjourney.com/',
      'gemini': 'https://gemini.google.com/',
      'perplexity': 'https://www.perplexity.ai/',
      'grok': 'https://grok.com/'
    }

    const url = modelUrls[model]
    if (url) {
      window.open(url, '_blank')
    }

    return { uses }
  }, [copyPrompt])

  return {
    likePrompt,
    dislikePrompt,
    copyPrompt,
    usePrompt,
    isLoading
  }
}