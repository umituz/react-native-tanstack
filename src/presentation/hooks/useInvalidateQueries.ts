/**
 * useInvalidateQueries Hook
 * Presentation layer - Cache invalidation helper
 *
 * General-purpose cache invalidation for any React Native app
 */

import { useQueryClient } from '@tanstack/react-query';
import { useCallback } from 'react';

/**
 * Hook for easy cache invalidation
 *
 * @example
 * ```typescript
 * const invalidate = useInvalidateQueries();
 *
 * // Invalidate all posts queries
 * await invalidate(['posts']);
 *
 * // Invalidate specific post
 * await invalidate(['posts', 'detail', 123]);
 *
 * // Invalidate with predicate
 * await invalidate({
 *   predicate: (query) => query.queryKey[0] === 'posts'
 * });
 * ```
 */
export function useInvalidateQueries() {
  const queryClient = useQueryClient();

  return useCallback(
    async (queryKey: readonly unknown[]) => {
      await queryClient.invalidateQueries({ queryKey });

      if (__DEV__) {
        // eslint-disable-next-line no-console
        console.log('[TanStack Query] Invalidated queries:', queryKey);
      }
    },
    [queryClient],
  );
}

/**
 * Hook for invalidating multiple query patterns at once
 *
 * @example
 * ```typescript
 * const invalidateMultiple = useInvalidateMultipleQueries();
 *
 * // Invalidate posts and comments
 * await invalidateMultiple([['posts'], ['comments']]);
 * ```
 */
export function useInvalidateMultipleQueries() {
  const queryClient = useQueryClient();

  return useCallback(
    async (queryKeys: Array<readonly unknown[]>) => {
      await Promise.all(
        queryKeys.map((key) => queryClient.invalidateQueries({ queryKey: key })),
      );

      if (__DEV__) {
        // eslint-disable-next-line no-console
        console.log('[TanStack Query] Invalidated multiple queries:', queryKeys);
      }
    },
    [queryClient],
  );
}

/**
 * Hook for removing queries from cache
 * More aggressive than invalidation - completely removes the data
 *
 * @example
 * ```typescript
 * const removeQueries = useRemoveQueries();
 *
 * // Remove all posts queries
 * await removeQueries(['posts']);
 * ```
 */
export function useRemoveQueries() {
  const queryClient = useQueryClient();

  return useCallback(
    async (queryKey: readonly unknown[]) => {
      queryClient.removeQueries({ queryKey });

      if (__DEV__) {
        // eslint-disable-next-line no-console
        console.log('[TanStack Query] Removed queries:', queryKey);
      }
    },
    [queryClient],
  );
}

/**
 * Hook for resetting queries to their initial state
 *
 * @example
 * ```typescript
 * const resetQueries = useResetQueries();
 *
 * // Reset all posts queries
 * await resetQueries(['posts']);
 * ```
 */
export function useResetQueries() {
  const queryClient = useQueryClient();

  return useCallback(
    async (queryKey: readonly unknown[]) => {
      await queryClient.resetQueries({ queryKey });

      if (__DEV__) {
        // eslint-disable-next-line no-console
        console.log('[TanStack Query] Reset queries:', queryKey);
      }
    },
    [queryClient],
  );
}
