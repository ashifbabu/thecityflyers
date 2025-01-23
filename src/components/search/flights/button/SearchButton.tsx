'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { cn } from '@/lib/utils';
import { useTripType } from '@/hooks/use-trip-type';
import { validateFlightSearch } from '@/lib/validations';
import type { FlightSearchError } from '@/types/flight';

interface SearchButtonProps {
  onError?: (errors: FlightSearchError[]) => void;
  searchData: {
    fromCity?: string;
    toCity?: string;
    departureDate?: Date;
    returnDate?: Date;
    travelers?: number;
    flights?: any[];
  };
  buttonText?: string;
}

const SearchButton = ({ onError, searchData, buttonText = 'Search' }: SearchButtonProps) => {
  const router = useRouter();
  const { tripType } = useTripType();

  const handleSearch = () => {
    console.log('Search button clicked');
    console.log('Search Data:', searchData);

    // Validate search data
    const validationErrors = validateFlightSearch(tripType, searchData);
    console.log('Validation Errors:', validationErrors);

    if (validationErrors.length > 0) {
      if (onError) {
        onError(validationErrors);
      }
      return;
    }

    // Construct search params
    const params = new URLSearchParams({
      tripType,
      ...Object.entries(searchData).reduce((acc, [key, value]) => {
        if (value !== undefined) {
          if (value instanceof Date) {
            acc[key] = value.toISOString();
          } else if (typeof value === 'object') {
            acc[key] = JSON.stringify(value);
          } else {
            acc[key] = String(value);
          }
        }
        return acc;
      }, {} as Record<string, string>)
    });

    console.log('Navigating to:', `/flight_results?${params.toString()}`);
    router.push(`/flight_results?${params.toString()}`);
  };

  return (
    <button
      type="button"
      onClick={handleSearch}
      className={cn(
        'w-full max-w-xs mx-auto rounded-md',
        'transition-all duration-200 flex items-center justify-center font-medium py-4 px-8',
        'bg-black text-white hover:bg-gray-900',
        'dark:bg-white dark:text-black dark:hover:bg-gray-100'
      )}
    >
      {buttonText}
    </button>
  );
};

export default SearchButton;