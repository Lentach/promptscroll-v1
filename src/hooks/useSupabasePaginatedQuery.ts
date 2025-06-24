import { useState, useCallback, useEffect } from 'react';

interface BuildQueryFn<T> {
  (range: { from: number; to: number }): Promise<{ data: T[] | null; error: any }>;
}

interface UseSupabasePaginatedReturn<T> {
  items: T[];
  loading: boolean;
  error: string | null;
  hasMore: boolean;
  loadMore: () => void;
  refresh: () => void;
  setItems: React.Dispatch<React.SetStateAction<T[]>>;
}

export function useSupabasePaginatedQuery<T>(
  buildQuery: BuildQueryFn<T>,
  deps: any[] = [],
  limit = 20,
): UseSupabasePaginatedReturn<T> {
  const [items, setItems] = useState<T[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [offset, setOffset] = useState(0);
  const [hasMore, setHasMore] = useState(true);

  const fetchPage = useCallback(
    async (isNewQuery: boolean) => {
      try {
        setLoading(true);
        setError(null);

        const from = isNewQuery ? 0 : offset;
        const to = from + limit - 1;

        const { data, error } = await buildQuery({ from, to });
        if (error) throw error;

        const newData = (data || []) as T[];
        setItems((prev) => (isNewQuery ? newData : [...prev, ...newData]));
        setOffset(from + newData.length);
        setHasMore(newData.length === limit);
      } catch (err: any) {
        console.error('Pagination query failed', err);
        setError(err?.message ?? 'Unknown error');
      } finally {
        setLoading(false);
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [buildQuery, offset, limit, ...deps],
  );

  const refresh = useCallback(() => {
    setOffset(0);
    setHasMore(true);
    fetchPage(true);
  }, [fetchPage]);

  const loadMore = useCallback(() => {
    if (!loading && hasMore) fetchPage(false);
  }, [loading, hasMore, fetchPage]);

  useEffect(() => {
    refresh();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);

  return { items, loading, error, hasMore, loadMore, refresh, setItems };
} 