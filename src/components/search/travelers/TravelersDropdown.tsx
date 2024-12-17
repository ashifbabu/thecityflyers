'use client'

import React from 'react';
import { cn } from '@/lib/utils';

interface TravelersDropdownProps {
  travelers: number;
  setTravelers: (value: number) => void;
  cabinClass: string;
  setCabinClass: (value: string) => void;
  onClose: () => void;
}

const cabinClasses = ['Economy', 'Premium Economy', 'Business', 'First'];

const TravelersDropdown = ({
  travelers,
  setTravelers,
  cabinClass,
  setCabinClass,
  onClose
}: TravelersDropdownProps) => {
  return (
    <div className={cn(
      "absolute top-full left-0 right-0 mt-2 z-50",
      "bg-white dark:bg-gray-800",
      "border border-gray-200 dark:border-gray-700",
      "rounded-lg shadow-lg",
      "p-4"
    )}>
      <div className="space-y-4">
        <div>
          <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
            Number of Travelers
          </label>
          <div className="flex items-center gap-4 mt-2">
            <button
              type="button"
              onClick={() => setTravelers(Math.max(1, travelers - 1))}
              className={cn(
                "p-2 rounded-lg",
                "border border-gray-200 dark:border-gray-600",
                "hover:bg-gray-50 dark:hover:bg-gray-700"
              )}
            >
              -
            </button>
            <span className="text-gray-900 dark:text-gray-100">{travelers}</span>
            <button
              type="button"
              onClick={() => setTravelers(Math.min(9, travelers + 1))}
              className={cn(
                "p-2 rounded-lg",
                "border border-gray-200 dark:border-gray-600",
                "hover:bg-gray-50 dark:hover:bg-gray-700"
              )}
            >
              +
            </button>
          </div>
        </div>

        <div>
          <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
            Cabin Class
          </label>
          <div className="grid grid-cols-2 gap-2 mt-2">
            {cabinClasses.map((cls) => (
              <button
                key={cls}
                type="button"
                onClick={() => {
                  setCabinClass(cls);
                  onClose();
                }}
                className={cn(
                  "p-2 rounded-lg text-sm",
                  "border border-gray-200 dark:border-gray-600",
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
    </div>
  );
};

export default TravelersDropdown;