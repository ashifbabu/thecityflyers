'use client'

import React, { useState } from 'react';
import { MagnifyingGlassIcon, XMarkIcon } from '@heroicons/react/24/outline';
import { cn } from '@/lib/utils';
import IconButton from '@/components/ui/button/IconButton';
import MobileSearchOverlay from './MobileSearchOverlay';

const SearchBar = () => {
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [query, setQuery] = useState('');

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Searching for:', query);
  };

  return (
    <>
      {/* Mobile Search Icon */}
      <div className="lg:hidden">
        <IconButton 
          onClick={() => setIsSearchOpen(true)}
          aria-label="Open search"
        >
          <MagnifyingGlassIcon className="h-6 w-6 text-gray-700 dark:text-gray-300" />
        </IconButton>
      </div>

      {/* Desktop Search Input */}
      <div className="hidden lg:block w-full max-w-xl">
        <form onSubmit={handleSearch}>
          <div className="relative">
            <MagnifyingGlassIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search flights, hotels, visa services..."
              className={cn(
                "w-full pl-10 pr-4 py-2 rounded-lg",
                "bg-white dark:bg-black", // Background
                "border border-gray-300 dark:border-gray-600", // Normal border
                "focus:outline-none focus:ring-2 focus:ring-gray-300 dark:focus:ring-white", // Active border changes to white in dark mode
                "text-gray-900 dark:text-gray-100", // Text color
                "placeholder-gray-500 dark:placeholder-gray-400" // Placeholder color
              )}
            />
          </div>
        </form>
      </div>

      {/* Mobile Search Overlay */}
      <MobileSearchOverlay 
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
        query={query}
        setQuery={setQuery}
        onSearch={handleSearch}
      />
    </>
  );
};

export default SearchBar;
