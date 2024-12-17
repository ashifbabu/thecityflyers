import React from 'react'

interface LocationInputProps {
  type: 'from' | 'to'
  value: string
  subValue: string
  onChange: (value: string) => void
}

const LocationInput: React.FC<LocationInputProps> = ({ type, value, subValue, onChange }) => {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow-sm h-full">
      <div className="text-sm text-gray-500 dark:text-gray-400">{type === 'from' ? 'From' : 'To'}</div>
      <div className="text-lg font-semibold">{value}</div>
      <div className="text-sm text-gray-500 dark:text-gray-400 truncate">{subValue}</div>
    </div>
  )
}

export default LocationInput

