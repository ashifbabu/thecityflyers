'use client'

import React from 'react';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import { MenuItemProps } from '@/types/menu';

interface ExtendedMenuItemProps extends MenuItemProps {
  isCollapsed?: boolean;
  onClick?: () => void;
}

const MenuItem = ({ href, icon, label, isCollapsed, onClick }: ExtendedMenuItemProps) => {
  return (
    <Link 
      href={href}
      onClick={onClick}
      className={cn(
        "flex items-center gap-3 px-3 py-2 rounded-lg transition-colors",
        "text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700",
        isCollapsed && "justify-center"
      )}
    >
      <div className="flex-shrink-0">
        {icon}
      </div>
      {!isCollapsed && (
        <span className="truncate">{label}</span>
      )}
    </Link>
  );
};

export default MenuItem;