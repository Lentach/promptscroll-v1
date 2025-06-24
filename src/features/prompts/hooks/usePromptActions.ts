import { useState, useCallback } from 'react';
import { supabase } from '@/lib/supabase';
import type { Prompt } from '@/types';

interface UsePromptActionsOptions {
  onUpdate?: (promptId: string, updates: Partial<Prompt>) => void;
}

export function usePromptActions({ onUpdate }: UsePromptActionsOptions = {}) {
  const [loadingStates, setLoadingStates] = useState<Record<string, Set<string>>>({});

  const setLoading = useCallback((id: string, action: string, is: boolean) => {
    setLoadingStates((prev) => {
      const next = { ...prev };
      if (!next[id]) next[id] = new Set();
      is ? next[id].add(action) : next[id].delete(action);
      if (next[id].size === 0) delete next[id];
      return next;
    });
  }, []);

  const isLoading = useCallback((id: string, action: string) => loadingStates[id]?.has(action) || false, [loadingStates]);

  const updateCount = async (
    promptId: string,
    column: 'total_likes' | 'total_dislikes' | 'total_uses',
    current: number,
  ) => {
    const { data, error } = await supabase
      .from('prompts')
      .update({ [column]: current + 1 })
      .eq('id', promptId)
      .select(column)
      .single();
    if (error) throw error;
    return data ? (data as any)[column] as number : current + 1;
  };

  const likePrompt = useCallback(
    async (id: string, cur: number) => {
      setLoading(id, 'like', true);
      try {
        const likes = await updateCount(id, 'total_likes', cur);
        onUpdate?.(id, { total_likes: likes });
        return { likes };
      } finally {
        setLoading(id, 'like', false);
      }
    },
    [setLoading, onUpdate],
  );

  const dislikePrompt = useCallback(
    async (id: string, cur: number) => {
      setLoading(id, 'dislike', true);
      try {
        const dislikes = await updateCount(id, 'total_dislikes', cur);
        onUpdate?.(id, { total_dislikes: dislikes });
        return { dislikes };
      } finally {
        setLoading(id, 'dislike', false);
      }
    },
    [setLoading, onUpdate],
  );

  const copyPrompt = useCallback(
    async (id: string, content: string, cur: number) => {
      setLoading(id, 'copy', true);
      try {
        await navigator.clipboard.writeText(content);
        const uses = await updateCount(id, 'total_uses', cur);
        onUpdate?.(id, { total_uses: uses });
        return { uses, copied: true };
      } catch {
        return { uses: cur, copied: false };
      } finally {
        setLoading(id, 'copy', false);
      }
    },
    [setLoading, onUpdate],
  );

  const recordUse = useCallback(
    async (id: string, cur: number) => {
      setLoading(id, 'use', true);
      try {
        const uses = await updateCount(id, 'total_uses', cur);
        onUpdate?.(id, { total_uses: uses });
        return { uses };
      } finally {
        setLoading(id, 'use', false);
      }
    },
    [setLoading, onUpdate],
  );

  return { likePrompt, dislikePrompt, copyPrompt, recordUse, isLoading } as const;
} 