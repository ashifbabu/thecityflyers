import React, { useState, useRef, useEffect } from 'react';
import { DayPicker, SelectSingleEventHandler } from 'react-day-picker';
import 'react-day-picker/dist/style.css';
import { useTripType } from '@/hooks/use-trip-type';
import { ChevronDownIcon, ChevronUpIcon } from '@heroicons/react/24/solid';
import { cn } from '@/lib/utils';
import { addDays, startOfDay, isBefore } from 'date-fns';

interface DateInputProps {
  type: 'departure' | 'return';
  value: string;
  subValue: string;
  selectedDate?: Date;
  onDateSelect?: (type: 'departure' | 'return', date: Date) => void;
  onChange?: (date: Date) => void; // Add onChange here
  className?: string;
  departureDate?: Date;
}

const DateInput: React.FC<DateInputProps> = ({
  type,
  value,
  subValue,
  onDateSelect, // Use onDateSelect only
  className,
  selectedDate,
  departureDate,
}) => {
  const { tripType } = useTripType();
  const [showCalendar, setShowCalendar] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const today = startOfDay(new Date());
  const minSelectableDate = addDays(today, 2);
  const numberOfMonths = tripType === 'roundTrip' ? 2 : 1;

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setShowCalendar(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleDayClick: SelectSingleEventHandler = (day) => {
    if (!day) return;

    if (isBefore(day, minSelectableDate)) return;

    setShowCalendar(false);
    onDateSelect?.(type, day); // Call the onDateSelect prop
  };

  const disabledDays = {
    before: type === 'return' && departureDate ? departureDate : minSelectableDate,
  };

  const formattedDate = selectedDate
    ? selectedDate.toLocaleDateString('en-US', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
      })
    : value;

  const weekday = selectedDate
    ? selectedDate.toLocaleDateString('en-US', { weekday: 'long' })
    : subValue;

  return (
    <div className={`relative ${className}`} ref={containerRef}>
      {/* Render UI */}
      <div
        className={cn(
          'bg-white dark:bg-black text-black dark:text-white p-4',
          'shadow-sm cursor-pointer h-full',
          'hover:bg-gray-50 dark:hover:bg-gray-900',
          'transition-colors duration-200'
        )}
        onClick={() => setShowCalendar((prev) => !prev)}
      >
        <div className="text-sm text-gray-600 dark:text-gray-400">
          {type === 'departure' ? 'Departure' : 'Return'}
        </div>
        <div className="text-lg font-semibold">{formattedDate}</div>
        <div className="text-sm text-gray-600 dark:text-gray-400">{weekday}</div>
        {showCalendar ? (
          <ChevronUpIcon className="h-5 w-5 text-gray-600 dark:text-gray-400 absolute right-4 top-1/2 transform -translate-y-1/2" />
        ) : (
          <ChevronDownIcon className="h-5 w-5 text-gray-600 dark:text-gray-400 absolute right-4 top-1/2 transform -translate-y-1/2" />
        )}
      </div>

      {showCalendar && (
        <div
          className={cn(
            'absolute z-50 mt-2',
            'bg-white dark:bg-gray-900',
            'border border-gray-200 dark:border-gray-700',
            'rounded-lg shadow-xl',
            'p-4',
            'w-[320px] md:w-auto max-w-sm'
          )}
          style={{
            position: 'absolute',
            top: '100%',
            left: type === 'return' ? 'auto' : 0,
            right: type === 'return' ? 0 : 'auto',
            margin: type === 'return' ? '0 0 0 auto' : '0 auto 0 0',
          }}
        >
          <DayPicker
            mode="single"
            selected={selectedDate}
            onSelect={handleDayClick}
            disabled={disabledDays}
            numberOfMonths={numberOfMonths}
            showOutsideDays={false}
          />
        </div>
      )}
    </div>
  );
};

export default DateInput;