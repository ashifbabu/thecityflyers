'use client';

import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { format, addDays, isSameDay, startOfDay, isBefore } from 'date-fns';
import { cn } from '@/lib/utils';
import { useTripType } from '@/hooks/use-trip-type';

interface FlightSuggestionCalendarProps {
  selectedDate?: Date;
  onDateSelect?: (date: Date) => void;
  minDate?: Date;
  maxDate?: Date;
  prices?: Record<string, number>;
  className?: string;
  lowestFare?: number;
}

const FlightSuggestionCalendar: React.FC<FlightSuggestionCalendarProps> = ({
  selectedDate = new Date(),
  onDateSelect,
  minDate = new Date(),
  maxDate,
  prices = {},
  className,
  lowestFare,
}) => {
  const { tripType } = useTripType();
  const [currentDate, setCurrentDate] = useState(selectedDate);
  const [visibleDates, setVisibleDates] = useState<Date[]>([]);
  const [displayCount, setDisplayCount] = useState(7);

  useEffect(() => {
    const updateDisplayCount = () => {
      if (window.innerWidth < 768) {
        setDisplayCount(3);
      } else if (window.innerWidth < 1024) {
        setDisplayCount(5);
      } else {
        setDisplayCount(7);
      }
    };

    updateDisplayCount();
    window.addEventListener('resize', updateDisplayCount);
    return () => window.removeEventListener('resize', updateDisplayCount);
  }, []);

  useEffect(() => {
    const dates: Date[] = [];
    const offset = Math.floor(displayCount / 2);
    const startDate = addDays(currentDate, -offset);
    
    for (let i = 0; i < displayCount; i++) {
      dates.push(addDays(startDate, i));
    }
    setVisibleDates(dates);
  }, [currentDate, displayCount]);

  const handleDateSelect = (date: Date) => {
    onDateSelect?.(date);
  };

  const navigateCalendar = (direction: 'prev' | 'next') => {
    const newDate = addDays(currentDate, direction === 'prev' ? -displayCount : displayCount);
    setCurrentDate(newDate);
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-BD', {
      style: 'currency',
      currency: 'BDT',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(price);
  };

  const today = startOfDay(new Date());
  
  const isDateDisabled = (date: Date) => {
    return isBefore(date, today);
  };

  return (
    <div className={cn(
      "w-full px-2 py-3 sm:p-4 rounded-lg border border-gray-200 dark:border-gray-800",
      className
    )}>
      <div className="flex items-center justify-between gap-1 sm:gap-2">
        <button
          onClick={() => navigateCalendar('prev')}
          className="p-1 sm:p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition-colors"
          aria-label="Previous dates"
        >
          <ChevronLeft className="w-4 h-4 sm:w-5 sm:h-5 text-gray-500 dark:text-gray-400" />
        </button>
        
        <div className={cn(
          "grid gap-1 sm:gap-2 flex-1",
          "grid-cols-3 sm:grid-cols-3 md:grid-cols-5 lg:grid-cols-7"
        )}>
          {visibleDates.map((date) => {
            const isSelected = selectedDate && isSameDay(date, selectedDate);
            const dateKey = format(date, 'yyyy-MM-dd');
            const price = prices[dateKey] || 20856;
            const isDisabled = isDateDisabled(date);
            
            return (
              <button
                key={dateKey}
                onClick={() => handleDateSelect(date)}
                className={cn(
                  "flex flex-col items-center justify-center",
                  "p-1 sm:p-2",
                  "min-h-[4.5rem] sm:min-h-[5rem]",
                  "rounded-lg transition-all",
                  "hover:bg-gray-100 dark:hover:bg-gray-800",
                  isSelected 
                    ? "bg-gray-900 dark:bg-white text-white dark:text-gray-900" 
                    : "bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100",
                  "border border-gray-200 dark:border-gray-700",
                  isDisabled && "opacity-50 cursor-not-allowed"
                )}
                disabled={isDisabled}
              >
                <span className="text-xs sm:text-sm font-medium">
                  {format(date, 'MMM d')}
                </span>
                <span className="text-[10px] sm:text-xs text-inherit opacity-75">
                  {format(date, 'EEE')}
                </span>
                <span className={cn(
                  "text-[10px] sm:text-xs mt-0.5 sm:mt-1",
                  isSelected 
                    ? "text-white dark:text-gray-900" 
                    : "text-gray-900 dark:text-gray-100"
                )}>
                  {isSelected && lowestFare 
                    ? formatPrice(lowestFare)
                    : "View fare"}
                </span>
              </button>
            );
          })}
        </div>

        <button
          onClick={() => navigateCalendar('next')}
          className="p-1 sm:p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition-colors"
          aria-label="Next dates"
        >
          <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5 text-gray-500 dark:text-gray-400" />
        </button>
      </div>
    </div>
  );
};

export default FlightSuggestionCalendar;