/**
 * Xandeum pRPC Client
 *
 * Production-ready client for querying Xandeum pNode network
 * with retry logic, load balancing, and graceful fallback
 *
 * Reference: https://docs.xandeum.network/api/pnode-rpc-prpc-reference
 */

import axios from 'axios';
import type {
  PNode,
  NetworkStats,
  PNodeMetrics,
} from '@/types/pnode';
import type {
  JsonRpcRequest,
  JsonRpcResponse,
  PNodeStats,
} from '@/types/prpc';
import { PRpcMethod } from '@/types/prpc';
import { getPRpcConfig } from './prpc-config';
import { withRetry, RetryableError } from './retry-util';
import { transformPNodeStats, transformNetworkStats } from './prpc-transformer';

/**
 * pRPC Client for Xandeum pNode Network
 */
export class PNodeClient {
  private config = getPRpcConfig();
  private currentEndpointIndex = 0;
  private requestIdCounter = 0;

  /**
   * Get the next endpoint in round-robin fashion
   */
  private getNextEndpoint(): string {
    const endpoint = this.config.endpoints[this.currentEndpointIndex];
    this.currentEndpointIndex = (this.currentEndpointIndex + 1) % this.config.endpoints.length;
    return endpoint;
  }

  /**
   * Extract IP address from endpoint URL
   */
  private extractIp(endpoint: string): string {
    return endpoint.match(/\d+\.\d+\.\d+\.\d+/)?.[0] || endpoint;
  }

  /**
   * Make a JSON-RPC 2.0 request to a pNode via our API proxy
   * This avoids ERR_UNSAFE_PORT errors when browsers block port 6000
   */
  private async makeRpcRequest<T>(
    method: PRpcMethod | string,
    params?: any,
    specificEndpoint?: string
  ): Promise<T> {
    const endpoint = specificEndpoint || this.getNextEndpoint();

    const request: JsonRpcRequest = {
      jsonrpc: '2.0',
      id: ++this.requestIdCounter,
      method,
      params,
    };

    if (this.config.enableLogging) {
      console.log(`[pRPC] → ${method} via proxy (target: ${this.extractIp(endpoint)})`);
    }

    try {
      const response = await withRetry(
        async () => {
          // Use our API proxy route instead of direct connection
          // This bypasses browser security restrictions on port 6000
          const proxyUrl = `/api/prpc?endpoint=${encodeURIComponent(endpoint)}`;

          const axiosResponse = await axios.post<JsonRpcResponse<T>>(
            proxyUrl,
            request,
            {
              timeout: this.config.timeout,
              headers: {
                'Content-Type': 'application/json',
              },
            }
          );

          // Check for JSON-RPC errors in response
          if (axiosResponse.data.error) {
            throw new RetryableError(
              `pRPC Error: ${axiosResponse.data.error.message}`,
              new Error(JSON.stringify(axiosResponse.data.error))
            );
          }

          return axiosResponse;
        },
        this.config.retry
      );

      if (this.config.enableLogging) {
        console.log(`[pRPC] ✓ ${method} succeeded`);
      }

      if (!response.data.result) {
        throw new Error('pRPC response missing result field');
      }

      return response.data.result;
    } catch (error) {
      if (this.config.enableLogging) {
        console.warn(`[pRPC] ✗ ${method} failed:`, error instanceof Error ? error.message : error);
      }
      throw error;
    }
  }

  /**
   * Get statistics for a specific pNode
   */
  private async getPNodeStats(endpoint: string): Promise<PNode> {
    try {
      const stats = await this.makeRpcRequest<PNodeStats>(
        PRpcMethod.GET_STATS,
        undefined,
        endpoint
      );

      const ip = this.extractIp(endpoint);
      return transformPNodeStats(stats, ip);
    } catch (error) {
      throw new Error(
        `Failed to get stats from ${endpoint}: ${error instanceof Error ? error.message : 'Unknown error'}`
      );
    }
  }

  /**
   * Get all pNodes from the network
   * Queries each known pNode endpoint and aggregates results
   */
  async getAllPNodes(): Promise<PNode[]> {
    try {
      console.info('[pRPC] Fetching all pNodes from network...');

      // Query all endpoints in parallel
      const results = await Promise.allSettled(
        this.config.endpoints.map(endpoint =>
          this.getPNodeStats(endpoint)
        )
      );

      // Extract successful results
      const pnodes = results
        .filter((result): result is PromiseFulfilledResult<PNode> =>
          result.status === 'fulfilled'
        )
        .map(result => result.value);

      // Log failures
      const failures = results.filter(result => result.status === 'rejected');
      if (failures.length > 0 && this.config.enableLogging) {
        console.warn(`[pRPC] ${failures.length}/${this.config.endpoints.length} endpoints failed`);
      }

      if (pnodes.length === 0) {
        throw new Error('All pNode endpoints failed to respond');
      }

      console.info(`[pRPC] ✓ Successfully fetched ${pnodes.length} pNodes`);
      return pnodes;
    } catch (error) {
      // Fallback to mock data in development
      if (process.env.NODE_ENV === 'development') {
        console.info('ℹ️ Using mock pNode data (pRPC query failed)');
        return this.getMockPNodes();
      }

      console.error('Error fetching all pNodes:', error);
      throw error;
    }
  }

  /**
   * Get details for a specific pNode by public key or IP
   */
  async getPNodeDetails(identifier: string): Promise<PNode | null> {
    try {
      // Try to find endpoint by IP
      const endpoint = this.config.endpoints.find(e => e.includes(identifier));

      if (endpoint) {
        return await this.getPNodeStats(endpoint);
      }

      // If not found, try to find by public key from all nodes
      const allNodes = await this.getAllPNodes();
      return allNodes.find(node =>
        node.publicKey === identifier ||
        node.ipAddress === identifier
      ) || null;
    } catch (error) {
      // Fallback to mock data
      if (process.env.NODE_ENV === 'development') {
        const mockNodes = this.getMockPNodes();
        return mockNodes.find(node =>
          node.publicKey === identifier ||
          node.ipAddress === identifier
        ) || null;
      }

      console.error(`Error fetching pNode details for ${identifier}:`, error);
      return null;
    }
  }

  /**
   * Get historical metrics for a specific pNode
   * Note: This is not yet available in the pRPC API
   * Returns mock data for now
   */
  async getPNodeMetrics(
    publicKey: string,
    timeframe: '24h' | '7d' | '30d' | '90d' = '24h'
  ): Promise<PNodeMetrics | null> {
    // TODO: Implement when Xandeum team releases historical metrics API
    if (process.env.NODE_ENV === 'development') {
      console.info('ℹ️ Historical metrics not yet available in pRPC - using mock data');
    }

    return this.getMockMetrics(publicKey, timeframe);
  }

  /**
   * Get network-wide statistics
   * Aggregates data from all pNodes
   */
  async getNetworkStats(): Promise<NetworkStats> {
    try {
      console.info('[pRPC] Calculating network statistics...');

      const allNodes = await this.getAllPNodes();
      const networkStats = transformNetworkStats(allNodes);

      console.info('[pRPC] ✓ Network stats calculated');
      return networkStats;
    } catch (error) {
      // Fallback to mock data in development
      if (process.env.NODE_ENV === 'development') {
        console.info('ℹ️ Using mock network stats (pRPC query failed)');
        return this.getMockNetworkStats();
      }

      console.error('Error fetching network stats:', error);
      throw error;
    }
  }

  /**
   * Search pNodes by moniker or public key
   */
  async searchPNodes(query: string): Promise<PNode[]> {
    try {
      const allNodes = await this.getAllPNodes();
      const lowercaseQuery = query.toLowerCase();

      return allNodes.filter(node =>
        node.moniker.toLowerCase().includes(lowercaseQuery) ||
        node.publicKey.toLowerCase().includes(lowercaseQuery) ||
        node.ipAddress.includes(lowercaseQuery)
      );
    } catch (error) {
      console.error('Error searching pNodes:', error);
      return [];
    }
  }

  /**
   * Get pNodes by status
   */
  async getPNodesByStatus(status: 'active' | 'inactive' | 'syncing'): Promise<PNode[]> {
    try {
      const allNodes = await this.getAllPNodes();
      return allNodes.filter(node => node.status === status);
    } catch (error) {
      console.error(`Error fetching ${status} pNodes:`, error);
      return [];
    }
  }

  /**
   * Health check - test connectivity to pNode network
   */
  async healthCheck(): Promise<{
    healthy: boolean;
    availableEndpoints: number;
    totalEndpoints: number;
    responseTime: number;
  }> {
    const startTime = Date.now();

    const results = await Promise.allSettled(
      this.config.endpoints.map(async endpoint => {
        try {
          await this.makeRpcRequest<PNodeStats>(
            PRpcMethod.GET_STATS,
            undefined,
            endpoint
          );
          return true;
        } catch {
          return false;
        }
      })
    );

    const availableEndpoints = results.filter(
      r => r.status === 'fulfilled' && r.value
    ).length;

    return {
      healthy: availableEndpoints > 0,
      availableEndpoints,
      totalEndpoints: this.config.endpoints.length,
      responseTime: Date.now() - startTime,
    };
  }

  // ===========================================
  // Mock Data Generators (Fallback)
  // ===========================================

  private getMockPNodes(): PNode[] {
    const mockNodes: PNode[] = [];
    const countries = [
      { country: 'United States', countryCode: 'US', city: 'New York', lat: 40.7128, lng: -74.0060 },
      { country: 'Germany', countryCode: 'DE', city: 'Berlin', lat: 52.5200, lng: 13.4050 },
      { country: 'Singapore', countryCode: 'SG', city: 'Singapore', lat: 1.3521, lng: 103.8198 },
      { country: 'Japan', countryCode: 'JP', city: 'Tokyo', lat: 35.6762, lng: 139.6503 },
      { country: 'United Kingdom', countryCode: 'GB', city: 'London', lat: 51.5074, lng: -0.1278 },
      { country: 'Canada', countryCode: 'CA', city: 'Toronto', lat: 43.6532, lng: -79.3832 },
      { country: 'Australia', countryCode: 'AU', city: 'Sydney', lat: -33.8688, lng: 151.2093 },
      { country: 'France', countryCode: 'FR', city: 'Paris', lat: 48.8566, lng: 2.3522 },
    ];

    for (let i = 0; i < 50; i++) {
      const location = countries[i % countries.length];
      const uptime = 90 + Math.random() * 10;
      const successRate = 95 + Math.random() * 5;
      const storageUsed = Math.random() * 100 * 1024 * 1024 * 1024 * 1024; // TB
      const storageTotal = 200 * 1024 * 1024 * 1024 * 1024; // 200 TB

      mockNodes.push({
        publicKey: `pNode${i.toString().padStart(4, '0')}...${Math.random().toString(36).substring(2, 10)}`,
        moniker: `pNode-${location.city}-${i + 1}`,
        ipAddress: `${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}`,
        version: `v${Math.floor(Math.random() * 3) + 1}.${Math.floor(Math.random() * 10)}.${Math.floor(Math.random() * 10)}`,
        status: Math.random() > 0.1 ? 'active' : (Math.random() > 0.5 ? 'syncing' : 'inactive'),
        uptime,
        storage: {
          used: storageUsed,
          total: storageTotal,
          available: storageTotal - storageUsed,
          usagePercentage: (storageUsed / storageTotal) * 100,
        },
        performance: {
          avgLatency: 50 + Math.random() * 200,
          successRate,
          bandwidthMbps: 100 + Math.random() * 900,
          responseTime: 20 + Math.random() * 180,
          requestsPerSecond: Math.floor(Math.random() * 1000),
        },
        location: {
          ...location,
          region: location.city,
          timezone: 'UTC',
        },
        lastSeen: new Date(Date.now() - Math.random() * 3600000),
        stakingInfo: {
          staked: Math.floor(Math.random() * 1000000),
          weight: Math.random() * 5,
          rewards: Math.floor(Math.random() * 10000),
          delegators: Math.floor(Math.random() * 100),
        },
        healthScore: (uptime * 0.4 + successRate * 0.6),
      });
    }

    return mockNodes;
  }

  private getMockNetworkStats(): NetworkStats {
    const mockNodes = this.getMockPNodes();
    const activeNodes = mockNodes.filter(n => n.status === 'active').length;
    const totalStorage = mockNodes.reduce((sum, n) => sum + n.storage.total, 0);
    const usedStorage = mockNodes.reduce((sum, n) => sum + n.storage.used, 0);
    const avgUptime = mockNodes.reduce((sum, n) => sum + n.uptime, 0) / mockNodes.length;

    return {
      totalNodes: mockNodes.length,
      activeNodes,
      inactiveNodes: mockNodes.filter(n => n.status === 'inactive').length,
      syncingNodes: mockNodes.filter(n => n.status === 'syncing').length,
      totalStorage,
      usedStorage,
      availableStorage: totalStorage - usedStorage,
      avgUptime,
      decentralizationScore: 75 + Math.random() * 20,
      networkVersion: 'v1.16.14-xandeum',
      avgLatency: mockNodes.reduce((sum, n) => sum + n.performance.avgLatency, 0) / mockNodes.length,
      totalBandwidth: mockNodes.reduce((sum, n) => sum + n.performance.bandwidthMbps, 0),
    };
  }

  private getMockMetrics(publicKey: string, timeframe: string): PNodeMetrics {
    const points = timeframe === '24h' ? 24 : (timeframe === '7d' ? 168 : 720);
    const now = Date.now();

    return {
      publicKey,
      timeframe: timeframe as '24h' | '7d' | '30d' | '90d',
      metrics: {
        uptime: Array.from({ length: points }, (_, i) => ({
          timestamp: new Date(now - (points - i) * 3600000),
          value: 95 + Math.random() * 5,
          metric: 'uptime',
        })),
        storage: Array.from({ length: points }, (_, i) => ({
          timestamp: new Date(now - (points - i) * 3600000),
          value: (50 + i * 0.1 + Math.random() * 5) * 1024 * 1024 * 1024 * 1024,
          metric: 'storage',
        })),
        latency: Array.from({ length: points }, (_, i) => ({
          timestamp: new Date(now - (points - i) * 3600000),
          value: 50 + Math.random() * 150,
          metric: 'latency',
        })),
        bandwidth: Array.from({ length: points }, (_, i) => ({
          timestamp: new Date(now - (points - i) * 3600000),
          value: 500 + Math.random() * 500,
          metric: 'bandwidth',
        })),
      },
    };
  }
}

// Singleton instance
let clientInstance: PNodeClient | null = null;

/**
 * Get or create PNodeClient singleton instance
 */
export function getPNodeClient(): PNodeClient {
  if (!clientInstance) {
    clientInstance = new PNodeClient();
  }
  return clientInstance;
}

export default PNodeClient;
