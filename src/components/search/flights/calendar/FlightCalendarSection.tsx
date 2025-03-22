'use client';

import React, { useState, useEffect } from 'react';
import { useTripType } from '@/hooks/use-trip-type';
import FlightSuggestionCalendar from './FlightSuggestionCalendar';
import { useRouter, useSearchParams } from 'next/navigation';
import { addDays, subDays, format } from 'date-fns';

interface FlightCalendarSectionProps {
  departureDate?: Date;
  returnDate?: Date;
  onDepartureDateSelect?: (date: Date) => void;
  onReturnDateSelect?: (date: Date) => void;
  className?: string;
  flightResults?: any[];
}

const FlightCalendarSection: React.FC<FlightCalendarSectionProps> = ({
  departureDate,
  returnDate,
  onDepartureDateSelect,
  onReturnDateSelect,
  className,
  flightResults = [],
}) => {
  const { tripType } = useTripType();
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isLoadingDeparture, setIsLoadingDeparture] = useState(false);
  const [isLoadingReturn, setIsLoadingReturn] = useState(false);
  const [localFlightResults, setLocalFlightResults] = useState(flightResults);
  const [loadingQueue, setLoadingQueue] = useState<{ date: Date; isReturn: boolean }[]>([]);
  const [isProcessingQueue, setIsProcessingQueue] = useState(false);
  const [loadingDate, setLoadingDate] = useState<string | null>(null);

  // Calculate prices for each date from flight results
  const getPricesForDate = React.useCallback((date: Date, isReturn: boolean = false) => {
    const dateStr = date.toISOString().split('T')[0];
    const flightsForDate = localFlightResults.filter(flight => {
      const flightDate = flight.OutboundSegments?.[0]?.Departure?.ScheduledTime?.split('T')[0];
      const isReturnFlight = !!flight.isReturn;
      return flightDate === dateStr && isReturnFlight === isReturn;
    });

    if (flightsForDate.length === 0) return undefined;

    const lowestFare = Math.min(...flightsForDate.map(flight => {
      // Try all possible price fields
      if (flight.totalAmount) return parseFloat(flight.totalAmount);
      if (flight.Price) return parseFloat(flight.Price);
      if (flight.fare) return parseFloat(flight.fare);
      if (flight.Pricing?.totalPayable?.total) return parseFloat(flight.Pricing.totalPayable.total);
      if (flight.Pricing?.BaseFare) {
        let total = parseFloat(flight.Pricing.BaseFare);
        if (flight.Pricing.Taxes) {
          total += flight.Pricing.Taxes.reduce((sum: number, tax: any) => 
            sum + parseFloat(tax.Amount || 0), 0);
        }
        return total;
      }
      if (flight.Pricing?.FareDetails?.Outbound?.[0]) {
        const outbound = flight.Pricing.FareDetails.Outbound[0];
        const total = parseFloat(outbound.BaseFare || 0) + 
                     parseFloat(outbound.Tax || 0) + 
                     parseFloat(outbound.VAT || 0);
        return total;
      }
      return Infinity;
    }));

    return lowestFare === Infinity ? undefined : lowestFare;
  }, [localFlightResults]);

  // Generate price data for the next 30 days
  const generatePriceData = React.useCallback((isReturn: boolean = false) => {
    const prices: Record<string, number> = {};
    const startDate = isReturn ? departureDate || new Date() : new Date();
    
    for (let i = 0; i < 30; i++) {
      const date = new Date(startDate);
      date.setDate(date.getDate() + i);
      const price = getPricesForDate(date, isReturn);
      if (price !== undefined && price > 0) {
        prices[date.toISOString().split('T')[0]] = price;
      }
    }
    
    return prices;
  }, [departureDate, getPricesForDate]);

  const departurePrices = React.useMemo(() => generatePriceData(false), [generatePriceData]);
  const returnPrices = React.useMemo(() => generatePriceData(true), [generatePriceData]);

  // Get dates to load around selected date
  const getDateLoadingQueue = React.useCallback((selectedDate: Date | undefined, isReturn: boolean) => {
    if (!selectedDate) return [];
    const queue: { date: Date; isReturn: boolean }[] = [];
    
    // Add only the next and previous day
    queue.push({ date: addDays(selectedDate, 1), isReturn });
    queue.push({ date: subDays(selectedDate, 1), isReturn });
    
    return queue;
  }, []);

  const fetchFlightsForDates = React.useCallback(async (dates: Date[], isReturn: boolean = false) => {
    if (dates.length === 0) return;
    
    const params = new URLSearchParams(searchParams.toString());
    
    if (isReturn) {
      setIsLoadingReturn(true);
    } else {
      setIsLoadingDeparture(true);
    }

    try {
      const requestBody = {
        pointOfSale: "BD",
        source: "bdfare",
        request: {
          originDest: [{
            originDepRequest: {
              iatA_LocationCode: isReturn ? params.get('to') : params.get('from'),
              date: dates[0].toISOString().split('T')[0]
            },
            destArrivalRequest: {
              iatA_LocationCode: isReturn ? params.get('from') : params.get('to')
            }
          }],
          pax: [
            { paxID: "PAX1", ptc: "ADT" }
          ],
          shoppingCriteria: {
            tripType: "Oneway",
            travelPreferences: {
              vendorPref: [],
              cabinCode: params.get('class') || "Economy"
            },
            returnUPSellInfo: true
          }
        }
      };

      const apiUrl = process.env.NEXT_PUBLIC_API_URL;
      const response = await fetch(`${apiUrl}/api/combined/search`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody),
      });

      if (!response.ok) {
        throw new Error('Failed to fetch flights');
      }

      const data = await response.json();
      
      // Process the flights for this date
      const newFlights = data.flights?.map((flight: any) => ({
        ...flight,
        isReturn,
        OutboundSegments: flight.OutboundSegments?.map((segment: any) => ({
          ...segment,
          Departure: {
            ...segment.Departure,
            ScheduledTime: dates[0].toISOString().split('T')[0] + 'T' + segment.Departure.ScheduledTime.split('T')[1]
          }
        }))
      })) || [];

      // Update local flight results
      setLocalFlightResults(prev => {
        const dateStr = dates[0].toISOString().split('T')[0];
        const filteredPrev = prev.filter(flight => {
          const flightDate = flight.OutboundSegments?.[0]?.Departure?.ScheduledTime?.split('T')[0];
          return flightDate !== dateStr || flight.isReturn !== isReturn;
        });
        return [...filteredPrev, ...newFlights];
      });

    } catch (error) {
      console.error('Error fetching flights:', error);
    } finally {
      if (isReturn) {
        setIsLoadingReturn(false);
      } else {
        setIsLoadingDeparture(false);
      }
    }
  }, [searchParams]);

  // Process loading queue with delay between requests
  useEffect(() => {
    const processQueue = async () => {
      if (loadingQueue.length === 0 || isProcessingQueue) return;
      
      setIsProcessingQueue(true);
      const { date, isReturn } = loadingQueue[0];
      setLoadingDate(date.toISOString().split('T')[0]);

      try {
        await fetchFlightsForDates([date], isReturn);
      } catch (error) {
        console.error('Error loading date:', error);
      }
      
      // Remove processed date from queue
      setLoadingQueue(prev => prev.slice(1));
      setLoadingDate(null);
      setIsProcessingQueue(false);
    };

    processQueue();
  }, [loadingQueue, isProcessingQueue, fetchFlightsForDates]);

  // Initialize loading queue when selected dates change
  useEffect(() => {
    setLoadingQueue([]); // Clear existing queue
    if (departureDate) {
      // First fetch selected departure date
      fetchFlightsForDates([departureDate], false);
      // Then queue surrounding dates
      const departureQueue = getDateLoadingQueue(departureDate, false);
      setLoadingQueue(prev => [...prev, ...departureQueue]);
    }
    
    if (returnDate && tripType === 'roundTrip') {
      // First fetch selected return date
      fetchFlightsForDates([returnDate], true);
      // Then queue surrounding dates
      const returnQueue = getDateLoadingQueue(returnDate, true);
      setLoadingQueue(prev => [...prev, ...returnQueue]);
    }
  }, [departureDate, returnDate, tripType, fetchFlightsForDates, getDateLoadingQueue]);

  // Return null for multiCity trips
  if (tripType === 'multiCity') {
    return null;
  }

  return (
    <div className={`bg-white dark:bg-gray-900 rounded-lg shadow-sm border border-gray-200 dark:border-gray-800 p-4 ${className}`}>
      <h2 className="text-lg font-semibold mb-4">Flexible Dates</h2>
      <div className="space-y-4">
        <div>
          <div className="text-sm text-gray-600 dark:text-gray-400 mb-2">Departure Dates</div>
          <FlightSuggestionCalendar
            selectedDate={departureDate}
            onDateSelect={onDepartureDateSelect}
            prices={departurePrices}
            minDate={new Date()}
            isLoading={isLoadingDeparture}
            loadingDate={loadingDate}
            onNavigate={(direction, dates) => {
              const adjacentDates = dates.filter(date => {
                const dateStr = format(date, 'yyyy-MM-dd');
                return !departurePrices[dateStr] && 
                       (Math.abs(date.getTime() - (departureDate || new Date()).getTime()) <= 86400000);
              });
              if (adjacentDates.length > 0) {
                setLoadingQueue(prev => [...prev, ...adjacentDates.map(date => ({ date, isReturn: false }))]);
              }
            }}
          />
        </div>

        {tripType === 'roundTrip' && (
          <div>
            <div className="text-sm text-gray-600 dark:text-gray-400 mb-2">Return Dates</div>
            <FlightSuggestionCalendar
              selectedDate={returnDate}
              onDateSelect={onReturnDateSelect}
              prices={returnPrices}
              minDate={departureDate || new Date()}
              isLoading={isLoadingReturn}
              loadingDate={loadingDate}
              onNavigate={(direction, dates) => {
                const adjacentDates = dates.filter(date => {
                  const dateStr = format(date, 'yyyy-MM-dd');
                  return !returnPrices[dateStr] && 
                         (Math.abs(date.getTime() - (returnDate || new Date()).getTime()) <= 86400000);
                });
                if (adjacentDates.length > 0) {
                  setLoadingQueue(prev => [...prev, ...adjacentDates.map(date => ({ date, isReturn: true }))]);
                }
              }}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default FlightCalendarSection;