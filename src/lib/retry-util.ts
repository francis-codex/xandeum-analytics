/**
 * Retry Utility with Exponential Backoff
 *
 * Provides robust retry logic for network requests
 * with configurable exponential backoff
 */

import type { RetryConfig } from '@/types/prpc';

/**
 * Error that can be retried
 */
export class RetryableError extends Error {
  constructor(message: string, public readonly cause?: Error) {
    super(message);
    this.name = 'RetryableError';
  }
}

/**
 * Error that should not be retried
 */
export class NonRetryableError extends Error {
  constructor(message: string, public readonly cause?: Error) {
    super(message);
    this.name = 'NonRetryableError';
  }
}

/**
 * Sleep for specified milliseconds
 */
function sleep(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}

/**
 * Calculate delay with exponential backoff
 */
function calculateDelay(
  attempt: number,
  initialDelay: number,
  maxDelay: number,
  multiplier: number
): number {
  const delay = initialDelay * Math.pow(multiplier, attempt - 1);
  return Math.min(delay, maxDelay);
}

/**
 * Execute a function with retry logic and exponential backoff
 *
 * @param fn - Async function to execute
 * @param config - Retry configuration
 * @param shouldRetry - Optional custom retry condition
 * @returns Promise resolving to function result
 *
 * @example
 * ```typescript
 * const result = await withRetry(
 *   async () => await fetch('https://api.example.com'),
 *   {
 *     maxRetries: 3,
 *     initialDelayMs: 1000,
 *     maxDelayMs: 10000,
 *     backoffMultiplier: 2,
 *     retryableStatusCodes: [500, 502, 503]
 *   }
 * );
 * ```
 */
export async function withRetry<T>(
  fn: () => Promise<T>,
  config: RetryConfig,
  shouldRetry?: (error: Error, attempt: number) => boolean
): Promise<T> {
  let lastError: Error | undefined;

  for (let attempt = 1; attempt <= config.maxRetries + 1; attempt++) {
    try {
      return await fn();
    } catch (error) {
      lastError = error instanceof Error ? error : new Error(String(error));

      // Don't retry if it's explicitly a non-retryable error
      if (error instanceof NonRetryableError) {
        throw error;
      }

      // Last attempt - don't retry
      if (attempt > config.maxRetries) {
        break;
      }

      // Check custom retry condition
      if (shouldRetry && !shouldRetry(lastError, attempt)) {
        break;
      }

      // Check if error is retryable
      const isRetryable = isRetryableError(lastError, config);
      if (!isRetryable) {
        break;
      }

      // Calculate delay and wait
      const delay = calculateDelay(
        attempt,
        config.initialDelayMs,
        config.maxDelayMs,
        config.backoffMultiplier
      );

      await sleep(delay);
    }
  }

  // All retries exhausted
  throw new Error(
    `Failed after ${config.maxRetries} retries: ${lastError?.message}`,
    { cause: lastError }
  );
}

/**
 * Determine if an error is retryable based on configuration
 */
function isRetryableError(error: Error, config: RetryConfig): boolean {
  // Explicitly retryable errors
  if (error instanceof RetryableError) {
    return true;
  }

  // DON'T retry connection refused or timeout errors (fail fast)
  if (
    error.message.includes('ECONNREFUSED') ||
    error.message.includes('ECONNABORTED') ||
    error.message.includes('timeout')
  ) {
    return false;
  }

  // Retry other network errors
  if (
    error.message.includes('ETIMEDOUT') ||
    error.message.includes('ENOTFOUND') ||
    error.message.includes('Network Error')
  ) {
    return true;
  }

  // Check if it's an Axios error with retryable status code
  if ('response' in error && typeof error.response === 'object' && error.response) {
    const response = error.response as { status?: number };
    if (response.status && config.retryableStatusCodes.includes(response.status)) {
      return true;
    }
  }

  return false;
}

/**
 * Retry a fetch request with exponential backoff
 * Convenience wrapper around withRetry for fetch requests
 */
export async function retryFetch(
  url: string,
  options: RequestInit = {},
  config: RetryConfig
): Promise<Response> {
  return withRetry(
    async () => {
      const response = await fetch(url, options);

      // Check if response status is retryable
      if (!response.ok && config.retryableStatusCodes.includes(response.status)) {
        throw new RetryableError(
          `HTTP ${response.status}: ${response.statusText}`
        );
      }

      return response;
    },
    config
  );
}

/**
 * Default retry configuration
 */
export const DEFAULT_RETRY_CONFIG: RetryConfig = {
  maxRetries: 3,
  initialDelayMs: 1000,
  maxDelayMs: 10000,
  backoffMultiplier: 2,
  retryableStatusCodes: [408, 429, 500, 502, 503, 504],
};
