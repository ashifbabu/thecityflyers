// LocationInput.tsx
import React, { useState, useRef, useEffect } from 'react'

interface Airport {
  city: string
  country: string
  airportName: string
  code: string
}

interface LocationInputProps {
  type: 'from' | 'to'
  value: string
  subValue: string
  onChange: (value: string) => void
  suggestions?: Airport[]
}

const LocationInput: React.FC<LocationInputProps> = ({ 
  type, 
  value, 
  subValue, 
  onChange, 
  suggestions = [] 
}) => {
  const [isEditing, setIsEditing] = useState(false)
  const [inputValue, setInputValue] = useState(value)
  const [filteredSuggestions, setFilteredSuggestions] = useState<Airport[]>([])
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (isEditing) {
      // Filter suggestions based on input value
      const query = inputValue.trim().toLowerCase()
      if (query.length > 0) {
        const filtered = suggestions.filter((sug) =>
          sug.city.toLowerCase().includes(query) ||
          sug.airportName.toLowerCase().includes(query) ||
          sug.code.toLowerCase().includes(query)
        )
        setFilteredSuggestions(filtered)
      } else {
        setFilteredSuggestions(suggestions)
      }
    } else {
      setFilteredSuggestions([])
    }
  }, [inputValue, isEditing, suggestions])

  // Close editing if clicked outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsEditing(false)
        // Reset input value if needed
        setInputValue(value)
      }
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [value])

  const handleDisplayClick = () => {
    setIsEditing(true)
    // Reset input to current value in case it changed externally
    setInputValue(value)
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value)
  }

  const handleSuggestionClick = (airport: Airport) => {
    onChange(airport.city)
    setInputValue(airport.city)
    setIsEditing(false)
  }

  const handleInputBlur = () => {
    // If clicked outside or pressed enter, we've already handled it
    // Here, if user clicks away without selecting any suggestion,
    // we keep the last typed value or revert to the original value if empty.
    if (inputValue.trim() === '') {
      setInputValue(value)
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      // If user presses Enter without selecting a suggestion,
      // commit the input value directly.
      const finalValue = inputValue.trim() || value
      onChange(finalValue)
      setIsEditing(false)
    }
  }

  return (
    <div className="relative" ref={containerRef}>
      {!isEditing ? (
        <div
          onClick={handleDisplayClick}
          className="bg-white dark:bg-gray-800 p-4 shadow-sm h-full border border-gray-100 dark:border-gray-700 cursor-pointer"
        >
          <div className="text-sm text-gray-600 dark:text-gray-300 capitalize">
            {type === 'from' ? 'From' : 'To'}
          </div>
          <div className="text-lg font-semibold text-gray-900 dark:text-white">
            {value}
          </div>
          <div className="text-sm text-gray-600 dark:text-gray-300 truncate">
            {subValue}
          </div>
        </div>
      ) : (
        <div className="bg-white dark:bg-gray-800 p-4 shadow-sm border border-gray-200 dark:border-gray-700 rounded-md">
          <div className="text-sm text-gray-600 dark:text-gray-300 capitalize mb-2">
            {type === 'from' ? 'From' : 'To'}
          </div>
          <input
            type="text"
            className="w-full py-2 px-3 bg-white dark:bg-gray-800 text-gray-900 dark:text-white border border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-1 focus:ring-indigo-500 rounded-md"
            placeholder="Type the airport name or airport code"
            value={inputValue}
            onChange={handleInputChange}
            onBlur={handleInputBlur}
            onKeyDown={handleKeyDown}
          />
          {filteredSuggestions.length > 0 && (
            <div className="absolute left-0 right-0 mt-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-md shadow-lg max-h-64 overflow-auto z-50">
              <ul className="divide-y divide-gray-200 dark:divide-gray-700">
                {filteredSuggestions.map((airport, index) => (
                  <li 
                    key={index}
                    onClick={() => handleSuggestionClick(airport)}
                    className="p-3 hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer"
                  >
                    <div className="font-semibold text-gray-900 dark:text-white">
                      {`${airport.city}, ${airport.country}`}
                    </div>
                    <div className="text-sm text-gray-600 dark:text-gray-300">
                      {airport.airportName}
                    </div>
                    <div className="text-sm text-gray-500 dark:text-gray-400">
                      {airport.code}
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}
    </div>
  )
}

export default LocationInput
