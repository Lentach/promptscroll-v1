import React, { useState, useCallback, useEffect, useRef } from 'react';
import {
  Sparkles,
  Plus,
  TrendingUp,
  Clock,
  Flame,
  ExternalLink,
  ChevronDown,
  ChevronUp,
  ThumbsUp,
  ThumbsDown,
  Filter,
  X,
  Settings,
} from 'lucide-react';
import { AccountBar } from '@/features/auth/components/AccountBar';
import { usePrompts } from '@/features/prompts/hooks/usePrompts';
import { useCategories } from './hooks/useCategories';
import { useInfiniteScroll } from './hooks/useInfiniteScroll';
import { useDebounce } from './hooks/useDebounce';
import { useLocalStorage } from './hooks/useLocalStorage';
import { PromptGrid } from '@/features/prompts/components';
import { SearchBar } from './components/SearchBar';
import { FilterPanel } from './components/FilterPanel';
import { LoadingSpinner } from './components/LoadingSpinner';
import { AddPromptForm } from './components/AddPromptForm';
import { ErrorBoundary } from './components/ErrorBoundary';
import type { FilterState, Prompt, SortOption } from './types';
import { TopPromptsProvider } from '@/features/prompts/hooks/useTopPrompts';
import { AuthModal } from '@/features/auth/components/AuthModal';
import { useAuth } from '@/features/auth/hooks/useAuth';

function App() {
  // UI State
  const [showAddPrompt, setShowAddPrompt] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [showAllCategories, setShowAllCategories] = useState(false);
  const [highlightedPromptId, setHighlightedPromptId] = useState<string | null>(null);

  // Mobile filters state
  const [showMobileFilters, setShowMobileFilters] = useState(false);

  // DODANA referencja do głównego obszaru zawartości
  const mainContentRef = useRef<HTMLDivElement>(null);

  // ZMIENIONY Default filter state - POPULAR JAKO DOMYŚLNE
  const defaultFilters: FilterState = {
    category: '',
    search: '',
    sortBy: 'popular', // ZMIENIONE Z 'newest' NA 'popular'
  };

  // Filter State with localStorage persistence
  const [filters, setFilters] = useLocalStorage<FilterState>(
    'promptscroll-filters',
    defaultFilters,
  );

  // Debounced search for better performance
  const debouncedSearch = useDebounce(filters.search, 300);

  const { categories } = useCategories();

  // Main prompts with proper infinite scroll
  const { prompts, loading, error, hasMore, loadMore, refresh, setPrompts } = usePrompts({
    ...filters,
    search: debouncedSearch,
  });

  const { isAuthenticated } = useAuth();

  // DODANY useEffect do przewijania do podświetlonego prompta
  useEffect(() => {
    if (highlightedPromptId && !loading && prompts.length > 0) {
      console.log('🎯 Attempting to scroll to highlighted prompt:', highlightedPromptId);

      // Krótkie opóźnienie aby upewnić się, że DOM został zaktualizowany
      const scrollTimeout = setTimeout(() => {
        const promptElement = document.getElementById(`prompt-${highlightedPromptId}`);

        if (promptElement) {
          console.log('✅ Found prompt element, scrolling to it');
          promptElement.scrollIntoView({
            behavior: 'smooth',
            block: 'center',
          });

          // Usuń podświetlenie po 3 sekundach
          setTimeout(() => {
            console.log('🔄 Removing highlight from prompt:', highlightedPromptId);
            setHighlightedPromptId(null);
          }, 3000);
        } else {
          console.log('❌ Prompt element not found, scrolling to top');
          window.scrollTo({ top: 0, behavior: 'smooth' });
          setHighlightedPromptId(null);
        }
      }, 500);

      return () => clearTimeout(scrollTimeout);
    }
  }, [highlightedPromptId, loading, prompts]);

  // Infinite scroll callback
  const infiniteScrollCallback = useCallback(() => {
    if (hasMore && !loading) {
      loadMore();
    }
  }, [loadMore, hasMore, loading]);

  const { observer, isFetching, resetFetching } = useInfiniteScroll(infiniteScrollCallback, {
    enabled: true,
  });

  // Reset fetching state when loading completes
  useEffect(() => {
    if (!loading && isFetching) {
      resetFetching();
    }
  }, [loading, isFetching, resetFetching]);

  // Event handlers
  const handleFiltersChange = useCallback(
    (newFilters: Partial<FilterState>) => {
      setFilters((prev) => ({ ...prev, ...newFilters }));
    },
    [setFilters],
  );

  const handleAddPromptSuccess = useCallback(() => {
    refresh();
    setShowAddPrompt(false);
  }, [refresh]);

  const handlePromptUpdate = useCallback(
    (promptId: string, updates: Partial<Prompt>) => {
      setPrompts((prev) => prev.map((p) => (p.id === promptId ? { ...p, ...updates } : p)));
    },
    [setPrompts],
  );

  // RESET FUNCTIONALITY
  const resetToDefault = useCallback(() => {
    console.log('🔄 Resetting PromptScroll to default state...');

    setFilters(defaultFilters);
    setShowAllCategories(false);
    setHighlightedPromptId(null);
    setShowAddPrompt(false);
    setShowMobileFilters(false);

    localStorage.removeItem('promptscroll-recent-searches');
    refresh();
    window.scrollTo({ top: 0, behavior: 'smooth' });

    console.log('✅ Reset complete!');
  }, [setFilters, refresh]);

  // CLEAR FILTERS FUNCTIONALITY - NEW
  const clearAllFilters = useCallback(() => {
    console.log('🧹 Clearing all filters...');

    setFilters(defaultFilters);
    setShowMobileFilters(false);

    console.log('✅ Filters cleared!');
  }, [setFilters]);

  // TAG NAVIGATION
  const navigateToTag = useCallback(
    (tag: string) => {
      console.log('🏷️ Navigating to tag:', tag);

      const lower = tag.toLowerCase();
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

      if (difficulties.includes(lower)) {
        setFilters((prev) => ({
          ...prev,
          difficulty: lower as any,
          model: undefined,
          category: '',
          search: '',
        }));
      } else if (models.includes(lower)) {
        setFilters((prev) => ({
          ...prev,
          model: lower as any,
          difficulty: undefined,
          category: '',
          search: '',
        }));
      } else {
        // Check if tag matches a category name
        const matchedCat = categories.find((c) => c.name.toLowerCase() === lower);
        if (matchedCat) {
          setFilters((prev) => ({
            ...prev,
            category: matchedCat.id,
            search: '',
            model: undefined,
            difficulty: undefined,
          }));
        } else {
          // default: treat as text search
          setFilters({ category: '', search: tag, sortBy: 'popular' });
        }
      }

      setShowAllCategories(false);
      setHighlightedPromptId(null);
      setShowMobileFilters(false);

      window.scrollTo({ top: 0, behavior: 'smooth' });

      console.log('✅ Tag navigation complete!');
    },
    [setFilters, categories],
  );

  // CHECK IF FILTERS ARE ACTIVE - ZAKTUALIZOWANE DLA NOWEGO DOMYŚLNEGO
  const hasActiveFilters = useCallback(() => {
    return (
      filters.category !== '' ||
      filters.search !== '' ||
      filters.sortBy !== 'popular' || // ZMIENIONE Z 'newest' NA 'popular'
      filters.difficulty !== undefined ||
      filters.model !== undefined ||
      filters.verified !== undefined
    );
  }, [filters]);

  return (
    <ErrorBoundary>
      <TopPromptsProvider>
        <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
          {/* Header - FIXED z-index to be below mobile overlay */}
          <header className="border-b border-white/10 backdrop-blur-md bg-black/20 sticky top-0 z-30">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="flex justify-between items-center h-16">
                {/* Logo and Title */}
                <button
                  onClick={resetToDefault}
                  className="flex items-center space-x-2 hover:opacity-80 transition-opacity group flex-shrink-0"
                  title="Reset to homepage"
                >
                  <Sparkles className="h-6 w-6 sm:h-8 sm:w-8 text-blue-500 group-hover:scale-110 transition-transform" />
                  <h1 className="text-lg sm:text-2xl font-bold bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
                    PromptScroll
                  </h1>
                </button>

                {/* Desktop Search Bar - ALWAYS FUNCTIONAL */}
                <div className="hidden lg:flex flex-1 max-w-md mx-8">
                  <SearchBar
                    value={filters.search}
                    onChange={(value) => handleFiltersChange({ search: value })}
                    placeholder="Search amazing prompts..."
                    className="w-full"
                  />
                </div>

                {/* Header Actions */}
                <div className="flex items-center space-x-2">
                  {/* Mobile Settings Toggle */}
                  <button
                    onClick={() => setShowMobileFilters(!showMobileFilters)}
                    className="lg:hidden flex items-center space-x-1 bg-white/10 hover:bg-white/20 px-3 py-2 rounded-lg transition-colors text-white"
                  >
                    <Settings className="h-4 w-4" />
                    <span className="text-sm">Settings</span>
                    {showMobileFilters ? (
                      <ChevronUp className="h-4 w-4" />
                    ) : (
                      <ChevronDown className="h-4 w-4" />
                    )}
                  </button>

                  {/* Add Prompt Button */}
                  <button
                    onClick={() => {
                      if (isAuthenticated) {
                        setShowAddPrompt(true);
                      } else {
                        setShowAuthModal(true);
                      }
                    }}
                    className="flex items-center space-x-1 sm:space-x-2 bg-gradient-to-r from-blue-500 to-purple-500 px-2 sm:px-4 py-2 rounded-lg hover:opacity-90 transition-opacity font-medium text-white text-sm sm:text-base whitespace-nowrap"
                  >
                    <Plus className="h-4 w-4 flex-shrink-0" />
                    <span className="hidden xs:inline sm:inline">Add Prompt</span>
                    <span className="xs:hidden sm:hidden">Add</span>
                  </button>
                </div>
              </div>
            </div>
          </header>

          {/* Account bar showing avatar + logout when authenticated */}
          <AccountBar />

          {/* FIXED Mobile Settings Overlay - Higher z-index and proper positioning */}
          {showMobileFilters && (
            <div className="lg:hidden fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-start justify-center pt-20">
              <div className="bg-slate-900/95 backdrop-blur-xl rounded-2xl border border-white/10 w-full max-w-md mx-4 max-h-[80vh] overflow-y-auto">
                {/* Mobile Settings Header */}
                <div className="flex items-center justify-between p-4 border-b border-white/10">
                  <h3 className="text-lg font-semibold text-white flex items-center">
                    <Settings className="h-5 w-5 mr-2 text-blue-500" />
                    Settings & Search
                  </h3>
                  <button
                    onClick={() => setShowMobileFilters(false)}
                    className="p-2 hover:bg-white/10 rounded-lg transition-colors text-gray-400 hover:text-white"
                  >
                    <X className="h-5 w-5" />
                  </button>
                </div>

                {/* Mobile Settings Content */}
                <div className="p-4 space-y-6">
                  {/* Search bar removed from settings as per mobile UI optimization */}

                  {/* Mobile Filters Panel - REMOVED SORT OPTIONS FROM HERE */}
                  <FilterPanel
                    filters={filters}
                    onFiltersChange={handleFiltersChange}
                    showAllCategories={showAllCategories}
                    onToggleCategories={() => setShowAllCategories(!showAllCategories)}
                  />

                  {/* Mobile Action Buttons */}
                  <div className="pt-4 border-t border-white/10 space-y-3">
                    {/* UPDATED Clear Filters Button - RED LIKE DISLIKE */}
                    {hasActiveFilters() && (
                      <button
                        onClick={clearAllFilters}
                        className="w-full bg-gradient-to-r from-red-500/20 to-red-600/20 hover:from-red-500/30 hover:to-red-600/30 text-red-300 hover:text-red-200 font-medium py-3 rounded-lg transition-all duration-300 border border-red-500/30 hover:border-red-400/40 flex items-center justify-center space-x-2 hover:shadow-lg hover:shadow-red-500/20"
                      >
                        <X className="h-4 w-4" />
                        <span>Clear All Filters</span>
                      </button>
                    )}

                    {/* Apply Settings Button */}
                    <button
                      onClick={() => setShowMobileFilters(false)}
                      className="w-full bg-gradient-to-r from-blue-500 to-purple-500 text-white font-medium py-3 rounded-lg hover:opacity-90 transition-opacity"
                    >
                      Apply Settings
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* NEW: Mobile Clear Filters Bar - Shows when filters are active and settings are closed */}
          {!showMobileFilters && hasActiveFilters() && (
            <div className="lg:hidden bg-gradient-to-r from-blue-500/10 to-purple-500/10 border-b border-blue-500/20 px-4 py-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2 text-sm text-blue-300">
                  <Filter className="h-4 w-4" />
                  <span>Filters active</span>
                  {filters.search && (
                    <span className="bg-blue-500/20 px-2 py-1 rounded-full text-xs">
                      "{filters.search}"
                    </span>
                  )}
                  {filters.category && (
                    <span className="bg-purple-500/20 px-2 py-1 rounded-full text-xs">
                      {filters.category}
                    </span>
                  )}
                </div>
                {/* UPDATED Mobile Clear Button - RED LIKE DISLIKE */}
                <button
                  onClick={clearAllFilters}
                  className="flex items-center space-x-1 bg-gradient-to-r from-red-500/20 to-red-600/20 hover:from-red-500/30 hover:to-red-600/30 text-red-300 hover:text-red-200 px-3 py-1 rounded-lg transition-all duration-300 text-sm border border-red-500/30 hover:border-red-400/40 hover:shadow-lg hover:shadow-red-500/20"
                >
                  <X className="h-3 w-3" />
                  <span>Clear</span>
                </button>
              </div>
            </div>
          )}

          {/* Main Content - DODANA referencja */}
          <main ref={mainContentRef} className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
              {/* Desktop Sidebar - HIDDEN ON MOBILE */}
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

              {/* Main Feed - FULL WIDTH ON MOBILE */}
              <div className="col-span-1 lg:col-span-3">
                <div className="hidden md:block mb-6">
                  <h2 className="text-2xl sm:text-3xl font-bold mb-2 text-white">
                    Discover Amazing AI Prompts
                  </h2>
                  <p className="text-gray-400 text-sm sm:text-base">
                    Explore curated, high-quality prompts for ChatGPT, Claude, DALL-E and more
                  </p>
                </div>

                {/* Mobile Sort & Search */}
                <div className="lg:hidden mb-6">
                  <div className="bg-white/5 backdrop-blur-md rounded-2xl p-4 border border-white/10">
                    {/* Mobile SearchBar */}
                    <SearchBar
                      value={filters.search}
                      onChange={(value) => handleFiltersChange({ search: value })}
                      placeholder="Search amazing prompts..."
                      className="w-full mb-4"
                    />

                    {/* Sort header */}
                    <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
                      <TrendingUp className="h-5 w-5 mr-2 text-blue-500" />
                      Sort By
                    </h3>

                    {/* Sort buttons grid */}
                    <div className="grid grid-cols-3 gap-3">
                      <button
                        onClick={() => handleFiltersChange({ sortBy: 'newest' })}
                        className={`flex items-center justify-center space-x-2 px-3 py-3 rounded-xl font-medium transition-all text-sm ${
                          filters.sortBy === 'newest'
                            ? 'bg-blue-500/20 text-blue-300 border border-blue-500/30 shadow-lg shadow-blue-500/20'
                            : 'bg-white/5 text-gray-300 hover:bg-white/10 hover:text-white border border-transparent'
                        }`}
                      >
                        <Clock className="h-4 w-4 flex-shrink-0" />
                        <span>Newest</span>
                      </button>
                      <button
                        onClick={() => handleFiltersChange({ sortBy: 'popular' })}
                        className={`flex items-center justify-center space-x-2 px-3 py-3 rounded-xl font-medium transition-all text-sm ${
                          filters.sortBy === 'popular'
                            ? 'bg-orange-500/20 text-orange-300 border border-orange-500/30 shadow-lg shadow-orange-500/20'
                            : 'bg-white/5 text-gray-300 hover:bg-white/10 hover:text-white border border-transparent'
                        }`}
                      >
                        <Flame className="h-4 w-4 flex-shrink-0" />
                        <span>Popular</span>
                      </button>
                      {/* NEW: Mobile Trending Button */}
                      <button
                        onClick={() => handleFiltersChange({ sortBy: 'trending' })}
                        className={`flex items-center justify-center space-x-2 px-3 py-3 rounded-xl font-medium transition-all text-sm ${
                          filters.sortBy === 'trending'
                            ? 'bg-green-500/20 text-green-300 border border-green-500/30 shadow-lg shadow-green-500/20'
                            : 'bg-white/5 text-gray-300 hover:bg-white/10 hover:text-white border border-transparent'
                        }`}
                      >
                        <TrendingUp className="h-4 w-4 flex-shrink-0" />
                        <span>Trending</span>
                      </button>
                    </div>
                  </div>
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
            </div>
          </main>

          {/* Footer */}
          <footer className="border-t border-white/10 bg-black/20 backdrop-blur-md mt-16">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
              <div className="flex flex-col items-center justify-center space-y-4">
                <a
                  href="https://bolt.new"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg hover:opacity-90 transition-opacity text-white font-medium text-sm sm:text-base"
                >
                  <Sparkles className="h-4 w-4 flex-shrink-0" />
                  <span>Built on Bolt</span>
                  <ExternalLink className="h-3 w-3 flex-shrink-0" />
                </a>

                <div className="text-center">
                  <p className="text-gray-400 text-xs sm:text-sm">
                    PromptScroll - Discover, share, and perfect AI prompts
                  </p>
                </div>
              </div>
            </div>
          </footer>

          {/* Add Prompt Modal */}
          <AddPromptForm
            isOpen={showAddPrompt}
            onClose={() => setShowAddPrompt(false)}
            onSuccess={handleAddPromptSuccess}
          />
          <AuthModal isOpen={showAuthModal} onClose={() => setShowAuthModal(false)} />
        </div>
      </TopPromptsProvider>
    </ErrorBoundary>
  );
}

export default App;
