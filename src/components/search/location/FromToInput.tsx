'use client'

import React from 'react';
import { cn } from '@/lib/utils';
import { ArrowsRightLeftIcon } from '@heroicons/react/24/outline';

interface LocationData {
  city: string;
  airport: string;
}

interface FromToInputProps {
  from: LocationData;
  to: LocationData;
  onSwap: () => void;
  onFromChange: (data: LocationData) => void;
  onToChange: (data: LocationData) => void;
}

const FromToInput = ({ from, to, onSwap, onFromChange, onToChange }: FromToInputProps) => {
  return (
    <div className="relative bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
      {/* From Section */}
      <div className="p-4 border-b border-gray-200 dark:border-gray-700">
        <label className="block text-sm text-gray-500 dark:text-gray-400">From</label>
        <input
          type="text"
          value={from.city}
          onChange={(e) => onFromChange({ ...from, city: e.target.value })}
          className="w-full mt-1 text-lg font-medium bg-transparent focus:outline-none text-gray-900 dark:text-white"
          placeholder="Enter city or airport"
        />
        <div className="mt-1 text-sm text-gray-500 dark:text-gray-400">
          {from.airport}
        </div>
      </div>

      {/* Swap Button */}
      <button
        onClick={onSwap}
        className={cn(
          "absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-10",
          "w-8 h-8 rounded-full bg-white dark:bg-gray-800",
          "border border-gray-200 dark:border-gray-700 shadow-sm",
          "flex items-center justify-center",
          "hover:bg-gray-50 dark:hover:bg-gray-700",
          "transition-colors"
        )}
      >
        <ArrowsRightLeftIcon className="h-4 w-4 text-gray-500 dark:text-gray-400" />
      </button>

      {/* To Section */}
      <div className="p-4">
        <label className="block text-sm text-gray-500 dark:text-gray-400">To</label>
        <input
          type="text"
          value={to.city}
          onChange={(e) => onToChange({ ...to, city: e.target.value })}
          className="w-full mt-1 text-lg font-medium bg-transparent focus:outline-none text-gray-900 dark:text-white"
          placeholder="Enter city or airport"
        />
        <div className="mt-1 text-sm text-gray-500 dark:text-gray-400">
          {to.airport}
        </div>
      </div>
    </div>
  );
};

export default FromToInput;