'use client'

import React from 'react';
import { Bars3Icon, XMarkIcon } from '@heroicons/react/24/outline';

interface MobileToggleProps {
  isOpen: boolean;
  onClick: () => void;
}

const MobileToggle = ({ isOpen, onClick }: MobileToggleProps) => {
  return (
    <div className="fixed top-4 left-4 z-50 lg:hidden">
      <button
        className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
        onClick={onClick}
      >
        {isOpen ? (
          <XMarkIcon className="h-6 w-6 text-gray-600 dark:text-gray-400" />
        ) : (
          <Bars3Icon className="h-6 w-6 text-gray-600 dark:text-gray-400" />
        )}
      </button>
    </div>
  );
};

export default MobileToggle;