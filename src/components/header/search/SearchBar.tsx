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
          aria-label="Search"
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
                "bg-gray-50 dark:bg-gray-700",
                "border border-gray-200 dark:border-gray-600",
                "focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400",
                "text-gray-900 dark:text-gray-100",
                "placeholder-gray-500 dark:placeholder-gray-400"
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