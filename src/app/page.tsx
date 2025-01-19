import React from 'react';
import FlightSearchForm from '@/components/search/flights/FlightSearchForm';
import SearchContent from '@/components/search/flights/content/SearchContent';
export default function Home() {
  return (
    <div className="flex-1">
      <FlightSearchForm />
      <SearchContent/>
    </div>
  );
}