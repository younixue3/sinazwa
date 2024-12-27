import { QueryClient } from 'react-query';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      staleTime: Infinity,
      cacheTime: Infinity,
      retry: 1,
      retryDelay: 1000
    },
    mutations: {
      retry: 1,
      retryDelay: 1000
    }
  }
});

export default queryClient;
