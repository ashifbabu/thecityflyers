'use client'

import React from 'react';
import { cn } from '@/lib/utils';
import Logo from '../header/Logo';

interface SidebarLogoProps {
  isCollapsed: boolean;
}

const SidebarLogo = ({ isCollapsed }: SidebarLogoProps) => {
  return (
    <div className="h-16 flex items-center justify-center border-b border-gray-200 dark:border-gray-700">
      <span className={cn(
        "font-bold text-xl transition-all duration-300",
        isCollapsed ? "scale-0" : "scale-100"
      )}>
         <Logo width={120} height={40} color="#0B1E37" />
      </span>
    </div>
  );
};

export default SidebarLogo;