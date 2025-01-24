'use client';

import React from 'react';
import { useTripType } from '@/hooks/use-trip-type';
import FlightSuggestionCalendar from './FlightSuggestionCalendar';

interface FlightCalendarSectionProps {
  departureDate?: Date;
  returnDate?: Date;
  onDepartureDateSelect?: (date: Date) => void;
  onReturnDateSelect?: (date: Date) => void;
}

const FlightCalendarSection: React.FC<FlightCalendarSectionProps> = ({
  departureDate,
  returnDate,
  onDepartureDateSelect,
  onReturnDateSelect,
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
    <div className="space-y-4">
      <FlightSuggestionCalendar
        selectedDate={departureDate}
        onDateSelect={onDepartureDateSelect}
        prices={departurePrices}
        minDate={new Date()}
      />

      {tripType === 'roundTrip' && (
        <FlightSuggestionCalendar
          selectedDate={returnDate}
          onDateSelect={onReturnDateSelect}
          prices={returnPrices}
          minDate={departureDate || new Date()}
          className="mt-4"
        />
      )}
    </div>
  );
};

export default FlightCalendarSection;