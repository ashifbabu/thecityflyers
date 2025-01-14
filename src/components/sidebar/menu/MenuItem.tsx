'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import { MenuItemProps } from '@/types/menu';
import { ChevronRightIcon, ChevronDownIcon } from '@heroicons/react/24/outline';

interface ExtendedMenuItemProps extends MenuItemProps {
  isCollapsed?: boolean;
  onClick?: () => void;
  toggleSidebar?: () => void;
}

const MenuItem = ({ href, icon, label, children, isCollapsed, onClick, toggleSidebar }: ExtendedMenuItemProps) => {
  const [isOpen, setIsOpen] = useState(false);

  // Automatically close submenu when sidebar is collapsed
  useEffect(() => {
    if (isCollapsed && isOpen) {
      setIsOpen(false);
    }
  }, [isCollapsed]);

  const toggleSubMenu = (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent navigation if submenu toggles
    setIsOpen(!isOpen);

    // Automatically expand sidebar when submenu is clicked
    if (isCollapsed && !isOpen) {
      toggleSidebar?.();
    }

    // Automatically add/remove "submenu-open" class
    const menuItem = e.currentTarget as HTMLElement;
    if (!isOpen) {
      menuItem.classList.add('submenu-open');
    } else {
      menuItem.classList.remove('submenu-open');
    }
  };

  return (
    <div>
      {/* Main Menu Item */}
      {children ? (
        <div
          className={cn(
            'flex items-center px-3 py-2 rounded-lg transition-colors cursor-pointer',
            'text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700',
            isCollapsed ? 'justify-center' : 'justify-between'
          )}
          onClick={toggleSubMenu}
        >
          <div className="flex items-center">
            {/* Icon with fixed size for consistency */}
            <div className="w-5 h-5 text-gray-900 dark:text-white">
              {icon}
            </div>
            {/* Label */}
            {!isCollapsed && (
              <span className="ml-3 truncate">
                {label}
              </span>
            )}
          </div>
          {/* Submenu toggle icon */}
          {!isCollapsed && (
            <div className="flex-shrink-0">
              {isOpen ? (
                <ChevronDownIcon className="w-5 h-5 text-gray-900 dark:text-white" />
              ) : (
                <ChevronRightIcon className="w-5 h-5 text-gray-900 dark:text-white" />
              )}
            </div>
          )}
        </div>
      ) : (
        <Link
          href={href}
          passHref
          className={cn(
            'flex items-center px-3 py-2 rounded-lg transition-colors cursor-pointer',
            'text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700',
            isCollapsed ? 'justify-center' : 'justify-start'
          )}
          onClick={onClick}
        >
          {/* Icon with fixed size for consistency */}
          <div className="w-5 h-5 text-gray-900 dark:text-white">
            {icon}
          </div>
          {/* Label */}
          {!isCollapsed && (
            <span className="ml-3 truncate">
              {label}
            </span>
          )}
        </Link>
      )}

      {/* Submenu Items */}
      {children && isOpen && (
        <div className="pl-8 space-y-1">
          {children.map((child) => (
            <Link
              key={child.href}
              href={child.href}
              className="flex items-center px-3 py-2 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
              onClick={onClick}
            >
              {/* Submenu item icon with fixed size */}
              <div className="w-5 h-5">
                {child.icon}
              </div>
              {/* Submenu item label */}
              <span className="ml-3 truncate">
                {child.label}
              </span>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
};

export default MenuItem;
