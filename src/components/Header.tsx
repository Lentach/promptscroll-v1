import { Sparkles, Plus, Settings, ChevronDown, ChevronUp } from 'lucide-react';
import { SearchBar } from './SearchBar';
import type { FilterState } from '@/types';

interface HeaderProps {
  filters: FilterState;
  handleFiltersChange: (newFilters: Partial<FilterState>) => void;
  resetToDefault: () => void;
  showMobileFilters: boolean;
  setShowMobileFilters: (show: boolean) => void;
  isAuthenticated: boolean;
  setShowAddPrompt: (show: boolean) => void;
  setShowAuthModal: (show: boolean) => void;
}

export function Header({ 
  filters, 
  handleFiltersChange, 
  resetToDefault, 
  showMobileFilters, 
  setShowMobileFilters, 
  isAuthenticated, 
  setShowAddPrompt, 
  setShowAuthModal 
}: HeaderProps) {
  return (
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
  );
}
