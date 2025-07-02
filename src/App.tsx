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
import { useFilters } from './hooks/useFilters';
import { MainContent } from './components/MainContent';
import { Header } from './components/Header';
import { Sidebar } from './components/Sidebar';
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

  const { filters, setFilters, handleFiltersChange, clearAllFilters, hasActiveFilters, defaultFilters } = useFilters();

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

  

  return (
    <ErrorBoundary>
      <TopPromptsProvider>
        <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
          <Header 
            filters={filters}
            handleFiltersChange={handleFiltersChange}
            resetToDefault={resetToDefault}
            showMobileFilters={showMobileFilters}
            setShowMobileFilters={setShowMobileFilters}
            isAuthenticated={isAuthenticated}
            setShowAddPrompt={setShowAddPrompt}
            setShowAuthModal={setShowAuthModal}
          />

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
              <Sidebar 
                filters={filters}
                handleFiltersChange={handleFiltersChange}
                showAllCategories={showAllCategories}
                setShowAllCategories={setShowAllCategories}
              />

              <MainContent 
                prompts={prompts}
                loading={loading}
                error={error}
                hasMore={hasMore}
                filters={filters}
                observer={observer}
                isFetching={isFetching}
                handlePromptUpdate={handlePromptUpdate}
                navigateToTag={navigateToTag}
                highlightedPromptId={highlightedPromptId}
              />
            </div>
          </main>

          {/* Footer */}
          <footer className="border-t border-white/10 bg-black/20 backdrop-blur-md mt-16">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
              <div className="flex flex-col items-center justify-center space-y-4">
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
