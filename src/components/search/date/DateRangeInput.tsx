'use client'

import React, { useState } from 'react';
import { cn } from '@/lib/utils';
import { ChevronDownIcon } from '@heroicons/react/24/outline';
import DatePicker from './DatePicker';

interface DateRangeInputProps {
  departure: Date | null;
  return: Date | null;
  onDepartureChange: (date: Date) => void;
  onReturnChange: (date: Date) => void;
  isRoundTrip: boolean;
}

const DateRangeInput = ({
  departure,
  return: returnDate,
  onDepartureChange,
  onReturnChange,
  isRoundTrip
}: DateRangeInputProps) => {
  const [isOpen, setIsOpen] = useState(false);

  const formatDate = (date: Date | null) => {
    if (!date) return 'Select date';
    return date.toLocaleDateString('en-US', {
      day: 'numeric',
      month: 'short',
      year: '2-digit'
    });
  };

  const formatDay = (date: Date | null) => {
    if (!date) return '';
    return date.toLocaleDateString('en-US', { weekday: 'long' });
  };

  return (
    <div className="relative">
      <div className="flex gap-4">
        {/* Departure Date */}
        <button
          onClick={() => setIsOpen(true)}
          className={cn(
            "flex-1 p-4 text-left",
            "bg-white dark:bg-gray-800",
            "border border-gray-200 dark:border-gray-700",
            "rounded-lg"
          )}
        >
          <div className="text-sm text-gray-500 dark:text-gray-400">Departure</div>
          <div className="mt-1 text-lg font-medium text-gray-900 dark:text-white">
            {formatDate(departure)}
          </div>
          <div className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            {formatDay(departure)}
          </div>
        </button>

        {/* Return Date */}
        <button
          onClick={() => setIsOpen(true)}
          disabled={!isRoundTrip}
          className={cn(
            "flex-1 p-4 text-left",
            "bg-white dark:bg-gray-800",
            "border border-gray-200 dark:border-gray-700",
            "rounded-lg",
            !isRoundTrip && "opacity-50"
          )}
        >
          <div className="text-sm text-gray-500 dark:text-gray-400">Return</div>
          <div className="mt-1 text-lg font-medium text-gray-900 dark:text-white">
            {isRoundTrip ? formatDate(returnDate) : 'One way'}
          </div>
          <div className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            {isRoundTrip ? formatDay(returnDate) : ''}
          </div>
        </button>
      </div>

      {/* Date Picker Popover */}
      {isOpen && (
        <DatePicker
          departure={departure}
          return={returnDate}
          onDepartureChange={onDepartureChange}
          onReturnChange={onReturnChange}
          isRoundTrip={isRoundTrip}
          onClose={() => setIsOpen(false)}
        />
      )}
    </div>
  );
};

export default DateRangeInput;