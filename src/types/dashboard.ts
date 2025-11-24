import type { UserRole } from './auth';

export interface SummaryCardProps {
  title: string;
  value: number | string;
  icon?: React.ReactNode;
}

export interface SummaryMetric {
  id: string;
  label: string;
  value: string | number;
  icon?: React.ReactNode;
  roles?: string[]; // restrict visibility
}

export interface Activity {
  id: string;
  message: string;
  timestamp: string;
  roleVisibility?: string[]; // which roles can see
}

export interface ActivityListProps {
  activities: Activity[];
}

export interface RoleAdaptiveWidgetProps {
  userRole: UserRole;
}

export const summaryMetrics: SummaryMetric[] = [
  { id: 'totalBookings', label: 'Total Bookings', value: 150, icon: '🚌' },
  { id: 'activeUsers', label: 'Active Users', value: 75, icon: '👥', roles: ['ADMIN'] },
  {
    id: 'pendingRequests',
    label: 'Pending Requests',
    value: 5,
    icon: '⏳',
    roles: ['ADMIN', 'USER'],
  },
  { id: 'myUpcomingTrips', label: 'My Upcoming Trips', value: 3, icon: '📅', roles: ['USER'] },
];

export const activities: Activity[] = [
  {
    id: 'a1',
    message: 'John Doe booked route HN → HCM',
    timestamp: '2025-11-24 09:10',
    roleVisibility: ['ADMIN'],
  },
  {
    id: 'a2',
    message: 'Jane Smith canceled booking #4421',
    timestamp: '2025-11-24 08:55',
    roleVisibility: ['ADMIN'],
  },
  {
    id: 'a3',
    message: 'System maintenance scheduled',
    timestamp: '2025-11-24 08:00',
    roleVisibility: ['ADMIN', 'USER'],
  },
];
