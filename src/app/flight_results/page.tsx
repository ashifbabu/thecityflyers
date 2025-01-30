'use client';

import React, { useEffect, useState, useRef } from 'react';
import { useSearchParams } from 'next/navigation';
import ModifySearch from '@/components/search/flights/modify/ModifySearch';
import FlightCalendarSection from '@/components/search/flights/calendar/FlightCalendarSection';
import FlightResultsList from '@/components/search/flights/results/FlightResultsList';

// City-to-Airport Code Mapping
const CITY_TO_AIRPORT: Record<string, string> = {
  "Dhaka": "DAC",
  "Chittagong": "CGP",
  "Sylhet": "ZYL",
  "Cox's Bazar": "CXB",
  "Jessore": "JSR",
  "Saidpur": "SPD",
  "Barisal": "BZL"
};

const FlightResultsPage = () => {
  const searchParams = useSearchParams();
  const [departureDate, setDepartureDate] = useState<Date | undefined>(
    searchParams.get('departure') ? new Date(searchParams.get('departure')!) : undefined
  );
  const [returnDate, setReturnDate] = useState<Date | undefined>(
    searchParams.get('return') ? new Date(searchParams.get('return')!) : undefined
  );

  const [flightResults, setFlightResults] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const isFirstRender = useRef(true);

  useEffect(() => {
    const fetchFlights = async () => {
      // Skip the first render if it's a navigation from search
      if (isFirstRender.current) {
        isFirstRender.current = false;
        const fromCache = sessionStorage.getItem('flightResults');
        if (fromCache) {
          setFlightResults(JSON.parse(fromCache));
          setLoading(false);
          return;
        }
      }

      setLoading(true);
      try {
        const fromCity = searchParams.get('from') || "Dhaka";
        const toCity = searchParams.get('to') || "Chittagong";
        const departureDateParam = searchParams.get('departure') || new Date().toISOString().split('T')[0];

        const fromCode = CITY_TO_AIRPORT[fromCity] || "DAC";
        const toCode = CITY_TO_AIRPORT[toCity] || "CGP";

        const requestBody = {
          pointOfSale: "BD",
          source: "all",
          request: {
            originDest: [
              {
                originDepRequest: {
                  iatA_LocationCode: fromCode,
                  date: departureDateParam
                },
                destArrivalRequest: {
                  iatA_LocationCode: toCode
                }
              }
            ],
            pax: [
              {
                paxID: "PAX1",
                ptc: "ADT"
              }
            ],
            shoppingCriteria: {
              tripType: searchParams.get('tripType') || "oneWay",
              travelPreferences: {
                vendorPref: [],
                cabinCode: "Economy"
              },
              returnUPSellInfo: true
            }
          }
        };

        console.log("🚀 Sending Request Body:", JSON.stringify(requestBody, null, 2));

        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/combined/search`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(requestBody)
        });

        if (!response.ok) {
          throw new Error(`Server error: ${response.status} - ${await response.text()}`);
        }

        const result = await response.json();
        console.log('✅ Flight Search Response:', result);

        setFlightResults(result.flights || []);
        // Cache the results
        sessionStorage.setItem('flightResults', JSON.stringify(result.flights || []));
      } catch (error) {
        console.error("❌ Error fetching flights:", error);
      }
      setLoading(false);
    };

    fetchFlights();
  }, [searchParams]);

  return (
    <div className="container mx-auto p-4 space-y-6">
      <ModifySearch />
      
      <FlightCalendarSection
        departureDate={departureDate}
        returnDate={returnDate}
        onDepartureDateSelect={setDepartureDate}
        onReturnDateSelect={setReturnDate}
      />

      <div className="bg-white dark:bg-black p-6 rounded-lg border border-gray-200 dark:border-gray-800">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-4">Flight Results</h2>
        
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