import React from 'react';
import { PromptCard } from './PromptCard';
import { LoadingSpinner } from '@/components/LoadingSpinner';
import { AlertCircle, Flame, Clock, Sparkles, TrendingUp } from 'lucide-react';
import type { Prompt, SortOption } from '@/types';

interface PromptGridProps {
  prompts: Prompt[];
  loading: boolean;
  error: string | null;
  hasMore: boolean;
  sortBy: SortOption;
  totalCount: number;
  highlightedPromptId?: string | null;
  onPromptUpdate?: (promptId: string, updates: Partial<Prompt>) => void;
  onTagClick?: (tag: string) => void;
}

export function PromptGrid({
  prompts,
  loading,
  error,
  hasMore,
  sortBy,
  totalCount,
  highlightedPromptId,
  onPromptUpdate,
  onTagClick,
}: PromptGridProps) {
  if (error) {
    return (
      <div className="bg-gradient-to-br from-red-500/10 to-pink-500/10 border border-red-500/20 rounded-3xl p-8 text-center relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-red-500/5 to-pink-500/5 animate-pulse" />
        <div className="relative z-10">
          <div className="w-16 h-16 bg-gradient-to-br from-red-500/20 to-pink-500/20 rounded-full flex items-center justify-center mx-auto mb-4 animate-bounce">
            <AlertCircle className="h-8 w-8 text-red-400" />
          </div>
          <h3 className="text-lg font-semibold text-red-300 mb-2">Error Loading Prompts</h3>
          <p className="text-red-400 text-sm">{error}</p>
        </div>
      </div>
    );
  }

  if (loading && prompts.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 relative">
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-1/4 left-1/4 w-32 h-32 bg-blue-500/10 rounded-full animate-pulse" />
          <div className="absolute top-3/4 right-1/4 w-24 h-24 bg-purple-500/10 rounded-full animate-pulse delay-300" />
          <div className="absolute top-1/2 left-1/2 w-16 h-16 bg-pink-500/10 rounded-full animate-pulse delay-700" />
        </div>
        <div className="relative z-10 text-center">
          <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center mx-auto mb-4 animate-spin">
            <Sparkles className="h-8 w-8 text-white" />
          </div>
          <LoadingSpinner size="lg" className="mb-4" />
          <p className="text-gray-400 text-lg font-medium animate-pulse">Loading amazing prompts...</p>
          <p className="text-gray-500 text-sm mt-2">Discovering the best AI prompts for you</p>
        </div>
      </div>
    );
  }

  if (!loading && prompts.length === 0) {
    return (
      <div className="text-center py-16 relative">
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-1/3 left-1/3 w-20 h-20 bg-gray-500/5 rounded-full animate-pulse" />
          <div className="absolute bottom-1/3 right-1/3 w-16 h-16 bg-gray-500/5 rounded-full animate-pulse delay-500" />
        </div>
        <div className="bg-gradient-to-br from-white/5 to-white/10 backdrop-blur-xl rounded-3xl p-8 max-w-md mx-auto border border-white/10 relative z-10">
          <div className="w-16 h-16 bg-gradient-to-br from-gray-500/20 to-slate-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
            <AlertCircle className="h-8 w-8 text-gray-400" />
          </div>
          <h3 className="text-lg font-semibold text-white mb-2">No Prompts Found</h3>
          <p className="text-gray-400 text-sm">Try adjusting your search terms or filters to find what you're looking for.</p>
          <div className="mt-4 space-y-2">
            <p className="text-xs text-gray-500">Try searching for:</p>
            <div className="flex flex-wrap gap-2 justify-center">
              {['business', 'creative', 'coding', 'marketing'].map((s) => (
                <button
                  key={s}
                  onClick={() => onTagClick?.(s)}
                  className="px-3 py-1 bg-blue-500/20 text-blue-300 rounded-full text-xs hover:bg-blue-500/30 transition-colors"
                >
                  {s}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {prompts.length > 0 && (
        <div className="hidden md:flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-0 bg-gradient-to-r from-white/5 to-white/10 backdrop-blur-xl rounded-2xl p-4 border border-white/10">
          <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-3 text-sm text-gray-300">
            <span className="font-medium text-white flex items-center space-x-2">
              <TrendingUp className="h-4 w-4 text-blue-400" />
              <span>Showing {prompts.length} of {totalCount} prompts</span>
            </span>
            <div className="flex items-center space-x-3 mt-1 sm:mt-0">
              <span className="hidden sm:inline text-gray-500">•</span>
              <div className="flex items-center space-x-2 bg-white/10 rounded-full px-3 py-1">
                {sortBy === 'newest' ? (
                  <><Clock className="h-4 w-4 text-blue-400 animate-pulse" /><span className="text-blue-300 font-medium">Newest first</span></>
                ) : sortBy === 'popular' ? (
                  <><Flame className="h-4 w-4 text-orange-400 animate-pulse" /><span className="text-orange-300 font-medium">Most popular first</span></>
                ) : (
                  <><TrendingUp className="h-4 w-4 text-green-400 animate-pulse" /><span className="text-green-300 font-medium">Trending (14 days)</span></>
                )}
              </div>
              {hasMore && (
                <>
                  <span className="hidden sm:inline text-gray-500">•</span>
                  <span className="text-purple-400 text-xs sm:text-sm bg-purple-500/20 rounded-full px-3 py-1 border border-purple-500/30 animate-pulse">
                    <span className="hidden sm:inline">Scroll for more</span>
                    <span className="sm:hidden">More below ↓</span>
                  </span>
                </>
              )}
            </div>
          </div>
        </div>
      )}
      <div className="grid grid-cols-1 gap-6">
        {prompts.map((prompt, idx) => (
          <div
            key={prompt.id}
            id={`prompt-${prompt.id}`}
            className={`transition-all duration-1000 ease-out ${highlightedPromptId === prompt.id ? 'ring-2 ring-blue-500 ring-opacity-50 bg-blue-500/5 rounded-3xl scale-105 shadow-2xl shadow-blue-500/20' : ''}`}
            style={{ animationDelay: `${idx * 100}ms`, animation: 'fadeInUp 0.6s ease-out forwards' }}
          >
            <PromptCard
              prompt={prompt}
              isTopPrompt={sortBy === 'popular' && idx < 10}
              onUpdate={onPromptUpdate}
              onTagClick={onTagClick}
            />
          </div>
        ))}
      </div>
      {loading && prompts.length > 0 && (
        <div className="flex justify-center py-8">
          <div className="flex items-center space-x-3 text-gray-400 bg-gradient-to-r from-white/5 to-white/10 backdrop-blur-xl rounded-2xl px-6 py-4 border border-white/10">
            <div className="relative">
              <LoadingSpinner />
              <div className="absolute inset-0 animate-ping">
                <LoadingSpinner className="opacity-20" />
              </div>
            </div>
            <span className="text-sm font-medium">Loading more amazing prompts...</span>
          </div>
        </div>
      )}
    </div>
  );
} 