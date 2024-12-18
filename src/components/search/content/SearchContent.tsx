// SearchContent.tsx
'use client'

import React, { useState } from 'react'
import { ArrowsRightLeftIcon } from '@heroicons/react/24/outline'
import { cn } from '@/lib/utils'
import TripTypes from '../trip/TripTypes'
import LocationInput from '../location/LocationInput'
import DateInput from '../date/DateInput'
import TravelersInput from '../travelers/TravelersInput'
import FareTypes from '../fare/FareTypes'
import SearchButton from '../button/SearchButton'

interface Airport {
  city: string
  country: string
  airportName: string
  code: string
}

const SearchContent = () => {
  const [fromCity, setFromCity] = useState('Dhaka')
  const [fromAirport, setFromAirport] = useState('Hazrat Shahjalal International Airport')
  const [toCity, setToCity] = useState('Chittagong')
  const [toAirport, setToAirport] = useState('Shah Amanat International')

  // Example suggestions
  const suggestions: Airport[] = [
    {
      city: "Dhaka",
      country: "Bangladesh",
      airportName: "Hazrat Shahjalal International Airport",
      code: "DAC"
    },
    {
      city: "Chittagong",
      country: "Bangladesh",
      airportName: "Shah Amanat International",
      code: "CGP"
    },
    {
      city: "Cox's Bazar",
      country: "Bangladesh",
      airportName: "Cox's Bazar",
      code: "CXB"
    },
    // Add more airports as needed
  ]

  const swapLocations = () => {
    setFromCity(toCity)
    setFromAirport(toAirport)
    setToCity(fromCity)
    setToAirport(fromAirport)
  }

  return (
    <div className="w-full bg-gray-100 dark:bg-gray-900 p-6 space-y-6">
      <TripTypes />
      
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-0">
        {/* Location Selection */}
        <div className="lg:col-span-5">
          <div className="relative grid grid-rows-2 gap-0">
            <LocationInput
              type="from"
              value={fromCity}
              subValue={fromAirport}
              onChange={setFromCity}
              suggestions={suggestions}
            />
            <LocationInput
              type="to"
              value={toCity}
              subValue={toAirport}
              onChange={setToCity}
              suggestions={suggestions}
            />
            <button
              type="button"
              onClick={swapLocations}
              className={cn(
                "absolute right-20 top-1/2 translate-x-1/2 -translate-y-1/2 z-10 rounded-full",
                "w-8 h-8",
                "bg-white dark:bg-gray-800",
                "border border-gray-200 dark:border-gray-700",
                "flex items-center justify-center",
                "hover:bg-gray-50 dark:hover:bg-gray-700",
                "focus:outline-none focus:ring-2 focus:ring-gray-400",
                "shadow-sm"
              )}  
            >
              <ArrowsRightLeftIcon 
                className="h-4 w-4 text-gray-500" 
                style={{ transform: 'rotate(90deg)' }}
              />
            </button>
          </div>
        </div>
        
        {/* Date Selection */}
        <div className="lg:col-span-4">
          <div className="grid grid-cols-2 gap-0 h-full">
            <DateInput
              type="departure"
              value="Select date"
              subValue=""
            />
            <DateInput
              type="return"
              value="Select date"
              subValue=""
            />
          </div>
        </div>
        
        {/* Travelers Selection */}
        <div className="lg:col-span-3">
          <TravelersInput
            value="1 Traveler"
            subValue="Economy"
            onClick={() => console.log('Open travelers modal')}
          />
        </div>
      </div>

      <FareTypes />
      
      <div className="flex justify-center w-full">
        <SearchButton />
      </div>
    </div>
  )
}

export default SearchContent