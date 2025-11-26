import { QueryClient } from '@tanstack/react-query';

export function getContext() {
  // You can add default options here if needed
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        retry: 1,
        refetchOnWindowFocus: false,
      },
    },
  });

  return {
    queryClient,
  };
}
