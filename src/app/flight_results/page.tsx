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

  // Format date to YYYY-MM-DD
  const formatDate = (dateStr?: string): string | undefined => {
    if (!dateStr) return undefined;
    const date = new Date(dateStr);
    return date.toISOString().split('T')[0];
  };

  // Parse flight segments from URL parameters
  const parseFlightSegments = (): FlightSegment[] => {
    const tripType = searchParams.get('tripType');
    const segments: FlightSegment[] = [];

    if (tripType === 'multiCity') {
      let segmentIndex = 1;
      while (true) {
        const fromCode = searchParams.get(`from${segmentIndex}`);
        const toCode = searchParams.get(`to${segmentIndex}`);
        const date = searchParams.get(`date${segmentIndex}`);

        if (!fromCode || !toCode || !date) break;

        segments.push({
          fromCode: fromCode.trim(),
          toCode: toCode.trim(),
          date: formatDate(date) || ''
        });

        segmentIndex++;
      }
    } else {
      const fromCode = searchParams.get('from');
      const toCode = searchParams.get('to');
      const departureDate = searchParams.get('departure');
      const returnDate = searchParams.get('return');

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
  
    const adults = parseInt(searchParams.get('adults') || '1');      // ✅ Correct
    const kids = parseInt(searchParams.get('kids') || '0');          // ✅ Correct
    const children = parseInt(searchParams.get('children') || '0');  // ✅ Correct
    const infants = parseInt(searchParams.get('infants') || '0');    // ✅ Correct
  
    const totalChildren = kids + children;  // ✅ Merge kids & children
  
    let paxCounter = 1;
  
    for (let i = 0; i < adults; i++) {
      passengers.push({ paxID: `PAX${paxCounter++}`, ptc: 'ADT' });
    }
  
    for (let i = 0; i < totalChildren; i++) {
      passengers.push({ paxID: `PAX${paxCounter++}`, ptc: 'CHD' });
    }
  
    for (let i = 0; i < infants; i++) {
      passengers.push({ paxID: `PAX${paxCounter++}`, ptc: 'INF' });
    }
  
    console.log("Generated Passenger List:", passengers);
    return passengers;
  };
  
  useEffect(() => {
    const fetchFlights = async () => {
      setLoading(true);
      try {
        const segments = parseFlightSegments();
        const passengers = parsePassengers();
        const tripType = searchParams.get('tripType');

        if (segments.length === 0) {
          console.error("No valid flight segments found");
          return;
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
              travelPreferences: { vendorPref: [], cabinCode: searchParams.get("cabinClass") || "Economy" },
              returnUPSellInfo: true
            }
          }
        };

        console.log("Final Request Body:", JSON.stringify(requestBody, null, 2));

        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/combined/search`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(requestBody)
        });

        console.log("API Response Status:", response.status);

        if (!response.ok) {
          const errorText = await response.text();
          throw new Error(`Server error: ${response.status} - ${errorText}`);
        }

        const result = await response.json();
        console.log("API Response Data:", result);
        
        setFlightResults(result.flights || []);
        sessionStorage.setItem("flightResults", JSON.stringify(result.flights || []));

      } catch (error) {
        console.error("Error fetching flights:", error);
        setFlightResults([]);
      }
      setLoading(false);
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
        {loading ? (
          <p className="text-gray-600 dark:text-gray-400">Loading flight results...</p>
        ) : flightResults.length > 0 ? (
          <FlightResultsList flights={flightResults} />
        ) : (
          <p className="text-gray-600 dark:text-gray-400">No flights found for your search criteria.</p>
        )}
      </div>
    </div>
  );
};

export default FlightResultsPage;
