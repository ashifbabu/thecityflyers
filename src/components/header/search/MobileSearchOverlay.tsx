'use client'

import React from 'react';
import { XMarkIcon, MagnifyingGlassIcon } from '@heroicons/react/24/outline';
import { cn } from '@/lib/utils';
import IconButton from '@/components/ui/button/IconButton';

interface MobileSearchOverlayProps {
  isOpen: boolean;
  onClose: () => void;
  query: string;
  setQuery: (query: string) => void;
  onSearch: (e: React.FormEvent) => void;
}

const MobileSearchOverlay = ({
  isOpen,
  onClose,
  query,
  setQuery,
  onSearch
}: MobileSearchOverlayProps) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-x-0 top-16 z-50 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
      <form onSubmit={onSearch} className="container mx-auto px-4 py-3">
        <div className="relative flex items-center">
          <MagnifyingGlassIcon className="absolute left-3 h-5 w-5 text-gray-400" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search flights, hotels, visa services..."
            className={cn(
              "w-full pl-10 pr-10 py-2 rounded-lg",
              "bg-gray-50 dark:bg-gray-700",
              "border border-gray-200 dark:border-gray-600",
              "focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400",
              "text-gray-900 dark:text-gray-100",
              "placeholder-gray-500 dark:placeholder-gray-400"
            )}
            autoFocus
          />
          <IconButton 
            onClick={onClose}
            className="absolute right-2"
            aria-label="Close search"
          >
            <XMarkIcon className="h-5 w-5 text-gray-400" />
          </IconButton>
        </div>
      </form>
    </div>
  );
};

export default MobileSearchOverlay;