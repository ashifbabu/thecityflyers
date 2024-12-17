import React from 'react'

interface TravelersInputProps {
  value: string
  subValue: string
  onClick: () => void
}

const TravelersInput: React.FC<TravelersInputProps> = ({ value, subValue, onClick }) => {
  return (
    <div 
      className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow-sm cursor-pointer h-full"
      onClick={onClick}
    >
      <div className="text-sm text-gray-500 dark:text-gray-400">Travelers & Booking Class</div>
      <div className="text-lg font-semibold">{value}</div>
      <div className="text-sm text-gray-500 dark:text-gray-400">{subValue}</div>
    </div>
  )
}

export default TravelersInput

