import React from 'react'
import { UserIcon } from '@heroicons/react/24/outline'

// Example stroller icon - replace if you have a different one
const StrollerIcon = () => (
  <svg 
    xmlns="http://www.w3.org/2000/svg" 
    fill="none" viewBox="0 0 24 24" strokeWidth={1.5} 
    stroke="currentColor" className="w-5 h-5"
  >
    <path 
      strokeLinecap="round" strokeLinejoin="round" 
      d="M10.125 8.25c0 2.071-1.679 3.75-3.75 3.75S2.625 10.321 2.625 8.25 4.304 4.5 6.375 4.5s3.75 1.679 3.75 3.75zM6.375 12v7.5m0 0h1.125m-1.125 0H5.25M20.25 6H12M9 6H7.5C6.395 6 5.4 6.395 4.605 7.05L3 8.25l3 3 3.75-3.75A3 3 0 0 1 10.5 6H9zm5.25 12.75a1.125 1.125 0 1 1-2.25 0 1.125 1.125 0 0 1 2.25 0zm6 0a1.125 1.125 0 1 1-2.25 0 1.125 1.125 0 0 1 2.25 0z" 
    />
  </svg>
)

interface TravelersPopupProps {
  adults: number
  children: number
  infants: number
  travelClass: string
  onChangeAdults: (value: number) => void
  onChangeChildren: (value: number) => void
  onChangeInfants: (value: number) => void
  onChangeClass: (value: string) => void
  onClose: () => void
}

const TravelersPopup: React.FC<TravelersPopupProps> = ({
  adults,
  children,
  infants,
  travelClass,
  onChangeAdults,
  onChangeChildren,
  onChangeInfants,
  onChangeClass,
  onClose
}) => {
  const classes = ["Economy", "Premium Economy", "Business", "First Class"];

  const IncrementDecrement = ({ label, icon, value, onChange, max = 9 }: { 
    label: string; 
    icon: React.ReactNode;
    value: number;
    onChange: (val: number) => void;
    max?: number;
  }) => {
    return (
      <div className="flex items-center justify-between py-2">
        <div className="flex items-center space-x-2">
          <div className="text-gray-700 dark:text-gray-300">
            {icon}
          </div>
          <span className="text-sm text-gray-700 dark:text-gray-300">{label}</span>
        </div>
        <div className="flex items-center space-x-2">
          <button
            type="button"
            onClick={() => onChange(Math.max(value - 1, 0))}
            disabled={value === 0}
            className="bg-gray-200 dark:bg-gray-600 rounded-full w-6 h-6 flex items-center justify-center hover:bg-gray-300 dark:hover:bg-gray-500"
          >
            -
          </button>
          <span className="text-gray-900 dark:text-white">{value}</span>
          <button
            type="button"
            onClick={() => onChange(Math.min(value + 1, max))}
            disabled={value === max}
            className="bg-gray-200 dark:bg-gray-600 rounded-full w-6 h-6 flex items-center justify-center hover:bg-gray-300 dark:hover:bg-gray-500"
          >
            +
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="absolute top-full right-0 mt-2 bg-white dark:bg-gray-800 shadow-lg border border-gray-200 dark:border-gray-700 p-4 z-50 w-64">
      <IncrementDecrement 
        label="Adults (12+)" 
        icon={<UserIcon className="w-5 h-5" />} 
        value={adults} 
        onChange={onChangeAdults} 
      />
      <IncrementDecrement 
        label="Children (2-11)" 
        icon={<UserIcon className="w-5 h-5" />} 
        value={children} 
        onChange={onChangeChildren} 
        max={6}
      />
      <IncrementDecrement 
        label="Infants (below 2)" 
        icon={<StrollerIcon />} 
        value={infants} 
        onChange={onChangeInfants} 
        max={6}
      />

      <div className="mt-4">
        <span className="text-sm font-semibold text-gray-700 dark:text-gray-300">Travel Class</span>
        <div className="flex flex-wrap items-center mt-2 gap-2">
          {classes.map((cls) => (
            <button
              key={cls}
              onClick={() => onChangeClass(cls)}
              className={`text-sm px-2 py-1 rounded border ${
                travelClass === cls ? "bg-orange-500 text-white border-orange-500" : "border-gray-200 dark:border-gray-600 text-gray-700 dark:text-gray-300"
              } hover:bg-orange-100 dark:hover:bg-gray-700`}
            >
              {cls}
            </button>
          ))}
        </div>
      </div>

      <div className="flex justify-end mt-4">
        <button 
          type="button"
          onClick={onClose}
          className="bg-orange-500 hover:bg-orange-600 text-white px-4 py-1 rounded"
        >
          Done
        </button>
      </div>
    </div>
  )
}

export default TravelersPopup
