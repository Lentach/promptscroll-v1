import { useState, useCallback } from 'react'
import { supabase } from '../lib/supabase'
import type { Prompt } from '../types'

interface UsePromptActionsOptions {
  onUpdate?: (promptId: string, updates: Partial<Prompt>) => void;
}

export function usePromptActions({ onUpdate }: UsePromptActionsOptions = {}) {
  const [loadingStates, setLoadingStates] = useState<Record<string, Set<string>>>({});

  const setLoading = useCallback((promptId: string, action: string, isLoading: boolean) => {
    setLoadingStates(prev => {
      const newStates = { ...prev };
      if (!newStates[promptId]) newStates[promptId] = new Set();
      isLoading ? newStates[promptId].add(action) : newStates[promptId].delete(action);
      if (newStates[promptId].size === 0) delete newStates[promptId];
      return newStates;
    });
  }, []);

  const isLoading = useCallback((promptId: string, action: string) => {
    return loadingStates[promptId]?.has(action) || false;
  }, [loadingStates]);

  const updatePromptCount = async (promptId: string, column: 'total_likes' | 'total_dislikes' | 'total_uses', currentCount: number) => {
    const { data, error } = await supabase
      .from('prompts')
      .update({ [column]: currentCount + 1 })
      .eq('id', promptId)
      .select(column)
      .single();

    if (error) {
      console.error(`Error updating ${column}:`, error);
      throw error;
    }
    
    return data ? data[column] : currentCount + 1;
  };

  const likePrompt = useCallback(async (promptId: string, currentLikes: number) => {
    setLoading(promptId, 'like', true);
    try {
      const newLikes = await updatePromptCount(promptId, 'total_likes', currentLikes);
      onUpdate?.(promptId, { total_likes: newLikes });
      return { likes: newLikes };
    } catch (error) {
      // Revert optimistic UI or show error
      return { likes: currentLikes };
    } finally {
      setLoading(promptId, 'like', false);
    }
  }, [setLoading, onUpdate]);

  const dislikePrompt = useCallback(async (promptId: string, currentDislikes: number) => {
    setLoading(promptId, 'dislike', true);
    try {
      const newDislikes = await updatePromptCount(promptId, 'total_dislikes', currentDislikes);
      onUpdate?.(promptId, { total_dislikes: newDislikes });
      return { dislikes: newDislikes };
    } catch (error) {
      return { dislikes: currentDislikes };
    } finally {
      setLoading(promptId, 'dislike', false);
    }
  }, [setLoading, onUpdate]);

  const copyPrompt = useCallback(async (promptId: string, content: string, currentUses: number) => {
    setLoading(promptId, 'copy', true);
    try {
      await navigator.clipboard.writeText(content);
      const newUses = await updatePromptCount(promptId, 'total_uses', currentUses);
      onUpdate?.(promptId, { total_uses: newUses });
      return { uses: newUses, copied: true };
    } catch (error) {
      console.error('Failed to copy or update count:', error);
      return { uses: currentUses, copied: false };
    } finally {
      setLoading(promptId, 'copy', false);
    }
  }, [setLoading, onUpdate]);
  
  const usePrompt = useCallback(async (promptId: string, content: string, currentUses: number) => {
      return await copyPrompt(promptId, content, currentUses);
  }, [copyPrompt]);

  return {
    likePrompt,
    dislikePrompt,
    copyPrompt,
    usePrompt,
    isLoading,
  };
}