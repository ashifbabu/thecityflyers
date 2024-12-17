'use client'

import React from 'react';
import { cn } from '@/lib/utils';
import SearchTabs from './tabs/SearchTabs';
import TripTypeSelector from './trip/TripTypeSelector';
import LocationSelector from './location/LocationSelector';
import DateSelector from './date/DateSelector';
import PassengerSelector from './passenger/PassengerSelector';
import FareTypeSelector from './fare/FareTypeSelector';
import SearchButton from './button/SearchButton';

const FlightSearch = () => {
  return (
    <div className="w-full max-w-7xl mx-auto p-6">
      <div className={cn(
        "bg-white dark:bg-gray-800 rounded-xl shadow-lg",
        "border border-gray-200 dark:border-gray-700",
        "overflow-hidden"
      )}>
        {/* Search Type Tabs */}
        <SearchTabs />

        <div className="p-6">
          {/* Trip Type */}
          <TripTypeSelector />

          <div className="mt-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Location Selection */}
            <div className="lg:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-4">
              <LocationSelector type="from" />
              <LocationSelector type="to" />
            </div>

            {/* Date Selection */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-1 gap-4">
              <DateSelector type="departure" />
              <DateSelector type="return" disabled />
            </div>

            {/* Passenger Selection */}
            <PassengerSelector />
          </div>

          {/* Fare Type */}
          <div className="mt-6">
            <FareTypeSelector />
          </div>

          {/* Search Button */}
          <div className="mt-6 flex justify-center">
            <SearchButton />
          </div>
        </div>
      </div>
    </div>
  );
};

export default FlightSearch;