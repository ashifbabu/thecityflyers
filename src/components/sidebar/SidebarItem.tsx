import React from 'react';
import Link from 'next/link';

interface SidebarItemProps {
  href: string;
  icon: React.ReactNode;
  label: string;
}

const SidebarItem = ({ href, icon, label }: SidebarItemProps) => {
  return (
    <Link 
      href={href}
      className="flex items-center gap-3 px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg"
    >
      {icon}
      <span>{label}</span>
    </Link>
  );
};

export default SidebarItem;