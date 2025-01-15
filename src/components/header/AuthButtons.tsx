'use client'

import React, { useState, useRef } from 'react';
import { UserCircleIcon } from '@heroicons/react/24/outline';
import { useOnClickOutside } from '@/hooks/use-click-outside';
import IconButton from '@/components/ui/button/IconButton';

const AuthButtons = () => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useOnClickOutside(dropdownRef, () => setIsOpen(false));

  return (
    <div className="relative" ref={dropdownRef}>
      <IconButton
        onClick={() => setIsOpen(!isOpen)}
        aria-label="Open user menu" // Added required aria-label
      >
        <UserCircleIcon className="h-5 w-5 text-gray-600 dark:text-gray-400" />
      </IconButton>

      {isOpen && (
        <div
          className="absolute right-0 mt-2 w-48 py-2 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700"
          role="menu"
          aria-labelledby="user-menu"
        >
          <button
            onClick={() => setIsOpen(false)}
            className="block w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700"
            role="menuitem"
          >
            Sign In
          </button>
          <button
            onClick={() => setIsOpen(false)}
            className="block w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700"
            role="menuitem"
          >
            Register
          </button>
        </div>
      )}
    </div>
  );
};

export default AuthButtons;
