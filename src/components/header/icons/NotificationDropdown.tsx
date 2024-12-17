'use client'

import React, { useRef } from 'react';
import { useOnClickOutside } from '@/hooks/use-click-outside';
import { cn } from '@/lib/utils';

interface NotificationDropdownProps {
  isOpen: boolean;
  onClose: () => void;
}

const notifications = [
  {
    id: 1,
    title: 'Special Offer',
    message: '30% off on international flights!',
    time: '5 mins ago'
  },
  {
    id: 2,
    title: 'Booking Confirmed',
    message: 'Your hotel booking has been confirmed',
    time: '1 hour ago'
  },
  {
    id: 3,
    title: 'Price Alert',
    message: 'Prices dropped for your saved flight',
    time: '2 hours ago'
  }
];

const NotificationDropdown = ({ isOpen, onClose }: NotificationDropdownProps) => {
  const ref = useRef<HTMLDivElement>(null);
  useOnClickOutside(ref, onClose);

  if (!isOpen) return null;

  return (
    <div 
      ref={ref}
      className={cn(
        "absolute right-0 mt-2 w-80 max-h-[calc(100vh-80px)]",
        "bg-white dark:bg-gray-800",
        "border border-gray-200 dark:border-gray-700",
        "rounded-lg shadow-lg",
        "z-50 transform origin-top-right transition-all",
        "overflow-hidden"
      )}
    >
      <div className="p-4 border-b border-gray-200 dark:border-gray-700">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Notifications</h3>
      </div>
      
      <div className="overflow-y-auto max-h-[400px] divide-y divide-gray-200 dark:divide-gray-700">
        {notifications.map((notification) => (
          <div 
            key={notification.id}
            className="p-4 hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer transition-colors"
          >
            <h4 className="text-sm font-medium text-gray-900 dark:text-white">
              {notification.title}
            </h4>
            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
              {notification.message}
            </p>
            <span className="mt-2 text-xs text-gray-400 dark:text-gray-500">
              {notification.time}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default NotificationDropdown;