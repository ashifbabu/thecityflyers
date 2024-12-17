import React from 'react';
import { cn } from '@/lib/utils';

interface IconButtonProps {
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
  'aria-label'?: string;
}

const IconButton = ({ 
  children, 
  className, 
  onClick, 
  'aria-label': ariaLabel 
}: IconButtonProps) => {
  return (
    <button 
      onClick={onClick}
      aria-label={ariaLabel}
      className={cn(
        "p-2 rounded-full transition-colors",
        "hover:bg-gray-100 dark:hover:bg-gray-700",
        "focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400",
        "active:bg-gray-200 dark:active:bg-gray-600",
        className
      )}
    >
      {children}
    </button>
  );
};

export default IconButton;