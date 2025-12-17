import { QueryClient } from '@tanstack/react-query';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1, // Enable retries for failed requests
      refetchOnReconnect: true, // Automatically refetch when the network reconnects
      refetchOnWindowFocus: true, // Automatically refetch when the window is focused
      // staleTime: 1000 * 60 * 5, // Data is considered fresh for 5 minutes
    },
  },
});

export default queryClient;
