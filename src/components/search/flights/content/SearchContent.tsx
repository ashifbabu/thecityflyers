'use client';

import React, { useState, lazy, Suspense } from 'react';
import { ArrowsRightLeftIcon } from '@heroicons/react/24/outline';
import { cn } from '@/lib/utils';
import { useTripType } from '@/hooks/use-trip-type';
import type { FlightSearchError } from '@/types/flight';

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

const SearchContent: React.FC = () => {
  const [fromCity, setFromCity] = useState('Dhaka');
  const [fromAirport, setFromAirport] = useState('Hazrat Shahjalal International Airport');
  const [toCity, setToCity] = useState('Chittagong');
  const [toAirport, setToAirport] = useState('Shah Amanat International');
  const [departureDateState, setDepartureDateState] = useState<Date | undefined>(undefined);
  const [returnDateState, setReturnDateState] = useState<Date | undefined>(undefined);
  const [travelers, setTravelers] = useState(1);
  const [errors, setErrors] = useState<FlightSearchError[]>([]);
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

  const handleSearchErrors = (searchErrors: FlightSearchError[]) => {
    setErrors(searchErrors);
    setTimeout(() => setErrors([]), 5000); // Clear errors after 5 seconds
  };

  const searchData = {
    fromCity,
    toCity,
    departureDate: departureDateState,
    returnDate: returnDateState,
    travelers,
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
      {errors.length > 0 && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative">
          <ul>
            {errors.map((error, index) => (
              <li key={index}>{error.message}</li>
            ))}
          </ul>
        </div>
      )}

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
                {/* Departure DateInput */}
                <div className="border-r border-gray-400 dark:border-gray-600">
                  <DateInput
                    type="departure"
                    value={departureDateState ? departureDateState.toISOString().slice(0, 10) : 'Select date'} // Ensure value is a string
                    subValue=""
                    selectedDate={departureDateState}
                    onDateSelect={(type, date) => handleDateSelect(type, date)} // Pass the correct type and date
                  />
                </div>

                {/* Return DateInput */}
                <div>
                  <DateInput
                    type="return"
                    value={returnDateState ? returnDateState.toISOString().slice(0, 10) : 'Select date'} // Ensure value is a string
                    subValue=""
                    selectedDate={returnDateState}
                    onDateSelect={(type, date) => handleDateSelect(type, date)} // Pass the correct type and date
                    departureDate={departureDateState}
                  />
                </div>
              </Suspense>
            </div>
          </div>


        {/* Travelers Selection */}
        <div className="lg:col-span-3 rounded-lg border border-gray-400 dark:border-gray-600 overflow-visible bg-white dark:bg-black">
          <Suspense fallback={<div className="h-24" />}>
            <TravelersInput
              value={`${travelers} Traveler${travelers > 1 ? 's' : ''}`}
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
          <SearchButton searchData={searchData} onError={handleSearchErrors} />
        </Suspense>
      </div>
    </div>
  );
};

export default SearchContent;
