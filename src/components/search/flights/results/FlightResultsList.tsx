'use client';

import React from 'react';
import FlightCard from './FlightCard';

interface FlightResultsListProps {
  flights: any[];
}

const FlightResultsList: React.FC<FlightResultsListProps> = ({ flights }) => {
  if (!flights || flights.length === 0) {
    return <p className="text-gray-600 dark:text-gray-400">No flights available for this search.</p>;
  }

        return (
          <div className="space-y-4">
            {flights.map((flight, index) => {
        const segment = flight.Segments?.[0];

        return (
          <FlightCard 
            key={flight.OfferId || `${segment?.FlightNumber}-${index}`}  // Fallback key
            offer={{
              Segments: [segment],
              Pricing: flight.Pricing,
              Refundable: flight.Refundable,
              Airline: segment?.Airline,
              FlightNumber: segment?.FlightNumber,
              Departure: segment?.From,
              Arrival: segment?.To,
              CabinClass: segment?.CabinClass,
              Duration: segment?.Duration,
              FareType: flight.FareType,
              BaggageAllowance: flight.BaggageAllowance,
              SeatsRemaining: flight.SeatsRemaining
            }}
          />
        );
      })}
    </div>
  );
};

export default FlightResultsList;
