'use client';

import React, { useState, useEffect } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { cn } from '@/lib/utils';
import { ChevronDownIcon, ChevronUpIcon, ArrowsRightLeftIcon } from '@heroicons/react/24/outline';
import { useTripType } from '@/hooks/use-trip-type';
import LocationInput from '../location/LocationInput';
import DateInput from '../date/DateInput';
import TravelersInput from '../travelers/TravelersInput';
import SearchButton from '../button/SearchButton';
import type { FlightSearchError } from '@/types/flight';
import MultiCityContent from '../content/MultiCityContent';

const ModifySearch = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { tripType, setTripType } = useTripType();
  const [isExpanded, setIsExpanded] = useState(false);
  const [errors, setErrors] = useState<FlightSearchError[]>([]);

  // Parse multi-city flights from URL
  const parseMultiCityFlights = () => {
    try {
      const flightsParam = searchParams?.get('flights');
      if (flightsParam) {
        return JSON.parse(decodeURIComponent(flightsParam));
      }
    } catch (error) {
      console.error('Error parsing multi-city flights:', error);
    }
    return [];
  };

  // Initialize state with URL parameters
  const [searchData, setSearchData] = useState({
    fromCity: searchParams?.get('fromCity') || '',
    fromAirport: searchParams?.get('from') || '',
    fromAirportCode: searchParams?.get('from') || '',
    toCity: searchParams?.get('toCity') || '',
    toAirport: searchParams?.get('to') || '',
    toAirportCode: searchParams?.get('to') || '',
    departureDate: searchParams?.get('departure')
      ? new Date(searchParams.get('departure')!)
      : undefined,
    returnDate: searchParams?.get('return')
      ? new Date(searchParams.get('return')!)
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
    flights: parseMultiCityFlights()
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
      fromAirportCode: prev.toAirportCode,
      toCity: prev.fromCity,
      toAirport: prev.fromAirport,
      toAirportCode: prev.fromAirportCode
    }));
  };

  const handleTripTypeChange = (newTripType: 'oneWay' | 'roundTrip' | 'multiCity') => {
    setTripType(newTripType);
    if (newTripType === 'oneWay') {
      setSearchData(prev => ({ ...prev, returnDate: undefined }));
    }
  };

  const handleSearch = () => {
    const params = new URLSearchParams();
    
    params.set('tripType', tripType);

    if (tripType === 'multiCity') {
      // Handle multi-city search
      if (searchData.flights && searchData.flights.length > 0) {
        params.set('flights', JSON.stringify(searchData.flights));
      }
    } else {
      // Handle one-way and round-trip search
      params.set('from', searchData.fromAirportCode);
      params.set('to', searchData.toAirportCode);
      params.set('departure', searchData.departureDate?.toISOString().split('T')[0] || '');
      if (tripType === 'roundTrip' && searchData.returnDate) {
        params.set('return', searchData.returnDate.toISOString().split('T')[0]);
      }
    }

    // Add common parameters
    params.set('adults', searchData.travelers.adults.toString());
    params.set('kids', searchData.travelers.kids.toString());
    params.set('children', searchData.travelers.children.toString());
    params.set('infants', searchData.travelers.infants.toString());
    params.set('class', searchData.travelers.travelClass);

    router.push(`/flight_results?${params.toString()}`);
    setIsExpanded(false);
  };

  // Function to format flight segments for display
  const formatFlightSegments = () => {
    if (tripType === 'multiCity' && searchData.flights?.length > 0) {
      return searchData.flights.map((flight: any, index: number) => (
        <span key={index}>
          {index > 0 && <span className="text-gray-400 mx-1">→</span>}
          {flight.fromAirportCode} → {flight.toAirportCode}
        </span>
      ));
    }
    return (
      <>
        <span>{searchData.fromCity || searchData.fromAirportCode}</span>
        <span className="text-gray-400 mx-1">→</span>
        <span>{searchData.toCity || searchData.toAirportCode}</span>
      </>
    );
  };

  return (
    <div className="bg-white dark:bg-black shadow-lg rounded-lg border border-gray-200 dark:border-gray-800">
      {/* Collapsed View */}
      <div className="p-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          {/* Trip Summary */}
          <div className="flex flex-wrap items-center gap-2 text-sm">
            <span className="font-medium">
              {tripType === 'oneWay' ? 'One Way' : tripType === 'roundTrip' ? 'Round Trip' : 'Multi City'}
            </span>
            <span className="text-gray-400">•</span>
            {formatFlightSegments()}
            <span className="text-gray-400">•</span>
            {tripType === 'multiCity' ? (
              searchData.flights?.map((flight: any, index: number) => (
                <React.Fragment key={index}>
                  {index > 0 && <span className="text-gray-400 mx-1">|</span>}
                  <span>
                    {new Date(flight.departureDate).toLocaleDateString('en-US', {
                      day: 'numeric',
                      month: 'short',
                      year: 'numeric'
                    })}
                  </span>
                </React.Fragment>
              ))
            ) : (
              <>
                <span>
                  {searchData.departureDate?.toLocaleDateString('en-US', {
                    day: 'numeric',
                    month: 'short',
                    year: 'numeric'
                  })}
                </span>
                {tripType === 'roundTrip' && searchData.returnDate && (
                  <>
                    <span className="text-gray-400">-</span>
                    <span>
                      {searchData.returnDate.toLocaleDateString('en-US', {
                        day: 'numeric',
                        month: 'short',
                        year: 'numeric'
                      })}
                    </span>
                  </>
                )}
              </>
            )}
            <span className="text-gray-400">•</span>
            <span>
              {searchData.travelers.totalPassengers} Traveller{searchData.travelers.totalPassengers !== 1 ? 's' : ''}, {searchData.travelers.travelClass}
            </span>
          </div>

          {/* Modify Button */}
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className={cn(
              "flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-md transition-colors",
              "bg-black dark:bg-white text-white dark:text-black",
              "hover:bg-gray-800 dark:hover:bg-gray-200"
            )}
          >
            Modify
            {isExpanded ? (
              <ChevronUpIcon className="w-4 h-4" />
            ) : (
              <ChevronDownIcon className="w-4 h-4" />
            )}
          </button>
        </div>
      </div>

      {/* Expanded Search Form */}
      {isExpanded && (
        <div className="border-t border-gray-200 dark:border-gray-700 p-4">
          {/* Trip Type Selection */}
          <div className="mb-4 flex gap-4">
            {['oneWay', 'roundTrip', 'multiCity'].map((type) => (
              <button
                key={type}
                onClick={() => handleTripTypeChange(type as any)}
                className={cn(
                  "px-4 py-2 rounded-md text-sm font-medium transition-colors",
                  tripType === type
                    ? "bg-black dark:bg-white text-white dark:text-black"
                    : "bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700"
                )}
              >
                {type === 'oneWay' ? 'One Way' : type === 'roundTrip' ? 'Round Trip' : 'Multi City'}
              </button>
            ))}
          </div>

          {errors.length > 0 && (
            <div className="mb-4 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
              <ul className="list-disc list-inside space-y-1">
                {errors.map((error, index) => (
                  <li key={index} className="text-red-600 dark:text-red-400 text-sm">
                    {error.message}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {tripType === 'multiCity' ? (
            <MultiCityContent
              initialFlights={searchData.flights}
              initialTravelers={searchData.travelers.totalPassengers}
              initialClass={searchData.travelers.travelClass}
            />
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
              {/* Location Selection */}
              <div className="lg:col-span-5">
                <div className="relative grid grid-rows-2 gap-0 rounded-lg border border-gray-200 dark:border-gray-700">
                  <div className="border-b border-gray-200 dark:border-gray-700">
                    <LocationInput
                      type="from"
                      value={searchData.fromCity}
                      subValue={searchData.fromAirport}
                      onChange={(city, airportName, code) => {
                        setSearchData(prev => ({
                          ...prev,
                          fromCity: city,
                          fromAirport: airportName,
                          fromAirportCode: code
                        }));
                      }}
                    />
                  </div>
                  <LocationInput
                    type="to"
                    value={searchData.toCity}
                    subValue={searchData.toAirport}
                    onChange={(city, airportName, code) => {
                      setSearchData(prev => ({
                        ...prev,
                        toCity: city,
                        toAirport: airportName,
                        toAirportCode: code
                      }));
                    }}
                  />
                  <button
                    onClick={swapLocations}
                    className="absolute right-4 top-1/2 -translate-y-1/2 z-10 p-2 rounded-full bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700"
                    aria-label="Swap locations"
                  >
                    <ArrowsRightLeftIcon className="w-4 h-4 rotate-90" />
                  </button>
                </div>
              </div>

              {/* Date Selection */}
              <div className="lg:col-span-4">
                <div className="grid grid-cols-2 h-full rounded-lg border border-gray-200 dark:border-gray-700 overflow-visible">
                  <div className={cn(
                    "h-full",
                    tripType === 'roundTrip' && "border-r border-gray-200 dark:border-gray-700"
                  )}>
                    <DateInput
                      type="departure"
                      value={searchData.departureDate?.toLocaleDateString() || 'Select date'}
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
                      value={searchData.returnDate?.toLocaleDateString() || 'Select date'}
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
                <div className="h-full rounded-lg border border-gray-200 dark:border-gray-700">
                  <TravelersInput
                    value={`${searchData.travelers.totalPassengers} Traveller${searchData.travelers.totalPassengers !== 1 ? 's' : ''}`}
                    subValue={searchData.travelers.travelClass}
                    onClick={() => {}}
                    onChange={(updatedTravelers) => {
                      setSearchData(prev => ({
                        ...prev,
                        travelers: updatedTravelers
                      }));
                    }}
                  />
                </div>
              </div>
            </div>
          )}

          {/* Search Button */}
          <div className="mt-4 flex justify-end">
            <button
              onClick={handleSearch}
              className={cn(
                "px-6 py-2 rounded-md text-sm font-medium transition-colors",
                "bg-black dark:bg-white text-white dark:text-black",
                "hover:bg-gray-800 dark:hover:bg-gray-200"
              )}
            >
              Search Flights
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ModifySearch;