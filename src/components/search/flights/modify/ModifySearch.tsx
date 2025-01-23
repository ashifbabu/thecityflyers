'use client';

import React, { useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { cn } from '@/lib/utils';
import { ChevronDownIcon, ChevronUpIcon, ArrowsRightLeftIcon } from '@heroicons/react/24/outline';
import { useTripType } from '@/hooks/use-trip-type';
import LocationInput from '../location/LocationInput';
import DateInput from '../date/DateInput';
import TravelersInput from '../travelers/TravelersInput';
import TripTypes from '../trip/TripTypes';
import FareTypes from '../fare/FareTypes';
import SearchButton from '../button/SearchButton';
import type { FlightSearchError } from '@/types/flight';

const ModifySearch = () => {
  const searchParams = useSearchParams();
  const { tripType, setTripType } = useTripType();
  const [isExpanded, setIsExpanded] = useState(false);
  const [errors, setErrors] = useState<FlightSearchError[]>([]);

  // Initialize state with URL parameters
  const [searchData, setSearchData] = useState({
    fromCity: searchParams.get('fromCity') || '',
    fromAirport: searchParams.get('fromAirport') || '',
    toCity: searchParams.get('toCity') || '',
    toAirport: searchParams.get('toAirport') || '',
    departureDate: searchParams.get('departureDate') 
      ? new Date(searchParams.get('departureDate')!) 
      : undefined,
    returnDate: searchParams.get('returnDate')
      ? new Date(searchParams.get('returnDate')!)
      : undefined,
    travelers: parseInt(searchParams.get('travelers') || '1', 10),
    class: searchParams.get('class') || 'Economy',
    fareType: searchParams.get('fareType') || 'regular'
  });

  const handleSearchErrors = (searchErrors: FlightSearchError[]) => {
    setErrors(searchErrors);
    setTimeout(() => setErrors([]), 5000);
  };

  const swapLocations = () => {
    setSearchData(prev => ({
      ...prev,
      fromCity: prev.toCity,
      fromAirport: prev.toAirport,
      toCity: prev.fromCity,
      toAirport: prev.fromAirport
    }));
  };

  // Format date for display
  const formatDate = (date?: Date) => {
    if (!date) return '';
    return date.toLocaleDateString('en-US', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    });
  };

  return (
    <div className="bg-white dark:bg-black border border-gray-200 dark:border-gray-700 rounded-lg shadow-sm">
      {/* Header - Always visible */}
      <div 
        className="p-4 cursor-pointer"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-4">
          {/* Trip Type */}
          <div className="text-sm font-medium text-gray-900 dark:text-gray-100">
            {tripType === 'oneWay' ? 'One Way' : tripType === 'roundTrip' ? 'Round Trip' : 'Multi City'}
          </div>

          {/* Route and Dates */}
          <div className="flex flex-wrap items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
            <span>{searchData.fromCity}</span>
            <span>→</span>
            <span>{searchData.toCity}</span>
            <span>•</span>
            <span>{formatDate(searchData.departureDate)}</span>
            {tripType === 'roundTrip' && searchData.returnDate && (
              <>
                <span>-</span>
                <span>{formatDate(searchData.returnDate)}</span>
              </>
            )}
          </div>

          {/* Travelers and Class */}
          <div className="text-sm text-gray-600 dark:text-gray-400">
            <span>{searchData.travelers} Traveler{searchData.travelers > 1 ? 's' : ''}</span>
            <span> • </span>
            <span>{searchData.class}</span>
          </div>
        </div>

        {/* Expand/Collapse Button */}
        <button
          type="button"
          className="absolute right-4 top-4 p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
          aria-label={isExpanded ? 'Collapse search form' : 'Expand search form'}
        >
          {isExpanded ? (
            <ChevronUpIcon className="h-5 w-5" />
          ) : (
            <ChevronDownIcon className="h-5 w-5" />
          )}
        </button>
      </div>

      {/* Expanded Search Form */}
      {isExpanded && (
        <div className="border-t border-gray-200 dark:border-gray-700 p-4">
          {/* Error Messages */}
          {errors.length > 0 && (
            <div className="mb-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
              <ul className="list-disc list-inside space-y-1">
                {errors.map((error, index) => (
                  <li key={index} className="text-red-600 dark:text-red-400 text-sm">
                    {error.message}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Trip Types */}
          <div className="mb-4">
            <TripTypes />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
            {/* Location Selection */}
            <div className="lg:col-span-5">
              <div className="relative grid grid-rows-2 gap-0 rounded-lg border border-gray-400 dark:border-gray-700 bg-white dark:bg-black">
                <div className="border-b border-gray-300 dark:border-gray-600">
                  <LocationInput
                    type="from"
                    value={searchData.fromCity}
                    subValue={searchData.fromAirport}
                    onChange={(city, airportName) => {
                      setSearchData(prev => ({
                        ...prev,
                        fromCity: city,
                        fromAirport: airportName
                      }));
                    }}
                  />
                </div>
                <LocationInput
                  type="to"
                  value={searchData.toCity}
                  subValue={searchData.toAirport}
                  onChange={(city, airportName) => {
                    setSearchData(prev => ({
                      ...prev,
                      toCity: city,
                      toAirport: airportName
                    }));
                  }}
                />
                {/* Swap Button */}
                <button
                  type="button"
                  onClick={swapLocations}
                  aria-label="Swap locations"
                  className={cn(
                    'absolute right-20 top-1/2 -translate-y-1/2 z-10 rounded-full',
                    'w-8 h-8',
                    'bg-white dark:bg-black',
                    'border border-gray-400 dark:border-gray-600',
                    'flex items-center justify-center',
                    'hover:bg-gray-100 dark:hover:bg-gray-800',
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
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-0 h-full">
                <div className="sm:border-r border-gray-400 dark:border-gray-600">
                  <DateInput
                    type="departure"
                    value={searchData.departureDate?.toISOString().slice(0, 10) || 'Select date'}
                    subValue=""
                    selectedDate={searchData.departureDate}
                    onDateSelect={(type, date) => {
                      setSearchData(prev => ({
                        ...prev,
                        departureDate: date
                      }));
                    }}
                  />
                </div>
                {tripType === 'roundTrip' && (
                  <DateInput
                    type="return"
                    value={searchData.returnDate?.toISOString().slice(0, 10) || 'Select date'}
                    subValue=""
                    selectedDate={searchData.returnDate}
                    onDateSelect={(type, date) => {
                      setSearchData(prev => ({
                        ...prev,
                        returnDate: date
                      }));
                    }}
                    departureDate={searchData.departureDate}
                  />
                )}
              </div>
            </div>

            {/* Travelers Selection */}
            <div className="lg:col-span-3">
              <div className="h-full rounded-lg border border-gray-400 dark:border-gray-600 bg-white dark:bg-black">
                <TravelersInput
                  value={`${searchData.travelers} Traveler${searchData.travelers > 1 ? 's' : ''}`}
                  subValue={searchData.class}
                  onClick={() => {/* Handle travelers modal */}}
                />
              </div>
            </div>
          </div>

          {/* Fare Types */}
          <div className="mt-4">
            <FareTypes />
          </div>

          {/* Search Button */}
          <div className="mt-4 flex justify-center">
            <SearchButton
              searchData={searchData}
              onError={handleSearchErrors}
              buttonText="Modify Search"
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default ModifySearch;
