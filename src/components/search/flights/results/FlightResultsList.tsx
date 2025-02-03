'use client';

import React from 'react';
import FlightCard from '@/components/flightcard/FlightCard';

interface FlightResultsListProps {
  flights: Array<any>; // Using 'any' temporarily for dynamic API response
}

const FlightResultsList: React.FC<FlightResultsListProps> = ({ flights }) => {
  return (
    <div className="w-full max-w-5xl mx-auto space-y-4">
      {flights.map((flight) => (
        <FlightCard key={flight.OfferId} offer={flight} />
      ))}
    </div>
  );
};

export default FlightResultsList;
