'use client';

import React, { useRef, useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';

interface Airline {
  code: string;
  name: string;
  logo: string;
  lowestFare: number;
  flightCount: number;
}

interface AirlineFilterProps {
  airlines: Airline[];
  selectedAirlines: string[];
  onAirlineSelect: (code: string) => void;
}

const DEFAULT_AIRLINE_LOGO = '/default-logo.png';

const AirlineFilter: React.FC<AirlineFilterProps> = ({
  airlines,
  selectedAirlines,
  onAirlineSelect,
}) => {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [showLeftScroll, setShowLeftScroll] = useState(false);
  const [showRightScroll, setShowRightScroll] = useState(true);

  console.log('AirlineFilter rendered with:', {
    airlinesCount: airlines?.length,
    airlines,
    selectedAirlines
  });

  // If no airlines data, show empty state
  if (!airlines || airlines.length === 0) {
    return (
      <div className="w-full p-4 border border-gray-200 dark:border-gray-800 rounded-lg">
        <div className="flex flex-col items-center justify-center gap-2 py-4">
          <div className="animate-spin rounded-full h-6 w-6 border-2 border-primary border-t-transparent"></div>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Loading airlines...
          </p>
          <p className="text-xs text-gray-400 dark:text-gray-500">
            Please wait while we fetch available airlines
          </p>
        </div>
      </div>
    );
  }

  console.log('Rendering airlines:', airlines);

  const scroll = (direction: 'left' | 'right') => {
    const container = scrollContainerRef.current;
    if (!container) return;

    const scrollAmount = 200;
    const newScrollLeft = direction === 'left' 
      ? container.scrollLeft - scrollAmount 
      : container.scrollLeft + scrollAmount;

    container.scrollTo({
      left: newScrollLeft,
      behavior: 'smooth'
    });
  };

  const handleScroll = () => {
    const container = scrollContainerRef.current;
    if (!container) return;

    setShowLeftScroll(container.scrollLeft > 0);
    setShowRightScroll(
      container.scrollLeft < container.scrollWidth - container.clientWidth
    );
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-BD', {
      style: 'currency',
      currency: 'BDT',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(price);
  };

  const getAirlineLogo = (airline: Airline) => {
    try {
      if (!airline.logo) {
        // Try to get logo from Kiwi CDN
        return `https://images.kiwi.com/airlines/64/${airline.code}.png`;
      }
      return airline.logo;
    } catch (error) {
      console.error('Error getting airline logo:', error);
      return DEFAULT_AIRLINE_LOGO;
    }
  };

  return (
    <div className="relative w-full bg-white dark:bg-black border border-gray-200 dark:border-gray-800 rounded-lg">
      {showLeftScroll && (
        <button
          onClick={() => scroll('left')}
          className="absolute left-0 top-1/2 -translate-y-1/2 z-10 w-8 h-8 flex items-center justify-center bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-full shadow-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
          aria-label="Scroll left"
        >
          <ChevronLeft className="w-4 h-4" />
        </button>
      )}

      {showRightScroll && (
        <button
          onClick={() => scroll('right')}
          className="absolute right-0 top-1/2 -translate-y-1/2 z-10 w-8 h-8 flex items-center justify-center bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-full shadow-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
          aria-label="Scroll right"
        >
          <ChevronRight className="w-4 h-4" />
        </button>
      )}

      <div
        ref={scrollContainerRef}
        onScroll={handleScroll}
        className="flex gap-2 overflow-x-auto scrollbar-none scroll-smooth px-10 py-3"
      >
        {airlines.map((airline) => {
          console.log('Rendering airline:', airline);
          return (
            <button
              key={airline.code}
              onClick={() => onAirlineSelect(airline.code)}
              className={cn(
                "flex items-center gap-3 px-4 py-2 min-w-[160px]",
                "border rounded-lg transition-all duration-200",
                selectedAirlines.includes(airline.code)
                  ? "bg-gray-100 dark:bg-gray-800 border-gray-300 dark:border-gray-600"
                  : "bg-white dark:bg-black border-gray-200 dark:border-gray-800",
                "hover:border-gray-300 dark:hover:border-gray-600"
              )}
            >
              <div className="flex items-center gap-2">
                {/* Airline Logo */}
                <div className="w-8 h-8 flex items-center justify-center bg-gray-50 dark:bg-gray-900 rounded-full overflow-hidden">
                  <img
                    src={getAirlineLogo(airline)}
                    alt={`${airline.name} logo`}
                    className="w-6 h-6 object-contain"
                    onError={(e) => {
                      e.currentTarget.src = DEFAULT_AIRLINE_LOGO;
                    }}
                  />
                </div>
                
                {/* Airline Info */}
                <div className="flex flex-col items-start">
                  <span className="font-medium text-sm">{airline.code}</span>
                  <span className="text-sm text-primary font-medium">
                    {formatPrice(airline.lowestFare)}
                  </span>
                  <span className="text-xs text-gray-500">
                    ({airline.flightCount})
                  </span>
                </div>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default AirlineFilter;