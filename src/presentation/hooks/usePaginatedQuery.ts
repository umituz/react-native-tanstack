/**
 * usePaginatedQuery Hook
 * Presentation layer - Pagination helper
 *
 * General-purpose pagination for any React Native app
 */

import {
  useInfiniteQuery,
  type UseInfiniteQueryOptions,
  type InfiniteData,
} from '@tanstack/react-query';
import { useMemo } from 'react';

/**
 * Page parameter for cursor-based pagination
 */
export interface CursorPageParam {
  cursor?: string;
  limit?: number;
}

/**
 * Page parameter for offset-based pagination
 */
export interface OffsetPageParam {
  offset: number;
  limit: number;
}

/**
 * Paginated response with cursor
 */
export interface CursorPaginatedResponse<TData> {
  items: TData[];
  nextCursor?: string;
  hasMore: boolean;
}

/**
 * Paginated response with offset
 */
export interface OffsetPaginatedResponse<TData> {
  items: TData[];
  total: number;
  offset: number;
  limit: number;
}

/**
 * Hook for cursor-based infinite scroll
 *
 * @example
 * ```typescript
 * const { data, fetchNextPage, hasNextPage, isFetchingNextPage } = useCursorPagination({
 *   queryKey: ['posts'],
 *   queryFn: ({ pageParam }) => fetchPosts({ cursor: pageParam, limit: 20 }),
 *   limit: 20,
 * });
 *
 * // Flatten all pages into single array
 * const allPosts = data.pages.flatMap(page => page.items);
 * ```
 */
export function useCursorPagination<TData>(
  options: Omit<
    UseInfiniteQueryOptions<
      CursorPaginatedResponse<TData>,
      Error,
      CursorPaginatedResponse<TData>,
      readonly unknown[],
      string | undefined
    >,
    'getNextPageParam' | 'initialPageParam'
  > & {
    limit?: number;
  },
) {
  const { limit = 20, ...queryOptions } = options;

  const result = useInfiniteQuery({
    ...queryOptions,
    initialPageParam: undefined,
    getNextPageParam: (lastPage: CursorPaginatedResponse<TData>) =>
      lastPage.hasMore ? lastPage.nextCursor : undefined,
  });

  // Flatten pages into single array for easier consumption
  const flatData = useMemo(() => {
    const infiniteData = result.data as InfiniteData<CursorPaginatedResponse<TData>> | undefined;
    if (!infiniteData?.pages) return [];
    return infiniteData.pages.flatMap((page) => page.items);
  }, [result.data]);

  return {
    ...result,
    flatData,
    totalItems: flatData.length,
  };
}

/**
 * Hook for offset-based pagination
 *
 * @example
 * ```typescript
 * const { data, fetchNextPage, hasNextPage } = useOffsetPagination({
 *   queryKey: ['posts'],
 *   queryFn: ({ pageParam }) => fetchPosts({ offset: pageParam.offset, limit: pageParam.limit }),
 *   limit: 20,
 * });
 * ```
 */
export function useOffsetPagination<TData>(
  options: Omit<
    UseInfiniteQueryOptions<
      OffsetPaginatedResponse<TData>,
      Error,
      OffsetPaginatedResponse<TData>,
      readonly unknown[],
      OffsetPageParam
    >,
    'getNextPageParam' | 'initialPageParam'
  > & {
    limit?: number;
  },
) {
  const { limit = 20, ...queryOptions } = options;

  const result = useInfiniteQuery({
    ...queryOptions,
    initialPageParam: { offset: 0, limit },
    getNextPageParam: (lastPage: OffsetPaginatedResponse<TData>) => {
      const nextOffset = lastPage.offset + lastPage.limit;
      return nextOffset < lastPage.total ? { offset: nextOffset, limit } : undefined;
    },
  });

  // Flatten pages into single array
  const flatData = useMemo(() => {
    const infiniteData = result.data as InfiniteData<OffsetPaginatedResponse<TData>> | undefined;
    if (!infiniteData?.pages) return [];
    return infiniteData.pages.flatMap((page) => page.items);
  }, [result.data]);

  // Calculate total from last page
  const infiniteData = result.data as InfiniteData<OffsetPaginatedResponse<TData>> | undefined;
  const total = infiniteData?.pages?.[infiniteData.pages.length - 1]?.total ?? 0;

  return {
    ...result,
    flatData,
    totalItems: flatData.length,
    total,
  };
}
