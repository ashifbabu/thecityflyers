'use client';

import React, { useMemo, useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import FlightCard from '@/components/flightcard/FlightCard';
import MultiCityFlightCard from '@/components/flightcard/MultiCityFlightCard';
import OneWayFlightCard from '@/components/flightcard/OneWayFlightCard';
import ReturnFlightCard from '@/components/flightcard/ReturnFlightCard';
import FlightLoadingSkeleton from './FlightLoadingSkeleton';

interface FlightResultsListProps {
  flights: any[];
  isLoading?: boolean;
}

const FlightResultsList: React.FC<FlightResultsListProps> = ({ flights, isLoading = false }) => {
  const searchParams = useSearchParams();
  const tripType = searchParams?.get('tripType');
  const totalPassengers = parseInt(searchParams.get('passengers') || '1', 10);
  const [isTransitioning, setIsTransitioning] = useState(false);

  // Show loading state during transitions
  useEffect(() => {
    if (isLoading) {
      setIsTransitioning(true);
      const timer = setTimeout(() => setIsTransitioning(false), 800);
      return () => clearTimeout(timer);
    }
  }, [isLoading]);

  // Calculate summary statistics
  const summary = useMemo(() => {
    if (!Array.isArray(flights)) return { flightCount: 0, airlineCount: 0 };

    const uniqueAirlines = new Set(
      flights.map(flight => {
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

  if (isLoading || isTransitioning) {
    return <FlightLoadingSkeleton />;
  }

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
        Showing {summary.flightCount} flight{summary.flightCount !== 1 ? 's' : ''} & {summary.airlineCount} airline{summary.airlineCount !== 1 ? 's' : ''}
      </div>

      {/* Flight Cards */}
      <div className="space-y-4">
        {flights.map((flight, index) => {
          if (!flight) return null;

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