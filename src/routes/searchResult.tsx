import { createRoute } from '@tanstack/react-router';
import { rootRoute } from './root.tsx';
import SearchResultsPage from '../pages/SearchResultsPage.tsx';

export const searchResultRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/search-results',
  component: () => <SearchResultsPage />,
});
