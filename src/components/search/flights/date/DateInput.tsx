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
  onChange?: (newDate: Date) => void;
  className?: string;
  departureDate?: Date;
}

const DateInput: React.FC<DateInputProps> = ({
  type,
  value,
  subValue,
  onChange,
  className,
  departureDate,
}) => {
  const { tripType } = useTripType();
  const [showCalendar, setShowCalendar] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);
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

  const handleClick = () => {
    setShowCalendar((prev) => !prev);
  };

  const handleDayClick: SelectSingleEventHandler = (day) => {
    if (!day) return;

    if (isBefore(day, minSelectableDate)) return;

    if (type === 'return' && departureDate && isBefore(day, departureDate)) return;

    setSelectedDate(day);
    setShowCalendar(false);
    onChange?.(day);
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
        <div
          className={cn(
            'bg-white dark:bg-black text-black dark:text-white p-4',
            'shadow-sm cursor-pointer h-full',
            'hover:bg-gray-50 dark:hover:bg-gray-900',
            'transition-colors duration-200',
            'rounded-lg' // Adds border radius to the parent div
          )}
          onClick={handleClick}
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
            right: type === 'departure' ? 'auto' : 0,
            margin: type === 'return' ? '0 0 0 auto' : '0 auto 0 0',
            transform: 'translateX(0)',
            overflow: 'visible', // Ensures the popup isn't clipped
          }}
        >
          <DayPicker
            mode="single"
            selected={selectedDate}
            onSelect={handleDayClick}
            disabled={disabledDays}
            numberOfMonths={numberOfMonths}
            showOutsideDays={false}
            classNames={{
              months: 'flex flex-col md:flex-row space-y-4 md:space-x-4 md:space-y-0',
              month: 'w-full md:w-[280px]',
              caption: 'flex justify-between items-center h-10 mb-4',
              caption_label: 'text-sm font-medium text-gray-900 dark:text-gray-100',
              nav: 'flex items-center',
              nav_button: cn(
                'h-7 w-7 bg-transparent p-0 opacity-70 hover:opacity-100',
                'text-gray-800 dark:text-gray-100',
                'hover:bg-gray-100 dark:hover:bg-gray-800',
                'rounded-full transition-colors'
              ),
              table: 'w-full border-collapse',
              head_row: 'flex',
              head_cell: cn(
                'text-gray-500 dark:text-gray-400',
                'rounded-md w-9 font-normal text-[0.8rem] mb-1'
              ),
              row: 'flex w-full mt-2',
              cell: cn(
                'relative p-0 text-center text-sm focus-within:relative focus-within:z-20',
                'first:[&:has([aria-selected])]:rounded-l-md last:[&:has([aria-selected])]:rounded-r-md'
              ),
              day: cn(
                'h-9 w-9 p-0 font-normal',
                'aria-selected:opacity-100',
                'hover:bg-gray-100 dark:hover:bg-gray-800',
                'rounded-md transition-colors'
              ),
              day_selected: cn(
                'bg-black dark:bg-white text-white dark:text-black',
                'hover:bg-black dark:hover:bg-white',
                'focus:bg-black dark:focus:bg-white'
              ),
              day_today: 'bg-gray-100 dark:bg-gray-800',
              day_disabled: 'text-gray-400 dark:text-gray-600 hover:bg-transparent',
              day_outside: 'opacity-50',
            }}
          />
        </div>
      )}
    </div>
  );
};

export default DateInput;
