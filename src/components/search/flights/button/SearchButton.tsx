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
import type { FlightSearchError } from '@/types/flight';

interface SearchButtonProps {
  onError?: (errors: FlightSearchError[]) => void;
  searchData: {
    fromCity?: string;
    toCity?: string;
    departureDate?: Date;
    returnDate?: Date;
    travelers?: number;
  };
  buttonText?: string;
}



const SearchButton = ({ onError, searchData, buttonText = 'Search' }: SearchButtonProps) => {
  const router = useRouter();
  const { tripType } = useTripType();
  const [loading, setLoading] = useState(false);

  const handleSearch = async () => {
    console.log('🔍 Search button clicked');
    console.log('🎯 Raw Search Data:', searchData);
const API_URL = "https://connect.thecityflyers.com";
    // Validate search data
    const validationErrors = validateFlightSearch(tripType, searchData);
    console.log('⚠️ Validation Errors:', validationErrors);

    if (validationErrors.length > 0) {
      if (onError) {
        onError(validationErrors);
      }
      return;
    }

    // Construct API request body (Matching your required format)
    const requestBody = {
      pointOfSale: "BD",
      source: "all",
      request: {
        originDest: [
          {
            originDepRequest: {
              iatA_LocationCode: searchData.fromCity || "",
              date: searchData.departureDate?.toISOString().split("T")[0] || "", // YYYY-MM-DD
            },
            destArrivalRequest: {
              iatA_LocationCode: searchData.toCity || "",
            },
          },
        ],
        pax: Array.from({ length: searchData.travelers || 1 }).map((_, index) => ({
          paxID: `PAX${index + 1}`,
          ptc: "ADT",
        })),
        shoppingCriteria: {
          tripType: tripType === "roundTrip" ? "Roundtrip" : "Oneway",
          travelPreferences: {
            vendorPref: [],
            cabinCode: "Economy",
          },
          returnUPSellInfo: true,
        },
      },
    };

    console.log('📩 Request Body for Flight Search API:', JSON.stringify(requestBody, null, 2));

     try {
      setLoading(true);
      const response = await fetch(`${API_URL}/api/combined/search`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody),
      });

      if (!response.ok) {
        throw new Error('Failed to fetch flight results');
      }

      const flightResults = await response.json();
      console.log('🛫 API Response:', flightResults);

      // Redirect to results page with search params and flight data
      const params = new URLSearchParams({
        tripType,
        fromCity: searchData.fromCity || "",
        toCity: searchData.toCity || "",
        departureDate: searchData.departureDate?.toISOString() || "",
        travelers: String(searchData.travelers || 1),
      });

      console.log('🌍 Navigating to:', `/flight_results?${params}`);
      const queryString = new URLSearchParams({
        ...Object.fromEntries(params),
        flights: JSON.stringify(flightResults)
      }).toString();

      router.push(`/flight_results?${queryString}`);

    } catch (error) {
      console.error('❌ Error fetching flights:', error);
      alert('Failed to fetch flights. Please try again.');
    } finally {
      setLoading(false);
    }
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



// {
//     "from": "Jashore (Jessore)",
//     "to": "Dhaka",
//     "departureDate": "2025-02-12T18:00:00.000Z",
//     "returnDate": "",
//     "travelers": 1
// }



