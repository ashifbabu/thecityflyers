'use client'

import React, { useState } from 'react';
import { ArrowsRightLeftIcon } from '@heroicons/react/24/outline';
import { cn } from '@/lib/utils';
import LocationInput from './LocationInput';

const LocationInputs = () => {
  const [from, setFrom] = useState('');
  const [to, setTo] = useState('');

  const swapLocations = () => {
    const temp = from;
    setFrom(to);
    setTo(temp);
  };

  return (
    <div className="relative">
      <div className="space-y-4">
        <LocationInput
          label="From"
          value={from}
          onChange={setFrom}
          placeholder="Enter departure city"
        />
        <LocationInput
          label="To"
          value={to}
          onChange={setTo}
          placeholder="Enter arrival city"
        />
      </div>

      <button
        type="button"
        onClick={swapLocations}
        className={cn(
          "absolute right-0 top-1/2 -translate-y-1/2 -translate-x-2",
          "w-8 h-8 rounded-full",
          "bg-white dark:bg-gray-700",
          "border border-gray-200 dark:border-gray-600",
          "flex items-center justify-center",
          "shadow-md",
          "hover:bg-gray-50 dark:hover:bg-gray-600",
          "transition-colors"
        )}
      >
        <ArrowsRightLeftIcon className="h-4 w-4 text-gray-600 dark:text-gray-300" />
      </button>
    </div>
  );
};

export default LocationInputs;