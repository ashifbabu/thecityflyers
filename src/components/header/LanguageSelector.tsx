import React from 'react';
import { GlobeAltIcon } from '@heroicons/react/24/outline';

const LanguageSelector = () => {
  return (
    <button className="p-2 hover:bg-gray-100 rounded-full">
      <GlobeAltIcon className="h-6 w-6" />
    </button>
  );
};

export default LanguageSelector;