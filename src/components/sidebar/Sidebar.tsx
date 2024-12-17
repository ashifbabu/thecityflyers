'use client'

import React from 'react';
import { cn } from '@/lib/utils';
import { useSidebar } from '@/providers/sidebar-provider';
import MenuItem from './menu/MenuItem';
import { menuItems } from './menu/MenuItems';
import SidebarToggle from './SidebarToggle';
import SidebarLogo from './SidebarLogo';
import MobileToggle from './MobileToggle';

const Sidebar = () => {
  const { isCollapsed, isMobileOpen, toggleSidebar, toggleMobile, closeMobile } = useSidebar();

  return (
    <>
      {/* Mobile Overlay */}
      {isMobileOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={closeMobile}
        />
      )}

      {/* Mobile Toggle */}
      <MobileToggle isOpen={isMobileOpen} onClick={toggleMobile} />

      {/* Sidebar */}
      <aside className={cn(
        "fixed top-0 left-0 z-40 h-screen transition-all duration-300",
        "bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700",
        isCollapsed ? "w-16" : "w-64",
        "lg:sticky lg:top-16", // Make sidebar sticky and start below header
        isMobileOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
      )}>
        <SidebarToggle onClick={toggleSidebar} />
        <SidebarLogo isCollapsed={isCollapsed} />

        {/* Navigation */}
        <nav className="p-2 space-y-1 overflow-y-auto no-scrollbar">
          {menuItems.map((item) => (
            <MenuItem
              key={item.href}
              {...item}
              isCollapsed={isCollapsed}
              onClick={closeMobile}
            />
          ))}
        </nav>
      </aside>
    </>
  );
};

export default Sidebar;