'use client'

import React, { useState } from 'react';
import { BellIcon } from '@heroicons/react/24/outline';
import IconButton from '@/components/ui/button/IconButton';
import NotificationDropdown from './NotificationDropdown';

const NotificationIcon = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="relative">
      <IconButton 
        onClick={() => setIsOpen(!isOpen)}
        aria-label="Notifications"
      >
        <BellIcon className="h-6 w-6 text-gray-700 dark:text-gray-300" />
        <span className="absolute top-0.5 right-0.5 h-2.5 w-2.5 bg-red-500 rounded-full" />
      </IconButton>

      <NotificationDropdown 
        isOpen={isOpen} 
        onClose={() => setIsOpen(false)} 
        aria-label="Notification dropdown" // Accessible name for the dropdown
      />
    </div>
  );
};

export default NotificationIcon;
