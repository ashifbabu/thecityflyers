'use client';

import React from 'react';
import { useSearchParams } from 'next/navigation';
import FlightCard from '@/components/flightcard/FlightCard';
import MultiCityFlightCard from '@/components/flightcard/MultiCityFlightCard';

interface FlightResultsListProps {
  flights: Array<any>; // Using 'any' temporarily for dynamic API response
}

const FlightResultsList: React.FC<FlightResultsListProps> = ({ flights }) => {
  const searchParams = useSearchParams();
  const tripType = searchParams?.get('tripType');

  if (!Array.isArray(flights)) {
    return (
      <div className="w-full max-w-5xl mx-auto">
        <p className="text-center text-muted-foreground">No flight results available</p>
      </div>
    );
  }

  return (
    <div className="w-full max-w-5xl mx-auto space-y-4">
      {flights.map((flight) => {
        if (!flight) return null;

        // Use MultiCityFlightCard for multi-city trips
        if (tripType === 'multiCity') {
          return (
            <MultiCityFlightCard 
              key={flight.OfferId || Math.random()} 
              multiCityOffer={flight} 
            />
          );
        }

        // Use regular FlightCard for one-way and round-trip
        return (
          <FlightCard 
            key={flight.OfferId || Math.random()} 
            offer={flight} 
          />
        );
      })}
    </div>
  );
};

export default FlightResultsList;
