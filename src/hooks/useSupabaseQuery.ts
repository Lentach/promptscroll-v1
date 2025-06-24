import { useState, useEffect, useCallback } from 'react';

/**
 * Generic helper to execute a Supabase query and track loading / error state.
 * The caller provides a factory function that returns a *prepared* query
 * (e.g. `() => supabase.from('table').select('*').eq('id', 1)`),
 * so the hook has no knowledge about table names or filters.
 */
export function useSupabaseQuery<T>(queryFactory: () => Promise<{ data: T | null; error: any }>, deps: any[] = []) {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const execute = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const { data, error } = await queryFactory();
      if (error) throw error;
      setData(data as unknown as T);
    } catch (err: any) {
      console.error('Supabase query failed', err);
      setError(err?.message ?? 'Unknown error');
    } finally {
      setLoading(false);
    }
  }, deps); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    execute();
  }, [execute]);

  return { data, loading, error, refresh: execute } as const;
} 