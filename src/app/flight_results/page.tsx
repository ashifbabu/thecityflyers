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
      if (flight.totalAmount) {
        return parseFloat(flight.totalAmount);
      }

      if (flight.Price) {
        return parseFloat(flight.Price);
      }

      if (flight.fare) {
        return parseFloat(flight.fare);
      }

      if (flight.Pricing) {
        if (flight.Pricing.totalPayable?.total) {
          return parseFloat(flight.Pricing.totalPayable.total);
        }

        if (flight.Pricing.BaseFare) {
          let total = parseFloat(flight.Pricing.BaseFare);
          if (flight.Pricing.Taxes) {
            total += flight.Pricing.Taxes.reduce((sum: number, tax: any) => 
              sum + parseFloat(tax.Amount || 0), 0);
          }
          return total;
        }

        if (flight.Pricing.FareDetails) {
          let total = 0;
          
          if (flight.Pricing.FareDetails.Outbound?.[0]) {
            const outbound = flight.Pricing.FareDetails.Outbound[0];
            total += parseFloat(outbound.BaseFare || 0) + 
                    parseFloat(outbound.Tax || 0) + 
                    parseFloat(outbound.VAT || 0);
          }
          
          if (flight.Pricing.FareDetails.Inbound?.[0]) {
            const inbound = flight.Pricing.FareDetails.Inbound[0];
            total += parseFloat(inbound.BaseFare || 0) + 
                    parseFloat(inbound.Tax || 0) + 
                    parseFloat(inbound.VAT || 0);
          }

          if (total > 0) return total;
        }
      }

      console.warn('No valid fare structure found for flight:', flight);
      return 0;

    } catch (error) {
      console.error('Error calculating fare:', error);
      return 0;
    }
  };

  const parseCurrency = (value: string | number): number => {
    if (typeof value === 'number') return value;
    if (typeof value === 'string') {
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

      if (flight.OutboundSegments?.[0]?.Departure?.ScheduledTime) {
        const departureTime = flight.OutboundSegments[0].Departure.ScheduledTime;
        const date = new Date(departureTime);
        
        if (!isNaN(date.getTime())) {
          const localDate = new Date(date.toLocaleString('en-US', { timeZone: 'Asia/Dhaka' }));
          
          let timeValue = localDate.getHours() * 60 + localDate.getMinutes();
          
          if (timeValue < 240) {
            timeValue += 1440;
          }
          
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
    
    const flightsWithDetails = flights.map(flight => {
      const calculatedFare = getFare(flight);
      const departureTime = getDepartureTime(flight);
      const numberOfStops = flight.OutboundSegments?.length - 1 || 0;
      let layoverDuration = 0;

      if (flight.OutboundSegments?.length > 1) {
        for (let i = 0; i < flight.OutboundSegments.length - 1; i++) {
          const currentSegment = flight.OutboundSegments[i];
          const nextSegment = flight.OutboundSegments[i + 1];
          const arrival = new Date(currentSegment.Arrival.ScheduledTime);
          const departure = new Date(nextSegment.Departure.ScheduledTime);
          layoverDuration += (departure.getTime() - arrival.getTime()) / (1000 * 60);
        }
      }

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

    return filteredFlights.sort((a, b) => {
      const fareDiff = (options.fare === 'highToLow' ? -1 : 1) * 
        (a.calculatedFare - b.calculatedFare);
      if (fareDiff !== 0) return fareDiff;

      if (options.takeoff) {
        const timeDiff = options.takeoff === 'laterToEarlier' ? 
          b.departureTime - a.departureTime :
          a.departureTime - b.departureTime;
        if (timeDiff !== 0) return timeDiff;
      } else {
        const timeDiff = a.departureTime - b.departureTime;
        if (timeDiff !== 0) return timeDiff;
      }

      const stopsDiff = a.numberOfStops - b.numberOfStops;
      if (stopsDiff !== 0) return stopsDiff;

      if (options.layovers) {
        return options.layovers === 'highToLow' ?
          b.layoverDuration - a.layoverDuration :
          a.layoverDuration - b.layoverDuration;
      }
      
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

      console.log('Sending request with body:', JSON.stringify(requestBody, null, 2));

      const apiUrl = process.env.NEXT_PUBLIC_API_URL;
      const response = await fetch(`${apiUrl}/api/combined/search`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody),
      });

      if (!response.ok) {
        let errorMessage = `HTTP error! status: ${response.status}`;
        const rawBody = await response.text();

        try {
          const errorData = JSON.parse(rawBody);
          console.error('Error response JSON:', errorData);
          errorMessage = errorData.error || errorData.details || errorMessage;
        } catch (e) {
          console.error('Error response text:', rawBody);
          errorMessage = rawBody || errorMessage;
        }

        throw new Error(errorMessage);
      }

      const data = await response.json();
      console.log('Received response:', data);

      const flights = data.flights || [];
      setFlightResults(flights);

      const sortedResults = getSortedAndFilteredFlights(flights, sortOptions);
      setSortedFlights(sortedResults);

    } catch (error) {
      console.error('Error fetching flights:', error);
      setError(error instanceof Error ? error.message : 'Failed to fetch flight results');
      setFlightResults([]);
      setSortedFlights([]);
    } finally {
      setTimeout(() => {
        setLoading(false);
      }, 500);
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
    
    const updatedOptions = { ...sortOptions, ...newOptions };
    
    console.log('Applying sort with flights:', {
      numberOfFlights: flightResults.length,
      firstFlight: flightResults[0]
    });
    
    const newSortedFlights = getSortedAndFilteredFlights([...flightResults], updatedOptions);
    
    console.log('Sorting complete:', {
      numberOfSortedFlights: newSortedFlights.length,
      firstSortedFlight: newSortedFlights[0]
    });
    
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
        
        <FlightResultsList 
          flights={sortedFlights} 
          isLoading={loading}
        />
      </div>
    </div>
  );
};

export default FlightResultsPage;