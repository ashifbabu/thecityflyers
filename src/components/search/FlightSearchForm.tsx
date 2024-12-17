'use client'

import React from 'react';
import { cn } from '@/lib/utils';
import SearchTabs from './tabs/SearchTabs';
import SearchContent from './content/SearchContent';

const FlightSearchForm = () => {
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Searching for flights...');
  };

  return (
    <form onSubmit={handleSearch} className="w-full">
      <div className={cn(
        "bg-white dark:bg-gray-800",
        "border-b border-gray-200 dark:border-gray-700"
      )}>
        <div className="w-full">
          <SearchTabs />
          <SearchContent />
        </div>
      </div>
    </form>
  );
};

export default FlightSearchForm;