'use client'

import React from 'react';
import { cn } from '@/lib/utils';
import { CalendarIcon } from '@heroicons/react/24/outline';

interface DateSelectorProps {
  type: 'departure' | 'return';
  disabled?: boolean;
}

const DateSelector = ({ type, disabled }: DateSelectorProps) => {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
        {type === 'departure' ? 'Departure' : 'Return'}
      </label>
      <div className="relative">
        <input
          type="date"
          disabled={disabled}
          className={cn(
            "w-full px-4 py-2 rounded-lg",
            "bg-gray-50 dark:bg-gray-700",
            "border border-gray-200 dark:border-gray-600",
            "focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400",
            "text-gray-900 dark:text-gray-100",
            disabled && "opacity-50 cursor-not-allowed"
          )}
        />
        <CalendarIcon className="absolute right-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400 pointer-events-none" />
      </div>
    </div>
  );
};

export default DateSelector;