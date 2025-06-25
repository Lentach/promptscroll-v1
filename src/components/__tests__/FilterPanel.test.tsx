import { render, screen, fireEvent } from '@testing-library/react';
import React from 'react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { FilterPanel } from '../FilterPanel';
import { FilterState } from '@/types';

vi.mock('../../hooks/useCategories', () => ({
  useCategories: () => ({
    categories: [
      { id: 'cat1', name: 'Writing', description: null, icon: 'Pen', color: '#fff', created_at: '' },
      { id: 'cat2', name: 'Coding', description: null, icon: 'Code', color: '#fff', created_at: '' },
    ],
  }),
}));

describe('FilterPanel', () => {
  const defaultFilters: FilterState = { category: '', search: '', sortBy: 'newest' } as any;
  const onFiltersChange = vi.fn();

  beforeEach(() => onFiltersChange.mockClear());

  it('renders categories', () => {
    render(
      <FilterPanel
        filters={defaultFilters}
        onFiltersChange={onFiltersChange}
        showAllCategories={false}
        onToggleCategories={() => {}}
      />,
    );
    expect(screen.getByText('Writing')).toBeInTheDocument();
    expect(screen.getByText('Coding')).toBeInTheDocument();
  });

  it('calls onFiltersChange when category clicked', () => {
    render(
      <FilterPanel
        filters={defaultFilters}
        onFiltersChange={onFiltersChange}
        showAllCategories={false}
        onToggleCategories={() => {}}
      />,
    );
    fireEvent.click(screen.getByText('Writing'));
    expect(onFiltersChange).toHaveBeenCalledWith({ category: 'cat1' });
  });
}); 