/**
 * Retry Helpers
 * Presentation layer - Utility functions for retry logic
 *
 * General-purpose retry helpers for any React Native app
 */

/**
 * Retry function type for TanStack Query
 */
export type RetryFunction = (failureCount: number, error: Error) => boolean;

/**
 * Error checker function type
 */
export type ErrorChecker = (error: unknown) => boolean;

/**
 * Creates a retry function that stops retrying on specific errors
 *
 * @param shouldNotRetry - Function to check if error should NOT be retried
 * @param maxRetries - Maximum number of retries (default: 1)
 *
 * @example
 * ```typescript
 * const isQuotaError = (error: unknown) => {
 *   return error instanceof Error && error.message.includes('quota');
 * };
 *
 * const retryFn = createConditionalRetry(isQuotaError, 1);
 * ```
 */
export function createConditionalRetry(
  shouldNotRetry: ErrorChecker,
  maxRetries = 1,
): RetryFunction {
  return (failureCount: number, error: Error) => {
    // Don't retry if error matches condition
    if (shouldNotRetry(error)) {
      return false;
    }

    // Retry up to maxRetries times
    return failureCount < maxRetries;
  };
}

/**
 * Creates a quota-aware retry function
 * Stops retrying on quota errors, retries other errors
 *
 * @param isQuotaError - Function to check if error is quota-related
 * @param maxRetries - Maximum number of retries (default: 1)
 *
 * @example
 * ```typescript
 * import { isQuotaError } from '@umituz/react-native-firestore';
 *
 * const retryFn = createQuotaAwareRetry(isQuotaError);
 * ```
 */
export function createQuotaAwareRetry(
  isQuotaError: ErrorChecker,
  maxRetries = 1,
): RetryFunction {
  return createConditionalRetry(isQuotaError, maxRetries);
}
