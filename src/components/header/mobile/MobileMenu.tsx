'use client';

import React from 'react';
import { Bars3Icon } from '@heroicons/react/24/outline';
import { useSidebar } from '@/providers/sidebar-provider';
import IconButton from '@/components/ui/button/IconButton';

const MobileMenu = () => {
  const { toggleMobile } = useSidebar();

  return (
    <IconButton
      onClick={toggleMobile}
      className="lg:hidden header-menu-icon" // Added specific class for the header
      aria-label="Open navigation menu" // This ensures accessibility
    >
      <Bars3Icon className="h-6 w-6 text-gray-700 dark:text-gray-300" />
    </IconButton>
  );
};

export default MobileMenu;


