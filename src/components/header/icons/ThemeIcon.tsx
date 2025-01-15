'use client'

import React, { useEffect, useState } from 'react';
import { useTheme } from 'next-themes';
import { SunIcon, MoonIcon } from '@heroicons/react/24/outline';
import IconButton from '@/components/ui/button/IconButton';

const ThemeIcon = () => {
  const [mounted, setMounted] = useState(false);
  const { theme, setTheme } = useTheme();

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    // Provide an aria-label for the loading state
    return <IconButton aria-label="Loading theme selector"><div className="h-5 w-5" /></IconButton>;
  }

  return (
    <IconButton 
      onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
      aria-label={theme === 'dark' ? 'Switch to light theme' : 'Switch to dark theme'}
    >
      {theme === 'dark' ? (
        <SunIcon className="h-5 w-5 text-gray-600 dark:text-gray-400" />
      ) : (
        <MoonIcon className="h-5 w-5 text-gray-600 dark:text-gray-400" />
      )}
    </IconButton>
  );
};

export default ThemeIcon;
