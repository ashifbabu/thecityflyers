'use client'

import React from 'react';
import { cn } from '@/lib/utils';

const fareTypes = [
  { id: 'regular', label: 'Regular Fares' },
  { id: 'student', label: 'Student Fares' },
  { id: 'seaman', label: 'Seaman Fares' },
] as const;

const FareTypes = () => {
  const [selected, setSelected] = React.useState('regular');

  return (
    <div className="flex flex-wrap gap-6">
      <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
        Fare Type:
      </span>
      <div className="flex flex-wrap gap-4">
        {fareTypes.map(({ id, label }) => (
          <button
            key={id}
            type="button"
            onClick={() => setSelected(id)}
            className="flex items-center gap-2"
          >
            <div className={cn(
              "w-4 h-4 rounded-full border-2",
              "flex items-center justify-center",
              selected === id 
                ? "border-gray-900 dark:border-gray-100 bg-gray-900 dark:bg-gray-100" 
                : "border-gray-300 dark:border-gray-600"
            )}>
              {selected === id && (
                <div className="w-1.5 h-1.5 rounded-full bg-white dark:bg-gray-900" />
              )}
            </div>
            <span className="text-sm text-gray-700 dark:text-gray-300">{label}</span>
          </button>
        ))}
      </div>
    </div>
  );
};

export default FareTypes;