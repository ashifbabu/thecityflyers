'use client';

import React from 'react';
import { ChevronDownIcon } from '@heroicons/react/24/outline';

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
  const handleSortChange = (field: keyof SortOption, value: any) => {
    // Create new sort options with only the changed field
    const newOptions: Partial<SortOption> = {
      [field]: value
    };
    
    // Call the parent's onSortChange with the new options
    onSortChange(newOptions);
  };

  return (
    <div className="bg-white dark:bg-black p-4 rounded-lg border border-gray-200 dark:border-gray-800 mb-4">
      <div className="flex flex-wrap gap-4">
        {/* Fare Sorting */}
        <div className="flex-1 min-w-[200px]">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Fare
          </label>
          <select
            className="w-full rounded-md border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 px-3 py-2 text-sm"
            onChange={(e) => handleSortChange('fare', e.target.value as SortOption['fare'])}
            value={currentSort.fare}
          >
            <option value="lowToHigh">Lower to Higher</option>
            <option value="highToLow">Higher to Lower</option>
          </select>
        </div>

        {/* Stops Filter */}
        <div className="flex-1 min-w-[200px]">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Stops
          </label>
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
        </div>

        {/* Takeoff Time */}
        <div className="flex-1 min-w-[200px]">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Takeoff
          </label>
          <select
            className="w-full rounded-md border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 px-3 py-2 text-sm"
            onChange={(e) => handleSortChange('takeoff', e.target.value as SortOption['takeoff'])}
            value={currentSort.takeoff}
          >
            <option value="earlierToLater">Earlier to Later</option>
            <option value="laterToEarlier">Later to Earlier</option>
          </select>
        </div>

        {/* Airlines */}
        <div className="flex-1 min-w-[200px]">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Airline
          </label>
          <select
            className="w-full rounded-md border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 px-3 py-2 text-sm"
            onChange={(e) => handleSortChange('airline', e.target.value ? [e.target.value] : [])}
            value={currentSort.airline?.[0]}
          >
            <option value="">All Airlines</option>
            {availableAirlines.map((airline) => (
              <option key={airline} value={airline}>
                {airline}
              </option>
            ))}
          </select>
        </div>

        {/* Layovers */}
        <div className="flex-1 min-w-[200px]">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Layovers
          </label>
          <select
            className="w-full rounded-md border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 px-3 py-2 text-sm"
            onChange={(e) => handleSortChange('layovers', e.target.value as SortOption['layovers'])}
            value={currentSort.layovers}
          >
            <option value="lowToHigh">Lower to Higher</option>
            <option value="highToLow">Higher to Lower</option>
          </select>
        </div>
      </div>
    </div>
  );
};

export default FlightSortingOptions; 