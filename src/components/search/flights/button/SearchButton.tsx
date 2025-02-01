// 'use client';

// import React from 'react';
// import { useRouter } from 'next/navigation';
// import { cn } from '@/lib/utils';
// import { useTripType } from '@/hooks/use-trip-type';
// import { validateFlightSearch } from '@/lib/validations';
// import type { FlightSearchError } from '@/types/flight';

// interface SearchButtonProps {
//   onError?: (errors: FlightSearchError[]) => void;
//   searchData: {
//     fromCity?: string;
//     toCity?: string;
//     departureDate?: Date;
//     returnDate?: Date;
//     travelers?: number;
//     flights?: any[];
//   };
//   buttonText?: string;
// }

// const SearchButton = ({ onError, searchData, buttonText = 'Search' }: SearchButtonProps) => {
//   const router = useRouter();
//   const { tripType } = useTripType();

//   const handleSearch = () => {
//     console.log('Search button clicked');
//     console.log('Search Data:', searchData);

//     // Validate search data
//     const validationErrors = validateFlightSearch(tripType, searchData);
//     console.log('Validation Errors:', validationErrors);

//     if (validationErrors.length > 0) {
//       if (onError) {
//         onError(validationErrors);
//       }
//       return;
//     }

//     // Construct search params
//     const params = new URLSearchParams({
//       tripType,
//       ...Object.entries(searchData).reduce((acc, [key, value]) => {
//         if (value !== undefined) {
//           if (value instanceof Date) {
//             acc[key] = value.toISOString();
//           } else if (typeof value === 'object') {
//             acc[key] = JSON.stringify(value);
//           } else {
//             acc[key] = String(value);
//           }
//         }
//         return acc;
//       }, {} as Record<string, string>)
//     });

//     console.log('Navigating to:', `/flight_results?${params.toString()}`);
//     router.push(`/flight_results?${params.toString()}`);
//   };

//   return (
//     <button
//       type="button"
//       onClick={handleSearch}
//       className={cn(
//         'w-full max-w-xs mx-auto rounded-md',
//         'transition-all duration-200 flex items-center justify-center font-medium py-4 px-8',
//         'bg-black text-white hover:bg-gray-900',
//         'dark:bg-white dark:text-black dark:hover:bg-gray-100'
//       )}
//     >
//       {buttonText}
//     </button>
//   );
// };

// export default SearchButton;


'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { cn } from '@/lib/utils';
import { useTripType } from '@/hooks/use-trip-type';
import { validateFlightSearch } from '@/lib/validations';
import type { FlightSearchError, TripType } from '@/types/flight';

// Define API trip type mapping
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
    travelers?: number;
  };
  buttonText?: string;
}

// Export getApiTripType to share with other components
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

  // Format date to YYYY-MM-DD
  const formatDate = (date?: Date) => {
    if (!date) return undefined;
    return date.toISOString().split('T')[0];
  };

  const handleSearch = async () => {
    console.log('🛫 Search button clicked');
    console.log('🔍 Search Data:', searchData);

    // Validate search data
    const validationErrors = validateFlightSearch(tripType, searchData);
    console.log('❌ Validation Errors:', validationErrors);

    if (validationErrors.length > 0) {
      if (onError) {
        onError(validationErrors);
      }
      return;
    }

    const fromCode = searchData.fromAirportCode || "";
    const toCode = searchData.toAirportCode || "";

    console.log("📌 Selected From Code:", fromCode);
    console.log("📌 Selected To Code:", toCode);

    // Validate required fields
    if (!fromCode || !toCode) {
      console.error("❌ ERROR: Airport codes are missing!");
      return;
    }

    // Construct the request body based on trip type
    const requestBody = {
      pointOfSale: "BD",
      source: "bdfare",
      request: {
        originDest: [
          {
            originDepRequest: {
              iatA_LocationCode: fromCode,
              date: formatDate(searchData.departureDate)
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
          tripType: getApiTripType(tripType),
          travelPreferences: {
            vendorPref: [],
            cabinCode: "Economy"
          },
          returnUPSellInfo: true
        }
      }
    };

    // Add return flight segment for round trips
    if (tripType === 'roundTrip' && searchData.returnDate) {
      requestBody.request.originDest.push({
        originDepRequest: {
          iatA_LocationCode: toCode,
          date: formatDate(searchData.returnDate)
        },
        destArrivalRequest: {
          iatA_LocationCode: fromCode
        }
      });
    }

    // Store the request in sessionStorage for the results page
    sessionStorage.setItem('lastFlightRequest', JSON.stringify(requestBody));

    // Construct URL parameters
    const params = new URLSearchParams({
      tripType: tripType,
      from: fromCode,
      to: toCode,
      departure: formatDate(searchData.departureDate) || '',
      travelers: String(searchData.travelers || 1)
    });

    // Add return date for round trips
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