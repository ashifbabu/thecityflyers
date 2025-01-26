import React, { useState, useRef, useEffect } from 'react';
import ChevronDown from '@geist-ui/icons/chevronDown';

interface TravelersInputProps {
  value: string;
  subValue: string;
  onClick: () => void;
}

const TravelersInput: React.FC<TravelersInputProps> = ({ value, subValue, onClick }) => {
  const MAX_PASSENGERS = 9; // Total passenger limit

  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [adults, setAdults] = useState<number>(1);
  const [kids, setKids] = useState<number>(0);
  const [children, setChildren] = useState<number>(0);
  const [infants, setInfants] = useState<number>(0);
  const [travelClass, setTravelClass] = useState<string>('Economy');

  const totalPassengers = adults + kids + children + infants;
  const remainingPassengers = MAX_PASSENGERS - totalPassengers;

  const modalRef = useRef<HTMLDivElement | null>(null);

  const toggleModal = (): void => {
    setIsOpen(!isOpen);
  };

  const handleTravelerChange = (type: 'adults' | 'kids' | 'children' | 'infants', value: number): void => {
    if (type === 'adults') setAdults(value);
    if (type === 'kids') setKids(value);
    if (type === 'children') setChildren(value);
    if (type === 'infants') setInfants(value);
  };

  const handleClickOutside = (event: MouseEvent | TouchEvent): void => {
    if (modalRef.current && !modalRef.current.contains(event.target as Node)) {
      setIsOpen(false);
    }
  };

  useEffect(() => {
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      document.addEventListener('touchstart', handleClickOutside);
    } else {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('touchstart', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('touchstart', handleClickOutside);
    };
  }, [isOpen]);

  return (
    <div className="relative h-full">
              <button
                type="button"
                className="h-full w-full p-4 bg-white dark:bg-black text-black dark:text-white rounded-lg 
                          cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-900 hover:shadow-md transition-all duration-200
                          flex justify-between items-center"
                onClick={toggleModal}
              >
                {/* Left Section: Text */}
                <div className="flex flex-col justify-center items-start space-y-1">
                  <div className="text-sm text-gray-600 dark:text-gray-400">{value}</div>
                  <div className="text-lg font-semibold text-black dark:text-white">
                    {totalPassengers} Traveler{totalPassengers > 1 ? 's' : ''}
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">{subValue}</div>
                </div>

                {/* Right Section: Chevron Icon */}
                <div className="text-gray-500 dark:text-gray-400">
                  <ChevronDown size={20} />
                </div>
              </button>

      {isOpen && (
        <div
          ref={modalRef}
          className="absolute z-10 w-full bg-white dark:bg-black text-black dark:text-white shadow-lg mt-2 py-4 rounded-lg"
        >
          <div className="px-4">
            <div className="space-y-4">
              {/* Adults Section */}
              <div>
                <div className="text-sm text-gray-600 dark:text-gray-400">Adults (12y+)</div>
                <div className="flex flex-wrap gap-1">
                  {Array.from({ length: Math.min(10, adults + remainingPassengers + 1) }, (_, num) => (
                    <button
                      key={num}
                      onClick={() => handleTravelerChange('adults', num)}
                      className={`p-2 rounded-full w-10 h-10 flex items-center justify-center ${
                        adults === num
                          ? 'bg-black dark:bg-white text-white dark:text-black'
                          : 'bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-300'
                      }`}
                    >
                      {num}
                    </button>
                  ))}
                </div>
              </div>

              {/* Kids Section */}
              <div>
                <div className="text-sm text-gray-600 dark:text-gray-400">Kids (2 - 5y)</div>
                <div className="flex flex-wrap gap-1">
                  {Array.from({ length: Math.min(6, kids + remainingPassengers + 1) }, (_, num) => (
                    <button
                      key={num + 1}
                      onClick={() => handleTravelerChange('kids', num + 1)}
                      className={`p-2 rounded-full w-10 h-10 flex items-center justify-center ${
                        kids === num + 1
                          ? 'bg-black dark:bg-white text-white dark:text-black'
                          : 'bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-300'
                      }`}
                    >
                      {num + 1}
                    </button>
                  ))}
                </div>
              </div>

              {/* Children Section */}
              <div>
                <div className="text-sm text-gray-600 dark:text-gray-400">Children (6 - 12y)</div>
                <div className="flex flex-wrap gap-1">
                  {Array.from({ length: Math.min(6, children + remainingPassengers + 1) }, (_, num) => (
                    <button
                      key={num + 1}
                      onClick={() => handleTravelerChange('children', num + 1)}
                      className={`p-2 rounded-full w-10 h-10 flex items-center justify-center ${
                        children === num + 1
                          ? 'bg-black dark:bg-white text-white dark:text-black'
                          : 'bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-300'
                      }`}
                    >
                      {num + 1}
                    </button>
                  ))}
                </div>
              </div>

              {/* Infants Section */}
              <div>
                <div className="text-sm text-gray-600 dark:text-gray-400">Infants (below 2y)</div>
                <div className="flex flex-wrap gap-1">
                  {Array.from({ length: Math.min(3, infants + remainingPassengers + 1) }, (_, num) => (
                    <button
                      key={num + 1}
                      onClick={() => handleTravelerChange('infants', num + 1)}
                      className={`p-2 rounded-full w-10 h-10 flex items-center justify-center ${
                        infants === num + 1
                          ? 'bg-black dark:bg-white text-white dark:text-black'
                          : 'bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-300'
                      }`}
                    >
                      {num + 1}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Buttons: Reset and Done */}
            <div className="mt-4 flex justify-end space-x-2">
              <button
                onClick={() => {
                  setAdults(1);
                  setKids(0);
                  setChildren(0);
                  setInfants(0);
                  setTravelClass('Economy');
                }}
                className="px-4 py-2 bg-gray-300 dark:bg-gray-600 text-black dark:text-white rounded-md shadow-sm hover:bg-gray-400 dark:hover:bg-gray-500"
              >
                Reset
              </button>
              <button
                onClick={toggleModal}
                className="px-4 py-2 bg-black dark:bg-white text-white dark:text-black rounded-md shadow-sm hover:bg-gray-700 dark:hover:bg-gray-300"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TravelersInput;
