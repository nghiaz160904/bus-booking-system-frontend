import { rootRoute } from './routes/root.tsx';
import { indexRoute } from './routes/index.tsx';
import { dashboardRoute } from './routes/dashboard.tsx';

export const routeTree = rootRoute.addChildren([indexRoute, dashboardRoute]);
