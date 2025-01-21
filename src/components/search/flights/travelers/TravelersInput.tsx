import React, { useState, useRef, useEffect } from 'react';
import ChevronDown from '@geist-ui/icons/chevronDown';
interface TravelersInputProps {
  value: string;
  subValue: string;
  onClick: () => void;
}

const TravelersInput: React.FC<TravelersInputProps> = ({ value, subValue, onClick }) => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [adults, setAdults] = useState<number>(1);
  const [children, setChildren] = useState<number>(0);
  const [infants, setInfants] = useState<number>(0);
  const [travelClass, setTravelClass] = useState<string>('Economy');
  const modalRef = useRef<HTMLDivElement | null>(null);

  const toggleModal = (): void => {
    setIsOpen(!isOpen);
  };

  const handleTravelerChange = (type: string, value: number): void => {
    if (type === 'adults') setAdults(value);
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
        className="bg-white dark:bg-black text-black dark:text-white p-4 shadow-sm cursor-pointer h-full w-full text-left rounded-md"
        onClick={toggleModal}
      >
        <div className="text-sm text-gray-600 dark:text-gray-400">{value}</div>
        <div className="text-lg font-semibold text-black dark:text-white">
          {adults + children + infants} Travelers
        </div>
        <div className="text-sm text-gray-600 dark:text-gray-400">{subValue}</div>
          {/* ChevronDown Icon */}
            <div className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-500 dark:text-gray-400">
              <ChevronDown size={20} />
            </div>
      </button>

      {isOpen && (
        <div
          ref={modalRef}
          className="absolute z-10 w-full bg-white dark:bg-black text-black dark:text-white shadow-lg mt-2 py-4 rounded-md"
        >
          <div className="px-4">
            <div className="space-y-4">
              <div>
                <div className="text-sm text-gray-600 dark:text-gray-400">Adults (12y+)</div>
                <div className="flex flex-wrap gap-1">
                  {Array.from({ length: 10 }, (_, num) => (
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
              <div>
                <div className="text-sm text-gray-600 dark:text-gray-400">Children (2 - 12y)</div>
                <div className="flex flex-wrap gap-1">
                  {Array.from({ length: 7 }, (_, num) => (
                    <button
                      key={num}
                      onClick={() => handleTravelerChange('children', num)}
                      className={`p-2 rounded-full w-10 h-10 flex items-center justify-center ${
                        children === num
                          ? 'bg-black dark:bg-white text-white dark:text-black'
                          : 'bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-300'
                      }`}
                    >
                      {num}
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <div className="text-sm text-gray-600 dark:text-gray-400">Infants (below 2y)</div>
                <div className="flex flex-wrap gap-1">
                  {Array.from({ length: 7 }, (_, num) => (
                    <button
                      key={num}
                      onClick={() => handleTravelerChange('infants', num)}
                      className={`p-2 rounded-full w-10 h-10 flex items-center justify-center ${
                        infants === num
                          ? 'bg-black dark:bg-white text-white dark:text-black'
                          : 'bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-300'
                      }`}
                    >
                      {num}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="mt-4">
              <div className="text-sm text-gray-600 dark:text-gray-400">Travel Class</div>
              <div className="flex space-x-2 mt-2">
                {['Economy', 'Business', 'First Class'].map((cls) => (
                  <button
                    key={cls}
                    onClick={() => setTravelClass(cls)}
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

            <div className="mt-4 text-right">
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
