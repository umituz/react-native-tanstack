/**
 * Query Key Factory
 * Domain layer - Query key generation utilities
 *
 * General-purpose query key patterns for any React Native app
 */

/**
 * Create a typed query key factory for a resource
 *
 * @example
 * ```typescript
 * const postKeys = createQueryKeyFactory('posts');
 *
 * // All posts
 * postKeys.all() // ['posts']
 *
 * // Posts list
 * postKeys.lists() // ['posts', 'list']
 *
 * // Posts list with filters
 * postKeys.list({ status: 'published' }) // ['posts', 'list', { status: 'published' }]
 *
 * // Single post detail
 * postKeys.detail(123) // ['posts', 'detail', 123]
 * ```
 */
export function createQueryKeyFactory(resource: string) {
  return {
    /**
     * All queries for this resource
     */
    all: () => [resource] as const,

    /**
     * All list queries for this resource
     */
    lists: () => [resource, 'list'] as const,

    /**
     * List query with optional filters
     */
    list: (filters?: Record<string, unknown>) =>
      filters ? ([resource, 'list', filters] as const) : ([resource, 'list'] as const),

    /**
     * All detail queries for this resource
     */
    details: () => [resource, 'detail'] as const,

    /**
     * Detail query for specific item
     */
    detail: (id: string | number) => [resource, 'detail', id] as const,

    /**
     * Custom query key
     */
    custom: (...args: unknown[]) => [resource, ...args] as const,
  };
}

/**
 * Create a query key for a list with pagination
 *
 * @example
 * ```typescript
 * createPaginatedQueryKey('posts', { page: 1, limit: 10 })
 * // ['posts', 'list', { page: 1, limit: 10 }]
 * ```
 */
export function createPaginatedQueryKey(
  resource: string,
  pagination: { page?: number; limit?: number; cursor?: string },
): readonly [string, 'list', typeof pagination] {
  return [resource, 'list', pagination] as const;
}

/**
 * Create a query key for infinite scroll
 *
 * @example
 * ```typescript
 * createInfiniteQueryKey('feed', { limit: 20 })
 * // ['feed', 'infinite', { limit: 20 }]
 * ```
 */
export function createInfiniteQueryKey(
  resource: string,
  params?: Record<string, unknown>,
): readonly [string, 'infinite', Record<string, unknown>] | readonly [string, 'infinite'] {
  return params ? ([resource, 'infinite', params] as const) : ([resource, 'infinite'] as const);
}

/**
 * Create a scoped query key (for user-specific data)
 *
 * @example
 * ```typescript
 * createScopedQueryKey('user123', 'posts')
 * // ['user', 'user123', 'posts']
 * ```
 */
export function createScopedQueryKey(
  scopeId: string,
  resource: string,
  ...args: unknown[]
): readonly [string, string, string, ...unknown[]] {
  return ['user', scopeId, resource, ...args] as const;
}

/**
 * Match query keys by pattern
 * Useful for invalidating multiple related queries
 *
 * @example
 * ```typescript
 * // Invalidate all post queries
 * queryClient.invalidateQueries({
 *   predicate: (query) => matchQueryKey(query.queryKey, ['posts'])
 * })
 * ```
 */
export function matchQueryKey(
  queryKey: readonly unknown[],
  pattern: readonly unknown[],
): boolean {
  if (pattern.length > queryKey.length) return false;

  return pattern.every((value, index) => {
    if (value === undefined) return true;
    return queryKey[index] === value;
  });
}
