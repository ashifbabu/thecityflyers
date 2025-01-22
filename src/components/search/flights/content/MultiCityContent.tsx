import React, { useState, lazy, Suspense } from 'react';
import { PlusCircleIcon, XMarkIcon } from '@heroicons/react/24/outline';
import { ArrowsRightLeftIcon } from '@heroicons/react/24/outline';
import { cn } from '@/lib/utils';
import LocationInput from '../location/LocationInput';
import DateInput from '../date/DateInput';
import TravelersInput from '../travelers/TravelersInput';
import SearchButton from '../button/SearchButton';
import TripTypes from '../trip/TripTypes';
import FareTypes from '../fare/FareTypes';

interface Flight {
  id: number;
  fromCity: string;
  fromAirport: string;
  toCity: string;
  toAirport: string;
  departureDate?: Date;
}

const MultiCityContent = () => {
  const [flights, setFlights] = useState<Flight[]>([
    {
      id: 1,
      fromCity: 'Dhaka',
      fromAirport: 'Hazrat Shahjalal International Airport',
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
  ]);
  
  const swapLocations = () => {
    setFlights(flights.map(flight => ({
      ...flight,
      fromCity: flight.toCity,
      fromAirport: flight.toAirport,
      toCity: flight.fromCity,
      toAirport: flight.fromAirport,
    })));
  };

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
      setFlights(flights.filter((flight) => flight.id !== id));
    }
  };

  const updateFlight = (id: number, updates: Partial<Flight>) => {
    setFlights(
      flights.map((flight) =>
        flight.id === id ? { ...flight, ...updates } : flight
      )
    );
  };

  return (
    <div className="w-full bg-white dark:bg-black p-6 space-y-6">
      <Suspense fallback={<div className="h-8" />}>
        <TripTypes />
      </Suspense>

      <div className="space-y-4">
        {flights.map((flight, index) => (
          <div
            key={flight.id}
            className={cn(
              'grid grid-cols-1 lg:grid-cols-12 gap-4',
              'p-4 rounded-lg',
              'border border-gray-200 dark:border-gray-700'
            )}
          >
        {/* Location Selection */}
        <div className="lg:col-span-5">
          <div className="relative grid grid-rows-2 gap-0 rounded-lg border border-gray-400 dark:border-gray-700 bg-white dark:bg-black">
            <Suspense fallback={<div className="h-24" />}>
              {/* From Section */}
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
              {/* To Section */}
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

            <div className="lg:col-span-4">
              <div className="h-full bg-white dark:bg-black rounded-lg border border-gray-400 dark:border-gray-600">
                <DateInput
                  type="departure"
                  value="Select date"
                  subValue=""
                  selectedDate={flight.departureDate} // Updated to match `DateInput` prop
                  onDateSelect={(type, date) => {
                    updateFlight(flight.id, { departureDate: date });
                  }}
                />
              </div>
            </div>

            {index === 0 && (
              <div className="lg:col-span-3 rounded-lg border border-gray-400 dark:border-gray-600 bg-white dark:bg-black">
                <TravelersInput
                  value="1 Traveler"
                  subValue="Economy"
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

      <div className="flex justify-between items-center">
        <button
          onClick={handleAddFlight}
          disabled={flights.length >= 6}
          className={cn(
            'flex items-center gap-2 px-4 py-2 rounded-md',
            'text-sm font-medium',
            flights.length >= 6
              ? 'text-gray-400 cursor-not-allowed'
              : 'text-black dark:text-white hover:bg-gray-100 dark:hover:bg-gray-800'
          )}
        >
          <PlusCircleIcon className="h-5 w-5" />
          <span>Add city</span>
        </button>

        <div className="text-sm text-gray-500">{flights.length}/6 flights</div>
      </div>

      <Suspense fallback={<div className="h-12" />}>
        <FareTypes />
      </Suspense>

      <div className="flex justify-center w-full">
        <SearchButton />
      </div>
    </div>
  );
};

export default MultiCityContent;
