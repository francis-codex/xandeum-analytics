/**
 * Core TypeScript interfaces for Xandeum pNode data structures
 */

export interface PNode {
  publicKey: string;
  moniker: string;
  ipAddress: string;
  version: string;
  status: 'active' | 'inactive' | 'syncing';
  uptime: number; // percentage
  storage: StorageInfo;
  performance: PerformanceMetrics;
  location: GeographicLocation;
  lastSeen: Date;
  stakingInfo?: StakingInfo;
  healthScore?: number; // Composite metric 0-100
}

export interface StorageInfo {
  used: number; // bytes
  total: number; // bytes
  available: number; // bytes
  usagePercentage: number;
}

export interface PerformanceMetrics {
  avgLatency: number; // milliseconds
  successRate: number; // percentage
  bandwidthMbps: number;
  responseTime: number; // milliseconds
  requestsPerSecond: number;
}

export interface GeographicLocation {
  country: string;
  countryCode: string;
  city: string;
  region: string;
  lat: number;
  lng: number;
  timezone?: string;
}

export interface StakingInfo {
  staked: number; // tokens
  weight: number; // percentage
  rewards?: number;
  delegators?: number;
}

export interface NetworkStats {
  totalNodes: number;
  activeNodes: number;
  inactiveNodes: number;
  syncingNodes: number;
  totalStorage: number; // bytes
  usedStorage: number; // bytes
  availableStorage: number; // bytes
  avgUptime: number; // percentage
  decentralizationScore: number; // 0-100
  networkVersion: string;
  avgLatency: number; // milliseconds
  totalBandwidth: number; // Mbps
}

export interface HistoricalMetric {
  timestamp: Date;
  value: number;
  metric: string;
}

export interface PNodeMetrics {
  publicKey: string;
  timeframe: '24h' | '7d' | '30d' | '90d';
  metrics: {
    uptime: HistoricalMetric[];
    storage: HistoricalMetric[];
    latency: HistoricalMetric[];
    bandwidth: HistoricalMetric[];
  };
}

export interface Alert {
  id: string;
  pNodePublicKey: string;
  type: 'uptime' | 'storage' | 'latency' | 'offline' | 'capacity';
  severity: 'info' | 'warning' | 'critical';
  message: string;
  timestamp: Date;
  acknowledged: boolean;
}

export interface StorageHeatmapData {
  publicKey: string;
  moniker: string;
  value: number; // storage usage or intensity
  lat: number;
  lng: number;
}

export interface ComparisonMetric {
  label: string;
  node1: number;
  node2: number;
  unit: string;
}

export interface LeaderboardEntry {
  rank: number;
  publicKey: string;
  moniker: string;
  score: number;
  category: 'uptime' | 'storage' | 'performance' | 'reliability';
}

// API Response types
export interface PNodeApiResponse {
  success: boolean;
  data: PNode[];
  error?: string;
  timestamp: Date;
}

export interface NetworkStatsApiResponse {
  success: boolean;
  data: NetworkStats;
  error?: string;
  timestamp: Date;
}

export interface MetricsApiResponse {
  success: boolean;
  data: PNodeMetrics;
  error?: string;
  timestamp: Date;
}

// Network Intelligence Types
export interface NetworkEvent {
  id: string;
  type: 'info' | 'warning' | 'critical' | 'success';
  category: 'storage' | 'network' | 'version' | 'performance' | 'capacity';
  title: string;
  message: string;
  timestamp: Date;
  metric?: string;
  value?: number;
  affectedNodes?: number;
}

export interface RiskAssessment {
  atRiskCount: number;
  atRiskNodes: PNode[];
  criticalCount: number;
  warningCount: number;
  riskCategories: {
    storage: number;
    uptime: number;
    version: number;
    latency: number;
  };
}

export interface VersionDistribution {
  version: string;
  count: number;
  percentage: number;
  isLatest: boolean;
  nodes: PNode[];
}

export interface NetworkHealthBreakdown {
  availability: number; // 0-100
  versionHealth: number; // 0-100
  distribution: number; // 0-100
  storageHealth: number; // 0-100
  totalScore: number; // 0-100
}
