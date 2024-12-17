import { ReactNode } from 'react';

export interface MenuItem {
  href: string;
  label: string;
  icon: ReactNode;
}

export interface MenuItemProps extends MenuItem {
  className?: string;
}