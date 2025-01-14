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
import Logo from '../header/Logo';

const Header = () => {
    const { isCollapsed } = useSidebar();

    return (
        <header className="sticky top-0 z-50 bg-white dark:bg-black border-b border-gray-200 dark:border-none text-black dark:text-white"> {/* Key Change: bg-black and border removal */}
            <div className="max-w-7xl mx-auto"> {/* Keep this for content centering */}
                <div className="flex items-center justify-between h-16 px-4 lg:px-8">
                    {/* Logo */}
                    <div className="hidden lg:block flex-shrink-0">
                        <Logo width={48} height={48} /> {/* No more color prop */}
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