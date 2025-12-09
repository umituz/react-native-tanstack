/**
 * Persister Configuration
 * Infrastructure layer - AsyncStorage persistence setup
 *
 * General-purpose persistence configuration for any React Native app
 */

import AsyncStorage from '@react-native-async-storage/async-storage';
import { createAsyncStoragePersister } from '@tanstack/query-async-storage-persister';
import { DEFAULT_GC_TIME } from '../../domain/constants/CacheDefaults';
import type { Persister } from '@tanstack/react-query-persist-client';

/**
 * Persister factory options
 */
export interface PersisterFactoryOptions {
  /**
   * Storage key prefix
   * @default 'tanstack-query'
   */
  keyPrefix?: string;

  /**
   * Maximum age of cached data in milliseconds
   * Data older than this will be discarded on restore
   * @default 24 hours
   */
  maxAge?: number;

  /**
   * Cache version for invalidation
   * Increment this to invalidate all existing caches
   * @default 1
   */
  busterVersion?: string;

  /**
   * Throttle time for persistence writes (in ms)
   * Prevents excessive writes to AsyncStorage
   * @default 1000
   */
  throttleTime?: number;
}

/**
 * Create an AsyncStorage persister for TanStack Query
 *
 * @example
 * ```typescript
 * const persister = createPersister({
 *   keyPrefix: 'myapp',
 *   maxAge: 24 * 60 * 60 * 1000, // 24 hours
 *   busterVersion: '1',
 * });
 * ```
 */
export function createPersister(options: PersisterFactoryOptions = {}): Persister {
  const {
    keyPrefix = 'tanstack-query',
    maxAge = DEFAULT_GC_TIME.LONG,
    busterVersion = '1',
    throttleTime = 1000,
  } = options;

  return createAsyncStoragePersister({
    storage: AsyncStorage,
    key: `${keyPrefix}-cache`,
    throttleTime,
    serialize: (data) => {
      // Add metadata for cache validation
      const persistData = {
        version: busterVersion,
        timestamp: Date.now(),
        data,
      };
      return JSON.stringify(persistData);
    },
    deserialize: (cachedString) => {
      try {
        const parsed = JSON.parse(cachedString);

        // Validate cache version
        if (parsed.version !== busterVersion) {
          if (__DEV__) {
            // eslint-disable-next-line no-console
            console.log(
              `[TanStack Query] Cache version mismatch. Expected: ${busterVersion}, Got: ${parsed.version}`,
            );
          }
          return undefined;
        }

        // Validate cache age
        const age = Date.now() - parsed.timestamp;
        if (age > maxAge) {
          if (__DEV__) {
            // eslint-disable-next-line no-console
            console.log(`[TanStack Query] Cache expired. Age: ${age}ms, Max: ${maxAge}ms`);
          }
          return undefined;
        }

        return parsed.data;
      } catch (error) {
        if (__DEV__) {
          // eslint-disable-next-line no-console
          console.error('[TanStack Query] Failed to deserialize cache:', error);
        }
        return undefined;
      }
    },
  });
}

/**
 * Clear all persisted cache data
 * Useful for logout or cache reset scenarios
 *
 * @example
 * ```typescript
 * await clearPersistedCache('myapp');
 * ```
 */
export async function clearPersistedCache(keyPrefix: string = 'tanstack-query'): Promise<void> {
  try {
    await AsyncStorage.removeItem(`${keyPrefix}-cache`);
    if (__DEV__) {
      // eslint-disable-next-line no-console
      console.log(`[TanStack Query] Cleared persisted cache: ${keyPrefix}`);
    }
  } catch (error) {
    if (__DEV__) {
      // eslint-disable-next-line no-console
      console.error('[TanStack Query] Failed to clear persisted cache:', error);
    }
  }
}

/**
 * Get persisted cache size (in bytes)
 * Useful for monitoring storage usage
 *
 * @example
 * ```typescript
 * const size = await getPersistedCacheSize('myapp');
 * console.log(`Cache size: ${size} bytes`);
 * ```
 */
export async function getPersistedCacheSize(
  keyPrefix: string = 'tanstack-query',
): Promise<number> {
  try {
    const data = await AsyncStorage.getItem(`${keyPrefix}-cache`);
    return data ? new Blob([data]).size : 0;
  } catch (error) {
    if (__DEV__) {
      // eslint-disable-next-line no-console
      console.error('[TanStack Query] Failed to get cache size:', error);
    }
    return 0;
  }
}
