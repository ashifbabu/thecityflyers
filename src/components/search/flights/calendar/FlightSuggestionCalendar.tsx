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
  isLoading?: boolean;
  loadingDate?: string | null;
  onNavigate?: (direction: 'prev' | 'next', dates: Date[]) => void;
}

const getFareComparisonColor = (currentFare: number, selectedFare: number) => {
  if (!currentFare || !selectedFare) return '';

  const percentageDiff = ((currentFare - selectedFare) / selectedFare) * 100;

  // Lower fares (green shades)
  if (percentageDiff <= -20) return 'text-green-600 font-bold';
  if (percentageDiff <= -15) return 'text-green-600';
  if (percentageDiff <= -10) return 'text-green-500';
  if (percentageDiff <= -5) return 'text-green-500';
  if (percentageDiff < 0) return 'text-green-400';

  // Higher fares (orange shades)
  if (percentageDiff >= 20) return 'text-orange-600 font-bold';
  if (percentageDiff >= 15) return 'text-orange-600';
  if (percentageDiff >= 10) return 'text-orange-500';
  if (percentageDiff >= 5) return 'text-orange-500';
  
  // Similar fare (neutral)
  return 'text-gray-600 dark:text-gray-300';
};

const FlightSuggestionCalendar: React.FC<FlightSuggestionCalendarProps> = ({
  selectedDate = new Date(),
  onDateSelect,
  minDate = new Date(),
  maxDate,
  prices = {},
  className,
  isLoading = false,
  loadingDate = null,
  onNavigate,
}) => {
  const { tripType } = useTripType();
  const [currentDate, setCurrentDate] = useState(selectedDate);
  const [visibleDates, setVisibleDates] = useState<Date[]>([]);
  const [displayCount, setDisplayCount] = useState(7);

  // Get selected date's fare
  const selectedDateKey = selectedDate ? format(selectedDate, 'yyyy-MM-dd') : '';
  const selectedFare = prices[selectedDateKey];

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
    
    // Calculate the new visible dates
    const dates: Date[] = [];
    const offset = Math.floor(displayCount / 2);
    const startDate = addDays(newDate, -offset);
    
    for (let i = 0; i < displayCount; i++) {
      dates.push(addDays(startDate, i));
    }
    
    // Notify parent component about navigation
    onNavigate?.(direction, dates);
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
          disabled={isLoading}
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
            const price = prices[dateKey];
            const isDisabled = isDateDisabled(date);
            const isDateLoading = loadingDate === dateKey;
            
            // Get color based on fare comparison
            const fareComparisonColor = isSelected ? 'text-white dark:text-gray-900' : 
              (price && selectedFare) ? getFareComparisonColor(price, selectedFare) : '';
            
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
                    : "bg-white dark:bg-gray-900",
                  "border border-gray-200 dark:border-gray-700",
                  (isDisabled || isLoading) && "opacity-50 cursor-not-allowed",
                  isDateLoading && "animate-pulse"
                )}
                disabled={isDisabled || isLoading}
              >
                <span className="text-xs sm:text-sm font-medium">
                  {format(date, 'MMM d')}
                </span>
                <span className="text-[10px] sm:text-xs text-inherit opacity-75">
                  {format(date, 'EEE')}
                </span>
                <span className={cn(
                  "text-sm sm:text-base mt-1",
                  "font-semibold",
                  fareComparisonColor
                )}>
                  {isDateLoading ? (
                    <div className="w-4 h-4 animate-spin rounded-full border-2 border-gray-300 border-t-gray-600" />
                  ) : (
                    price ? formatPrice(price) : "View fare"
                  )}
                </span>
                {price && selectedFare && !isSelected && !isDateLoading && (
                  <span className={cn(
                    "text-[9px] mt-0.5",
                    price < selectedFare ? "text-green-600" : "text-orange-600"
                  )}>
                    {((price - selectedFare) / selectedFare * 100).toFixed(0)}%
                  </span>
                )}
              </button>
            );
          })}
        </div>

        <button
          onClick={() => navigateCalendar('next')}
          className="p-1 sm:p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition-colors"
          aria-label="Next dates"
          disabled={isLoading}
        >
          <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5 text-gray-500 dark:text-gray-400" />
        </button>
      </div>
    </div>
  );
};

export default FlightSuggestionCalendar;