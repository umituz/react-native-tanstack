/**
 * TanStack Provider
 * Infrastructure layer - Root provider component
 *
 * General-purpose provider for any React Native app
 */

import React from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { PersistQueryClientProvider } from '@tanstack/react-query-persist-client';
import type { Persister } from '@tanstack/react-query-persist-client';
import { createQueryClient, type QueryClientFactoryOptions } from '../config/QueryClientConfig';
import { createPersister, type PersisterFactoryOptions } from '../config/PersisterConfig';

/**
 * TanStack provider props
 */
export interface TanstackProviderProps {
  /**
   * Child components
   */
  children: React.ReactNode;

  /**
   * Custom QueryClient instance
   * If not provided, a default one will be created
   */
  queryClient?: QueryClient;

  /**
   * QueryClient configuration options
   * Only used if queryClient is not provided
   */
  queryClientOptions?: QueryClientFactoryOptions;

  /**
   * Enable AsyncStorage persistence
   * @default true
   */
  enablePersistence?: boolean;

  /**
   * Custom persister instance
   * Only used if enablePersistence is true
   */
  persister?: Persister;

  /**
   * Persister configuration options
   * Only used if enablePersistence is true and persister is not provided
   */
  persisterOptions?: PersisterFactoryOptions;

  /**
   * Callback when persistence is successfully restored
   */
  onPersistSuccess?: () => void;

  /**
   * Callback when persistence restoration fails
   */
  onPersistError?: () => void;
}

/**
 * TanStack Query provider with optional AsyncStorage persistence
 *
 * @example
 * // Basic usage (with persistence)
 * ```tsx
 * <TanstackProvider>
 *   <App />
 * </TanstackProvider>
 * ```
 *
 * @example
 * // Custom configuration
 * ```tsx
 * <TanstackProvider
 *   queryClientOptions={{
 *     defaultStaleTime: 10 * 60 * 1000,
 *     enableDevLogging: true,
 *   }}
 *   persisterOptions={{
 *     keyPrefix: 'myapp',
 *     maxAge: 24 * 60 * 60 * 1000,
 *     busterVersion: '2',
 *   }}
 *   onPersistSuccess={() => console.log('Cache restored')}
 * >
 *   <App />
 * </TanstackProvider>
 * ```
 *
 * @example
 * // Without persistence
 * ```tsx
 * <TanstackProvider enablePersistence={false}>
 *   <App />
 * </TanstackProvider>
 * ```
 */
export function TanstackProvider({
  children,
  queryClient: providedQueryClient,
  queryClientOptions,
  enablePersistence = true,
  persister: providedPersister,
  persisterOptions,
  onPersistSuccess,
  onPersistError,
}: TanstackProviderProps): React.ReactElement {
  // Create QueryClient if not provided
  const [queryClient] = React.useState(() => providedQueryClient ?? createQueryClient(queryClientOptions));

  // Create persister if persistence is enabled
  const [persister] = React.useState(() => {
    if (!enablePersistence) return undefined;
    return providedPersister ?? createPersister(persisterOptions);
  });

  // Without persistence
  if (!enablePersistence || !persister) {
    return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>;
  }

  // With persistence
  return (
    <PersistQueryClientProvider
      client={queryClient}
      persistOptions={{
        persister,
        maxAge: persisterOptions?.maxAge,
        buster: persisterOptions?.busterVersion,
      }}
      onSuccess={onPersistSuccess}
      onError={onPersistError}
    >
      {children}
    </PersistQueryClientProvider>
  );
}
