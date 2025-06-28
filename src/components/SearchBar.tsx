import React, { useState, useRef, useEffect } from 'react';
import { Search, X, Clock, TrendingUp, Sparkles, Zap } from 'lucide-react';
import { useLocalStorage } from '../hooks/useLocalStorage';

interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
}

export function SearchBar({
  value,
  onChange,
  placeholder = 'Search prompts...',
  className = '',
}: SearchBarProps) {
  const [isFocused, setIsFocused] = useState(false);
  const [recentSearches, setRecentSearches] = useLocalStorage<string[]>(
    'promptscroll-recent-searches',
    [],
  );
  const [showSuggestions, setShowSuggestions] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleSubmit = (searchTerm: string) => {
    if (searchTerm.trim()) {
      // Add to recent searches (avoid duplicates)
      const newRecentSearches = [
        searchTerm.trim(),
        ...recentSearches.filter((s) => s !== searchTerm.trim()),
      ].slice(0, 5); // Keep only 5 recent searches

      setRecentSearches(newRecentSearches);
      onChange(searchTerm.trim());
      setShowSuggestions(false);
      inputRef.current?.blur();
    }
  };

  const handleClear = () => {
    onChange('');
    setShowSuggestions(false);
    inputRef.current?.focus();
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleSubmit(value);
    } else if (e.key === 'Escape') {
      e.preventDefault();
      setShowSuggestions(false);
      inputRef.current?.blur();
    }
  };

  // FIXED: Better input change handler
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    onChange(newValue);
  };

  // Close suggestions when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Node;
      if (inputRef.current && !inputRef.current.closest('.search-container')?.contains(target)) {
        setShowSuggestions(false);
        setIsFocused(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className={`relative search-container ${className}`}>
      <div className="relative">
        {/* SIMPLIFIED search input - removed complex styling that might interfere */}
        <div className="relative bg-white/10 backdrop-blur-md border border-white/20 rounded-xl overflow-hidden transition-all duration-300 hover:border-white/30 focus-within:border-blue-500/50 focus-within:bg-white/15">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none z-10" />

          <input
            ref={inputRef}
            type="text"
            value={value}
            onChange={handleInputChange}
            onKeyDown={handleKeyDown}
            onFocus={() => {
              setIsFocused(true);
              setShowSuggestions(true);
            }}
            onBlur={() => {
              // Delay hiding suggestions to allow clicks
              setTimeout(() => {
                if (!inputRef.current?.matches(':focus')) {
                  setIsFocused(false);
                }
              }, 150);
            }}
            placeholder={placeholder}
            className="w-full pl-10 pr-10 py-3 bg-transparent text-white placeholder-gray-400 outline-none border-none text-sm sm:text-base"
            autoComplete="off"
            spellCheck="false"
          />

          {value && (
            <button
              type="button"
              onClick={handleClear}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 p-1 hover:bg-white/10 rounded-full transition-colors z-10"
            >
              <X className="h-4 w-4 text-gray-400 hover:text-white" />
            </button>
          )}
        </div>
      </div>

      {/* FIXED Search Suggestions - better positioning and event handling */}
      {showSuggestions && (isFocused || value) && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-slate-900/90 backdrop-blur-xl border border-white/10 rounded-xl shadow-2xl z-[60] max-h-80 overflow-y-auto">
          {/* Recent Searches */}
          {recentSearches.length > 0 && (
            <div className="p-3 border-b border-white/10">
              <div className="flex items-center space-x-2 mb-2">
                <Clock className="h-4 w-4 text-gray-400" />
                <span className="text-sm font-medium text-gray-300">Recent</span>
              </div>
              <div className="space-y-1">
                {recentSearches.map((search, index) => (
                  <button
                    key={index}
                    type="button"
                    onMouseDown={(e) => {
                      e.preventDefault();
                      handleSubmit(search);
                    }}
                    className="w-full text-left px-3 py-2 text-sm text-gray-300 hover:bg-white/10 rounded-lg transition-colors flex items-center space-x-2"
                  >
                    <Clock className="h-3 w-3 text-gray-500" />
                    <span>{search}</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Footer */}
          <div className="px-3 py-2 border-t border-white/10 bg-white/5">
            <p className="text-xs text-gray-500 text-center">
              Press Enter to search • ESC to close
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
