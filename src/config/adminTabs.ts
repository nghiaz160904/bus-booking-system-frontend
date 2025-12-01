import { LayoutDashboard, Bus, Building2, Users } from 'lucide-react';

export interface AdminTabItem {
  label: string;
  icon: React.ElementType;
  path: string;
}

export const ADMIN_TABS: AdminTabItem[] = [
  {
    label: 'Dashboard',
    icon: LayoutDashboard,
    path: '/admin',
  },
  {
    label: 'Trips',
    icon: Bus,
    path: '/admin/trips',
  },
  {
    label: 'Operators',
    icon: Building2,
    path: '/admin/operators',
  },
  {
    label: 'Users',
    icon: Users,
    path: '/admin/users',
  },
];
