'use client'

import React, { useState } from 'react';
import { cn } from '@/lib/utils';
import { ChevronDownIcon } from '@heroicons/react/24/outline';
import TravelersClassPopover from './TravelersClassPopover';

interface TravelersClassInputProps {
  travelers: number;
  cabinClass: string;
  onTravelersChange: (count: number) => void;
  onCabinClassChange: (className: string) => void;
}

const TravelersClassInput = ({
  travelers,
  cabinClass,
  onTravelersChange,
  onCabinClassChange
}: TravelersClassInputProps) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(true)}
        className={cn(
          "w-full p-4 text-left",
          "bg-white dark:bg-gray-800",
          "border border-gray-200 dark:border-gray-700",
          "rounded-lg"
        )}
      >
        <div className="text-sm text-gray-500 dark:text-gray-400">
          Travelers & Booking Class
        </div>
        <div className="mt-1 text-lg font-medium text-gray-900 dark:text-white">
          {travelers} Traveler{travelers !== 1 ? 's' : ''}
        </div>
        <div className="mt-1 text-sm text-gray-500 dark:text-gray-400">
          {cabinClass}
        </div>
      </button>

      {/* Travelers & Class Selection Popover */}
      {isOpen && (
        <TravelersClassPopover
          travelers={travelers}
          cabinClass={cabinClass}
          onTravelersChange={onTravelersChange}
          onCabinClassChange={onCabinClassChange}
          onClose={() => setIsOpen(false)}
        />
      )}
    </div>
  );
};

export default TravelersClassInput;