'use client'

import React from 'react';
import { cn } from '@/lib/utils';
import { MinusIcon, PlusIcon } from '@heroicons/react/24/outline';

interface TravelersClassPopoverProps {
  travelers: number;
  cabinClass: string;
  onTravelersChange: (count: number) => void;
  onCabinClassChange: (className: string) => void;
  onClose: () => void;
}

const cabinClasses = ['Economy', 'Premium Economy', 'Business', 'First'];

const TravelersClassPopover = ({
  travelers,
  cabinClass,
  onTravelersChange,
  onCabinClassChange,
  onClose
}: TravelersClassPopoverProps) => {
  return (
    <div className={cn(
      "absolute top-full left-0 right-0 mt-2 z-50",
      "bg-white dark:bg-gray-800",
      "border border-gray-200 dark:border-gray-700",
      "rounded-lg shadow-lg",
      "p-4"
    )}>
      {/* Travelers Counter */}
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-900 dark:text-white mb-2">
          Number of Travelers
        </label>
        <div className="flex items-center gap-4">
          <button
            onClick={() => onTravelersChange(Math.max(1, travelers - 1))}
            className={cn(
              "p-2 rounded-lg",
              "border border-gray-200 dark:border-gray-700",
              "hover:bg-gray-50 dark:hover:bg-gray-700"
            )}
          >
            <MinusIcon className="h-4 w-4" />
          </button>
          <span className="text-lg font-medium text-gray-900 dark:text-white">
            {travelers}
          </span>
          <button
            onClick={() => onTravelersChange(Math.min(9, travelers + 1))}
            className={cn(
              "p-2 rounded-lg",
              "border border-gray-200 dark:border-gray-700",
              "hover:bg-gray-50 dark:hover:bg-gray-700"
            )}
          >
            <PlusIcon className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* Cabin Class Selection */}
      <div>
        <label className="block text-sm font-medium text-gray-900 dark:text-white mb-2">
          Cabin Class
        </label>
        <div className="grid grid-cols-2 gap-2">
          {cabinClasses.map((cls) => (
            <button
              key={cls}
              onClick={() => {
                onCabinClassChange(cls);
                onClose();
              }}
              className={cn(
                "p-2 rounded-lg text-sm",
                "border border-gray-200 dark:border-gray-700",
                "hover:bg-gray-50 dark:hover:bg-gray-700",
                cabinClass === cls && "bg-gray-900 dark:bg-gray-100 text-white dark:text-gray-900"
              )}
            >
              {cls}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default TravelersClassPopover;