/**
 * Data Export Utilities
 * Export network and node data to CSV/JSON formats
 */

import type { PNode, NetworkStats } from "@/types/pnode";
import { formatBytes } from "./utils";

/**
 * Export pNodes to CSV format
 */
export function exportNodesToCSV(nodes: PNode[]): void {
  const headers = [
    'Public Key',
    'Moniker',
    'Status',
    'Version',
    'Uptime (%)',
    'Health Score',
    'Location',
    'Country',
    'Storage Used (GB)',
    'Storage Total (GB)',
    'Storage Usage (%)',
    'Avg Latency (ms)',
    'Success Rate (%)',
    'Bandwidth (Mbps)',
    'Last Seen',
    'IP Address',
  ];

  const rows = nodes.map(node => [
    node.publicKey,
    node.moniker,
    node.status,
    node.version,
    node.uptime.toFixed(2),
    node.healthScore?.toFixed(1) || 'N/A',
    `${node.location.city}, ${node.location.region}`,
    node.location.country,
    (node.storage.used / (1024 ** 3)).toFixed(2),
    (node.storage.total / (1024 ** 3)).toFixed(2),
    node.storage.usagePercentage.toFixed(2),
    node.performance.avgLatency.toFixed(0),
    node.performance.successRate.toFixed(2),
    node.performance.bandwidthMbps.toFixed(0),
    node.lastSeen.toISOString(),
    node.ipAddress,
  ]);

  const csv = [
    headers.join(','),
    ...rows.map(row => row.map(cell => `"${cell}"`).join(',')),
  ].join('\n');

  const timestamp = new Date().toISOString().split('T')[0];
  downloadFile(csv, `xandeum-pnodes-${timestamp}.csv`, 'text/csv');
}

/**
 * Export complete network data to JSON
 */
export function exportNetworkToJSON(data: {
  nodes: PNode[];
  stats: NetworkStats;
  exportDate?: Date;
}): void {
  const exportData = {
    exportDate: data.exportDate || new Date(),
    networkStats: data.stats,
    nodes: data.nodes.map(node => ({
      ...node,
      // Convert dates to ISO strings for JSON
      lastSeen: node.lastSeen.toISOString(),
    })),
    metadata: {
      totalNodes: data.nodes.length,
      exportedBy: 'Xandeum pNode Analytics Platform',
      version: '1.0.0',
    },
  };

  const json = JSON.stringify(exportData, null, 2);
  const timestamp = new Date().toISOString().split('T')[0];
  downloadFile(json, `xandeum-network-data-${timestamp}.json`, 'application/json');
}

/**
 * Export filtered nodes based on criteria
 */
export function exportFilteredNodesCSV(
  nodes: PNode[],
  filter: {
    status?: 'active' | 'inactive' | 'syncing';
    version?: string;
    minHealthScore?: number;
  }
): void {
  let filtered = nodes;

  if (filter.status) {
    filtered = filtered.filter(n => n.status === filter.status);
  }

  if (filter.version) {
    filtered = filtered.filter(n => n.version === filter.version);
  }

  if (filter.minHealthScore !== undefined) {
    const minScore = filter.minHealthScore;
    filtered = filtered.filter(n => (n.healthScore || 0) >= minScore);
  }

  exportNodesToCSV(filtered);
}

/**
 * Export network summary report
 */
export function exportNetworkSummary(stats: NetworkStats, nodes: PNode[]): void {
  const summary = {
    'Report Date': new Date().toISOString(),
    'Network Version': stats.networkVersion,
    'Total Nodes': stats.totalNodes,
    'Active Nodes': stats.activeNodes,
    'Inactive Nodes': stats.inactiveNodes,
    'Syncing Nodes': stats.syncingNodes,
    'Total Storage': formatBytes(stats.totalStorage),
    'Used Storage': formatBytes(stats.usedStorage),
    'Available Storage': formatBytes(stats.availableStorage),
    'Storage Usage': `${((stats.usedStorage / stats.totalStorage) * 100).toFixed(2)}%`,
    'Average Uptime': `${stats.avgUptime.toFixed(2)}%`,
    'Average Latency': `${stats.avgLatency.toFixed(0)}ms`,
    'Total Bandwidth': `${stats.totalBandwidth.toFixed(0)} Mbps`,
    'Decentralization Score': `${stats.decentralizationScore.toFixed(1)}/100`,
    'Unique Countries': new Set(nodes.map(n => n.location.country)).size,
  };

  const csv = [
    'Metric,Value',
    ...Object.entries(summary).map(([key, value]) => `"${key}","${value}"`),
  ].join('\n');

  const timestamp = new Date().toISOString().split('T')[0];
  downloadFile(csv, `xandeum-network-summary-${timestamp}.csv`, 'text/csv');
}

/**
 * Export node performance comparison
 */
export function exportNodeComparison(nodes: PNode[]): void {
  const headers = [
    'Moniker',
    'Version',
    'Uptime',
    'Storage Used',
    'Storage Total',
    'Health Score',
    'Latency',
    'Success Rate',
    'Location',
  ];

  const rows = nodes.map(node => [
    node.moniker,
    node.version,
    `${node.uptime.toFixed(2)}%`,
    formatBytes(node.storage.used),
    formatBytes(node.storage.total),
    node.healthScore?.toFixed(1) || 'N/A',
    `${node.performance.avgLatency.toFixed(0)}ms`,
    `${node.performance.successRate.toFixed(2)}%`,
    `${node.location.city}, ${node.location.countryCode}`,
  ]);

  const csv = [
    headers.join(','),
    ...rows.map(row => row.map(cell => `"${cell}"`).join(',')),
  ].join('\n');

  const timestamp = new Date().toISOString().split('T')[0];
  downloadFile(csv, `xandeum-node-comparison-${timestamp}.csv`, 'text/csv');
}

/**
 * Helper function to trigger file download
 */
function downloadFile(content: string, filename: string, mimeType: string): void {
  const blob = new Blob([content], { type: mimeType });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

/**
 * Format data for clipboard copy
 */
export function copyToClipboard(data: string): Promise<void> {
  return navigator.clipboard.writeText(data);
}

/**
 * Generate shareable network status text
 */
export function generateStatusText(stats: NetworkStats): string {
  const storageUsage = ((stats.usedStorage / stats.totalStorage) * 100).toFixed(1);

  return `Xandeum Network Status
━━━━━━━━━━━━━━━━━━━━━━
Nodes: ${stats.activeNodes}/${stats.totalNodes} active
Storage: ${formatBytes(stats.usedStorage)} / ${formatBytes(stats.totalStorage)} (${storageUsage}%)
Uptime: ${stats.avgUptime.toFixed(2)}%
Network: v${stats.networkVersion}
Decentralization: ${stats.decentralizationScore.toFixed(1)}/100

Generated by Xandeum pNode Analytics
${new Date().toLocaleString()}`;
}
