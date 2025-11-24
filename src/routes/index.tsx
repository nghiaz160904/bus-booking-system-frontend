import { createRoute } from '@tanstack/react-router';
import HomePage from '../pages/HomePage.tsx';
import { rootRoute } from './root.tsx';

export const indexRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/',
  component: () => <HomePage />,
});

// In router setup (e.g. router.ts):
// const routeTree = rootRoute.addChildren([indexRoute, dashboardRoute])
