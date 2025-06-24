import React from 'react';
import { Filter, X, ChevronDown, ChevronUp } from 'lucide-react';
import { useCategories } from '../hooks/useCategories';
import type { FilterState, AIModel } from '../types';
import { DIFFICULTY_LEVELS } from '../constants';
import * as LucideIcons from 'lucide-react';

interface FilterPanelProps {
  filters: FilterState;
  onFiltersChange: (filters: Partial<FilterState>) => void;
  showAllCategories: boolean;
  onToggleCategories: () => void;
}

export function FilterPanel({
  filters,
  onFiltersChange,
  showAllCategories,
  onToggleCategories,
}: FilterPanelProps) {
  const { categories } = useCategories();

  const aiModels: { value: AIModel; label: string }[] = [
    { value: 'chatgpt', label: 'ChatGPT' },
    { value: 'claude', label: 'Claude' },
    { value: 'dalle', label: 'DALL-E' },
    { value: 'midjourney', label: 'Midjourney' },
    { value: 'gpt-4', label: 'GPT-4' },
    { value: 'gemini', label: 'Gemini' },
    { value: 'perplexity', label: 'Perplexity' },
    { value: 'grok', label: 'Grok' },
  ];

  const difficultyLevels = DIFFICULTY_LEVELS;

  const initialCategoriesCount = 6;
  const visibleCategories = showAllCategories
    ? categories
    : categories.slice(0, initialCategoriesCount);
  const hasMoreCategories = categories.length > initialCategoriesCount;

  const hasActiveFilters =
    filters.category || filters.difficulty || filters.model || filters.verified !== undefined;

  const clearAllFilters = () => {
    onFiltersChange({
      category: '',
      difficulty: undefined,
      model: undefined,
      verified: undefined,
    });
  };

  // Active check based on category id now
  const isCategoryActive = (categoryId: string) => {
    return filters.category === categoryId;
  };

  const handleCategorySelect = (categoryId: string) => {
    const isActive = isCategoryActive(categoryId);
    onFiltersChange({
      category: isActive ? '' : categoryId,
    });
  };

  return (
    <div className="bg-white/5 backdrop-blur-md rounded-2xl p-4 sm:p-6 border border-white/10">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-white flex items-center">
          <Filter className="h-5 w-5 mr-2 text-blue-500" />
          Filters
        </h3>
        {hasActiveFilters && (
          <button
            onClick={clearAllFilters}
            className="flex items-center space-x-1 bg-gradient-to-r from-red-500/20 to-red-600/20 hover:from-red-500/30 hover:to-red-600/30 text-red-300 hover:text-red-200 px-3 py-1 rounded-lg transition-all duration-300 text-sm border border-red-500/30 hover:border-red-400/40 hover:shadow-lg hover:shadow-red-500/20"
          >
            <X className="h-4 w-4" />
            <span className="hidden sm:inline">Clear All</span>
            <span className="sm:hidden">Clear</span>
          </button>
        )}
      </div>

      {/* AI Model Filter */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-300 mb-3">AI Model</label>
        <div className="grid grid-cols-2 gap-2">
          {aiModels.map((model) => (
            <button
              key={model.value}
              onClick={() =>
                onFiltersChange({
                  model: filters.model === model.value ? undefined : model.value,
                })
              }
              className={`px-2 sm:px-3 py-2 rounded-lg font-medium transition-all text-xs sm:text-sm whitespace-nowrap ${
                filters.model === model.value
                  ? 'bg-blue-500/20 text-blue-300 border border-blue-500/30'
                  : 'bg-white/5 text-gray-300 hover:bg-white/10 hover:text-white border border-transparent'
              }`}
            >
              {model.label}
            </button>
          ))}
        </div>
      </div>

      {/* Difficulty Filter - Fixed layout and full labels */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-300 mb-3">Difficulty</label>
        <div className="space-y-2">
          {difficultyLevels.map((level) => (
            <button
              key={level.value}
              onClick={() =>
                onFiltersChange({
                  difficulty: filters.difficulty === level.value ? undefined : level.value,
                })
              }
              className={`w-full px-3 py-2 rounded-lg font-medium transition-all text-sm flex items-center space-x-2 ${
                filters.difficulty === level.value
                  ? 'bg-purple-500/20 text-purple-300 border border-purple-500/30'
                  : 'bg-white/5 text-gray-300 hover:bg-white/10 hover:text-white border border-transparent'
              }`}
            >
              <span className={`${level.color} flex-shrink-0`}>●</span>
              <span>{level.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Verified Filter */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-300 mb-3">Quality</label>
        <button
          onClick={() =>
            onFiltersChange({
              verified: filters.verified === true ? undefined : true,
            })
          }
          className={`w-full sm:w-auto px-4 py-2 rounded-lg font-medium transition-all text-sm ${
            filters.verified === true
              ? 'bg-green-500/20 text-green-300 border border-green-500/30'
              : 'bg-white/5 text-gray-300 hover:bg-white/10 hover:text-white border border-transparent'
          }`}
        >
          ✓ Verified Only
        </button>
      </div>

      {/* Category Filters */}
      <div>
        <label className="block text-sm font-medium text-gray-300 mb-3">Categories</label>
        <div className="grid grid-cols-1 gap-2">
          {visibleCategories.map((category) => {
            const IconComponent =
              category.icon && (LucideIcons as any)[category.icon]
                ? (LucideIcons as any)[category.icon]
                : LucideIcons.Sparkles;
            const isActive = isCategoryActive(category.id);

            return (
              <button
                key={category.id}
                onClick={() => handleCategorySelect(category.id)}
                className={`flex items-center space-x-3 p-3 rounded-lg font-medium transition-all ${
                  isActive
                    ? 'bg-blue-500/20 text-blue-300 border border-blue-500/30'
                    : 'bg-white/5 text-gray-300 hover:bg-white/10 hover:text-white border border-transparent'
                }`}
              >
                <IconComponent className="h-4 w-4 flex-shrink-0" />
                <span className="text-sm truncate">{category.name}</span>
              </button>
            );
          })}
        </div>

        {/* Show More/Less Button */}
        {hasMoreCategories && (
          <div className="mt-4 flex justify-center">
            <button
              onClick={onToggleCategories}
              className="flex items-center space-x-2 px-4 py-2 bg-white/5 hover:bg-white/10 rounded-lg font-medium transition-colors text-gray-300 hover:text-white border border-white/10"
            >
              <span className="text-sm">
                {showAllCategories
                  ? `Show Less`
                  : `Show ${categories.length - initialCategoriesCount} More`}
              </span>
              {showAllCategories ? (
                <ChevronUp className="h-4 w-4" />
              ) : (
                <ChevronDown className="h-4 w-4" />
              )}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
