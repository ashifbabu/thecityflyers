'use client';

import React, { useState, lazy, Suspense } from 'react';
import { PlusCircleIcon, XMarkIcon } from '@heroicons/react/24/outline';
import { cn } from '@/lib/utils';
import LocationInput from '../location/LocationInput';
import DateInput from '../date/DateInput';
import TravelersInput from '../travelers/TravelersInput';
import SearchButton from '../button/SearchButton';
import type { FlightSearchError } from '@/types/flight';

interface Flight {
  id: number;
  fromCity: string;
  fromAirport: string;
  toCity: string;
  toAirport: string;
  departureDate?: Date;
}

interface MultiCityContentProps {
  initialFlights?: any[];
  initialTravelers?: number;
  initialClass?: string;
}

const MultiCityContent = ({ 
  initialFlights = [], 
  initialTravelers = 1,
  initialClass = 'Economy'
}: MultiCityContentProps) => {
  // Initialize flights with provided data or defaults
  const [flights, setFlights] = useState<Flight[]>(() => {
    if (initialFlights && initialFlights.length >= 2) {
      return initialFlights.map((flight, index) => ({
        id: index + 1,
        fromCity: flight.fromCity || '',
        fromAirport: flight.fromAirport || '',
        toCity: flight.toCity || '',
        toAirport: flight.toAirport || '',
        departureDate: flight.departureDate ? new Date(flight.departureDate) : undefined,
      }));
    }
    return [
      {
        id: 1,
        fromCity: '',
        fromAirport: '',
        toCity: '',
        toAirport: '',
        departureDate: undefined,
      },
      {
        id: 2,
        fromCity: '',
        fromAirport: '',
        toCity: '',
        toAirport: '',
        departureDate: undefined,
      },
    ];
  });

  const [errors, setErrors] = useState<FlightSearchError[]>([]);

  const handleAddFlight = () => {
    if (flights.length < 6) {
      setFlights([
        ...flights,
        {
          id: Date.now(),
          fromCity: '',
          fromAirport: '',
          toCity: '',
          toAirport: '',
          departureDate: undefined,
        },
      ]);
    }
  };

  const handleRemoveFlight = (id: number) => {
    if (flights.length > 2) {
      setFlights(flights.filter(flight => flight.id !== id));
    }
  };

  const updateFlight = (id: number, updates: Partial<Flight>) => {
    setFlights(flights.map(flight => 
      flight.id === id ? { ...flight, ...updates } : flight
    ));
  };

  const handleSearchErrors = (searchErrors: FlightSearchError[]) => {
    setErrors(searchErrors);
    setTimeout(() => setErrors([]), 5000);
  };

  return (
    <div className="w-full bg-white dark:bg-black p-6 space-y-6">
      {/* Error Messages */}
      {errors.length > 0 && (
        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
          <ul className="list-disc list-inside space-y-1">
            {errors.map((error, index) => (
              <li key={index} className="text-red-600 dark:text-red-400 text-sm">
                {error.message}
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Flight Segments */}
      <div className="space-y-4">
        {flights.map((flight, index) => (
          <div 
            key={flight.id}
            className={cn(
              "grid grid-cols-1 lg:grid-cols-12 gap-4",
              "p-4 rounded-lg",
              "border border-gray-200 dark:border-gray-700"
            )}
          >
            <div className="lg:col-span-5">
              <div className="grid grid-rows-2 gap-0 rounded-lg border border-gray-400 dark:border-gray-700 bg-white dark:bg-black">
                <div className="border-b border-gray-300 dark:border-gray-600">
                  <LocationInput
                    type="from"
                    value={flight.fromCity}
                    subValue={flight.fromAirport}
                    onChange={(city, airportName) => {
                      updateFlight(flight.id, {
                        fromCity: city,
                        fromAirport: airportName,
                      });
                    }}
                  />
                </div>
                <LocationInput
                  type="to"
                  value={flight.toCity}
                  subValue={flight.toAirport}
                  onChange={(city, airportName) => {
                    updateFlight(flight.id, {
                      toCity: city,
                      toAirport: airportName,
                    });
                  }}
                />
              </div>
            </div>

            <div className="lg:col-span-4">
              <div className="h-full bg-white dark:bg-black rounded-lg border border-gray-400 dark:border-gray-600">
                <DateInput
                  type="departure"
                  value={flight.departureDate?.toISOString().slice(0, 10) || 'Select date'}
                  subValue=""
                  selectedDate={flight.departureDate}
                  onDateSelect={(type, date) => {
                    updateFlight(flight.id, { departureDate: date });
                  }}
                />
              </div>
            </div>

            {index === 0 && (
              <div className="lg:col-span-3 rounded-lg border border-gray-400 dark:border-gray-600 bg-white dark:bg-black">
                <TravelersInput
                  value={`${initialTravelers} Traveler${initialTravelers !== 1 ? 's' : ''}`}
                  subValue={initialClass}
                  onClick={() => console.log('Open travelers modal')}
                />
              </div>
            )}

            {index > 0 && (
              <div className="lg:col-span-3 flex items-center justify-end">
                <button
                  onClick={() => handleRemoveFlight(flight.id)}
                  className="p-2 text-gray-500 hover:text-red-500 transition-colors"
                  aria-label="Remove flight"
                >
                  <XMarkIcon className="h-6 w-6" />
                </button>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Add City Button and Counter */}
      <div className="flex justify-between items-center">
        <button
          onClick={handleAddFlight}
          disabled={flights.length >= 6}
          className={cn(
            "flex items-center gap-2 px-4 py-2 rounded-md",
            "text-sm font-medium",
            flights.length >= 6
              ? "text-gray-400 cursor-not-allowed"
              : "text-black dark:text-white hover:bg-gray-100 dark:hover:bg-gray-800"
          )}
        >
          <PlusCircleIcon className="h-5 w-5" />
          <span>Add city</span>
        </button>

        <div className="text-sm text-gray-500">
          {flights.length}/6 flights
        </div>
      </div>

      {/* Search Button */}
      <div className="flex justify-center w-full">
        <SearchButton 
          searchData={{ flights }}
          onError={handleSearchErrors}
          buttonText="Search Flights"
        />
      </div>
    </div>
  );
};

export default MultiCityContent;