'use client'

import React from 'react';
import { cn } from '@/lib/utils';
import { useTripType } from '@/hooks/use-trip-type';

const tripTypes = [
  { id: 'oneWay', label: 'One Way' },
  { id: 'roundTrip', label: 'Round Trip' },
  { id: 'multiCity', label: 'Multi City' },
] as const;

const TripTypes = () => {
  const { tripType, setTripType } = useTripType();

  return (
    <div className="flex flex-wrap gap-4">
      {tripTypes.map(({ id, label }) => (
        <button
          key={id}
          type="button"
          onClick={() => setTripType(id as any)}
          className="flex items-center gap-2"
        >
          <div className={cn(
            "w-4 h-4 rounded-full border-2",
            "flex items-center justify-center",
            tripType === id 
              ? "border-gray-900 dark:border-gray-100 bg-gray-900 dark:bg-gray-100" 
              : "border-gray-300 dark:border-gray-600"
          )}>
            {tripType === id && (
              <div className="w-1.5 h-1.5 rounded-full bg-white dark:bg-gray-900" />
            )}
          </div>
          <span className="text-sm font-medium text-gray-900 dark:text-gray-100">{label}</span>
        </button>
      ))}
    </div>
  );
};

export default TripTypes;