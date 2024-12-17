import React from 'react';
import { cn } from '@/lib/utils';

const SearchButton = () => {
  return (
    <button
      type="submit"
      className={cn(
        "px-8 py-3 rounded-lg font-medium",
        "bg-gray-900 dark:bg-gray-100",
        "text-white dark:text-gray-900",
        "hover:bg-gray-800 dark:hover:bg-gray-200",
        "focus:outline-none focus:ring-2",
        "focus:ring-gray-900 dark:focus:ring-gray-100",
        "focus:ring-offset-2 dark:focus:ring-offset-gray-800",
        "transition-colors"
      )}
    >
      Search
    </button>
  );
};

export default SearchButton;