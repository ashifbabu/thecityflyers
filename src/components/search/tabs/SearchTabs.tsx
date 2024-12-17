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
            "text-gray-600 dark:text-gray-400",
            "hover:bg-gray-50 dark:hover:bg-gray-700/50",
            activeTab === id && [
              "bg-gray-50 dark:bg-gray-700/50",
              "border-b-2 border-gray-900 dark:border-gray-100"
            ]
          )}
        >
          <Icon className="h-5 w-5" />
          <span className="hidden sm:inline">{label}</span>
        </button>
      ))}
    </div>
  );
};

export default SearchTabs;