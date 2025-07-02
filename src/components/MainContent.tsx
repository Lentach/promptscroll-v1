import { PromptGrid } from '@/features/prompts/components';
import { LoadingSpinner } from './LoadingSpinner';
import { Flame, TrendingUp } from 'lucide-react';
import type { Prompt, FilterState } from '@/types';

interface MainContentProps {
  prompts: Prompt[];
  loading: boolean;
  error: boolean;
  hasMore: boolean;
  filters: FilterState;
  observer: (node?: Element | null | undefined) => void;
  isFetching: boolean;
  handlePromptUpdate: (promptId: string, updates: Partial<Prompt>) => void;
  navigateToTag: (tag: string) => void;
  highlightedPromptId: string | null;
}

export function MainContent({ 
  prompts, 
  loading, 
  error, 
  hasMore, 
  filters, 
  observer, 
  isFetching, 
  handlePromptUpdate, 
  navigateToTag, 
  highlightedPromptId 
}: MainContentProps) {
  return (
    <div className="col-span-1 lg:col-span-3">
      <div className="hidden md:block mb-6">
        <h2 className="text-2xl sm:text-3xl font-bold mb-2 text-white">
          Discover Amazing AI Prompts
        </h2>
        <p className="text-gray-400 text-sm sm:text-base">
          Explore curated, high-quality prompts for ChatGPT, Claude, DALL-E and more
        </p>
      </div>

      {/* Prompts Grid */}
      <PromptGrid
        prompts={prompts}
        loading={loading}
        error={error}
        hasMore={hasMore}
        sortBy={filters.sortBy}
        totalCount={prompts.length}
        highlightedPromptId={highlightedPromptId}
        onPromptUpdate={handlePromptUpdate}
        onTagClick={navigateToTag}
      />

      {/* Infinite Scroll Trigger */}
      {hasMore && !loading && prompts.length > 0 && (
        <div ref={observer} className="flex justify-center py-8">
          {isFetching && (
            <div className="flex items-center space-x-2 text-gray-400">
              <LoadingSpinner />
              <span className="text-sm">Loading more prompts...</span>
            </div>
          )}
        </div>
      )}

      {/* End Messages */}
      {!hasMore && prompts.length > 0 && !loading && (
        <div className="text-center py-8">
          <div className="bg-white/5 backdrop-blur-md rounded-2xl p-6 max-w-md mx-auto border border-white/10">
            {filters.sortBy === 'newest' ? (
              <>
                <p className="text-gray-400 text-lg font-medium mb-2">
                  You've reached the end!
                </p>
                <p className="text-gray-500 text-sm">
                  You've seen all {prompts.length} available prompts. Check back later for
                  new content!
                </p>
              </>
            ) : filters.sortBy === 'popular' ? (
              <>
                <Flame className="h-8 w-8 text-orange-400 mx-auto mb-2" />
                <p className="text-orange-300 font-medium mb-1">
                  All {prompts.length} Prompts by Popularity
                </p>
                <p className="text-orange-400/80 text-sm">
                  You've seen all prompts sorted by popularity. Switch to "Newest" to see
                  them chronologically.
                </p>
              </>
            ) : (
              <>
                <TrendingUp className="h-8 w-8 text-green-400 mx-auto mb-2" />
                <p className="text-green-300 font-medium mb-1">
                  All {prompts.length} Trending Prompts
                </p>
                <p className="text-green-400/80 text-sm">
                  You've seen all trending prompts from the last 14 days. Check "Newest"
                  or "Popular" for more content.
                </p>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
