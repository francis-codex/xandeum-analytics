/**
 * Xandeum pRPC Type Definitions
 *
 * Based on official Xandeum pRPC API
 * Reference: https://docs.xandeum.network/api/pnode-rpc-prpc-reference
 *
 * Protocol: JSON-RPC 2.0
 * Endpoint Pattern: http://<pnode-ip>:6000/rpc
 */

/**
 * Standard JSON-RPC 2.0 request structure
 */
export interface JsonRpcRequest<T = unknown> {
  jsonrpc: '2.0';
  id: number | string;
  method: string;
  params?: T;
}

/**
 * Standard JSON-RPC 2.0 response structure
 */
export interface JsonRpcResponse<T = unknown> {
  jsonrpc: '2.0';
  id: number | string;
  result?: T;
  error?: JsonRpcError | null;
}

/**
 * JSON-RPC error object
 */
export interface JsonRpcError {
  code: number;
  message: string;
  data?: unknown;
}

/**
 * pNode Statistics
 * Returned by the "get-stats" method
 *
 * @example
 * {
 *   "active_streams": 2,
 *   "cpu_percent": 5.74,
 *   "current_index": 14,
 *   "file_size": 558000000000,
 *   "last_updated": 1764953798,
 *   "packets_received": 1425698,
 *   "packets_sent": 1489846,
 *   "ram_total": 12567232512,
 *   "ram_used": 6943084544,
 *   "total_bytes": 94633,
 *   "total_pages": 0,
 *   "uptime": 38575
 * }
 */
export interface PNodeStats {
  /** Number of active data streams */
  active_streams: number;

  /** CPU usage percentage (0-100) */
  cpu_percent: number;

  /** Current index position */
  current_index: number;

  /** Total file/storage size in bytes */
  file_size: number;

  /** Unix timestamp of last update */
  last_updated: number;

  /** Total packets received */
  packets_received: number;

  /** Total packets sent */
  packets_sent: number;

  /** Total RAM capacity in bytes */
  ram_total: number;

  /** Used RAM in bytes */
  ram_used: number;

  /** Total bytes processed */
  total_bytes: number;

  /** Total pages */
  total_pages: number;

  /** Uptime in seconds */
  uptime: number;
}

/**
 * All pNodes list (structure TBD - coming from Xandeum team)
 * This will be updated when the official API is released
 */
export interface AllPNodesResponse {
  nodes: PNodeInfo[];
  total_count: number;
  timestamp: number;
}

/**
 * Individual pNode information (estimated structure)
 * Will be updated when official API documentation is available
 */
export interface PNodeInfo {
  /** pNode public key or identifier */
  pubkey: string;

  /** IP address */
  ip: string;

  /** RPC port (default: 6000) */
  port: number;

  /** Node statistics */
  stats: PNodeStats;

  /** Geographic location (if available) */
  location?: {
    country?: string;
    city?: string;
    region?: string;
  };

  /** Node status */
  status: 'active' | 'inactive' | 'syncing';

  /** Node version */
  version?: string;
}

/**
 * Retry configuration for failed requests
 */
export interface RetryConfig {
  /** Maximum number of retry attempts */
  maxRetries: number;

  /** Initial delay in milliseconds */
  initialDelayMs: number;

  /** Maximum delay in milliseconds */
  maxDelayMs: number;

  /** Exponential backoff multiplier */
  backoffMultiplier: number;

  /** HTTP status codes that should trigger a retry */
  retryableStatusCodes: number[];
}

/**
 * pRPC client configuration
 */
export interface PRpcClientConfig {
  /** List of pNode endpoints to load balance across */
  endpoints: string[];

  /** Request timeout in milliseconds */
  timeout: number;

  /** Retry configuration */
  retry: RetryConfig;

  /** Custom headers */
  headers?: Record<string, string>;

  /** Enable request/response logging */
  enableLogging?: boolean;
}

/**
 * Pod information from get-pods-with-stats
 * Response structure from v0.7.0+
 */
export interface PodWithStats {
  /** IP address and port of the pod */
  address: string;

  /** Whether the pod is publicly accessible (can be null) */
  is_public: boolean | null;

  /** Unix timestamp when pod was last seen (can be null) */
  last_seen_timestamp: number | null;

  /** Public key of the pod (can be null for some nodes) */
  pubkey: string | null;

  /** RPC port number */
  rpc_port: number;

  /** Storage committed in bytes */
  storage_committed: number;

  /** Storage usage percentage (0-100) */
  storage_usage_percent: number;

  /** Storage used in bytes */
  storage_used: number;

  /** Uptime in seconds */
  uptime: number;

  /** Pod version string (can be null) */
  version: string | null;
}

/**
 * Response from get-pods-with-stats method
 */
export interface GetPodsWithStatsResponse {
  pods: PodWithStats[];
}

/**
 * Pod credits data from credits API
 */
export interface PodCredits {
  pubkey: string;
  credits: number;
  last_updated?: number;
}

/**
 * Available pRPC methods
 */
export enum PRpcMethod {
  /** Get statistics for a single pNode */
  GET_STATS = 'get-stats',

  /** Get all pNodes with statistics (v0.7.0+) */
  GET_PODS_WITH_STATS = 'get-pods-with-stats',

  /** Get all pNodes (deprecated - use GET_PODS_WITH_STATS) */
  GET_ALL_PNODES = 'get-all-pnodes',
}
