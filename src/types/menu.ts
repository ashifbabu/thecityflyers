import { ReactNode } from 'react';

export interface MenuItemProps {
  href: string;
  label: string;
  icon: ReactNode;
  children?: MenuItemProps[]; // Allows nesting for submenus
}
