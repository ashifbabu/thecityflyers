'use client';

import React, { Suspense } from 'react';
import { useSearchParams } from 'next/navigation';

const FlightResultsContent = () => {
  const searchParams = useSearchParams();
  const tripType = searchParams.get('tripType');

  console.log('Search Params:', Object.fromEntries(searchParams.entries())); // Debug log

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">Flight Search Results</h1>
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
        <p className="text-gray-600 dark:text-gray-300">
          Showing results for {tripType} flight
        </p>
      </div>
    </div>
  );
};

const FlightResultsPage = () => {
  return (
    <Suspense fallback={<div>Loading flight search results...</div>}>
      <FlightResultsContent />
    </Suspense>
  );
};

export default FlightResultsPage;
