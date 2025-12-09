/**
 * Cache Time Constants
 * Domain layer - Time constants for cache management
 *
 * General-purpose time utilities for any React Native app
 */

/**
 * Milliseconds constants for time calculations
 */
export const TIME_MS = {
  SECOND: 1000,
  MINUTE: 60 * 1000,
  HOUR: 60 * 60 * 1000,
  DAY: 24 * 60 * 60 * 1000,
  WEEK: 7 * 24 * 60 * 60 * 1000,
} as const;

/**
 * Default staleTime values for different cache strategies
 * staleTime = how long data is considered fresh
 */
export const DEFAULT_STALE_TIME = {
  REALTIME: 0, // Always stale (refetch immediately)
  VERY_SHORT: TIME_MS.MINUTE, // 1 minute
  SHORT: 5 * TIME_MS.MINUTE, // 5 minutes
  MEDIUM: 30 * TIME_MS.MINUTE, // 30 minutes
  LONG: 2 * TIME_MS.HOUR, // 2 hours
  VERY_LONG: TIME_MS.DAY, // 24 hours
  PERMANENT: Infinity, // Never stale
} as const;

/**
 * Default gcTime (garbage collection) values
 * gcTime = how long unused data stays in cache before being garbage collected
 */
export const DEFAULT_GC_TIME = {
  VERY_SHORT: 5 * TIME_MS.MINUTE, // 5 minutes
  SHORT: 30 * TIME_MS.MINUTE, // 30 minutes
  MEDIUM: 2 * TIME_MS.HOUR, // 2 hours
  LONG: TIME_MS.DAY, // 24 hours
  VERY_LONG: 7 * TIME_MS.DAY, // 7 days
} as const;

/**
 * Default retry configuration
 */
export const DEFAULT_RETRY = {
  NONE: false,
  MINIMAL: 1,
  STANDARD: 3,
  AGGRESSIVE: 5,
} as const;

/**
 * Default refetch intervals
 */
export const DEFAULT_REFETCH_INTERVAL = {
  REALTIME: 10 * TIME_MS.SECOND, // 10 seconds
  FAST: 30 * TIME_MS.SECOND, // 30 seconds
  MODERATE: TIME_MS.MINUTE, // 1 minute
  SLOW: 5 * TIME_MS.MINUTE, // 5 minutes
} as const;
