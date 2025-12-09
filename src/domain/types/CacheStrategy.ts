/**
 * Cache Strategy Types
 * Domain layer - Cache configuration types
 *
 * General-purpose cache strategies for any React Native app
 */

import type { UseQueryOptions } from '@tanstack/react-query';

/**
 * Cache configuration for TanStack Query
 */
export interface CacheConfig {
  /**
   * Time in ms data is considered fresh (no refetch)
   */
  staleTime: number;

  /**
   * Time in ms inactive data stays in cache before garbage collection
   */
  gcTime: number;

  /**
   * Whether to refetch when component mounts
   */
  refetchOnMount?: boolean | 'always';

  /**
   * Whether to refetch when window regains focus
   */
  refetchOnWindowFocus?: boolean | 'always';

  /**
   * Whether to refetch when network reconnects
   */
  refetchOnReconnect?: boolean | 'always';

  /**
   * Number of retry attempts on failure
   */
  retry?: boolean | number;

  /**
   * Interval for automatic background refetching (in ms)
   * Set to false to disable
   */
  refetchInterval?: number | false;
}

/**
 * Cache strategy enum for different data types
 */
export enum CacheStrategyType {
  /**
   * Real-time data that changes frequently
   * Example: Live chat, stock prices, sports scores
   */
  REALTIME = 'REALTIME',

  /**
   * User-specific data
   * Example: User profile, settings, preferences
   */
  USER_DATA = 'USER_DATA',

  /**
   * Master data that rarely changes
   * Example: Countries list, categories, app configuration
   */
  MASTER_DATA = 'MASTER_DATA',

  /**
   * Public read-heavy data
   * Example: Blog posts, product catalog, news feed
   */
  PUBLIC_DATA = 'PUBLIC_DATA',

  /**
   * Custom strategy (user-defined)
   */
  CUSTOM = 'CUSTOM',
}

/**
 * Query options type (generic, works with any data)
 */
export type QueryConfig<TData = unknown, TError = Error> = Partial<
  UseQueryOptions<TData, TError>
>;

/**
 * Mutation options type (generic, works with any data)
 */
export interface MutationConfig<TData = unknown, TError = Error, TVariables = unknown> {
  /**
   * Function to call on mutation success
   */
  onSuccess?: (data: TData, variables: TVariables) => void | Promise<void>;

  /**
   * Function to call on mutation error
   */
  onError?: (error: TError, variables: TVariables) => void | Promise<void>;

  /**
   * Function to call on mutation settled (success or error)
   */
  onSettled?: (data: TData | undefined, error: TError | null, variables: TVariables) => void | Promise<void>;

  /**
   * Number of retry attempts
   */
  retry?: boolean | number;
}
