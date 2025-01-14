'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import { MenuItemProps } from '@/types/menu';
import { ChevronDownIcon, ChevronUpIcon } from '@heroicons/react/24/outline';

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
            "flex items-center gap-3 px-3 py-2 rounded-lg transition-colors cursor-pointer",
            "text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700", // Light mode: gray text, Dark mode: white text
            isCollapsed ? "justify-center" : "justify-start"
          )}
          onClick={toggleSubMenu}
        >
          <div className="flex-shrink-0 text-gray-900 dark:text-white">{icon}</div> {/* Explicit icon color */}
          {/* Always show label */}
          <span className={cn("truncate", { "hidden lg:block": isCollapsed })}>{label}</span>
          {/* Show submenu toggle icon when sidebar is expanded */}
          {isCollapsed && (
            <div className="ml-auto">
              {isOpen ? <ChevronUpIcon className="h-5 w-5 text-gray-900 dark:text-white" /> : <ChevronDownIcon className="h-5 w-5 text-gray-900 dark:text-white" />}
            </div>
          )}
        </div>
      ) : (
        <Link
          href={href}
          passHref
          className={cn(
            "flex items-center gap-3 px-3 py-2 rounded-lg transition-colors cursor-pointer",
            "text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700", // Light mode: gray text, Dark mode: white text
            isCollapsed ? "justify-center" : "justify-start"
          )}
          onClick={onClick}
        >
          <div className="flex-shrink-0 text-gray-900 dark:text-white">{icon}</div> {/* Explicit icon color */}
          {/* Always show label */}
          <span className={cn("truncate", { "hidden lg:block": isCollapsed })}>{label}</span>
        </Link>
      )}

      {/* Submenu Items */}
      {children && isOpen && (
        <div className="pl-8 space-y-1">
          {children.map((child) => (
            <Link
              key={child.href}
              href={child.href}
              className="flex items-center gap-3 px-3 py-2 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
              onClick={onClick}
            >
              <div className="flex-shrink-0">{child.icon}</div>
              {/* Always show label for submenu items */}
              <span className="truncate">{child.label}</span>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
};

export default MenuItem;
