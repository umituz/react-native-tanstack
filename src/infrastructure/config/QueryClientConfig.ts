/**
 * QueryClient Configuration
 * Infrastructure layer - TanStack Query client setup
 *
 * General-purpose QueryClient configuration for any React Native app
 */

import { QueryClient } from '@tanstack/react-query';
import {
  DEFAULT_STALE_TIME,
  DEFAULT_GC_TIME,
  DEFAULT_RETRY,
} from '../../domain/constants/CacheDefaults';
import type { CacheConfig, CacheStrategyType } from '../../domain/types/CacheStrategy';

/**
 * Cache strategy configurations
 */
export const CacheStrategies: Record<CacheStrategyType, CacheConfig> = {
  REALTIME: {
    staleTime: DEFAULT_STALE_TIME.REALTIME,
    gcTime: DEFAULT_GC_TIME.VERY_SHORT,
    refetchOnMount: 'always',
    refetchOnWindowFocus: true,
    refetchOnReconnect: true,
    retry: DEFAULT_RETRY.MINIMAL,
  },
  USER_DATA: {
    staleTime: DEFAULT_STALE_TIME.MEDIUM,
    gcTime: DEFAULT_GC_TIME.LONG,
    refetchOnMount: false,
    refetchOnWindowFocus: false,
    refetchOnReconnect: true,
    retry: DEFAULT_RETRY.STANDARD,
  },
  MASTER_DATA: {
    staleTime: DEFAULT_STALE_TIME.VERY_LONG,
    gcTime: DEFAULT_GC_TIME.VERY_LONG,
    refetchOnMount: false,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
    retry: DEFAULT_RETRY.STANDARD,
  },
  PUBLIC_DATA: {
    staleTime: DEFAULT_STALE_TIME.MEDIUM,
    gcTime: DEFAULT_GC_TIME.LONG,
    refetchOnMount: false,
    refetchOnWindowFocus: false,
    refetchOnReconnect: true,
    retry: DEFAULT_RETRY.STANDARD,
  },
  CUSTOM: {
    staleTime: DEFAULT_STALE_TIME.SHORT,
    gcTime: DEFAULT_GC_TIME.MEDIUM,
    refetchOnMount: false,
    refetchOnWindowFocus: false,
    refetchOnReconnect: true,
    retry: DEFAULT_RETRY.STANDARD,
  },
};

/**
 * QueryClient factory options
 */
export interface QueryClientFactoryOptions {
  /**
   * Default staleTime in milliseconds
   * @default 5 minutes
   */
  defaultStaleTime?: number;

  /**
   * Default gcTime in milliseconds
   * @default 24 hours
   */
  defaultGcTime?: number;

  /**
   * Default retry configuration
   * @default 3
   */
  defaultRetry?: boolean | number;

  /**
   * Enable development mode logging
   * @default __DEV__
   */
  enableDevLogging?: boolean;
}

/**
 * Create a configured QueryClient instance
 *
 * @example
 * ```typescript
 * const queryClient = createQueryClient({
 *   defaultStaleTime: 5 * 60 * 1000, // 5 minutes
 *   enableDevLogging: true,
 * });
 * ```
 */
export function createQueryClient(options: QueryClientFactoryOptions = {}): QueryClient {
  const {
    defaultStaleTime = DEFAULT_STALE_TIME.SHORT,
    defaultGcTime = DEFAULT_GC_TIME.LONG,
    defaultRetry = DEFAULT_RETRY.STANDARD,
    enableDevLogging = __DEV__,
  } = options;

  return new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: defaultStaleTime,
        gcTime: defaultGcTime,
        retry: defaultRetry,
        refetchOnWindowFocus: false,
        refetchOnMount: false,
        refetchOnReconnect: true,
      },
      mutations: {
        retry: DEFAULT_RETRY.MINIMAL,
        onError: (error) => {
          if (enableDevLogging) {
            // eslint-disable-next-line no-console
            console.error('[TanStack Query] Mutation error:', error);
          }
        },
      },
    },
  });
}

/**
 * Get cache configuration for a specific strategy
 *
 * @example
 * ```typescript
 * const config = getCacheStrategy('PUBLIC_DATA');
 * const { data } = useQuery({
 *   queryKey: ['posts'],
 *   queryFn: fetchPosts,
 *   ...config,
 * });
 * ```
 */
export function getCacheStrategy(strategy: CacheStrategyType): CacheConfig {
  return CacheStrategies[strategy];
}
