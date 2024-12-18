import React, { useState, useRef, useEffect } from 'react'
import { DayPicker } from 'react-day-picker'
import 'react-day-picker/dist/style.css'
import { useTripType } from '@/hooks/use-trip-type'
import { ChevronDownIcon, ChevronUpIcon } from '@heroicons/react/24/solid'

interface DateInputProps {
  type: 'departure' | 'return'
  value: string
  subValue: string
  onChange?: (newDate: Date) => void
}

const DateInput: React.FC<DateInputProps> = ({ type, value, subValue, onChange }) => {
  const { tripType } = useTripType()
  const [showCalendar, setShowCalendar] = useState(false)
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined)
  const containerRef = useRef<HTMLDivElement>(null)

  const numberOfMonths = tripType === 'roundTrip' ? 2 : 1
  const currentMonth = new Date()
  const nextMonth = new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1)

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setShowCalendar(false)
      }
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  const handleClick = () => {
    setShowCalendar(prev => !prev)
  }

  const handleDayClick = (day?: Date) => {
    if (!day) return
    setSelectedDate(day)
    setShowCalendar(false)
    onChange?.(day)
  }

  const formattedDate = selectedDate
    ? selectedDate.toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' })
    : value

  const weekday = selectedDate
    ? selectedDate.toLocaleDateString('en-US', { weekday: 'long' })
    : subValue

  return (
    <div className="relative" ref={containerRef}>
      <div
        className="bg-white dark:bg-gray-800 p-4 shadow-sm cursor-pointer h-full border border-gray-100 dark:border-gray-700 hover:border-gray-200 dark:hover:border-gray-600 transition-colors"
        onClick={handleClick}
      >
        <div className="text-sm text-gray-600 dark:text-gray-300">
          {type === 'departure' ? 'Departure' : 'Return'}
        </div>
        <div className="text-lg font-semibold text-gray-900 dark:text-white">
          {formattedDate}
        </div>
        <div className="text-sm text-gray-600 dark:text-gray-300">
          {weekday}
        </div>
        {showCalendar ? (
          <ChevronUpIcon className="h-5 w-5 text-gray-500 dark:text-gray-400 absolute right-4 top-1/2 transform -translate-y-1/2" />
        ) : (
          <ChevronDownIcon className="h-5 w-5 text-gray-500 dark:text-gray-400 absolute right-4 top-1/2 transform -translate-y-1/2" />
        )}
      </div>

      {showCalendar && (
        <div
          className="absolute z-50 mt-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-md shadow-lg p-4"
          style={{ minWidth: '250px' }}
        >
          <DayPicker
            className="rdp-responsive"
            mode="single"
            required={false}
            selected={selectedDate}
            onSelect={handleDayClick}
            showOutsideDays={false}
            pagedNavigation
            month={currentMonth}
            fromMonth={currentMonth}
            toMonth={tripType === 'roundTrip' ? nextMonth : currentMonth}
            numberOfMonths={numberOfMonths}
            styles={{
              caption: { textAlign: 'center', fontWeight: '500', marginBottom: '1rem' },
              head: { textAlign: 'center', color: '#555' },
              table: { borderCollapse: 'separate' },
              day: {
                width: '2rem',
                height: '2rem',
                lineHeight: '2rem',
                margin: '0.2rem',
                borderRadius: '50%',
                textAlign: 'center',
                cursor: 'pointer'
              },
              day_selected: {
                backgroundColor: '#e11d48',
                color: '#fff'
              },
              day_today: {
                fontWeight: 'bold',
                border: '1px solid #ccc'
              }
            }}
            modifiersClassNames={{
              selected: 'bg-red-600 text-white',
              today: 'font-bold border-gray-300'
            }}
          />
        </div>
      )}
    </div>
  )
}

export default DateInput