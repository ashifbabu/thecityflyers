'use client'

import React from 'react';
import { Bars3Icon } from '@heroicons/react/24/outline';
import { cn } from '@/lib/utils';

interface SidebarToggleProps {
  onClick: () => void;
}

const SidebarToggle = ({ onClick }: SidebarToggleProps) => {
  return (
    <button
      className={cn(
        "hidden lg:block absolute -right-3 top-10",
        "bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700",
        "rounded-full p-1.5 hover:bg-gray-100 dark:hover:bg-gray-700"
      )}
      onClick={onClick}
    >
      <Bars3Icon className="h-4 w-4 text-gray-600 dark:text-gray-300" />
    </button>
  );
};

export default SidebarToggle;