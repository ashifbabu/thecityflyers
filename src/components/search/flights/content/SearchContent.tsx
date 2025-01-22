'use client';

import React, { useState, lazy, Suspense } from 'react';
import { ArrowsRightLeftIcon } from '@heroicons/react/24/outline';
import { cn } from '@/lib/utils';
import { useTripType } from '@/hooks/use-trip-type';

// Lazy load components
const TripTypes = lazy(() => import('../trip/TripTypes'));
const LocationInput = lazy(() => import('../location/LocationInput'));
const DateInput = lazy(() => import('../date/DateInput'));
const TravelersInput = lazy(() => import('../travelers/TravelersInput'));
const FareTypes = lazy(() => import('../fare/FareTypes'));
const SearchButton = lazy(() => import('../button/SearchButton'));
const MultiCityContent = lazy(() => import('./MultiCityContent'));

interface Airport {
  city: string;
  country: string;
  airportName: string;
  code: string;
}

const SearchContent = () => {
  const [fromCity, setFromCity] = useState('Dhaka');
  const [fromAirport, setFromAirport] = useState('Hazrat Shahjalal International Airport');
  const [toCity, setToCity] = useState('Chittagong');
  const [toAirport, setToAirport] = useState('Shah Amanat International');
  const [departureDateState, setDepartureDateState] = useState<Date | undefined>(undefined);
  const [returnDateState, setReturnDateState] = useState<Date | undefined>(undefined);

  const { tripType } = useTripType();

  const swapLocations = () => {
    setFromCity(toCity);
    setFromAirport(toAirport);
    setToCity(fromCity);
    setToAirport(fromAirport);
  };

  const handleDateSelect = (type: 'departure' | 'return', date: Date) => {
    if (type === 'departure') {
      setDepartureDateState(date);
      if (returnDateState && returnDateState < date) {
        setReturnDateState(undefined);
      }
    } else {
      setReturnDateState(date);
    }
  };

  if (tripType === 'multiCity') {
    return (
      <Suspense fallback={<div className="h-96" />}>
        <MultiCityContent />
      </Suspense>
    );
  }

  return (
    <div className="w-full bg-white dark:bg-black p-6 space-y-6">
      <Suspense fallback={<div className="h-8" />}>
        <TripTypes />
      </Suspense>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-1">
        {/* Location Selection */}
        <div className="lg:col-span-5">
          <div className="relative grid grid-rows-2 gap-0 rounded-lg border border-gray-400 dark:border-gray-700 bg-white dark:bg-black">
            <Suspense fallback={<div className="h-24" />}>
              {/* From Section */}
              <div className="border-b border-gray-300 dark:border-gray-600">
                <LocationInput
                  type="from"
                  value={fromCity}
                  subValue={fromAirport}
                  onChange={(city, airportName) => {
                    setFromCity(city);
                    setFromAirport(airportName);
                  }}
                />
              </div>
              {/* To Section */}
              <LocationInput
                type="to"
                value={toCity}
                subValue={toAirport}
                onChange={(city, airportName) => {
                  setToCity(city);
                  setToAirport(airportName);
                }}
              />
            </Suspense>
            {/* Swap Button */}
            <button
              type="button"
              onClick={swapLocations}
              aria-label="Swap locations"
              className={cn(
                'absolute right-20 top-1/2 translate-x-1/2 -translate-y-1/2 z-10 rounded-full',
                'w-8 h-8',
                'bg-white dark:bg-black',
                'border border-gray-400 dark:border-gray-600',
                'flex items-center justify-center',
                'hover:bg-gray-200 dark:hover:bg-gray-800',
                'focus:outline-none focus:ring-2 focus:ring-gray-500 dark:focus:ring-gray-700',
                'shadow-sm'
              )}
            >
              <ArrowsRightLeftIcon
                className="h-4 w-4 text-gray-600 dark:text-gray-300"
                style={{ transform: 'rotate(90deg)' }}
              />
            </button>
          </div>
        </div>
        {/* Date Selection */}
        <div className="lg:col-span-4">
          <div className="grid grid-cols-2 gap-0 h-full bg-white dark:bg-black border border-gray-400 dark:border-gray-600 rounded-lg overflow-visible">
            <Suspense fallback={<div className="h-24" />}>
              {/* Departure Box */}
              <div className="border-r border-gray-400 dark:border-gray-600">
                <DateInput
                  type="departure"
                  value="Select date"
                  subValue=""
                  className="rounded-none"
                />
              </div>

              {/* Return Box */}
              <div>
                <DateInput
                  type="return"
                  value="Select date"
                  subValue=""
                  className="rounded-none"
                />
              </div>
            </Suspense>
          </div>
        </div>

        {/* Travelers Selection */}
        <div className="lg:col-span-3 rounded-lg border border-gray-400 dark:border-gray-600 overflow-visible bg-white dark:bg-black">
          <Suspense fallback={<div className="h-24" />}>
            <TravelersInput
              value="1 Traveler"
              subValue="Economy"
              onClick={() => console.log('Open travelers modal')}
            />
          </Suspense>
        </div>
      </div>

      <Suspense fallback={<div className="h-12" />}>
        <FareTypes />
      </Suspense>

      <div className="flex justify-center w-full">
        <Suspense fallback={<div className="h-12" />}>
          <SearchButton />
        </Suspense>
      </div>
    </div>
  );
};

export default SearchContent;
