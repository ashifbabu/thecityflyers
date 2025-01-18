'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import { MenuItemProps } from '@/types/menu';
import { ChevronRightIcon, ChevronDownIcon } from '@heroicons/react/24/outline';

interface ExtendedMenuItemProps extends MenuItemProps {
    isCollapsed?: boolean;
    onClick?: () => void;
    toggleSidebar?: () => void;
}

const MenuItem = ({ href, icon, label, children, isCollapsed, onClick, toggleSidebar }: ExtendedMenuItemProps) => {
    const [isOpen, setIsOpen] = useState(false);

    useEffect(() => {
        if (isCollapsed && isOpen) {
            setIsOpen(false);
        }
    }, [isCollapsed]);

    const toggleSubMenu = (e: React.MouseEvent) => {
        e.stopPropagation();
        setIsOpen(!isOpen);

        if (isCollapsed && !isOpen) {
            toggleSidebar?.();
        }

        const menuItem = e.currentTarget as HTMLElement;
        if (!isOpen) {
            menuItem.classList.add('submenu-open');
        } else {
            menuItem.classList.remove('submenu-open');
        }
    };

    return (
        <div>
            {/* Main Menu Item */}
            {children ? (
                <button
                    className={cn(
                        'flex items-center px-3 py-2 rounded-lg transition-colors cursor-pointer w-full',
                        'text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700',
                        isCollapsed ? 'justify-center' : 'justify-between'
                    )}
                    onClick={toggleSubMenu}
                    aria-label={label}
                    aria-expanded={isOpen}
                    type="button" // Important for proper button behavior
                >
                    <div className="flex items-center">
                        <div className="w-5 h-5 text-gray-900 dark:text-white" aria-hidden="true">
                            {icon}
                        </div>
                        {!isCollapsed && (
                            <span className="ml-3 truncate">
                                {label}
                            </span>
                        )}
                    </div>
                    {!isCollapsed && (
                        <div className="flex-shrink-0" aria-hidden="true">
                            {isOpen ? (
                                <ChevronDownIcon className="w-5 h-5 text-gray-900 dark:text-white" />
                            ) : (
                                <ChevronRightIcon className="w-5 h-5 text-gray-900 dark:text-white" />
                            )}
                        </div>
                    )}
                </button>
            ) : (
                <Link
                    href={href}
                    passHref
                    className={cn(
                        'flex items-center px-3 py-2 rounded-lg transition-colors cursor-pointer',
                        'text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700',
                        isCollapsed ? 'justify-center' : 'justify-start'
                    )}
                    onClick={onClick}
                    aria-label={label}
                >
                    <div className="w-5 h-5 text-gray-900 dark:text-white" aria-hidden="true">
                        {icon}
                    </div>
                    {!isCollapsed && (
                        <span className="ml-3 truncate">
                            {label}
                        </span>
                    )}
                </Link>
            )}

            {/* Submenu Items */}
            {children && isOpen && (
                <div className="pl-8 space-y-1">
                    {children.map((child) => (
                        <Link
                            key={child.href}
                            href={child.href}
                            className="flex items-center px-3 py-2 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                            onClick={onClick}
                            aria-label={child.label}
                        >
                            <div className="w-5 h-5" aria-hidden="true">
                                {child.icon}
                            </div>
                            <span className="ml-3 truncate">
                                {child.label}
                            </span>
                        </Link>
                    ))}
                </div>
            )}
        </div>
    );
};

export default MenuItem;