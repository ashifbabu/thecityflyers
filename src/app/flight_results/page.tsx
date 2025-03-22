'use client';

import React, { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import ModifySearch from '@/components/search/flights/modify/ModifySearch';
import FlightResultsList from '@/components/search/flights/results/FlightResultsList';
import { getApiTripType } from '@/components/search/flights/button/SearchButton';
import FlightCalendarSection from '@/components/search/flights/calendar/FlightCalendarSection';
import FlightSortingOptions, { SortOption } from '@/components/search/flights/sort/FlightSortingOptions';

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
  const router = useRouter();
  const searchParams = useSearchParams();
  const [flightResults, setFlightResults] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [departureDate, setDepartureDate] = useState<Date | null>(() => {
    const departureDateStr = searchParams.get('departure');
    return departureDateStr ? new Date(departureDateStr) : null;
  });
  
  const [returnDate, setReturnDate] = useState<Date | null>(() => {
    const returnDateStr = searchParams.get('return');
    return returnDateStr ? new Date(returnDateStr) : null;
  });

  const [sortOptions, setSortOptions] = useState<Partial<SortOption>>({
    fare: 'lowToHigh',
    stops: [],
    takeoff: undefined,
    airline: [],
    layovers: undefined
  });

  const [sortedFlights, setSortedFlights] = useState<any[]>([]);

  const formatDate = (dateStr?: string): string | undefined => {
    if (!dateStr) return undefined;
    const date = new Date(dateStr);
    return date.toISOString().split('T')[0];
  };

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

  const getFare = (flight: any): number => {
    if (!flight) {
      console.warn('Flight object is undefined');
      return 0;
    }

    try {
      // First try to get fare from totalAmount
      if (flight.totalAmount) {
        return parseFloat(flight.totalAmount);
      }

      // Try to get from Price field
      if (flight.Price) {
        return parseFloat(flight.Price);
      }

      // Try to get from simple fare structure
      if (flight.fare) {
        return parseFloat(flight.fare);
      }

      // Try to get from detailed pricing structure
      if (flight.Pricing) {
        // Try totalPayable first
        if (flight.Pricing.totalPayable?.total) {
          return parseFloat(flight.Pricing.totalPayable.total);
        }

        // Try BaseFare + Taxes
        if (flight.Pricing.BaseFare) {
          let total = parseFloat(flight.Pricing.BaseFare);
          if (flight.Pricing.Taxes) {
            total += flight.Pricing.Taxes.reduce((sum: number, tax: any) => 
              sum + parseFloat(tax.Amount || 0), 0);
          }
          return total;
        }

        // Try FareDetails structure
        if (flight.Pricing.FareDetails) {
          let total = 0;
          
          // Handle outbound fare
          if (flight.Pricing.FareDetails.Outbound?.[0]) {
            const outbound = flight.Pricing.FareDetails.Outbound[0];
            total += parseFloat(outbound.BaseFare || 0) + 
                    parseFloat(outbound.Tax || 0) + 
                    parseFloat(outbound.VAT || 0);
          }
          
          // Handle inbound fare for return flights
          if (flight.Pricing.FareDetails.Inbound?.[0]) {
            const inbound = flight.Pricing.FareDetails.Inbound[0];
            total += parseFloat(inbound.BaseFare || 0) + 
                    parseFloat(inbound.Tax || 0) + 
                    parseFloat(inbound.VAT || 0);
          }

          if (total > 0) return total;
        }
      }

      // Log the flight object for debugging if no fare structure is found
      console.warn('No valid fare structure found for flight:', flight);
      return 0;

    } catch (error) {
      console.error('Error calculating fare:', error);
      return 0;
    }
  };

  // Helper function to safely parse currency values
  const parseCurrency = (value: string | number): number => {
    if (typeof value === 'number') return value;
    if (typeof value === 'string') {
      // Remove currency symbols and commas, then parse
      const cleanValue = value.replace(/[^0-9.-]+/g, '');
      return parseFloat(cleanValue) || 0;
    }
    return 0;
  };

  const getDepartureTime = (flight: any) => {
    try {
      if (!flight) {
        console.error('Flight object is null or undefined');
        return 0;
      }

      const flightId = flight.OfferId || flight.id || 'unknown';

      // Check OutboundSegments[0].Departure.ScheduledTime
      if (flight.OutboundSegments?.[0]?.Departure?.ScheduledTime) {
        const departureTime = flight.OutboundSegments[0].Departure.ScheduledTime;
        const date = new Date(departureTime);
        
        if (!isNaN(date.getTime())) {
          // Convert UTC to local time
          const localDate = new Date(date.toLocaleString('en-US', { timeZone: 'Asia/Dhaka' }));
          
          // Calculate minutes since midnight
          let timeValue = localDate.getHours() * 60 + localDate.getMinutes();
          
          // If the time is between 00:00 and 03:59, add 24 hours (1440 minutes)
          // This ensures flights after midnight sort after flights from the previous day
          if (timeValue < 240) { // 240 minutes = 4 hours
            timeValue += 1440; // Add 24 hours worth of minutes
          }
          
          console.log(`Flight ${flightId} departure time:`, {
            raw: departureTime,
            localTime: localDate.toLocaleTimeString(),
            timeValue,
            adjustedHours: Math.floor(timeValue / 60),
            minutes: timeValue % 60,
            isNextDay: timeValue > 1440
          });
          
          return timeValue;
        }
      }

      console.error('No departure time found. Flight structure:', {
        flightId,
        hasOutboundSegments: !!flight.OutboundSegments,
        departureInfo: flight.OutboundSegments?.[0]?.Departure,
        scheduledTime: flight.OutboundSegments?.[0]?.Departure?.ScheduledTime
      });
      return 0;
    } catch (error) {
      console.error('Error in getDepartureTime:', error);
      return 0;
    }
  };

  const getSortedAndFilteredFlights = (flights: any[], options: Partial<SortOption>) => {
    if (!flights.length) return [];
    
    // Create a new array with calculated details
    const flightsWithDetails = flights.map(flight => {
      const calculatedFare = getFare(flight);
      const departureTime = getDepartureTime(flight);
      const numberOfStops = flight.OutboundSegments?.length - 1 || 0;
      let layoverDuration = 0;

      // Calculate total layover duration
      if (flight.OutboundSegments?.length > 1) {
        for (let i = 0; i < flight.OutboundSegments.length - 1; i++) {
          const currentSegment = flight.OutboundSegments[i];
          const nextSegment = flight.OutboundSegments[i + 1];
          const arrival = new Date(currentSegment.Arrival.ScheduledTime);
          const departure = new Date(nextSegment.Departure.ScheduledTime);
          layoverDuration += (departure.getTime() - arrival.getTime()) / (1000 * 60);
        }
      }

      // Get airline information
      const airline = flight.OutboundSegments?.[0]?.MarketingCarrier?.carrierName || '';

      return {
        ...flight,
        calculatedFare,
        departureTime,
        numberOfStops,
        layoverDuration,
        airline
      };
    });

    let filteredFlights = [...flightsWithDetails];

    // Apply filters
    if (options.stops?.length) {
      filteredFlights = filteredFlights.filter(flight => {
        const stopValue = options.stops?.[0];
        if (stopValue === '0') return flight.numberOfStops === 0;
        if (stopValue === '1') return flight.numberOfStops === 1;
        if (stopValue === '2') return flight.numberOfStops === 2;
        if (stopValue === '2+') return flight.numberOfStops > 2;
        return true;
      });
    }

    if (options.airline?.length) {
      filteredFlights = filteredFlights.filter(flight => 
        options.airline?.includes(flight.airline)
      );
    }

    // Sort flights based on active sorting criteria
    return filteredFlights.sort((a, b) => {
      // Primary sort: Fare (always applied)
      const fareDiff = (options.fare === 'highToLow' ? -1 : 1) * 
        (a.calculatedFare - b.calculatedFare);
      if (fareDiff !== 0) return fareDiff;

      // Secondary sort: Departure time
      if (options.takeoff) {
        const timeDiff = options.takeoff === 'laterToEarlier' ? 
          b.departureTime - a.departureTime :
          a.departureTime - b.departureTime;
        if (timeDiff !== 0) return timeDiff;
      } else {
        // Default to earlier departure if no takeoff preference
        const timeDiff = a.departureTime - b.departureTime;
        if (timeDiff !== 0) return timeDiff;
      }

      // Tertiary sort: Number of stops (prefer fewer stops by default)
      const stopsDiff = a.numberOfStops - b.numberOfStops;
      if (stopsDiff !== 0) return stopsDiff;

      // Final sort: Layover duration
      if (options.layovers) {
        return options.layovers === 'highToLow' ?
          b.layoverDuration - a.layoverDuration :
          a.layoverDuration - b.layoverDuration;
      }
      
      // Default to shorter layovers
      return a.layoverDuration - b.layoverDuration;
    });
  };
  
 const fetchFlights = async () => {
  setLoading(true);
  setError(null);

  try {
    const segments = parseFlightSegments();
    console.log('Sending request with segments:', segments);

    const requestBody = {
      pointOfSale: "BD",
      source: "bdfare",
      request: {
        originDest: segments.map(segment => ({
          originDepRequest: { iatA_LocationCode: segment.fromCode, date: segment.date },
          destArrivalRequest: { iatA_LocationCode: segment.toCode }
        })),
        pax: parsePassengers(),
        shoppingCriteria: {
          tripType: getApiTripType(searchParams?.get('tripType') as any),
          travelPreferences: {
            vendorPref: [],
            cabinCode: searchParams?.get('class') || 'Economy'
          },
          returnUPSellInfo: true
        }
      }
    };

    // updated

    console.log('Sending request with body updated:', JSON.stringify(requestBody, null, 2));

     const apiUrl = process.env.NEXT_PUBLIC_API_URL;
    const response = await fetch(`${apiUrl}/api/combined/search`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(requestBody),
    });

    // If the response is not OK, read the body once and parse as JSON or text
    if (!response.ok) {
      let errorMessage = `HTTP error! status: ${response.status}`;
      const rawBody = await response.text();  // <-- Read the body only once

      try {
        // Attempt to parse the raw body as JSON
        const errorData = JSON.parse(rawBody);
        console.error('Error response JSON:', errorData);
        // If the JSON contains an `error` or `details` field, use it
        errorMessage = errorData.error || errorData.details || errorMessage;
      } catch (e) {
        // If parsing fails, we treat it as text
        console.error('Error response text:', rawBody);
        errorMessage = rawBody || errorMessage;
      }

      throw new Error(errorMessage);
    }

    // If the response is OK, parse JSON normally
    const data = await response.json();
    console.log('Received response:', data);

    const flights = data.flights || [];
    setFlightResults(flights);

    // Sort/filter if needed
    const sortedResults = getSortedAndFilteredFlights(flights, sortOptions);
    setSortedFlights(sortedResults);

  } catch (error) {
    console.error('Error fetching flights:', error);
    setError(error instanceof Error ? error.message : 'Failed to fetch flight results');
    setFlightResults([]);
    setSortedFlights([]);
  } finally {
    setLoading(false);
  }
};


  const updateSearchParams = (type: 'departure' | 'return', date: Date) => {
    const params = new URLSearchParams(searchParams.toString());
    const formattedDate = date.toISOString().split('T')[0];
    
    if (type === 'departure') {
      params.set('departure', formattedDate);
    } else {
      params.set('return', formattedDate);
    }
    
    router.push(`/flight_results?${params.toString()}`);
  };

  const handleDepartureDateSelect = (date: Date) => {
    setDepartureDate(date);
    updateSearchParams('departure', date);
  };

  const handleReturnDateSelect = (date: Date) => {
    setReturnDate(date);
    updateSearchParams('return', date);
  };

  const getLowestFare = (flights: any[]) => {
    if (!flights.length) return undefined;
    
    const fares = flights.map(flight => {
      const fare = flight.fareAmount || 
                  flight.fareDetails?.fareAmount || 
                  flight.fareInfo?.fareAmount || 
                  flight.adultFare?.amount ||
                  flight.amount ||
                  0;
                  
      return parseFloat(fare);
    });
    
    return Math.min(...fares);
  };

  const getAvailableAirlines = () => {
    const airlines = new Set<string>();
    flightResults.forEach(flight => {
      const segments = flight.OutboundSegments || [];
      segments.forEach((segment: any) => {
        const airline = segment?.MarketingCarrier?.carrierName;
        if (airline) {
          airlines.add(airline);
        }
      });
    });
    return Array.from(airlines);
  };

  const handleSortChange = (newOptions: Partial<SortOption>) => {
    console.log('Sort options changed:', {
      previous: sortOptions,
      new: newOptions,
      combined: { ...sortOptions, ...newOptions }
    });
    
    // Create new sort options
    const updatedOptions = { ...sortOptions, ...newOptions };
    
    console.log('Applying sort with flights:', {
      numberOfFlights: flightResults.length,
      firstFlight: flightResults[0]
    });
    
    // Apply sorting immediately with fresh copy of flights
    const newSortedFlights = getSortedAndFilteredFlights([...flightResults], updatedOptions);
    
    console.log('Sorting complete:', {
      numberOfSortedFlights: newSortedFlights.length,
      firstSortedFlight: newSortedFlights[0]
    });
    
    // Update both state values
    setSortOptions(updatedOptions);
    setSortedFlights(newSortedFlights);
  };

  useEffect(() => {
    fetchFlights();
  }, [searchParams]);

  useEffect(() => {
    if (flightResults.length > 0) {
      console.log('Flight Results before sorting:', flightResults.map(f => ({
        id: f.OfferId,
        fare: getFare(f),
        pricing: f.Pricing,
        fareDetails: f.FareDetails
      })));
      
      const sorted = getSortedAndFilteredFlights([...flightResults], sortOptions);
      
      console.log('Sorted Results:', sorted.map(f => ({
        id: f.OfferId,
        fare: f.calculatedFare,
        direction: f.isReturn ? 'Return' : 'Outbound'
      })));
      
      setSortedFlights(sorted);
    }
  }, [flightResults]);

  return (
    <div className="container mx-auto px-4 py-8 space-y-6">
      <ModifySearch />
      
      <FlightCalendarSection
        departureDate={departureDate || undefined}
        returnDate={returnDate || undefined}
        onDepartureDateSelect={handleDepartureDateSelect}
        onReturnDateSelect={handleReturnDateSelect}
        flightResults={flightResults}
      />

      <FlightSortingOptions
        onSortChange={handleSortChange}
        availableAirlines={getAvailableAirlines()}
        currentSort={sortOptions}
      />
      
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
        ) : sortedFlights.length > 0 ? (
          <FlightResultsList flights={sortedFlights} />
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