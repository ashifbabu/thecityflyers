'use client'

import React from 'react';
import { cn } from '@/lib/utils';
import { PaperAirplaneIcon, BuildingOfficeIcon, DocumentTextIcon, CreditCardIcon } from '@heroicons/react/24/outline';

const tabs = [
  { id: 'flight', label: 'Flight', icon: PaperAirplaneIcon },
  { id: 'hotel', label: 'Hotel', icon: BuildingOfficeIcon },
  { id: 'visa', label: 'Visa', icon: DocumentTextIcon },
  { id: 'esim', label: 'eSim', icon: CreditCardIcon },
] as const;

const SearchTabs = () => {
  const [activeTab, setActiveTab] = React.useState('flight');

  return (
    <div className="grid grid-cols-4">
      {tabs.map(({ id, label, icon: Icon }) => (
        <button
          key={id}
          onClick={() => setActiveTab(id)}
          className={cn(
            "flex items-center justify-center gap-2 p-4",
            "text-sm font-medium transition-all",
            "bg-white dark:bg-black", // Fully white for light mode, fully black for dark mode
            activeTab === id && [
              "border-b-2",
              "border-black dark:border-white",
              "bg-gray-100 dark:bg-gray-900"
            ],
            "text-black dark:text-white", // Text color adapts to background
            "hover:bg-gray-200 dark:hover:bg-gray-800" // Hover effect for interaction
          )}>
          <Icon className="h-5 w-5" />
          <span className="hidden sm:inline">{label}</span>
        </button>
      ))}
    </div>
  );
};

export default SearchTabs;