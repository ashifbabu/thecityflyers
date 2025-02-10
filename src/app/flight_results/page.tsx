'use client';

import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import ModifySearch from '@/components/search/flights/modify/ModifySearch';
import FlightResultsList from '@/components/search/flights/results/FlightResultsList';
import { getApiTripType } from '@/components/search/flights/button/SearchButton';

interface FlightSegment {
  fromCode: string;
  toCode: string;
  date: string;
}

interface Passenger {
  paxID: string;
  ptc: string;
}

const FlightResultsPage = () => {
  const searchParams = useSearchParams();
  const [flightResults, setFlightResults] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Format date to YYYY-MM-DD
  const formatDate = (dateStr?: string): string | undefined => {
    if (!dateStr) return undefined;
    const date = new Date(dateStr);
    return date.toISOString().split('T')[0];
  };

  // Parse flight segments from URL parameters
  const parseFlightSegments = (): FlightSegment[] => {
    const tripType = searchParams ? searchParams.get('tripType') : null;
    const segments: FlightSegment[] = [];

    if (tripType === 'multiCity') {
      try {
        const flightsParam = searchParams?.get('flights');
        if (flightsParam) {
          const flights = JSON.parse(decodeURIComponent(flightsParam));
          flights.forEach((flight: any) => {
            if (flight.fromAirportCode && flight.toAirportCode && flight.departureDate) {
              segments.push({
                fromCode: flight.fromAirportCode,
                toCode: flight.toAirportCode,
                date: formatDate(flight.departureDate) || ''
              });
            }
          });
        }
      } catch (error) {
        console.error('Error parsing multi-city flights:', error);
        setError('Invalid flight search parameters');
      }
    } else {
      const fromCode = searchParams?.get('from');
      const toCode = searchParams?.get('to');
      const departureDate = searchParams?.get('departure');
      const returnDate = searchParams?.get('return');

      if (fromCode && toCode && departureDate) {
        segments.push({
          fromCode: fromCode.trim(),
          toCode: toCode.trim(),
          date: formatDate(departureDate) || ''
        });

        if (tripType === 'roundTrip' && returnDate) {
          segments.push({
            fromCode: toCode.trim(),
            toCode: fromCode.trim(),
            date: formatDate(returnDate) || ''
          });
        }
      }
    }

    return segments;
  };

  // Parse passengers from URL parameters
  const parsePassengers = (): Passenger[] => {
    const passengers: Passenger[] = [];
  
    const adults = parseInt(searchParams?.get('adults') || '1');
    const kids = parseInt(searchParams?.get('kids') || '0');
    const children = parseInt(searchParams?.get('children') || '0');
    const infants = parseInt(searchParams?.get('infants') || '0');
  
    let paxCounter = 1;
  
    for (let i = 0; i < adults; i++) {
      passengers.push({ paxID: `PAX${paxCounter++}`, ptc: 'ADT' });
    }
  
    for (let i = 0; i < kids; i++) {
      passengers.push({ paxID: `PAX${paxCounter++}`, ptc: 'CHD' });
    }
  
    for (let i = 0; i < children; i++) {
      passengers.push({ paxID: `PAX${paxCounter++}`, ptc: 'C05' });
    }
  
    for (let i = 0; i < infants; i++) {
      passengers.push({ paxID: `PAX${paxCounter++}`, ptc: 'INF' });
    }
  
    return passengers;
  };
  
  useEffect(() => {
    const fetchFlights = async () => {
      setLoading(true);
      setError(null);
      try {
        const segments = parseFlightSegments();
        const passengers = parsePassengers();
        const tripType = searchParams?.get('tripType');
        const cabinClass = searchParams?.get('class') || 'Economy';

        if (segments.length === 0) {
          throw new Error("No valid flight segments found");
        }

        const requestBody = {
          pointOfSale: "BD",
          source: "bdfare",
          request: {
            originDest: segments.map(segment => ({
              originDepRequest: { iatA_LocationCode: segment.fromCode, date: segment.date },
              destArrivalRequest: { iatA_LocationCode: segment.toCode }
            })),
            pax: passengers,
            shoppingCriteria: {
              tripType: getApiTripType(tripType as any),
              travelPreferences: {
                vendorPref: [],
                cabinCode: cabinClass
              },
              returnUPSellInfo: true
            }
          }
        };

        console.log("Final Request Body:", JSON.stringify(requestBody, null, 2));

        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/combined/search`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(requestBody)
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        setFlightResults(data.flights || []);
        sessionStorage.setItem("flightResults", JSON.stringify(data.flights));
      } catch (error) {
        console.error('Error fetching flights:', error);
        setError('Failed to fetch flight results. Please try again.');
        setFlightResults([]);
      } finally {
        setLoading(false);
      }
    };

    fetchFlights();
  }, [searchParams]);

  return (
    <div className="container mx-auto p-4 space-y-6">
      <ModifySearch />
      <div className="bg-white dark:bg-black p-6 rounded-lg border border-gray-200 dark:border-gray-800">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-4">
          Flight Results
        </h2>
        
        {error && (
          <div className="mb-4 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg text-red-600 dark:text-red-400">
            {error}
          </div>
        )}
        
        {loading ? (
          <div className="flex items-center justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 dark:border-white"></div>
            <span className="ml-3 text-gray-600 dark:text-gray-400">Searching for flights...</span>
          </div>
        ) : flightResults.length > 0 ? (
          <FlightResultsList flights={flightResults} />
        ) : !error && (
          <p className="text-gray-600 dark:text-gray-400 text-center py-8">
            No flights found for your search criteria. Please try different dates or routes.
          </p>
        )}
      </div>
    </div>
  );
};

export default FlightResultsPage;