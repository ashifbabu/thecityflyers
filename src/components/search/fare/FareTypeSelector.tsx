'use client'

import React from 'react';
import { cn } from '@/lib/utils';

const fareTypes = [
  { id: 'regular', label: 'Regular Fares' },
  { id: 'student', label: 'Student Fares' },
  { id: 'seaman', label: 'Seaman Fares' },
];

const FareTypeSelector = () => {
  const [selected, setSelected] = React.useState('regular');

  return (
    <div className="flex gap-6">
      <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
        Fare Type:
      </span>
      <div className="flex gap-4">
        {fareTypes.map(({ id, label }) => (
          <button
            key={id}
            onClick={() => setSelected(id)}
            className={cn(
              "flex items-center gap-2",
              "text-sm font-medium",
              selected === id ? "text-blue-600 dark:text-blue-400" : "text-gray-500 dark:text-gray-400"
            )}
          >
            <div className={cn(
              "w-4 h-4 rounded-full border-2",
              "flex items-center justify-center",
              selected === id ? [
                "border-blue-600 dark:border-blue-400",
                "bg-blue-600 dark:bg-blue-400"
              ] : "border-gray-400 dark:border-gray-600"
            )}>
              {selected === id && (
                <div className="w-2 h-2 rounded-full bg-white" />
              )}
            </div>
            {label}
          </button>
        ))}
      </div>
    </div>
  );
};

export default FareTypeSelector;