'use client';

import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import ModifySearch from '@/components/search/flights/modify/ModifySearch';
import FlightCalendarSection from '@/components/search/flights/calendar/FlightCalendarSection';
import FlightCard from '@/components/flightcard/FlightCard';

const FlightResultsPage = () => {
  const searchParams = useSearchParams();
  const [departureDate, setDepartureDate] = useState<Date | undefined>(
    searchParams.get('departureDate') ? new Date(searchParams.get('departureDate')!) : undefined
  );
  const [returnDate, setReturnDate] = useState<Date | undefined>(
    searchParams.get('returnDate') ? new Date(searchParams.get('returnDate')!) : undefined
  );
  const [flights, setFlights] = useState<any[]>([]);

  // Load flights from search params
  useEffect(() => {
    const flightsParam = searchParams.get('flights');
    if (flightsParam) {
      try {
        setFlights(JSON.parse(flightsParam).flights);
      } catch (error) {
        console.error('Error parsing flight results:', error);
      }
    }
  }, [searchParams]);

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
        {flights.length > 0 ? (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {flights.map((flight, index) => (
              <FlightCard key={index} flight={flight} />
            ))}
          </div>
        ) : (
          <p className="text-gray-600 dark:text-gray-400">No flights found. Please refine your search.</p>
        )}
      </div>
    </div>
  );
};

export default FlightResultsPage;
