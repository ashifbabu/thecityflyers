'use client'

import React from 'react';
import { cn } from '@/lib/utils';
import { useSidebar } from '@/providers/sidebar-provider';
import SearchBar from './search/SearchBar';
import LanguageIcon from './icons/LanguageIcon';
import NotificationIcon from './icons/NotificationIcon';
import ThemeIcon from './icons/ThemeIcon';
import AuthButtons from './auth/AuthButtons';
import MobileMenu from './mobile/MobileMenu';

const Header = () => {
  const { isCollapsed } = useSidebar();

  return (
    <header className="sticky top-0 z-50 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between h-16 px-4 lg:px-8">
          {/* Logo - Hidden on mobile when sidebar is present */}
          <div className="hidden lg:block flex-shrink-0">
            <h1 className="text-xl font-bold text-gray-900 dark:text-white">Travel</h1>
          </div>

          {/* Mobile Menu & Search */}
          <div className="flex items-center gap-2 lg:hidden">
            <MobileMenu />
            <SearchBar />
          </div>

          {/* Desktop Search Bar */}
          <div className={cn(
            "hidden lg:block flex-1 max-w-2xl mx-auto transition-all",
            isCollapsed ? "lg:ml-20" : "lg:ml-72"
          )}>
            <SearchBar />
          </div>

          {/* Actions */}
          <div className="flex items-center gap-2">
            <LanguageIcon />
            <NotificationIcon />
            <ThemeIcon />
            <AuthButtons />
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;