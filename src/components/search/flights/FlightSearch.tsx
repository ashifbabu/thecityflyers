'use client';

import React, { useState } from 'react';
import { cn } from '@/lib/utils';
import SearchTabs from '@/components/tabs/SearchTabs';
import TripTypeSelector from './trip/TripTypeSelector';
import PassengerSelector from './passenger/PassengerSelector';
import FareTypeSelector from './fare/FareTypeSelector';
import SearchButton from './button/SearchButton';

const FlightSearch = () => {
  // Define searchData state
  const [searchData, setSearchData] = useState({
    fromCity: '',
    toCity: '',
    departureDate: undefined as Date | undefined,
    returnDate: undefined as Date | undefined,
    travelers: {
      adults: 1,                 // ✅ Default to 1 adult
      kids: 0,                   // ✅ Default to 0 kids
      children: 0,               // ✅ Default to 0 children
      infants: 0,                // ✅ Default to 0 infants
      totalPassengers: 1,        // ✅ Matches the sum of all travelers
      travelClass: 'Economy',    // ✅ Default travel class
    },
    fareType: 'economy',
    flights: [],
  });
  

  

  return (
    <div className="w-full max-w-7xl mx-auto p-6">
      <div
        className={cn(
          "bg-white dark:bg-gray-800 rounded-xl shadow-lg",
          "border border-gray-200 dark:border-gray-700",
          "overflow-hidden"
        )}
      >
        {/* Search Type Tabs */}
        <SearchTabs />

        <div className="p-6">
          {/* Trip Type */}
          <TripTypeSelector />

          <div className="mt-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Passenger Selection */}
            <PassengerSelector />
          </div>

          {/* Fare Type */}
          <div className="mt-6">
            <FareTypeSelector />
          </div>

          {/* Search Button */}
          <div className="mt-6 flex justify-center">
            <SearchButton searchData={searchData} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default FlightSearch;
