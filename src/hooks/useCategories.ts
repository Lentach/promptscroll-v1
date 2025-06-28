import { supabase } from '../lib/supabase';
import type { Category } from '../types';
import { useSupabaseQuery } from './useSupabaseQuery';

export function useCategories() {
  const { data, loading, error, refresh } = useSupabaseQuery<Category[]>(
    async () => {
      const { data, error } = await supabase.from('categories').select('*').order('name');
      return { data, error };
    },
    [],
  );

  return {
    categories: data ?? [],
    loading,
    error,
    refresh,
  };
}
