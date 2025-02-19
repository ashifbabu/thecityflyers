'use client';

import React, { useState } from 'react';
import { ChevronDownIcon, ChevronUpIcon, AdjustmentsHorizontalIcon } from '@heroicons/react/24/outline';
import { cn } from '@/lib/utils';

export type SortOption = {
  fare: 'lowToHigh' | 'highToLow';
  stops: string[];
  takeoff: 'earlierToLater' | 'laterToEarlier';
  airline: string[];
  layovers: 'lowToHigh' | 'highToLow';
};

interface FlightSortingOptionsProps {
  onSortChange: (sortOptions: Partial<SortOption>) => void;
  availableAirlines: string[];
  currentSort: Partial<SortOption>;
}

const FlightSortingOptions: React.FC<FlightSortingOptionsProps> = ({
  onSortChange,
  availableAirlines,
  currentSort
}) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const handleSortChange = (field: keyof SortOption, value: any) => {
    onSortChange({ [field]: value });
  };

  // Mobile sort options (always visible)
  const primarySortOptions = (
    <div className="grid grid-cols-2 gap-2 sm:gap-4">
      {/* Fare Sorting */}
      <select
        className="w-full rounded-md border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 px-3 py-2 text-sm"
        onChange={(e) => handleSortChange('fare', e.target.value as SortOption['fare'])}
        value={currentSort.fare}
      >
        <option value="lowToHigh">Price: Low to High</option>
        <option value="highToLow">Price: High to Low</option>
      </select>

      {/* Takeoff Time */}
      <select
        className="w-full rounded-md border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 px-3 py-2 text-sm"
        onChange={(e) => handleSortChange('takeoff', e.target.value as SortOption['takeoff'])}
        value={currentSort.takeoff}
      >
        <option value="earlierToLater">Departure: Early to Late</option>
        <option value="laterToEarlier">Departure: Late to Early</option>
      </select>
    </div>
  );

  // Additional sort options (expandable)
  const additionalSortOptions = (
    <div className={cn(
      "grid grid-cols-1 sm:grid-cols-3 gap-2 sm:gap-4 mt-2",
      "transition-all duration-300",
      isExpanded ? "opacity-100" : "opacity-0 h-0 overflow-hidden"
    )}>
      {/* Stops Filter */}
      <select
        className="w-full rounded-md border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 px-3 py-2 text-sm"
        onChange={(e) => handleSortChange('stops', e.target.value ? [e.target.value] : [])}
        value={currentSort.stops?.[0] || ''}
      >
        <option value="">All Stops</option>
        <option value="0">Non-stop</option>
        <option value="1">1 Stop</option>
        <option value="2">2 Stops</option>
        <option value="2+">2+ Stops</option>
      </select>

      {/* Airlines */}
      <select
        className="w-full rounded-md border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 px-3 py-2 text-sm"
        onChange={(e) => handleSortChange('airline', e.target.value ? [e.target.value] : [])}
        value={currentSort.airline?.[0] || ''}
      >
        <option value="">All Airlines</option>
        {availableAirlines.map((airline) => (
          <option key={airline} value={airline}>
            {airline}
          </option>
        ))}
      </select>

      {/* Layovers */}
      <select
        className="w-full rounded-md border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 px-3 py-2 text-sm"
        onChange={(e) => handleSortChange('layovers', e.target.value as SortOption['layovers'])}
        value={currentSort.layovers}
      >
        <option value="lowToHigh">Layover: Short to Long</option>
        <option value="highToLow">Layover: Long to Short</option>
      </select>
    </div>
  );

  return (
    <div className="bg-white dark:bg-black p-4 rounded-lg border border-gray-200 dark:border-gray-800">
      <div className="space-y-4">
        {/* Header with expand/collapse button */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <AdjustmentsHorizontalIcon className="w-5 h-5 text-gray-600 dark:text-gray-400" />
            <span className="font-medium">Sort & Filter</span>
          </div>
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="flex items-center gap-1 text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100"
          >
            <span className="hidden sm:inline">More options</span>
            {isExpanded ? (
              <ChevronUpIcon className="w-4 h-4" />
            ) : (
              <ChevronDownIcon className="w-4 h-4" />
            )}
          </button>
        </div>

        {/* Primary sort options (always visible) */}
        {primarySortOptions}

        {/* Additional sort options (expandable) */}
        {additionalSortOptions}
      </div>
    </div>
  );
};

export default FlightSortingOptions;