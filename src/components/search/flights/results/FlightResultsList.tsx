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
      {flights.map((flight, index) => (
        <FlightCard
          key={flight.OfferId || `${flight.Segments[0]?.FlightNumber}-${index}`}
          offer={{
            Segments: flight.Segments, // Send all segments
            Pricing: flight.Pricing,   // Send all pricing details
            Refundable: flight.Refundable,
            Airline: flight.Segments[0]?.Airline,
            FlightNumber: flight.Segments[0]?.FlightNumber,
            Departure: flight.Segments[0]?.From,
            Arrival: flight.Segments[0]?.To,
            CabinClass: flight.Segments[0]?.CabinClass,
            Duration: flight.Segments[0]?.Duration,
            FareType: flight.FareType,
            BaggageAllowance: flight.BaggageAllowance,
            SeatsRemaining: flight.SeatsRemaining,
          }}
        />
      ))}
    </div>
  );
};

export default FlightResultsList;
