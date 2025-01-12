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
            "text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700",
            isCollapsed ? "justify-center" : "justify-start"
          )}
          onClick={toggleSubMenu}
        >
          <div className="flex-shrink-0">{icon}</div>
          {!isCollapsed && <span className="truncate">{label}</span>}
          {!isCollapsed && (
            <div className="ml-auto">
              {isOpen ? <ChevronUpIcon className="h-5 w-5" /> : <ChevronDownIcon className="h-5 w-5" />}
            </div>
          )}
        </div>
      ) : (
        <Link
          href={href}
          passHref
          className={cn(
            "flex items-center gap-3 px-3 py-2 rounded-lg transition-colors cursor-pointer",
            "text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700",
            isCollapsed ? "justify-center" : "justify-start"
          )}
          onClick={onClick}
        >
          <div className="flex-shrink-0">{icon}</div>
          {!isCollapsed && <span className="truncate">{label}</span>}
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
              <span className="truncate">{child.label}</span>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
};

export default MenuItem;