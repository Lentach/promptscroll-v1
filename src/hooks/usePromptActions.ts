import { useState, useCallback } from 'react'

interface UsePromptActionsOptions {
  onUpdate?: (promptId: string, updates: any) => void
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

  const likePrompt = useCallback(async (
    promptId: string,
    currentLikes: number,
    currentDislikes: number
  ) => {
    setLoading(promptId, 'like', true)
    await new Promise(res => setTimeout(res, 300))
    setLoading(promptId, 'like', false)
    return { likes: currentLikes + 1, dislikes: currentDislikes }
  }, [setLoading])

  const dislikePrompt = useCallback(async (
    promptId: string,
    currentLikes: number,
    currentDislikes: number
  ) => {
    setLoading(promptId, 'dislike', true)
    await new Promise(res => setTimeout(res, 300))
    setLoading(promptId, 'dislike', false)
    return { likes: currentLikes, dislikes: currentDislikes + 1 }
  }, [setLoading])

  const copyPrompt = useCallback(async (
    promptId: string,
    content: string,
    currentUses: number
  ) => {
    setLoading(promptId, 'copy', true)
    try {
      await navigator.clipboard.writeText(content)
    } catch {}
    setLoading(promptId, 'copy', false)
    return { uses: currentUses + 1, copied: true }
  }, [setLoading])

  const usePrompt = useCallback(async (
    promptId: string,
    content: string,
    model: string,
    currentUses: number
  ) => {
    await copyPrompt(promptId, content, currentUses)
    return { uses: currentUses + 1 }
  }, [copyPrompt])

  return {
    likePrompt,
    dislikePrompt,
    copyPrompt,
    usePrompt,
    isLoading
  }
}