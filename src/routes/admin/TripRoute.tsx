import { createRoute } from '@tanstack/react-router';
import AdminPage from '@/pages/AdminPage';
import { adminRoute } from './AdminRoute';

export const tripRoute = createRoute({
  getParentRoute: () => adminRoute,
  path: '/trips',
  component: () => <AdminPage />,
});
