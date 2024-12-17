'use client'

import React, { useState } from 'react';
import { cn } from '@/lib/utils';
import { UserGroupIcon } from '@heroicons/react/24/outline';

const PassengerSelector = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="relative">
      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
        Travelers & Booking Class
      </label>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          "w-full px-4 py-2 rounded-lg text-left",
          "bg-gray-50 dark:bg-gray-700",
          "border border-gray-200 dark:border-gray-600",
          "focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400",
          "text-gray-900 dark:text-gray-100"
        )}
      >
        <div className="flex items-center gap-2">
          <UserGroupIcon className="h-5 w-5 text-gray-400" />
          <span>1 Traveler, Economy</span>
        </div>
      </button>

      {isOpen && (
        <div className={cn(
          "absolute top-full left-0 right-0 mt-2",
          "bg-white dark:bg-gray-800",
          "border border-gray-200 dark:border-gray-700",
          "rounded-lg shadow-lg",
          "z-50"
        )}>
          {/* Passenger selection content */}
        </div>
      )}
    </div>
  );
};

export default PassengerSelector;