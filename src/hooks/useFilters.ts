import { useCallback } from 'react';
import { useLocalStorage } from './useLocalStorage';
import type { FilterState } from '@/types';

const defaultFilters: FilterState = {
  category: '',
  search: '',
  sortBy: 'popular',
};

export function useFilters() {
  const [filters, setFilters] = useLocalStorage<FilterState>(
    'promptscroll-filters',
    defaultFilters,
  );

  const handleFiltersChange = useCallback(
    (newFilters: Partial<FilterState>) => {
      setFilters((prev) => ({ ...prev, ...newFilters }));
    },
    [setFilters],
  );

  const clearAllFilters = useCallback(() => {
    setFilters(defaultFilters);
  }, [setFilters]);

  const hasActiveFilters = useCallback(() => {
    return (
      filters.category !== '' ||
      filters.search !== '' ||
      filters.sortBy !== 'popular' ||
      filters.difficulty !== undefined ||
      filters.model !== undefined ||
      filters.verified !== undefined
    );
  }, [filters]);

  return { filters, setFilters, handleFiltersChange, clearAllFilters, hasActiveFilters, defaultFilters };
}
