'use client'

import React, { useState, useRef } from 'react';
import { GlobeAltIcon } from '@heroicons/react/24/outline';
import { useOnClickOutside } from '@/hooks/use-click-outside';
import IconButton from '@/components/ui/button/IconButton';
import LanguageDropdown from './LanguageDropdown';

const LanguageIcon = () => {
  const [isOpen, setIsOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useOnClickOutside(ref, () => setIsOpen(false));

  return (
    <div className="relative" ref={ref}>
      <IconButton 
        onClick={() => setIsOpen(!isOpen)}
        aria-label="Select language"
      >
        <GlobeAltIcon className="h-6 w-6 text-gray-700 dark:text-gray-300" />
      </IconButton>

      <LanguageDropdown isOpen={isOpen} onClose={() => setIsOpen(false)} />
    </div>
  );
};

export default LanguageIcon;