'use client';

import React, { useMemo } from 'react';
import { cn } from '@/lib/utils';
import { AdjustmentsHorizontalIcon } from '@heroicons/react/24/outline';
import AirlineFilter from '../filter/AirlineFilter';

export type SortOption = {
  fare: 'lowToHigh' | 'highToLow';
  stops: string[];
  takeoff: 'earlierToLater' | 'laterToEarlier';
  airline: string[];
  layovers: 'lowToHigh' | 'highToLow';
};

interface MarketingCarrier {
  carrierDesigCode: string;
  carrierName: string;
}

interface Segment {
  MarketingCarrier: MarketingCarrier;
  Logo: string;
}

interface Flight {
  OutboundSegments: Segment[];
  Pricing?: {
    totalPayable?: {
      total: number;
    };
  };
}

interface FlightResponse {
  flights: any[];
  [key: string]: any;
}

interface FlightSortingOptionsProps {
  onSortChange: (sortOptions: Partial<SortOption>) => void;
  availableAirlines: string[];
  currentSort: Partial<SortOption>;
  flights: Flight[] | { flights: Flight[] } | any[];
}

const FlightSortingOptions: React.FC<FlightSortingOptionsProps> = ({
  onSortChange,
  availableAirlines,
  currentSort,
  flights = []
}) => {
  // Process flights to get airline data
  const airlinesData = useMemo(() => {
    console.log('Processing flights:', flights);
    const airlineMap = new Map();

    // Handle case where flights is an object with a flights property
    const flightsArray = Array.isArray(flights) ? flights : 
                        (flights?.flights && Array.isArray(flights.flights)) ? flights.flights : [];

    console.log('Flights array:', flightsArray);

    // Process each flight
    flightsArray.forEach((flight: Flight) => {
      if (!flight || typeof flight !== 'object') {
        console.log('Invalid flight:', flight);
        return;
      }

      // Get segments from the flight
      const segments = Array.isArray(flight.OutboundSegments) 
        ? flight.OutboundSegments 
        : [];

      if (segments.length === 0) {
        console.log('No segments found for flight:', flight);
        return;
      }

      // Get the marketing carrier from the first segment
      const mainSegment = segments[0];
      if (!mainSegment || !mainSegment.MarketingCarrier) {
        console.log('Invalid main segment:', mainSegment);
        return;
      }

      const airline = mainSegment.MarketingCarrier;
      const code = airline.carrierDesigCode;
      
      if (!code) {
        console.log('No airline code found:', airline);
        return;
      }

      // Get or create airline data
      const existingData = airlineMap.get(code) || {
        code,
        name: airline.carrierName || code,
        logo: mainSegment.Logo || `https://images.kiwi.com/airlines/64/${code}.png`,
        lowestFare: Infinity,
        flightCount: 0
      };

      // Update flight count (count the flight, not segments)
      existingData.flightCount++;

      // Get fare from flight pricing
      const fare = flight.Pricing?.totalPayable?.total;
      if (typeof fare === 'number' && !isNaN(fare) && fare < existingData.lowestFare) {
        existingData.lowestFare = fare;
      }

      // Store updated airline data
      airlineMap.set(code, existingData);
    });

    const airlines = Array.from(airlineMap.values());
    console.log('Processed airlines:', airlines);
    return airlines;
  }, [flights]);

  // Debug current state
  console.log('Current airlines data:', airlinesData);
  console.log('Current sort:', currentSort);

  const handleAirlineSelect = (code: string) => {
    console.log('Selecting airline code:', code);
    const currentAirlines = currentSort.airline || [];
    const newAirlines = currentAirlines.includes(code)
      ? currentAirlines.filter(c => c !== code)
      : [...currentAirlines, code];
    
    console.log('Current airlines:', currentAirlines);
    console.log('New airlines selection:', newAirlines);
    
    onSortChange({ airline: newAirlines });
  };

  return (
    <div className="bg-white dark:bg-black p-4 rounded-lg border border-gray-200 dark:border-gray-800">
      <div className="space-y-4">
        {/* Header */}
        <div className="flex items-center gap-2">
          <AdjustmentsHorizontalIcon className="w-5 h-5 text-gray-600 dark:text-gray-400" />
          <span className="font-medium">Sort & Filter</span>
        </div>

        {/* Airline Filter */}
        <div className="pt-2">
          <AirlineFilter
            airlines={airlinesData}
            selectedAirlines={currentSort.airline || []}
            onAirlineSelect={handleAirlineSelect}
          />
        </div>

        {/* Primary Sort Options */}
        <div className="grid grid-cols-2 gap-2">
          <select
            className="w-full rounded-md border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 px-3 py-2 text-sm"
            onChange={(e) => onSortChange({ fare: e.target.value as SortOption['fare'] })}
            value={currentSort.fare}
          >
            <option value="lowToHigh">Price: Low to High</option>
            <option value="highToLow">Price: High to Low</option>
          </select>

          <select
            className="w-full rounded-md border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 px-3 py-2 text-sm"
            onChange={(e) => onSortChange({ takeoff: e.target.value as SortOption['takeoff'] })}
            value={currentSort.takeoff}
          >
            <option value="earlierToLater">Departure: Early to Late</option>
            <option value="laterToEarlier">Departure: Late to Early</option>
          </select>
        </div>

        {/* Additional Sort Options */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
          <select
            className="w-full rounded-md border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 px-3 py-2 text-sm"
            onChange={(e) => onSortChange({ stops: e.target.value ? [e.target.value] : [] })}
            value={currentSort.stops?.[0] || ''}
          >
            <option value="">All Stops</option>
            <option value="0">Non-stop</option>
            <option value="1">1 Stop</option>
            <option value="2">2 Stops</option>
            <option value="2+">2+ Stops</option>
          </select>

          <select
            className="w-full rounded-md border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 px-3 py-2 text-sm"
            onChange={(e) => onSortChange({ layovers: e.target.value as SortOption['layovers'] })}
            value={currentSort.layovers}
          >
            <option value="lowToHigh">Layover: Short to Long</option>
            <option value="highToLow">Layover: Long to Short</option>
          </select>
        </div>
      </div>
    </div>
  );
};

export default FlightSortingOptions;