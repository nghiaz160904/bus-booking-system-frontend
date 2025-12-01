import { createRoute } from '@tanstack/react-router';
import SearchResultsPage from '../../pages/SearchResultsPage.tsx';
import { indexRoute } from '../IndexRoute.tsx';

export const searchResultRoute = createRoute({
  getParentRoute: () => indexRoute,
  path: '/search-results',
  component: () => <SearchResultsPage />,
});
