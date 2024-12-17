'use client'

import React from 'react';
import { useTripType } from '@/hooks/use-trip-type';
import DateInput from './DateInput';

const DateInputs = () => {
  const { tripType } = useTripType();
  const [departure, setDeparture] = React.useState('');
  const [returnDate, setReturnDate] = React.useState('');

  return (
    <div className="grid grid-cols-2 gap-4">
      <DateInput
        label="Departure"
        value={departure}
        onChange={setDeparture}
      />
      <DateInput
        label="Return"
        value={returnDate}
        onChange={setReturnDate}
        disabled={tripType === 'oneWay'}
      />
    </div>
  );
};

export default DateInputs;