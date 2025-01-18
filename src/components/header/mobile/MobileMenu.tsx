'use client'

import React from 'react';
import { Bars3Icon } from '@heroicons/react/24/outline';
import { useSidebar } from '@/providers/sidebar-provider';
import IconButton from '@/components/ui/button/IconButton';

const MobileMenu = () => {
  const { toggleMobile } = useSidebar();

  return (
    <IconButton 
      onClick={toggleMobile} 
      className="lg:hidden" 
      aria-label="Open navigation menu"  // Updated accessible name for clarity
    >
      <Bars3Icon className="h-6 w-6 text-gray-700 dark:text-gray-300" />
    </IconButton>
  );
};

export default MobileMenu;
