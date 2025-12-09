/**
 * Network Intelligence & Event Generation
 * Storage-focused analytics for Xandeum pNodes
 */

import type {
  PNode,
  NetworkStats,
  NetworkEvent,
  RiskAssessment,
  VersionDistribution,
  NetworkHealthBreakdown,
} from '@/types/pnode';
import { formatBytes } from './utils';

/**
 * Generate intelligent insights and events from network data
 * Focus on storage capacity, exabyte scalability, and pNode health
 */
export function generateNetworkEvents(
  stats: NetworkStats,
  nodes: PNode[]
): NetworkEvent[] {
  const events: NetworkEvent[] = [];
  const now = new Date();

  // 1. STORAGE CAPACITY EVENTS (Primary focus for Xandeum)
  const storageUsagePercent = (stats.usedStorage / stats.totalStorage) * 100;
  const availableStorage = stats.totalStorage - stats.usedStorage;

  if (storageUsagePercent > 90) {
    events.push({
      id: 'storage-critical',
      type: 'critical',
      category: 'storage',
      title: 'Storage Capacity Critical',
      message: `Network storage at ${storageUsagePercent.toFixed(1)}%. Only ${formatBytes(availableStorage)} remaining.`,
      timestamp: now,
      metric: 'storage',
      value: storageUsagePercent,
    });
  } else if (storageUsagePercent > 75) {
    events.push({
      id: 'storage-warning',
      type: 'warning',
      category: 'storage',
      title: 'Storage Capacity Warning',
      message: `Network storage at ${storageUsagePercent.toFixed(1)}%. ${formatBytes(availableStorage)} available for Solana dApp data.`,
      timestamp: now,
      metric: 'storage',
      value: storageUsagePercent,
    });
  } else {
    events.push({
      id: 'storage-healthy',
      type: 'success',
      category: 'storage',
      title: 'Healthy Storage Capacity',
      message: `${formatBytes(availableStorage)} available across ${stats.activeNodes} pNodes. Ready for exabyte scale growth.`,
      timestamp: now,
      metric: 'storage',
      value: storageUsagePercent,
    });
  }

  // 2. NETWORK AVAILABILITY
  const availabilityPercent = (stats.activeNodes / stats.totalNodes) * 100;

  if (availabilityPercent === 100) {
    events.push({
      id: 'availability-perfect',
      type: 'success',
      category: 'network',
      title: 'Full Network Availability',
      message: `All ${stats.totalNodes} pNodes are online and serving Solana dApp storage.`,
      timestamp: now,
      metric: 'availability',
      value: 100,
    });
  } else if (availabilityPercent >= 95) {
    events.push({
      id: 'availability-good',
      type: 'success',
      category: 'network',
      title: 'Excellent Network Availability',
      message: `${stats.activeNodes} of ${stats.totalNodes} pNodes online (${availabilityPercent.toFixed(1)}%).`,
      timestamp: now,
      metric: 'availability',
      value: availabilityPercent,
      affectedNodes: stats.inactiveNodes + stats.syncingNodes,
    });
  } else {
    events.push({
      id: 'availability-degraded',
      type: 'warning',
      category: 'network',
      title: 'Degraded Network Availability',
      message: `Only ${stats.activeNodes} of ${stats.totalNodes} pNodes online. Storage redundancy may be affected.`,
      timestamp: now,
      metric: 'availability',
      value: availabilityPercent,
      affectedNodes: stats.inactiveNodes + stats.syncingNodes,
    });
  }

  // 3. VERSION HEALTH (Critical for network upgrades)
  const versionHealth = calculateVersionHealth(nodes);

  if (versionHealth.percentage === 100) {
    events.push({
      id: 'version-excellent',
      type: 'success',
      category: 'version',
      title: 'Excellent Version Health',
      message: `100% of pNodes on latest version (${versionHealth.latestVersion}). Network is fully synchronized.`,
      timestamp: now,
      metric: 'version',
      value: 100,
    });
  } else if (versionHealth.percentage >= 80) {
    events.push({
      id: 'version-good',
      type: 'info',
      category: 'version',
      title: 'Good Version Health',
      message: `${versionHealth.percentage.toFixed(0)}% of pNodes on latest version. ${versionHealth.outdatedCount} nodes need upgrade.`,
      timestamp: now,
      metric: 'version',
      value: versionHealth.percentage,
      affectedNodes: versionHealth.outdatedCount,
    });
  } else {
    events.push({
      id: 'version-warning',
      type: 'warning',
      category: 'version',
      title: 'Version Health Warning',
      message: `Only ${versionHealth.percentage.toFixed(0)}% on latest version. ${versionHealth.outdatedCount} pNodes need immediate upgrade.`,
      timestamp: now,
      metric: 'version',
      value: versionHealth.percentage,
      affectedNodes: versionHealth.outdatedCount,
    });
  }

  // 4. STORAGE SCALING INSIGHTS (Unique to Xandeum)
  const projectedCapacity = stats.totalStorage * 1.5; // Assume 50% growth potential
  const toExabyte = 1024 ** 6; // bytes in exabyte

  if (projectedCapacity >= toExabyte) {
    events.push({
      id: 'exabyte-milestone',
      type: 'success',
      category: 'capacity',
      title: 'Exabyte Milestone Approaching',
      message: `Network on track to reach exabyte scale. Current: ${formatBytes(stats.totalStorage)}, Projected: ${formatBytes(projectedCapacity)}.`,
      timestamp: now,
      metric: 'capacity',
      value: (stats.totalStorage / toExabyte) * 100,
    });
  }

  // 5. PERFORMANCE HEALTH
  if (stats.avgLatency < 100) {
    events.push({
      id: 'performance-excellent',
      type: 'success',
      category: 'performance',
      title: 'Excellent Network Performance',
      message: `Average latency ${stats.avgLatency.toFixed(0)}ms. Fast data access for Solana dApps.`,
      timestamp: now,
      metric: 'latency',
      value: stats.avgLatency,
    });
  } else if (stats.avgLatency > 300) {
    events.push({
      id: 'performance-warning',
      type: 'warning',
      category: 'performance',
      title: 'Performance Degradation Detected',
      message: `Average latency ${stats.avgLatency.toFixed(0)}ms. May impact dApp storage access speed.`,
      timestamp: now,
      metric: 'latency',
      value: stats.avgLatency,
    });
  }

  return events.sort((a, b) => {
    const priority = { critical: 0, warning: 1, success: 2, info: 3 };
    return priority[a.type] - priority[b.type];
  });
}

/**
 * Assess network risk with storage-first approach
 */
export function assessNetworkRisk(nodes: PNode[]): RiskAssessment {
  const atRiskNodes: PNode[] = [];
  const riskCategories = {
    storage: 0,
    uptime: 0,
    version: 0,
    latency: 0,
  };

  const latestVersion = getMostCommonVersion(nodes);

  nodes.forEach(node => {
    let isAtRisk = false;

    // CRITICAL: Node offline (storage unavailable)
    if (node.status === 'inactive') {
      isAtRisk = true;
      riskCategories.uptime++;
    }

    // CRITICAL: Storage nearly full (>95%)
    if (node.storage.usagePercentage > 95) {
      isAtRisk = true;
      riskCategories.storage++;
    }

    // WARNING: Low uptime (<95%)
    if (node.uptime < 95) {
      isAtRisk = true;
      riskCategories.uptime++;
    }

    // WARNING: Outdated version
    if (node.version !== latestVersion) {
      isAtRisk = true;
      riskCategories.version++;
    }

    // WARNING: High latency (>500ms)
    if (node.performance.avgLatency > 500) {
      isAtRisk = true;
      riskCategories.latency++;
    }

    if (isAtRisk) {
      atRiskNodes.push(node);
    }
  });

  const criticalCount = atRiskNodes.filter(
    node => node.status === 'inactive' || node.storage.usagePercentage > 95
  ).length;

  return {
    atRiskCount: atRiskNodes.length,
    atRiskNodes,
    criticalCount,
    warningCount: atRiskNodes.length - criticalCount,
    riskCategories,
  };
}

/**
 * Calculate version health metrics
 */
export function calculateVersionHealth(nodes: PNode[]): {
  latestVersion: string;
  percentage: number;
  outdatedCount: number;
} {
  const latestVersion = getMostCommonVersion(nodes);
  const onLatest = nodes.filter(n => n.version === latestVersion).length;
  const percentage = (onLatest / nodes.length) * 100;

  return {
    latestVersion,
    percentage,
    outdatedCount: nodes.length - onLatest,
  };
}

/**
 * Get version distribution across network
 */
export function getVersionDistribution(nodes: PNode[]): VersionDistribution[] {
  const versionMap = new Map<string, PNode[]>();

  nodes.forEach(node => {
    const existing = versionMap.get(node.version) || [];
    versionMap.set(node.version, [...existing, node]);
  });

  const latestVersion = getMostCommonVersion(nodes);
  const distribution: VersionDistribution[] = [];

  versionMap.forEach((nodeList, version) => {
    distribution.push({
      version,
      count: nodeList.length,
      percentage: (nodeList.length / nodes.length) * 100,
      isLatest: version === latestVersion,
      nodes: nodeList,
    });
  });

  return distribution.sort((a, b) => b.count - a.count);
}

/**
 * Calculate comprehensive network health breakdown
 * Weighted scoring: Storage (30%), Availability (30%), Version (25%), Distribution (15%)
 */
export function calculateNetworkHealth(
  stats: NetworkStats,
  nodes: PNode[]
): NetworkHealthBreakdown {
  // Availability score (0-100)
  const availability = (stats.activeNodes / stats.totalNodes) * 100;

  // Version health score (0-100)
  const versionHealth = calculateVersionHealth(nodes).percentage;

  // Distribution score (geographic diversity, 0-100)
  const uniqueCountries = new Set(nodes.map(n => n.location.country)).size;
  const distribution = Math.min((uniqueCountries / nodes.length) * 200, 100);

  // Storage health score (optimal at 60-80% usage)
  const storageUsage = (stats.usedStorage / stats.totalStorage) * 100;
  const storageHealth = storageUsage > 95 ? 30 :
                        storageUsage > 85 ? 60 :
                        storageUsage >= 60 ? 100 :
                        storageUsage >= 40 ? 80 :
                        50; // Too empty might indicate underutilization

  // Weighted total (Storage-focused for Xandeum)
  const totalScore =
    (storageHealth * 0.30) +
    (availability * 0.30) +
    (versionHealth * 0.25) +
    (distribution * 0.15);

  return {
    availability,
    versionHealth,
    distribution,
    storageHealth,
    totalScore: Math.round(totalScore),
  };
}

/**
 * Helper: Get most common version (assumed latest)
 */
export function getMostCommonVersion(nodes: PNode[]): string {
  const versionCounts = nodes.reduce((acc, node) => {
    acc[node.version] = (acc[node.version] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  return Object.entries(versionCounts)
    .sort(([, a], [, b]) => b - a)[0]?.[0] || 'unknown';
}
