'use client';

import React, { useState, useEffect } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { cn } from '@/lib/utils';
import { ChevronDownIcon, ChevronUpIcon, ArrowsRightLeftIcon } from '@heroicons/react/24/outline';
import { useTripType } from '@/hooks/use-trip-type';
import LocationInput from '../location/LocationInput';
import DateInput from '../date/DateInput';
import TravelersInput from '../travelers/TravelersInput';
import TripTypes from '../trip/TripTypes';
import FareTypes from '../fare/FareTypes';
import SearchButton from '../button/SearchButton';
import MultiCityContent from '../content/MultiCityContent';
import type { FlightSearchError } from '@/types/flight';

const ModifySearch = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { tripType, setTripType } = useTripType();
  const [isExpanded, setIsExpanded] = useState(false);
  const [errors, setErrors] = useState<FlightSearchError[]>([]);

  // Parse flights data from URL
  const parseFlights = () => {
    try {
      const flightsParam = searchParams ? searchParams.get('flights') : null;
      return flightsParam ? JSON.parse(flightsParam) : [];
    } catch (error) {
      console.error('Error parsing flights data:', error);
      return [];
    }
  };

  // Initialize state with URL parameters
  const [searchData, setSearchData] = useState({
    fromCity: searchParams?.get('fromCity') || '',
    fromAirport: searchParams?.get('from') || '',
    toCity: searchParams?.get('toCity') || '',
    toAirport: searchParams?.get('to') || '',
    departureDate: searchParams?.get('departure')
      ? new Date(searchParams?.get('departure')!)
      : undefined,
    returnDate: searchParams?.get('return')
      ? new Date(searchParams?.get('return')!)
      : undefined,
    travelers: {
      adults: Number(searchParams?.get('adults')) || 1,
      kids: Number(searchParams?.get('kids')) || 0,
      children: Number(searchParams?.get('children')) || 0,
      infants: Number(searchParams?.get('infants')) || 0,
      totalPassengers: Number(searchParams?.get('adults')) + 
                      Number(searchParams?.get('kids')) + 
                      Number(searchParams?.get('children')) + 
                      Number(searchParams?.get('infants')) || 1,
      travelClass: searchParams?.get('class') || 'Economy'
    },
    class: searchParams?.get('class') || 'Economy',
    fareType: searchParams?.get('fareType') || 'Regular',
    flights: parseFlights()
  });

  // Set initial trip type from URL
  useEffect(() => {
    const urlTripType = searchParams?.get('tripType');
    if (urlTripType) {
      setTripType(urlTripType as any);
    }
  }, [searchParams, setTripType]);

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

  // Format date to show just the date and month
  const formatDate = (date?: Date) => {
    if (!date) return '';
    // Create a new date object preserving the exact date
    const utcDate = new Date(
      date.getUTCFullYear(),
      date.getUTCMonth(),
      date.getUTCDate()
    );
    
    return utcDate.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric'
    });
  };

  // Render multi-city route summary
  const renderMultiCityRoute = () => {
    if (!searchData.flights?.length) return null;

    return searchData.flights.map((flight: any, index: number) => (
      <React.Fragment key={index}>
        {index > 0 && <span className="mx-2">→</span>}
        <span>{flight.fromCity || '?'}</span>
        {index === searchData.flights.length - 1 && (
          <>
            <span className="mx-2">→</span>
            <span>{flight.toCity || '?'}</span>
          </>
        )}
      </React.Fragment>
    ));
  };

  // Render multi-city dates summary
  const renderMultiCityDates = () => {
    if (!searchData.flights?.length) return null;

    return searchData.flights.map((flight: any, index: number) => (
      <React.Fragment key={index}>
        {index > 0 && <span className="mx-1">•</span>}
        <span>{flight.departureDate ? formatDate(new Date(flight.departureDate)) : 'Select date'}</span>
      </React.Fragment>
    ));
  };

  // Add this helper function to format the airport code
  const formatLocation = (city: string, airport: string) => {
    if (city && airport) {
      return `${city} (${airport})`;
    }
    return 'Select location';
  };

  // Handle search submission
  const handleSearch = () => {
    const params = new URLSearchParams({
      tripType,
      fromCity: searchData.fromCity,
      fromAirport: searchData.fromAirport,
      toCity: searchData.toCity,
      toAirport: searchData.toAirport,
      departureDate: searchData.departureDate?.toISOString() || '',
      ...(tripType === 'roundTrip' && searchData.returnDate && {
        returnDate: searchData.returnDate.toISOString()
      }),
      travelers: JSON.stringify(searchData.travelers),
      class: searchData.class,
      fareType: searchData.fareType,
      ...(tripType === 'multiCity' && {
        flights: JSON.stringify(searchData.flights)
      })
    });

    router.push(`/flight_results?${params.toString()}`);
    setIsExpanded(false);
  };

  return (
    <div className="bg-white dark:bg-black p-2 sm:p-4">
      {/* Collapsed Search Summary Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 sm:gap-4">
        {/* Search Info - Wrapping Container */}
        <div className="flex flex-wrap items-center gap-1 sm:gap-2 text-xs sm:text-sm">
          {/* Trip Type */}
          <span className="font-medium whitespace-nowrap">
            {tripType === 'oneWay' ? 'One Way' : tripType === 'roundTrip' ? 'Round Trip' : 'Multi City'}
          </span>
          
          {tripType === 'multiCity' ? (
            // Multi City Format with Dates
            <div className="flex flex-wrap items-center gap-1 sm:gap-2">
              {searchData.flights.map((flight: any, index: number) => (
                <React.Fragment key={index}>
                  {index > 0 && <span className="text-gray-400">→</span>}
                  <span className="whitespace-nowrap">{flight.fromCity || flight.fromAirportCode}</span>
                  {index === searchData.flights.length - 1 && (
                    <>
                      <span className="text-gray-400">→</span>
                      <span className="whitespace-nowrap">{flight.toCity || flight.toAirportCode}</span>
                    </>
                  )}
                </React.Fragment>
              ))}
              
              {/* Show dates for each flight segment */}
              {searchData.flights.map((flight: any, index: number) => (
                <React.Fragment key={`date-${index}`}>
                  <span className="text-gray-400">•</span>
                  <span className="whitespace-nowrap">
                    {flight.departureDate ? 
                      formatDate(new Date(flight.departureDate)) : 
                      'Select date'}
                  </span>
                </React.Fragment>
              ))}
            </div>
          ) : (
            // One Way and Round Trip Format
            <div className="flex flex-wrap items-center gap-1 sm:gap-2">
              <span className="text-gray-400">→</span>
              <span className="whitespace-nowrap">{searchData.fromCity || searchData.fromAirport}</span>
              <span className="text-gray-400">→</span>
              <span className="whitespace-nowrap">{searchData.toCity || searchData.toAirport}</span>
              <span className="text-gray-400">•</span>
              <span className="whitespace-nowrap">
                {searchData.departureDate ? formatDate(searchData.departureDate) : 'Select date'}
              </span>
              {tripType === 'roundTrip' && searchData.returnDate && (
                <>
                  <span className="text-gray-400">•</span>
                  <span className="whitespace-nowrap">{formatDate(searchData.returnDate)}</span>
                </>
              )}
            </div>
          )}

          {/* Travelers */}
          <span className="text-gray-400">•</span>
          <span className="whitespace-nowrap">
            {searchData.travelers.totalPassengers} Traveler{searchData.travelers.totalPassengers > 1 ? 's' : ''}
          </span>

          {/* Class */}
          <span className="text-gray-400">•</span>
          <span className="whitespace-nowrap">{searchData.class}</span>

          {/* Fare Type */}
          <span className="text-gray-400">•</span>
          <span className="whitespace-nowrap">{searchData.fareType} Fare</span>
        </div>

        {/* Modify Button */}
        <button
          onClick={() => setIsExpanded(true)}
          className="px-4 py-2 bg-black text-white text-sm rounded-md hover:bg-gray-800 whitespace-nowrap ml-auto sm:ml-0"
        >
          Modify
        </button>
      </div>

      {/* Expanded Form */}
      {isExpanded && (
        <div className="mt-4 border-t border-gray-200 pt-4">
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

          {tripType === 'multiCity' ? (
            <MultiCityContent 
              initialFlights={searchData.flights}
              initialTravelers={searchData.travelers.totalPassengers}
              initialClass={searchData.class}
            />
          ) : (
            // One Way and Round Trip Form
            <>
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
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-0 h-full border border-gray-400 dark:border-gray-700 rounded-lg overflow-visible">
                    <div className={cn(
                      "h-full",
                      tripType === 'roundTrip' && "border-r border-gray-400 dark:border-gray-700"
                    )}>
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
                  <div className="h-full rounded-lg border border-gray-400 dark:border-gray-700 bg-white dark:bg-black">
                  <TravelersInput
                        value={`${searchData.travelers.totalPassengers} Traveler${searchData.travelers.totalPassengers > 1 ? 's' : ''}`}
                        subValue={searchData.class}
                        onClick={() => {
                          console.log('Traveler selection clicked!');
                        }}
                        onChange={(updatedTravelers) => {
                          setSearchData((prev) => ({
                            ...prev,
                            travelers: { ...prev.travelers, ...updatedTravelers }, // ✅ Fixed: Added missing onChange handler
                          }));
                        }}
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
                buttonText="Search Flights"
              />
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
};

export default ModifySearch;