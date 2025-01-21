'use client';

import React, { useState } from 'react';
import { Radio } from '@geist-ui/core';

const tripTypes = [
  { id: 'oneWay', label: 'One Way' },
  { id: 'roundTrip', label: 'Round Trip' },
  { id: 'multiCity', label: 'Multi City' },
];

const TripTypeSelector = () => {
  const [selected, setSelected] = useState('oneWay');

  return (
    <Radio.Group
      className="radio-group-horizontal"
      value={selected}
      onChange={(val) => setSelected(val as string)}
    >
      {tripTypes.map(({ id, label }) => (
        <Radio key={id} value={id}>
          {label}
        </Radio>
      ))}
    </Radio.Group>
  );
};

export default TripTypeSelector;
