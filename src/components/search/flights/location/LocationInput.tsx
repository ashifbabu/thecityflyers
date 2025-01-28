import React, { useState, useRef, useEffect } from 'react';

interface Airport {
  city: string;
  country: string;
  airportName: string;
  code: string;
}

interface LocationInputProps {
  type: 'from' | 'to';
  value: string;
  subValue: string;
  onChange: (city: string, airportName: string, code: string) => void; // Pass IATA Code
}

const LocationInput: React.FC<LocationInputProps> = ({
  type,
  value,
  subValue,
  onChange,
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [inputValue, setInputValue] = useState(value);
  const [filteredSuggestions, setFilteredSuggestions] = useState<Airport[]>([]);
  const containerRef = useRef<HTMLDivElement>(null);

  const API_URL = process.env.NEXT_PUBLIC_API_URL;

  // 🔍 Fetch suggestions from the API
  useEffect(() => {
    const fetchSuggestions = async () => {
      if (inputValue.trim().length > 0) {
        try {
          const response = await fetch(`${API_URL}/api/airports/?query=${inputValue}`);
          const data: Airport[] = await response.json();
          setFilteredSuggestions(data);
        } catch (error) {
          console.error('Error fetching airport suggestions:', error);
        }
      } else {
        setFilteredSuggestions([]);
      }
    };

    if (isEditing) {
      const debounceTimeout = setTimeout(() => fetchSuggestions(), 300); // Debounce API call
      return () => clearTimeout(debounceTimeout);
    }
  }, [inputValue, isEditing, API_URL]);

  // Handle click outside to close the dropdown
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsEditing(false);
        setInputValue(value);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [value]);

  const handleDisplayClick = () => {
    setIsEditing(true);
    setInputValue(value);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
  };

  // ✅ Update this function to pass the correct airport details
  // ✅ Update function to pass correct airport details
  const handleSuggestionClick = (airport: Airport) => {
    console.log(`📌 Selected Airport: ${airport.city} (${airport.code})`);
    onChange(airport.city, airport.airportName, airport.code); // Pass IATA Code
    setInputValue(airport.city);
    setIsEditing(false);
  };

  return (
    <div className="relative p-4" ref={containerRef}>
      {!isEditing ? (
        <div
          onClick={handleDisplayClick}
          className="bg-white dark:bg-black text-black dark:text-white cursor-pointer"
        >
          <div className="text-sm text-gray-500 dark:text-gray-400 capitalize">
            {type === 'from' ? 'From' : 'To'}
          </div>
          <div className="text-lg font-semibold">{value}</div>
          <div className="text-sm text-gray-500 dark:text-gray-400 truncate">
            {subValue}
          </div>
        </div>
      ) : (
        <div className="bg-white dark:bg-black text-black dark:text-white">
          <div className="text-sm text-gray-500 dark:text-gray-400 capitalize mb-2">
            {type === 'from' ? 'From' : 'To'}
          </div>
          <input
            type="text"
            className="w-full py-2 px-3 bg-white dark:bg-black text-black dark:text-white border border-gray-300 dark:border-gray-700 rounded-md focus:outline-none focus:ring-1 focus:ring-gray-400 dark:focus:ring-gray-600"
            placeholder="Type the airport name or airport code"
            value={inputValue}
            onChange={handleInputChange}
          />
          {filteredSuggestions.length > 0 && (
            <div className="absolute left-0 right-0 mt-2 bg-white dark:bg-black text-black dark:text-white border border-gray-300 dark:border-gray-700 rounded-md shadow-lg max-h-64 overflow-auto z-50">
              <ul className="divide-y divide-gray-300 dark:divide-gray-700">
                {filteredSuggestions.map((airport, index) => (
                  <li
                    key={index}
                    onClick={() => handleSuggestionClick(airport)}
                    className="p-3 hover:bg-gray-100 dark:hover:bg-gray-800 cursor-pointer"
                  >
                    <div className="font-semibold">
                      {`${airport.city}, ${airport.country}`}
                    </div>
                    <div className="text-sm text-gray-500 dark:text-gray-400">
                      {airport.airportName}
                    </div>
                    <div className="text-sm text-gray-400 dark:text-gray-500">
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
  );
};

export default LocationInput;
