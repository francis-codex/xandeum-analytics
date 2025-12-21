/**
 * Xandeum pRPC Configuration
 *
 * Centralized configuration for pNode RPC endpoints
 * and client settings
 */

import type { PRpcClientConfig } from '@/types/prpc';

/**
 * Known working pNode endpoints
 *
 * Source: Xandeum team communication (Dec 2024)
 * Status: Port 6000 endpoints with pRPC enabled
 * API Version: v0.7.0+ with get-pods-with-stats support
 * Last Updated: 2024-12-22
 *
 * Total: 9 verified working endpoints (expanded from 8)
 */
export const PNODE_ENDPOINTS = [
  // Confirmed working endpoints (port 6000 - publicly accessible)
  'http://173.212.203.145:6000/rpc',
  'http://173.212.220.65:6000/rpc',
  'http://161.97.97.41:6000/rpc',
  'http://192.190.136.36:6000/rpc',
  'http://192.190.136.37:6000/rpc', // NEW - Added from DevRel recommendation
  'http://192.190.136.38:6000/rpc',
  'http://192.190.136.28:6000/rpc',
  'http://192.190.136.29:6000/rpc',
  'http://207.244.255.1:6000/rpc',
];

/**
 * Pod Credits API endpoint
 * Provides credit/reward information for all pNodes
 */
export const POD_CREDITS_API = 'https://podcredits.xandeum.network/api/pods-credits';

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
