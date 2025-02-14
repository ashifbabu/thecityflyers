'use client';

import React from 'react';
import { useTripType } from '@/hooks/use-trip-type';
import FlightSuggestionCalendar from './FlightSuggestionCalendar';

interface FlightCalendarSectionProps {
  departureDate?: Date;
  returnDate?: Date;
  onDepartureDateSelect?: (date: Date) => void;
  onReturnDateSelect?: (date: Date) => void;
  className?: string;
  lowestDepartureFare?: number;
  lowestReturnFare?: number;
}

const FlightCalendarSection: React.FC<FlightCalendarSectionProps> = ({
  departureDate,
  returnDate,
  onDepartureDateSelect,
  onReturnDateSelect,
  className,
  lowestDepartureFare,
  lowestReturnFare,
}) => {
  const { tripType } = useTripType();

  // Sample price data - in a real app, this would come from an API
  const departurePrices = {
    '2024-01-28': 22856,
    '2024-01-29': 21856,
    '2024-01-30': 20856,
    '2024-01-31': 21856,
    '2024-02-01': 22856,
  };

  const returnPrices = {
    '2024-02-01': 22856,
    '2024-02-02': 21856,
    '2024-02-03': 20856,
    '2024-02-04': 21856,
    '2024-02-05': 22856,
  };

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
            lowestFare={lowestDepartureFare}
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
              lowestFare={lowestReturnFare}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default FlightCalendarSection;