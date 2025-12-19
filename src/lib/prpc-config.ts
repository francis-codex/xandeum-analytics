/**
 * Xandeum pRPC Configuration
 *
 * Centralized configuration for pNode RPC endpoints
 * and client settings
 */

import type { PRpcClientConfig } from '@/types/prpc';

/**
 * Known working pNode endpoints
 * These pNodes have open pRPC ports on 6000
 *
 * Source: Xandeum team communication (Dec 2024)
 * Status: Verified working as of 2024-12-10
 */
export const PNODE_ENDPOINTS = [
  'http://173.212.203.145:6000/rpc',  // ✅ Verified - 219 GB storage
  'http://173.212.220.65:6000/rpc',
  'http://161.97.97.41:6000/rpc',     // ✅ Verified - 20 GB storage
  'http://192.190.136.36:6000/rpc',   // ✅ Verified - 558 GB storage
  'http://192.190.136.37:6000/rpc',
  'http://192.190.136.38:6000/rpc',
  'http://192.190.136.28:6000/rpc',
  'http://192.190.136.29:6000/rpc',
  'http://207.244.255.1:6000/rpc',
];

/**
 * Default pRPC client configuration
 */
export const DEFAULT_PRPC_CONFIG: PRpcClientConfig = {
  /** List of pNode endpoints (load balanced round-robin) */
  endpoints: PNODE_ENDPOINTS,

  /** Request timeout: 5 seconds (fail fast for performance) */
  timeout: 5000,

  /** Retry configuration - DISABLED for performance (fail fast) */
  retry: {
    maxRetries: 0, // No retries - fail immediately
    initialDelayMs: 0,
    maxDelayMs: 0,
    backoffMultiplier: 1,
    retryableStatusCodes: [], // Don't retry any status codes
  },

  /** Custom headers for pRPC requests */
  headers: {
    'Content-Type': 'application/json',
    // Note: User-Agent header removed - browsers don't allow setting it from client-side code
  },

  /** Enable request/response logging in development */
  enableLogging: process.env.NODE_ENV === 'development',
};

/**
 * Environment-based configuration
 * Allows overriding endpoints via environment variables
 */
export function getPRpcConfig(): PRpcClientConfig {
  const envEndpoints = process.env.NEXT_PUBLIC_PRPC_ENDPOINTS?.split(',').filter(Boolean);

  return {
    ...DEFAULT_PRPC_CONFIG,
    endpoints: envEndpoints && envEndpoints.length > 0
      ? envEndpoints.map(e => e.trim())
      : DEFAULT_PRPC_CONFIG.endpoints,
  };
}

/**
 * Timeout configurations for different operations
 */
export const TIMEOUTS = {
  /** Quick health checks */
  HEALTH_CHECK: 5000,

  /** Standard RPC requests */
  STANDARD_REQUEST: 30000,

  /** Heavy data requests (batch operations) */
  HEAVY_REQUEST: 60000,
} as const;

/**
 * Cache duration for different data types (in milliseconds)
 */
export const CACHE_DURATION = {
  /** pNode stats cache: 30 seconds */
  PNODE_STATS: 30000,

  /** All pNodes list cache: 60 seconds */
  ALL_PNODES: 60000,

  /** Network stats cache: 30 seconds */
  NETWORK_STATS: 30000,
} as const;
