import { useMemo } from 'react';
import { supabase } from '@/lib/supabase';
import type { Prompt, FilterState } from '@/types';
import { useSupabasePaginatedQuery } from '@/hooks/useSupabasePaginatedQuery';
import { SUPABASE_TABLES } from '@/constants';

export function usePrompts(options?: FilterState & { limit?: number }) {
  const {
    category = '',
    search = '',
    sortBy = 'newest',
    difficulty,
    model,
    verified,
    limit = 20,
  } = options || {};

  const deps = [category, search, sortBy, difficulty, model, verified];

  const buildQuery = async ({ from, to }: { from: number; to: number }) => {
    let query = supabase.from(SUPABASE_TABLES.PROMPTS).select(
      `
        *,
        categories!prompts_category_id_fkey (
          name,
          color,
          icon
        ),
        prompt_tags (
          tag
        ),
        profiles:profiles!prompts_author_id_fkey (
          display_name,
          avatar_url
        )
      `,
    );

    if (sortBy === 'newest') {
      query = query.order('created_at', { ascending: false });
    } else if (sortBy === 'popular') {
      query = query
        .order('total_uses', { ascending: false })
        .order('total_likes', { ascending: false });
    }

    if (category) {
      query = query.eq('category_id', category);
    }

    if (search) {
      const likeStr = `%${search}%`;
      query = query
        .or(`title.ilike.${likeStr},content.ilike.${likeStr}`)
        .or(`tag.ilike.${likeStr}`, { foreignTable: 'prompt_tags' });

      const difficulties = ['beginner', 'intermediate', 'advanced'];
      const models = [
        'chatgpt',
        'claude',
        'dalle',
        'midjourney',
        'gpt-4',
        'gemini',
        'perplexity',
        'grok',
        'other',
      ];
      const lower = search.toLowerCase().trim();
      if (difficulties.includes(lower)) query = query.eq('difficulty_level', lower);
      if (models.includes(lower)) query = query.eq('primary_model', lower);
    }

    if (difficulty) query = query.eq('difficulty_level', difficulty);
    if (model) query = query.eq('primary_model', model);
    if (verified === true) query = query.eq('is_verified', true);

    query = query.range(from, to);
    const { data, error } = await query;
    return { data, error };
  };

  const {
    items: prompts,
    loading,
    error,
    hasMore,
    loadMore,
    refresh,
    setItems: setPrompts,
  } = useSupabasePaginatedQuery<Prompt>(buildQuery, deps, limit);

  return { prompts, loading, error, hasMore, loadMore, refresh, setPrompts } as const;
} 