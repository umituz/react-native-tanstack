/**
 * useOptimisticUpdate Hook
 * Presentation layer - Optimistic update helper
 *
 * General-purpose optimistic updates for any React Native app
 */

import { useMutation, useQueryClient, type UseMutationOptions } from '@tanstack/react-query';

/**
 * Optimistic update configuration
 */
export interface OptimisticUpdateConfig<TData, TVariables> {
  /**
   * Query key to update optimistically
   */
  queryKey: readonly unknown[];

  /**
   * Function to update the cached data optimistically
   */
  updater: (oldData: TData | undefined, variables: TVariables) => TData;

  /**
   * Whether to invalidate the query after successful mutation
   * @default true
   */
  invalidateOnSuccess?: boolean;
}

/**
 * Hook for mutations with optimistic updates and automatic rollback
 *
 * @example
 * ```typescript
 * const updatePost = useOptimisticUpdate<Post, UpdatePostVariables>({
 *   mutationFn: (variables) => api.updatePost(variables.id, variables.data),
 *   queryKey: ['posts', postId],
 *   updater: (oldPost, variables) => ({
 *     ...oldPost,
 *     ...variables.data,
 *   }),
 * });
 *
 * // Usage
 * updatePost.mutate({ id: 123, data: { title: 'New Title' } });
 * ```
 */
export function useOptimisticUpdate<TData = unknown, TVariables = unknown, TError = Error>(
  config: OptimisticUpdateConfig<TData, TVariables> &
    UseMutationOptions<TData, TError, TVariables>,
) {
  const queryClient = useQueryClient();
  const { queryKey, updater, invalidateOnSuccess = true, onError, onSettled, ...mutationOptions } = config;

  return useMutation({
    ...mutationOptions,
    onMutate: async (variables) => {
      // Cancel outgoing refetches to avoid overwriting optimistic update
      await queryClient.cancelQueries({ queryKey });

      // Snapshot the previous value
      const previousData = queryClient.getQueryData<TData>(queryKey);

      // Optimistically update to the new value
      if (previousData !== undefined) {
        const optimisticData = updater(previousData, variables);
        queryClient.setQueryData(queryKey, optimisticData);

        if (__DEV__) {
          // eslint-disable-next-line no-console
          console.log('[TanStack Query] Optimistic update applied:', queryKey);
        }
      }

      // Return context with previous data for rollback
      return { previousData };
    },
    onError: (error, variables, context, ...rest) => {
      // Rollback to previous data on error
      if (context?.previousData !== undefined) {
        queryClient.setQueryData(queryKey, context.previousData);

        if (__DEV__) {
          // eslint-disable-next-line no-console
          console.error('[TanStack Query] Optimistic update rolled back:', error);
        }
      }

      // Call user-provided onError
      if (onError) {
        onError(error, variables, context, ...rest);
      }
    },
    onSettled: (data, error, variables, context, ...rest) => {
      // Invalidate query to refetch with real data
      if (invalidateOnSuccess && !error) {
        queryClient.invalidateQueries({ queryKey });
      }

      // Call user-provided onSettled
      if (onSettled) {
        onSettled(data, error, variables, context, ...rest);
      }
    },
  });
}

/**
 * Hook for list mutations with optimistic updates (add/remove/update items)
 *
 * @example
 * ```typescript
 * const addPost = useOptimisticListUpdate<Post[], { title: string }>({
 *   mutationFn: (variables) => api.createPost(variables),
 *   queryKey: ['posts'],
 *   updater: (oldPosts, newPost) => [...(oldPosts ?? []), newPost],
 * });
 * ```
 */
export function useOptimisticListUpdate<TData extends unknown[], TVariables = unknown>(
  config: OptimisticUpdateConfig<TData, TVariables> &
    UseMutationOptions<TData, Error, TVariables>,
) {
  return useOptimisticUpdate<TData, TVariables>(config);
}
