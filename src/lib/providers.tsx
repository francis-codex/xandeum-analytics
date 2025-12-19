'use client';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useState } from 'react';

/**
 * React Query Provider Component
 * Manages data fetching, caching, and synchronization
 */
export function Providers({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            // Stale time: 1 minute (data valid for 1 min without refetch)
            staleTime: 60 * 1000,
            // Cache time: 5 minutes
            gcTime: 5 * 60 * 1000,
            // Don't retry failed requests (fail fast for performance)
            retry: false,
            // Disable refetch on window focus (prevents cascading requests)
            refetchOnWindowFocus: false,
            // Disable automatic refetch interval (user can manually refresh)
            refetchInterval: false,
          },
        },
      })
  );

  return (
    <QueryClientProvider client={queryClient}>
      {children}
    </QueryClientProvider>
  );
}
