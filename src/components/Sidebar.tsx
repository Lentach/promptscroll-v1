import { Clock, Flame, TrendingUp } from 'lucide-react';
import { FilterPanel } from './FilterPanel';
import type { FilterState } from '@/types';

interface SidebarProps {
  filters: FilterState;
  handleFiltersChange: (newFilters: Partial<FilterState>) => void;
  showAllCategories: boolean;
  setShowAllCategories: (show: boolean) => void;
}

export function Sidebar({ filters, handleFiltersChange, showAllCategories, setShowAllCategories }: SidebarProps) {
  return (
    <div className="hidden lg:block lg:col-span-1 space-y-6">
      {/* Sort Options - UPDATED WITH TRENDING */}
      <div className="bg-white/5 backdrop-blur-md rounded-2xl p-4 border border-white/10">
        <h3 className="text-lg font-semibold text-white mb-4">Sort By</h3>
        <div className="space-y-2">
          <button
            onClick={() => handleFiltersChange({ sortBy: 'newest' })}
            className={`w-full flex items-center space-x-2 px-3 py-2 rounded-lg font-medium transition-all text-sm ${
              filters.sortBy === 'newest'
                ? 'bg-blue-500/20 text-blue-300 border border-blue-500/30'
                : 'bg-white/5 text-gray-300 hover:bg-white/10 hover:text-white border border-transparent'
            }`}
          >
            <Clock className="h-4 w-4 flex-shrink-0" />
            <span>Newest</span>
          </button>
          <button
            onClick={() => handleFiltersChange({ sortBy: 'popular' })}
            className={`w-full flex items-center space-x-2 px-3 py-2 rounded-lg font-medium transition-all text-sm ${
              filters.sortBy === 'popular'
                ? 'bg-orange-500/20 text-orange-300 border border-orange-500/30'
                : 'bg-white/5 text-gray-300 hover:bg-white/10 hover:text-white border border-transparent'
            }`}
          >
            <Flame className="h-4 w-4 flex-shrink-0" />
            <span>Most Popular</span>
          </button>
          {/* NEW: Trending Sort Option */}
          <button
            onClick={() => handleFiltersChange({ sortBy: 'trending' })}
            className={`w-full flex items-center space-x-2 px-3 py-2 rounded-lg font-medium transition-all text-sm ${
              filters.sortBy === 'trending'
                ? 'bg-green-500/20 text-green-300 border border-green-500/30'
                : 'bg-white/5 text-gray-300 hover:bg-white/10 hover:text-white border border-transparent'
            }`}
          >
            <TrendingUp className="h-4 w-4 flex-shrink-0" />
            <span>Trending</span>
          </button>
        </div>
      </div>

      {/* Desktop Filters */}
      <FilterPanel
        filters={filters}
        onFiltersChange={handleFiltersChange}
        showAllCategories={showAllCategories}
        onToggleCategories={() => setShowAllCategories(!showAllCategories)}
      />
    </div>
  );
}
