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
  className?: string;
  departureDate?: Date;
}

const DateInput: React.FC<DateInputProps> = ({
  type,
  value,
  subValue,
  onDateSelect,
  className,
  selectedDate,
  departureDate,
}) => {
  const { tripType } = useTripType();
  const [showCalendar, setShowCalendar] = useState(false);
  const [currentMonth, setCurrentMonth] = useState<Date>(new Date());
  const containerRef = useRef<HTMLDivElement>(null);

  const today = startOfDay(new Date());
  const minSelectableDate = addDays(today, 0);

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
    onDateSelect?.(type, day);
  };

  const disabledDays = {
    before: type === 'return' && departureDate ? addDays(departureDate, 1) : minSelectableDate,
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
      <div
        className={cn(
          'h-full w-full p-4 bg-white dark:bg-black text-black dark:text-white',
          'cursor-pointer rounded-lg',
          'hover:bg-gray-50 dark:hover:bg-gray-900 hover:shadow-md',
          'transition-all duration-200'
        )}
        onClick={() => setShowCalendar((prev) => !prev)}
      >
        <div className="text-sm text-gray-600 dark:text-gray-400">
          {type === 'departure' ? 'Departure' : 'Return'}
        </div>
        <div className="text-lg font-semibold">{formattedDate || 'Select date'}</div>
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
            'w-[320px]'
          )}
          style={{
            top: '100%',
            left: type === 'return' ? 'auto' : 0,
            right: type === 'return' ? 0 : 'auto',
          }}
        >
          <DayPicker
            mode="single"
            selected={selectedDate}
            onSelect={handleDayClick}
            disabled={disabledDays}
            month={currentMonth}
            onMonthChange={setCurrentMonth}
            numberOfMonths={1}
            showOutsideDays={false}
            modifiersStyles={{
              selected: { backgroundColor: '#007BFF', color: '#fff' },
              disabled: { color: '#d3d3d3' },
            }}
          />
        </div>
      )}
    </div>
  );
};

export default DateInput;