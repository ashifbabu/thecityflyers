'use client'

import React from 'react';
import { cn } from '@/lib/utils';
import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/24/outline';

interface DatePickerProps {
  departure: Date | null;
  return: Date | null;
  onDepartureChange: (date: Date) => void;
  onReturnChange: (date: Date) => void;
  isRoundTrip: boolean;
  onClose: () => void;
}

const DatePicker = ({
  departure,
  return: returnDate,
  onDepartureChange,
  onReturnChange,
  isRoundTrip,
  onClose
}: DatePickerProps) => {
  const today = new Date();
  const [currentMonth, setCurrentMonth] = React.useState(today);

  const renderCalendar = (month: Date) => {
    // Calendar rendering logic here
    // This is a simplified version - you'll need to implement the full calendar logic
    return (
      <div className="p-4">
        <div className="flex justify-between items-center mb-4">
          <button onClick={() => setCurrentMonth(prev => new Date(prev.getFullYear(), prev.getMonth() - 1))}>
            <ChevronLeftIcon className="h-5 w-5" />
          </button>
          <span className="font-medium">
            {month.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
          </span>
          <button onClick={() => setCurrentMonth(prev => new Date(prev.getFullYear(), prev.getMonth() + 1))}>
            <ChevronRightIcon className="h-5 w-5" />
          </button>
        </div>
        {/* Calendar grid would go here */}
      </div>
    );
  };

  return (
    <div className={cn(
      "absolute top-full left-0 right-0 mt-2 z-50",
      "bg-white dark:bg-gray-800",
      "border border-gray-200 dark:border-gray-700",
      "rounded-lg shadow-lg"
    )}>
      <div className="flex">
        {/* Current Month */}
        <div className="flex-1 border-r border-gray-200 dark:border-gray-700">
          {renderCalendar(currentMonth)}
        </div>
        
        {/* Next Month */}
        {isRoundTrip && (
          <div className="flex-1">
            {renderCalendar(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1))}
          </div>
        )}
      </div>
    </div>
  );
};

export default DatePicker;