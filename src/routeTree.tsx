import { rootRoute } from './routes/root.tsx';
import { indexRoute } from './routes/index.tsx';
import { dashboardRoute } from './routes/dashboard.tsx';
import { oauthCallbackRoute } from './routes/oauthCallback.tsx';
import { searchResultRoute } from './routes/searchResult.tsx';

export const routeTree = rootRoute.addChildren([
  indexRoute,
  oauthCallbackRoute,
  dashboardRoute,
  searchResultRoute,
]);
