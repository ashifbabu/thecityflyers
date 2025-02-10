'use client';

import React from 'react';
import FlightCard from '@/components/flightcard/FlightCard';

interface FlightResultsListProps {
  flights: Array<any>; // Using 'any' temporarily for dynamic API response
}

const FlightResultsList: React.FC<FlightResultsListProps> = ({ flights }) => {
  if (!Array.isArray(flights)) {
    return (
      <div className="w-full max-w-5xl mx-auto">
        <p className="text-center text-muted-foreground">No flight results available</p>
      </div>
    );
  }

  return (
    <div className="w-full max-w-5xl mx-auto space-y-4">
      {flights.map((flight) => (
        flight && <FlightCard key={flight.OfferId || Math.random()} offer={flight} />
      ))}
    </div>
  );
};

export default FlightResultsList;
