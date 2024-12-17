import React from 'react'

interface DateInputProps {
  type: 'departure' | 'return'
  value: string
  subValue: string
}

const DateInput: React.FC<DateInputProps> = ({ type, value, subValue }) => {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow-sm h-full">
      <div className="text-sm text-gray-500 dark:text-gray-400">{type === 'departure' ? 'Departure' : 'Return'}</div>
      <div className="text-lg font-semibold">{value}</div>
      {subValue && <div className="text-sm text-gray-500 dark:text-gray-400">{subValue}</div>}
    </div>
  )
}

export default DateInput