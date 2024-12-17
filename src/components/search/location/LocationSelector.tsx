'use client'

import React from 'react';
import { cn } from '@/lib/utils';
import { ArrowsRightLeftIcon } from '@heroicons/react/24/outline';

interface LocationSelectorProps {
  type: 'from' | 'to';
}

const LocationSelector = ({ type }: LocationSelectorProps) => {
  return (
    <div className="relative">
      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
        {type === 'from' ? 'From' : 'To'}
      </label>
      <input
        type="text"
        placeholder={type === 'from' ? 'Enter departure city' : 'Enter arrival city'}
        className={cn(
          "w-full px-4 py-2 rounded-lg",
          "bg-gray-50 dark:bg-gray-700",
          "border border-gray-200 dark:border-gray-600",
          "focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400",
          "text-gray-900 dark:text-gray-100",
          "placeholder-gray-500 dark:placeholder-gray-400"
        )}
      />
      {type === 'from' && (
        <button 
          className={cn(
            "absolute right-0 top-8 -mr-6 z-10",
            "w-12 h-12 rounded-full",
            "bg-white dark:bg-gray-800",
            "border border-gray-200 dark:border-gray-700",
            "flex items-center justify-center",
            "text-gray-500 dark:text-gray-400",
            "hover:bg-gray-50 dark:hover:bg-gray-700",
            "transition-colors"
          )}
        >
          <ArrowsRightLeftIcon className="h-5 w-5" />
        </button>
      )}
    </div>
  );
};

export default LocationSelector;