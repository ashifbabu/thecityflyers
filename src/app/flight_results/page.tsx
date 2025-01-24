'use client';

import React, { useState } from 'react';
import { useSearchParams } from 'next/navigation';
import ModifySearch from '@/components/search/flights/modify/ModifySearch';
import FlightCalendarSection from '@/components/search/flights/calendar/FlightCalendarSection';

const FlightResultsPage = () => {
  const searchParams = useSearchParams();
  const [departureDate, setDepartureDate] = useState<Date | undefined>(
    searchParams.get('departureDate') 
      ? new Date(searchParams.get('departureDate')!) 
      : undefined
  );
  const [returnDate, setReturnDate] = useState<Date | undefined>(
    searchParams.get('returnDate')
      ? new Date(searchParams.get('returnDate')!)
      : undefined
  );

  return (
    <div className="container mx-auto p-4 space-y-6">
      <ModifySearch />
      
      <FlightCalendarSection
        departureDate={departureDate}
        returnDate={returnDate}
        onDepartureDateSelect={setDepartureDate}
        onReturnDateSelect={setReturnDate}
      />

      <div className="bg-white dark:bg-black p-6 rounded-lg border border-gray-200 dark:border-gray-800">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-4">Flight Results</h2>
        <p className="text-gray-600 dark:text-gray-400">Displaying results for your search...</p>
      </div>
    </div>
  );
};

export default FlightResultsPage;