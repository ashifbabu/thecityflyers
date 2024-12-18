import React, { useState } from 'react'
import { ChevronDownIcon, ChevronUpIcon } from '@heroicons/react/24/solid'
import { cn } from '@/lib/utils'

interface TravelersInputProps {
  value: string
  subValue: string
  onClick: () => void
}

const TravelersInput: React.FC<TravelersInputProps> = ({ value, subValue, onClick }) => {
  const [isOpen, setIsOpen] = useState(false)

  const toggleModal = () => {
    setIsOpen(!isOpen)
  }

  return (
    <div className="relative h-full">
      <button
        type="button"
        className={cn(
          'bg-white dark:bg-gray-800 p-4 shadow-sm cursor-pointer h-full w-full text-left',
          'border border-gray-100 dark:border-gray-700 hover:border-gray-200 dark:hover:border-gray-600 transition-colors'
        )}
        onClick={toggleModal}
      >
        <div className="text-sm text-gray-600 dark:text-gray-300">Travelers & Booking Class</div>
        <div className="text-lg font-semibold text-gray-900 dark:text-white">{value}</div>
        <div className="text-sm text-gray-600 dark:text-gray-300">{subValue}</div>
        {isOpen ? (
          <ChevronUpIcon className="h-5 w-5 text-gray-500 dark:text-gray-400 absolute right-4 top-1/2 transform -translate-y-1/2" />
        ) : (
          <ChevronDownIcon className="h-5 w-5 text-gray-500 dark:text-gray-400 absolute right-4 top-1/2 transform -translate-y-1/2" />
        )}
      </button>

      {isOpen && (
        <div className="absolute z-10 w-full bg-white dark:bg-gray-800 shadow-lg border border-gray-200 dark:border-gray-700 mt-2 py-4 h-auto">
          <div className="grid grid-cols-2 gap-4 px-4">
            <div>
              <div className="text-sm text-gray-600 dark:text-gray-300">Travelers</div>
              <div className="text-lg font-semibold text-gray-900 dark:text-white">1 Traveler</div>
            </div>
            <div>
              <div className="text-sm text-gray-600 dark:text-gray-300">Booking Class</div>
              <div className="text-lg font-semibold text-gray-900 dark:text-white">Economy</div>
            </div>
          </div>
          <div className="px-4 py-2 hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer mt-4">
            <div className="text-sm text-gray-600 dark:text-gray-300">Done</div>
          </div>
        </div>
      )}
    </div>
  )
}

export default TravelersInput