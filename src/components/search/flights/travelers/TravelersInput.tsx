import React, { useState, useRef, useEffect } from 'react';
import { ChevronDownIcon } from '@heroicons/react/20/solid';

interface TravelersInputProps {
  value: string;
  subValue: string;
  onClick: () => void;
  onChange: (data: { adults: number; kids: number; children: number; infants: number; totalPassengers: number; travelClass: string }) => void;
}

const TravelersInput: React.FC<TravelersInputProps> = ({ value, subValue, onClick, onChange }) => {
  const MAX_PASSENGERS = 9;

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

    onChange({
      adults: type === 'adults' ? value : adults,
      kids: type === 'kids' ? value : kids,
      children: type === 'children' ? value : children,
      infants: type === 'infants' ? value : infants,
      totalPassengers: (type === 'adults' ? value : adults) + (type === 'kids' ? value : kids) + (type === 'children' ? value : children) + (type === 'infants' ? value : infants),
      travelClass,
    });
  };

  const handleClassChange = (cls: string) => {
    setTravelClass(cls);
    onChange({
      adults,
      kids,
      children,
      infants,
      totalPassengers,
      travelClass: cls,
    });
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
        className="h-full w-full p-4 bg-white dark:bg-black text-black dark:text-white rounded-lg cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-900 hover:shadow-md transition-all duration-200 flex justify-between items-center"
        onClick={toggleModal}
      >
        <div className="flex flex-col justify-center items-start space-y-1">
          <div className="text-sm text-gray-600 dark:text-gray-400">{value}</div>
          <div className="text-lg font-semibold text-black dark:text-white">
            {totalPassengers} Traveler{totalPassengers > 1 ? 's' : ''}
          </div>
          <div className="text-sm text-gray-600 dark:text-gray-400">{subValue}</div>
        </div>
        <div className="text-gray-500 dark:text-gray-400">
          <ChevronDownIcon className="h-5 w-5" />
        </div>
      </button>

      {isOpen && (
        <div ref={modalRef} className="absolute z-10 w-full bg-white dark:bg-black text-black dark:text-white shadow-lg mt-2 py-4 rounded-lg">
          <div className="px-4 space-y-4">
            {['adults', 'kids', 'children', 'infants'].map((type) => (
              <div key={type}>
                <div className="text-sm text-gray-600 dark:text-gray-400">
                  {type.charAt(0).toUpperCase() + type.slice(1)}
                </div>
                <div className="flex flex-wrap gap-1">
                  {Array.from({ length: Math.min(10, (type === 'adults' ? adults : type === 'kids' ? kids : type === 'children' ? children : infants) + remainingPassengers + 1) }, (_, num) => (
                    <button
                      key={num}
                      onClick={() => handleTravelerChange(type as any, num)}
                      className={`p-2 rounded-full w-10 h-10 flex items-center justify-center ${
                        (type === 'adults' ? adults : type === 'kids' ? kids : type === 'children' ? children : infants) === num
                          ? 'bg-black dark:bg-white text-white dark:text-black'
                          : 'bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-300'
                      }`}
                    >
                      {num}
                    </button>
                  ))}
                </div>
              </div>
            ))}

            <div className="mt-4">
              <div className="text-sm text-gray-600 dark:text-gray-400">Travel Class</div>
              <div className="flex space-x-2 mt-2">
                {['Economy', 'Business', 'First Class'].map((cls) => (
                  <button
                    key={cls}
                    onClick={() => handleClassChange(cls)}
                    className={`p-2 rounded-md ${
                      travelClass === cls
                        ? 'bg-black dark:bg-white text-white dark:text-black'
                        : 'bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-300'
                    }`}
                  >
                    {cls}
                  </button>
                ))}
              </div>
            </div>

            <div className="mt-4 flex justify-end space-x-2">
              <button
                onClick={() => {
                  setAdults(1);
                  setKids(0);
                  setChildren(0);
                  setInfants(0);
                  setTravelClass('Economy');
                  onChange({ adults: 1, kids: 0, children: 0, infants: 0, totalPassengers: 1, travelClass: 'Economy' });
                }}
                className="px-4 py-2 bg-gray-300 dark:bg-gray-600 text-black dark:text-white rounded-md shadow-sm hover:bg-gray-400 dark:hover:bg-gray-500"
              >
                Reset
              </button>

              <button
                onClick={() => {
                  onChange({ adults, kids, children, infants, totalPassengers, travelClass });
                  toggleModal();
                }}
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
