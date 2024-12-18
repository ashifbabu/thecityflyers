import React from 'react';
import FlightSearchForm from '@/components/search/FlightSearchForm';
import SearchContent from '@/components/search/content/SearchContent';
export default function Home() {
  return (
    <div className="flex-1">
      <FlightSearchForm />
      <SearchContent/>
    </div>
  );
}