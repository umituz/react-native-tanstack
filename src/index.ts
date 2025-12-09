/**
 * @umituz/react-native-tanstack
 * TanStack Query configuration and utilities for React Native apps
 *
 * General-purpose package for hundreds of React Native apps
 */

// Domain - Constants
export {
  TIME_MS,
  DEFAULT_STALE_TIME,
  DEFAULT_GC_TIME,
  DEFAULT_RETRY,
  DEFAULT_REFETCH_INTERVAL,
} from './domain/constants/CacheDefaults';

// Domain - Types
export {
  CacheStrategyType,
  type CacheConfig,
  type QueryConfig,
  type MutationConfig,
} from './domain/types/CacheStrategy';

// Domain - Utils
export {
  createQueryKeyFactory,
  createPaginatedQueryKey,
  createInfiniteQueryKey,
  createScopedQueryKey,
  matchQueryKey,
} from './domain/utils/QueryKeyFactory';

// Infrastructure - Config
export {
  CacheStrategies,
  createQueryClient,
  getCacheStrategy,
  type QueryClientFactoryOptions,
} from './infrastructure/config/QueryClientConfig';

export {
  createPersister,
  clearPersistedCache,
  getPersistedCacheSize,
  type PersisterFactoryOptions,
} from './infrastructure/config/PersisterConfig';

// Infrastructure - Providers
export { TanstackProvider, type TanstackProviderProps } from './infrastructure/providers/TanstackProvider';

// Presentation - Hooks
export {
  useInvalidateQueries,
  useInvalidateMultipleQueries,
  useRemoveQueries,
  useResetQueries,
} from './presentation/hooks/useInvalidateQueries';

export {
  useCursorPagination,
  useOffsetPagination,
  type CursorPageParam,
  type OffsetPageParam,
  type CursorPaginatedResponse,
  type OffsetPaginatedResponse,
} from './presentation/hooks/usePaginatedQuery';

export {
  useOptimisticUpdate,
  useOptimisticListUpdate,
  type OptimisticUpdateConfig,
} from './presentation/hooks/useOptimisticUpdate';

// Presentation - Utils
export {
  createConditionalRetry,
  createQuotaAwareRetry,
  type RetryFunction,
  type ErrorChecker,
} from './presentation/utils/RetryHelpers';

// Re-export TanStack Query core for convenience
export {
  useQuery,
  useMutation,
  useInfiniteQuery,
  useQueryClient,
  useIsFetching,
  useIsMutating,
  type UseQueryResult,
  type UseMutationResult,
  type UseInfiniteQueryResult,
  type QueryKey,
  type QueryClient,
} from '@tanstack/react-query';
