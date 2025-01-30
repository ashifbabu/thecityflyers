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
        // Extract flight details based on source type (bdfare / flyhub)
        const segment =
          flight.Segments?.[0]?.Segments?.[0] || // For FlyHub
          flight.Segments?.[0]; // For BD Fare

        const price =
          flight.Pricing?.TotalFare || // For FlyHub
          flight.Pricing?.[0]?.Total; // For BD Fare

        return (
          <FlightCard 
            key={index}
            airlineName={segment?.Airline?.Name || "Unknown Airline"}
            flightNumber={segment?.FlightNumber || "N/A"}
            departureAirport={segment?.From?.Name || "Unknown Airport"}
            departureTime={segment?.From?.DepartureTime || "Unknown Time"}
            arrivalAirport={segment?.To?.Name || "Unknown Airport"}
            arrivalTime={segment?.To?.ArrivalTime || "Unknown Time"}
            duration={segment?.Duration || "N/A"}
            price={`BDT ${price}` || "Price Not Available"}
            airlineLogo={segment?.Airline?.Logo || ""}
            refundable={flight.Refundable || false}
          />
        );
      })}
    </div>
  );
};

export default FlightResultsList;