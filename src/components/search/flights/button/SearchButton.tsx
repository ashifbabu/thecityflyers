'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { cn } from '@/lib/utils';
import { useTripType } from '@/hooks/use-trip-type';
import { validateFlightSearch } from '@/lib/validations';
import type { FlightSearchError, TripType } from '@/types/flight';

type ApiTripType = 'Oneway' | 'Return' | 'Circle';

interface SearchButtonProps {
  onError?: (errors: FlightSearchError[]) => void;
  searchData: {
    fromCity?: string;
    toCity?: string;
    fromAirportCode?: string;
    toAirportCode?: string;
    departureDate?: Date;
    returnDate?: Date;
    travelers?: {
      adults: number;
      kids: number;
      children: number;
      infants: number;
      totalPassengers: number;
      travelClass: string;
    };
    flights?: any[];
    travelClass?: string;
  };
  buttonText?: string;
}

export const getApiTripType = (type: TripType): ApiTripType => {
  switch (type) {
    case 'roundTrip':
      return 'Return';
    case 'multiCity':
      return 'Circle';
    case 'oneWay':
      return 'Oneway';
    default:
      return 'Oneway';
  }
};

const SearchButton = ({ onError, searchData, buttonText = 'Search' }: SearchButtonProps) => {
  const router = useRouter();
  const { tripType } = useTripType();
  const [loading, setLoading] = useState(false);

  const formatDate = (date?: Date) => {
    if (!date) return undefined;
    // Create a new date and set to midnight in local timezone
    const d = new Date(date);
    d.setHours(12, 0, 0, 0); // Set to noon to avoid any timezone edge cases
    return d.toISOString().slice(0, 10); // Get YYYY-MM-DD
  };

  const handleSearch = async () => {
    console.log('🛫 Search button clicked');
    console.log('🔍 Search Data:', searchData);

    const validationErrors = validateFlightSearch(tripType, {
      ...searchData,
      travelers: searchData.travelers?.totalPassengers,
    });

    if (validationErrors.length > 0) {
      if (onError) {
        onError(validationErrors);
      }
      return;
    }

    // Generate passengers array
    const { adults = 1, kids = 0, children = 0, infants = 0 } = 
      searchData.travelers || { adults: 1, kids: 0, children: 0, infants: 0 };

    const pax = [];
    let paxCounter = 1;

    // Add Adults (ADT)
    for (let i = 0; i < adults; i++) {
      pax.push({ paxID: `PAX${paxCounter++}`, ptc: 'ADT' });
    }

    // Add Kids (CHD)
    for (let i = 0; i < kids; i++) {
      pax.push({ paxID: `PAX${paxCounter++}`, ptc: 'CHD' });
    }

    // Add Children (C05)
    for (let i = 0; i < children; i++) {
      pax.push({ paxID: `PAX${paxCounter++}`, ptc: 'C05' });
    }

    // Add Infants (INF)
    for (let i = 0; i < infants; i++) {
      pax.push({ paxID: `PAX${paxCounter++}`, ptc: 'INF' });
    }

    let requestBody;

    if (tripType === 'multiCity' && searchData.flights) {
      // Handle multi-city request
      const originDest = searchData.flights
        .filter(flight => flight.fromAirportCode && flight.toAirportCode && flight.departureDate) // Filter out incomplete segments
        .map(flight => ({
          originDepRequest: {
            iatA_LocationCode: flight.fromAirportCode,
            date: formatDate(flight.departureDate)
          },
          destArrivalRequest: {
            iatA_LocationCode: flight.toAirportCode
          }
        }));

      if (originDest.length < 2) {
        if (onError) {
          onError([{ field: 'flights', message: 'At least two valid flight segments are required' }]);
        }
        return;
      }

      requestBody = {
        pointOfSale: "BD",
        source: "bdfare", // Changed from "bdfare" to "all" to match successful request
        request: {
          originDest,
          pax,
          shoppingCriteria: {
            tripType: "Circle",
            travelPreferences: {
              vendorPref: [],
              cabinCode: searchData.travelers?.travelClass || "Economy"
            },
            returnUPSellInfo: true
          }
        }
      };
    } else {
      // Handle one-way and round-trip requests
      const originDest = [
        {
          originDepRequest: {
            iatA_LocationCode: searchData.fromAirportCode,
            date: formatDate(searchData.departureDate)
          },
          destArrivalRequest: {
            iatA_LocationCode: searchData.toAirportCode
          }
        }
      ];

      if (tripType === 'roundTrip' && searchData.returnDate) {
        originDest.push({
          originDepRequest: {
            iatA_LocationCode: searchData.toAirportCode,
            date: formatDate(searchData.returnDate)
          },
          destArrivalRequest: {
            iatA_LocationCode: searchData.fromAirportCode
          }
        });
      }

      requestBody = {
        pointOfSale: "BD",
        source: "bdfare", // Changed from "bdfare" to "all"
        request: {
          originDest,
          pax,
          shoppingCriteria: {
            tripType: getApiTripType(tripType),
            travelPreferences: {
              vendorPref: [],
              cabinCode: searchData.travelers?.travelClass || "Economy"
            },
            returnUPSellInfo: true
          }
        }
      };
    }

    console.log("Final Request Body:", JSON.stringify(requestBody, null, 2));
    sessionStorage.setItem('lastFlightRequest', JSON.stringify(requestBody));

    // Construct URL parameters
    const params = new URLSearchParams({
      tripType,
      ...(tripType === 'multiCity' 
        ? { flights: JSON.stringify(searchData.flights) }
        : {
            from: searchData.fromAirportCode || '',
            to: searchData.toAirportCode || '',
            departure: formatDate(searchData.departureDate) || ''
          }
      ),
      adults: String(adults),
      kids: String(kids),
      children: String(children),
      infants: String(infants),
      class: searchData.travelers?.travelClass || 'Economy'
    });

    if (tripType === 'roundTrip' && searchData.returnDate) {
      params.append('return', formatDate(searchData.returnDate) || '');
    }

    router.push(`/flight_results?${params.toString()}`);
  };

  return (
    <button
      type="button"
      onClick={handleSearch}
      disabled={loading}
      className={cn(
        'w-full max-w-xs mx-auto rounded-md',
        'transition-all duration-200 flex items-center justify-center font-medium py-4 px-8',
        loading ? 'bg-gray-400 cursor-not-allowed' : 'bg-black text-white hover:bg-gray-900'
      )}
    >
      {loading ? 'Searching...' : buttonText}
    </button>
  );
};

export default SearchButton;