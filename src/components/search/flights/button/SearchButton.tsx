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
    fromAirportCode?: string;
    toAirportCode?: string;
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

    // Use airport codes instead of city names
    const fromCode = searchData.fromAirportCode || "DAC";
    const toCode = searchData.toAirportCode || "CGP";

    // Construct URL parameters
    const params = new URLSearchParams({
      tripType,
      from: fromCode,
      to: toCode,
      departure: searchData.departureDate?.toISOString().split('T')[0] || "",
      return: searchData.returnDate?.toISOString().split('T')[0] || "",
      travelers: String(searchData.travelers || 1)
    });

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
