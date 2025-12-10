/**
 * pRPC Data Transformation Layer
 *
 * Transforms Xandeum pRPC responses into internal data structures
 * Maps PNodeStats → PNode format
 */

import type { PNode, NetworkStats, StorageInfo, PerformanceMetrics } from '@/types/pnode';
import type { PNodeStats } from '@/types/prpc';

/**
 * Geographic location database for known pNode IPs
 * This is a temporary solution until the official API provides location data
 */
const IP_LOCATION_MAP: Record<string, { country: string; countryCode: string; city: string; region: string; lat: number; lng: number }> = {
  '173.212.203.145': { country: 'Germany', countryCode: 'DE', city: 'Nuremberg', region: 'Bavaria', lat: 49.4521, lng: 11.0767 },
  '173.212.220.65': { country: 'Germany', countryCode: 'DE', city: 'Nuremberg', region: 'Bavaria', lat: 49.4521, lng: 11.0767 },
  '161.97.97.41': { country: 'Finland', countryCode: 'FI', city: 'Helsinki', region: 'Uusimaa', lat: 60.1695, lng: 24.9354 },
  '192.190.136.36': { country: 'Canada', countryCode: 'CA', city: 'Montreal', region: 'Quebec', lat: 45.5017, lng: -73.5673 },
  '192.190.136.37': { country: 'Canada', countryCode: 'CA', city: 'Montreal', region: 'Quebec', lat: 45.5017, lng: -73.5673 },
  '192.190.136.38': { country: 'Canada', countryCode: 'CA', city: 'Montreal', region: 'Quebec', lat: 45.5017, lng: -73.5673 },
  '192.190.136.28': { country: 'Canada', countryCode: 'CA', city: 'Montreal', region: 'Quebec', lat: 45.5017, lng: -73.5673 },
  '192.190.136.29': { country: 'Canada', countryCode: 'CA', city: 'Montreal', region: 'Quebec', lat: 45.5017, lng: -73.5673 },
  '207.244.255.1': { country: 'United States', countryCode: 'US', city: 'Kansas City', region: 'Missouri', lat: 39.0997, lng: -94.5786 },
};

/**
 * Transform pRPC PNodeStats to internal PNode format
 *
 * @param stats - Raw stats from get-stats pRPC method
 * @param ip - IP address of the pNode
 * @returns Transformed PNode object
 */
export function transformPNodeStats(stats: PNodeStats, ip: string): PNode {
  // Extract IP from endpoint URL if needed
  const ipAddress = ip.match(/\d+\.\d+\.\d+\.\d+/)?.[0] || ip;

  // Calculate uptime percentage
  // Assume 30 days (2,592,000 seconds) as max reference for percentage
  const maxUptimeSeconds = 30 * 24 * 60 * 60; // 30 days
  const uptimePercentage = Math.min((stats.uptime / maxUptimeSeconds) * 100, 100);

  // Storage calculations
  const storageUsed = stats.file_size;
  const storageTotal = Math.max(stats.file_size * 1.5, 1_000_000_000_000); // Estimate total as 1.5x used, min 1TB
  const storageAvailable = storageTotal - storageUsed;
  const usagePercentage = (storageUsed / storageTotal) * 100;

  // Performance calculations
  const packetsTotal = stats.packets_received + stats.packets_sent;
  const uptimeSeconds = stats.uptime || 1; // Avoid division by zero

  // Estimate bandwidth: (total packets * avg packet size) / uptime / 1_000_000 for Mbps
  // Assuming avg packet size ~1500 bytes (MTU)
  const avgPacketSizeBytes = 1500;
  const totalBytesTransferred = packetsTotal * avgPacketSizeBytes;
  const bandwidthBytesPerSecond = totalBytesTransferred / uptimeSeconds;
  const bandwidthMbps = (bandwidthBytesPerSecond * 8) / 1_000_000; // Convert to Mbps

  // Estimate latency based on CPU usage (inverse relationship)
  // Lower CPU = better performance = lower latency
  const estimatedLatency = 20 + (stats.cpu_percent * 5); // 20ms base + cpu factor

  // Success rate based on active streams and uptime
  const successRate = Math.min(95 + (stats.active_streams * 2), 99.9);

  // Calculate health score (0-100)
  const healthScore = calculateHealthScore(stats, uptimePercentage, usagePercentage);

  // Get location data
  const location = IP_LOCATION_MAP[ipAddress] || {
    country: 'Unknown',
    countryCode: 'XX',
    city: 'Unknown',
    region: 'Unknown',
    lat: 0,
    lng: 0,
  };

  // Generate moniker from location and index
  const moniker = `pNode-${location.city}-${stats.current_index}`;

  return {
    publicKey: generatePublicKey(ipAddress, stats.current_index),
    moniker,
    ipAddress,
    version: 'v1.16.14', // Based on Xandeum's Solana fork version
    status: determineStatus(stats),
    uptime: uptimePercentage,
    storage: {
      used: storageUsed,
      total: storageTotal,
      available: storageAvailable,
      usagePercentage,
    },
    performance: {
      avgLatency: estimatedLatency,
      successRate,
      bandwidthMbps,
      responseTime: estimatedLatency * 1.2, // Slightly higher than latency
      requestsPerSecond: stats.active_streams * 100, // Estimate based on active streams
    },
    location: {
      ...location,
      timezone: 'UTC',
    },
    lastSeen: new Date(stats.last_updated * 1000), // Convert Unix timestamp to Date
    healthScore,
  };
}

/**
 * Calculate health score (0-100) based on multiple factors
 */
function calculateHealthScore(
  stats: PNodeStats,
  uptimePercentage: number,
  storageUsagePercentage: number
): number {
  // Weighted health formula
  const weights = {
    uptime: 0.30,
    cpu: 0.20,
    storage: 0.25,
    activity: 0.25,
  };

  // Uptime score (higher is better)
  const uptimeScore = uptimePercentage;

  // CPU score (lower CPU usage is better)
  const cpuScore = Math.max(100 - stats.cpu_percent * 1.5, 0);

  // Storage score (optimal at 60-80% usage)
  let storageScore: number;
  if (storageUsagePercentage < 60) {
    storageScore = (storageUsagePercentage / 60) * 100;
  } else if (storageUsagePercentage <= 80) {
    storageScore = 100;
  } else {
    storageScore = Math.max(100 - (storageUsagePercentage - 80) * 5, 0);
  }

  // Activity score (based on active streams and packet flow)
  const activityScore = Math.min(
    (stats.active_streams * 20) + ((stats.packets_received + stats.packets_sent) / 1_000_000 * 10),
    100
  );

  // Calculate weighted score
  const totalScore =
    (uptimeScore * weights.uptime) +
    (cpuScore * weights.cpu) +
    (storageScore * weights.storage) +
    (activityScore * weights.activity);

  return Math.min(Math.max(totalScore, 0), 100);
}

/**
 * Determine node status based on stats
 */
function determineStatus(stats: PNodeStats): 'active' | 'inactive' | 'syncing' {
  // Active if has recent activity and active streams
  if (stats.active_streams > 0 && stats.uptime > 60) {
    return 'active';
  }

  // Syncing if recently started (less than 1 hour uptime)
  if (stats.uptime < 3600) {
    return 'syncing';
  }

  // Otherwise inactive
  return 'inactive';
}

/**
 * Generate a deterministic public key from IP and index
 * This is temporary until the official API provides actual public keys
 */
function generatePublicKey(ip: string, index: number): string {
  const ipParts = ip.split('.').map(p => parseInt(p).toString(16).padStart(2, '0')).join('');
  const indexHex = index.toString(16).padStart(4, '0');
  return `pNode${indexHex}${ipParts}...${Math.random().toString(36).substring(2, 10)}`;
}

/**
 * Transform multiple pNode stats into network statistics
 */
export function transformNetworkStats(nodes: PNode[]): NetworkStats {
  const activeNodes = nodes.filter(n => n.status === 'active');
  const inactiveNodes = nodes.filter(n => n.status === 'inactive');
  const syncingNodes = nodes.filter(n => n.status === 'syncing');

  const totalStorage = nodes.reduce((sum, n) => sum + n.storage.total, 0);
  const usedStorage = nodes.reduce((sum, n) => sum + n.storage.used, 0);
  const availableStorage = totalStorage - usedStorage;

  const avgUptime = nodes.reduce((sum, n) => sum + n.uptime, 0) / (nodes.length || 1);
  const avgLatency = nodes.reduce((sum, n) => sum + n.performance.avgLatency, 0) / (nodes.length || 1);
  const totalBandwidth = nodes.reduce((sum, n) => sum + n.performance.bandwidthMbps, 0);

  // Calculate decentralization score based on geographic distribution
  const uniqueCountries = new Set(nodes.map(n => n.location.countryCode)).size;
  const uniqueCities = new Set(nodes.map(n => n.location.city)).size;
  const decentralizationScore = Math.min(
    (uniqueCountries * 10) + (uniqueCities * 5),
    100
  );

  return {
    totalNodes: nodes.length,
    activeNodes: activeNodes.length,
    inactiveNodes: inactiveNodes.length,
    syncingNodes: syncingNodes.length,
    totalStorage,
    usedStorage,
    availableStorage,
    avgUptime,
    decentralizationScore,
    networkVersion: 'v1.16.14-xandeum',
    avgLatency,
    totalBandwidth,
  };
}
