'use client';

import React, { useMemo, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import FlightCard from '@/components/flightcard/FlightCard';
import MultiCityFlightCard from '@/components/flightcard/MultiCityFlightCard';
import OneWayFlightCard from '@/components/flightcard/OneWayFlightCard';
import ReturnFlightCard from '@/components/flightcard/ReturnFlightCard';

interface FlightResultsListProps {
  flights: any[];
}

const FlightResultsList: React.FC<FlightResultsListProps> = ({ flights }) => {
  const searchParams = useSearchParams();
  const tripType = searchParams?.get('tripType');
  const totalPassengers = parseInt(searchParams.get('passengers') || '1', 10);

  // Calculate summary statistics
  const summary = useMemo(() => {
    if (!Array.isArray(flights)) return { flightCount: 0, airlineCount: 0 };

    // Get unique airlines
    const uniqueAirlines = new Set(
      flights.map(flight => {
        // For multi-city or return flights, check all segments
        const segments = [
          ...(flight.OutboundSegments || []),
          ...(flight.InboundSegments || [])
        ];
        return segments[0]?.MarketingCarrier?.carrierName;
      }).filter(Boolean)
    );

    return {
      flightCount: flights.length,
      airlineCount: uniqueAirlines.size
    };
  }, [flights]);

  // Instead of creating new fare objects, use the fare directly from the flight
  const flightFares = flights.map(flight => ({
    id: flight.OfferId,
    fare: flight.fare // Use the fare we calculated in getSortedAndFilteredFlights
  }));

  console.log('Flight fares:', flightFares);

  console.log('Rendering FlightResultsList with flights:', flights.slice(0, 3));

  if (!Array.isArray(flights)) {
    return (
      <div className="w-full max-w-5xl mx-auto">
        <p className="text-center text-muted-foreground">No flight results available</p>
      </div>
    );
  }

  return (
    <div className="w-full max-w-5xl mx-auto">
      {/* Results Summary */}
      <div className="mb-4 text-sm text-muted-foreground">
        Showing {summary.flightCount} flight{summary.flightCount !== 1 ? 's' : ''} & {summary.airlineCount} Airline{summary.airlineCount !== 1 ? 's' : ''}
      </div>

      {/* Flight Cards */}
      <div className="space-y-4">
        {flights.map((flight, index) => {
          if (!flight) return null;

          // Debug log for each flight's fare
          console.log(`Flight ${index} fare:`, {
            id: flight.OfferId,
            fare: flight.fare
          });

          // Use appropriate card based on trip type
          switch(tripType) {
            case 'multiCity':
              return (
                <MultiCityFlightCard 
                  key={flight.OfferId || index} 
                  multiCityOffer={flight} 
                />
              );
            
            case 'oneWay':
              return (
                <OneWayFlightCard 
                  key={flight.OfferId || index} 
                  offer={flight}
                  totalPassengers={totalPassengers}
                />
              );
            
            case 'roundTrip':
              return (
                <ReturnFlightCard 
                  key={flight.OfferId || index} 
                  offer={flight}
                  totalPassengers={totalPassengers}
                />
              );
            
            default:
              return (
                <FlightCard 
                  key={flight.OfferId || index} 
                  offer={flight} 
                />
              );
          }
        })}
      </div>
    </div>
  );
};

export default FlightResultsList;