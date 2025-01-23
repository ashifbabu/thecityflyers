'use client';

import React, { Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import ModifySearch from '@/components/search/flights/modify/ModifySearch';

const FlightResultsContent = () => {
  const searchParams = useSearchParams();
  const tripType = searchParams.get('tripType');

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Modify Search Section */}
      <section>
        <ModifySearch />
      </section>

      {/* Results Section */}
      <section className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
        <h2 className="text-xl font-semibold mb-4">Flight Results</h2>
        <div className="text-gray-700 dark:text-gray-200">
          {/* Placeholder content */}
          <p>Displaying results for your search...</p>
        </div>
      </section>
    </div>
  );
};

const Page = () => {
  return (
    <Suspense fallback={<p>Loading...</p>}>
      <FlightResultsContent />
    </Suspense>
  );
};

export default Page;
