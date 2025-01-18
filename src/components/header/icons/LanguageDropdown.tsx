'use client'

import React, { useRef } from 'react';
import { useOnClickOutside } from '@/hooks/use-click-outside';
import { cn } from '@/lib/utils';

interface LanguageDropdownProps {
  isOpen: boolean;
  onClose: () => void;
}

const languages = [
  { code: 'en', name: 'English', flag: '🇺🇸' },
  { code: 'es', name: 'Español', flag: '🇪🇸' },
  { code: 'fr', name: 'Français', flag: '🇫🇷' },
  { code: 'de', name: 'Deutsch', flag: '🇩🇪' },
  { code: 'it', name: 'Italiano', flag: '🇮🇹' },
  { code: 'pt', name: 'Português', flag: '🇵🇹' },
];

const LanguageDropdown = ({ isOpen, onClose }: LanguageDropdownProps) => {
  const ref = useRef<HTMLDivElement>(null);
  useOnClickOutside(ref, onClose);

  if (!isOpen) return null;

  return (
    <div 
      ref={ref}
      className={cn(
        "absolute right-0 mt-2 w-48",
        "bg-white dark:bg-gray-800",
        "border border-gray-200 dark:border-gray-700",
        "rounded-lg shadow-lg",
        "z-50 transform origin-top-right transition-all",
        "overflow-hidden"
      )}
      aria-labelledby="language-dropdown"
    >
      <div className="py-1">
        {languages.map((language) => (
          <button
            key={language.code}
            onClick={() => {
              console.log(`Selected language: ${language.code}`);
              onClose();
            }}
            className={cn(
              "w-full px-4 py-2",
              "flex items-center gap-3",
              "text-sm text-gray-700 dark:text-gray-300",
              "hover:bg-gray-50 dark:hover:bg-gray-700",
              "transition-colors"
            )}
            aria-label={`Select ${language.name} (${language.flag})`}  // Accessible name for each button
          >
            <span className="text-xl">{language.flag}</span>
            <span>{language.name}</span>
          </button>
        ))}
      </div>
    </div>
  );
};

export default LanguageDropdown;
