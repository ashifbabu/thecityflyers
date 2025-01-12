import {
  HomeIcon,
  BuildingStorefrontIcon,
  PaperAirplaneIcon,
  BuildingOfficeIcon,
  CalendarIcon,
  TruckIcon,
  TicketIcon,
  DocumentTextIcon,
  ShieldCheckIcon,
  NewspaperIcon,
  PencilSquareIcon,
  MegaphoneIcon,
} from '@heroicons/react/24/outline';
import { MenuItemProps } from '@/types/menu';

export const menuItems: MenuItemProps[] = [
  { href: '/', label: 'Home', icon: <HomeIcon className="h-5 w-5" /> },
  {
    href: '#',
    label: 'Services',
    icon: <BuildingStorefrontIcon className="h-5 w-5" />,
    children: [
      { href: '/services/flights', label: 'Flights', icon: <PaperAirplaneIcon className="h-5 w-5" /> },
      { href: '/services/hotels', label: 'Hotels', icon: <BuildingOfficeIcon className="h-5 w-5" /> },
      { href: '/services/holidays', label: 'Holidays', icon: <CalendarIcon className="h-5 w-5" /> },
      { href: '/services/cars', label: 'Cars', icon: <TruckIcon className="h-5 w-5" /> },
      { href: '/services/events', label: 'Events', icon: <TicketIcon className="h-5 w-5" /> },
      { href: '/services/visa', label: 'Visa', icon: <DocumentTextIcon className="h-5 w-5" /> },
      { href: '/services/insurance', label: 'Travel Insurance', icon: <ShieldCheckIcon className="h-5 w-5" /> },
    ],
  },
  { href: '/advisory', label: 'Travel Advisory', icon: <NewspaperIcon className="h-5 w-5" /> },
  { href: '/news', label: 'News', icon: <NewspaperIcon className="h-5 w-5" /> },
  { href: '/blog', label: 'Blog', icon: <PencilSquareIcon className="h-5 w-5" /> },
  { href: '/promotions', label: 'Promotions', icon: <MegaphoneIcon className="h-5 w-5" /> },
];
