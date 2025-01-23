'use client'

import React from 'react';
import { useTheme } from 'next-themes';
import { SunIcon, MoonIcon } from '@heroicons/react/24/outline';
import IconButton from '@/components/ui/button/IconButton';

const ThemeIcon = () => {
  const { resolvedTheme, setTheme } = useTheme();

  return (
    <IconButton 
      onClick={() => setTheme(resolvedTheme === 'dark' ? 'light' : 'dark')}
      aria-label={resolvedTheme === 'dark' ? 'Switch to light theme' : 'Switch to dark theme'}
    >
      <div className="relative w-5 h-5">
        <SunIcon className="h-5 w-5 text-gray-600 dark:text-gray-400 absolute transition-opacity duration-300 ease-in-out" style={{ opacity: resolvedTheme === 'dark' ? 1 : 0 }} />
        <MoonIcon className="h-5 w-5 text-gray-600 dark:text-gray-400 absolute transition-opacity duration-300 ease-in-out" style={{ opacity: resolvedTheme === 'dark' ? 0 : 1 }} />
      </div>
    </IconButton>
  );
};

export default ThemeIcon;