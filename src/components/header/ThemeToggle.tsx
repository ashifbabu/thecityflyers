import React, { useEffect, useState } from 'react';
import { useTheme } from 'next-themes';
import { SunIcon, MoonIcon } from '@heroicons/react/24/outline';

const ThemeToggle = () => {
  const { theme, setTheme, resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  // Ensure the theme is correctly loaded before rendering the toggle button
  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return null;
  }

  return (
    <button
          className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400"
          onClick={() => setTheme(resolvedTheme === 'dark' ? 'light' : 'dark')}
          aria-label={resolvedTheme === 'dark' ? "Switch to light mode" : "Switch to dark mode"}
          title={resolvedTheme === 'dark' ? "Switch to light mode" : "Switch to dark mode"} // Tooltip for better UX
        >
          {resolvedTheme === 'dark' ? (
            <SunIcon className="h-6 w-6 text-yellow-400" aria-hidden="true" />
          ) : (
            <MoonIcon className="h-6 w-6 text-gray-900" aria-hidden="true" />
          )}
    </button>
  );
};

export default ThemeToggle;
