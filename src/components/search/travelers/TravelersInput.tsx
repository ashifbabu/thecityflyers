import React from 'react'

interface TravelersInputProps {
  value: string
  subValue: string
  onClick: () => void
}

const TravelersInput: React.FC<TravelersInputProps> = ({ value, subValue, onClick }) => {
  return (
    <button
      type="button"
      className="bg-white dark:bg-gray-800 p-4 shadow-sm cursor-pointer h-full w-full text-left 
                 border border-gray-100 dark:border-gray-700 
                 hover:border-gray-200 dark:hover:border-gray-600 transition-colors"
      onClick={onClick}
    >
      <div className="text-sm text-gray-600 dark:text-gray-300">
        Travelers & Booking Class
      </div>
      <div className="text-lg font-semibold text-gray-900 dark:text-white">
        {value}
      </div>
      <div className="text-sm text-gray-600 dark:text-gray-300">
        {subValue}
      </div>
    </button>
  )
}

export default TravelersInput
