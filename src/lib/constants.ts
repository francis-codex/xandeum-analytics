/**
 * Application constants and configuration
 */

// API Configuration
export const API_CONFIG = {
  MAINNET_URL: process.env.NEXT_PUBLIC_XANDEUM_RPC_URL || 'https://api.xandeum.network',
  DEVNET_URL: process.env.NEXT_PUBLIC_XANDEUM_DEVNET_RPC_URL || 'https://devnet.xandeum.network',
  REFRESH_INTERVAL: 30000, // 30 seconds
  TIMEOUT: 10000, // 10 seconds
} as const;

// Network Types
export const NETWORK_TYPES = {
  MAINNET: 'mainnet',
  DEVNET: 'devnet',
} as const;

// Default network
export const DEFAULT_NETWORK = NETWORK_TYPES.MAINNET;

// Chart colors
export const CHART_COLORS = {
  primary: '#3b82f6',
  success: '#10b981',
  warning: '#f59e0b',
  danger: '#ef4444',
  info: '#06b6d4',
  purple: '#8b5cf6',
  pink: '#ec4899',
} as const;

// Status colors
export const STATUS_COLORS = {
  active: '#10b981',
  inactive: '#ef4444',
  syncing: '#f59e0b',
} as const;

// Time frames for historical data
export const TIMEFRAMES = {
  '24h': { label: '24 Hours', value: '24h', hours: 24 },
  '7d': { label: '7 Days', value: '7d', hours: 168 },
  '30d': { label: '30 Days', value: '30d', hours: 720 },
  '90d': { label: '90 Days', value: '90d', hours: 2160 },
} as const;

// Metric thresholds
export const THRESHOLDS = {
  UPTIME: {
    EXCELLENT: 99.9,
    GOOD: 99,
    FAIR: 95,
    POOR: 90,
  },
  LATENCY: {
    EXCELLENT: 50, // ms
    GOOD: 100,
    FAIR: 200,
    POOR: 500,
  },
  STORAGE: {
    CRITICAL: 95, // percentage
    WARNING: 85,
    OPTIMAL: 75,
    LOW: 50,
  },
  SUCCESS_RATE: {
    EXCELLENT: 99.9,
    GOOD: 99,
    FAIR: 95,
    POOR: 90,
  },
} as const;

// Alert types
export const ALERT_TYPES = {
  UPTIME: 'uptime',
  STORAGE: 'storage',
  LATENCY: 'latency',
  OFFLINE: 'offline',
  CAPACITY: 'capacity',
} as const;

// Alert severity levels
export const ALERT_SEVERITY = {
  INFO: 'info',
  WARNING: 'warning',
  CRITICAL: 'critical',
} as const;

// Leaderboard categories
export const LEADERBOARD_CATEGORIES = {
  UPTIME: 'uptime',
  STORAGE: 'storage',
  PERFORMANCE: 'performance',
  RELIABILITY: 'reliability',
} as const;

// Pagination
export const PAGINATION = {
  DEFAULT_PAGE_SIZE: 20,
  PAGE_SIZE_OPTIONS: [10, 20, 50, 100],
} as const;

// Storage units
export const STORAGE_UNITS = {
  BYTES: 1,
  KB: 1024,
  MB: 1024 * 1024,
  GB: 1024 * 1024 * 1024,
  TB: 1024 * 1024 * 1024 * 1024,
  PB: 1024 * 1024 * 1024 * 1024 * 1024,
  EB: 1024 * 1024 * 1024 * 1024 * 1024 * 1024,
} as const;

// Navbar links
export const NAV_LINKS = [
  { href: '/', label: 'Dashboard' },
  { href: '/nodes', label: 'Nodes' },
  { href: '/analytics', label: 'Analytics' },
  { href: '/leaderboard', label: 'Leaderboard' },
] as const;

// Social links
export const SOCIAL_LINKS = {
  GITHUB: 'https://github.com/xandeum',
  TWITTER: 'https://twitter.com/xandeum',
  DISCORD: 'https://discord.gg/xandeum',
  DOCS: 'https://xandeum.network/docs',
} as const;

// Application metadata
export const APP_METADATA = {
  TITLE: 'XandScan - Xandeum pNode Explorer',
  DESCRIPTION: 'Real-time network explorer and analytics platform for Xandeum pNodes. Monitor storage provider nodes, track performance metrics, and explore the decentralized Xandeum storage network.',
  VERSION: '1.0.0',
  KEYWORDS: 'Xandeum, pNode, blockchain explorer, storage network, analytics, Solana, decentralized storage',
  OG_IMAGE: '/og-image.png', // We'll create this later
  SITE_URL: process.env.NEXT_PUBLIC_SITE_URL || 'https://xandscan.vercel.app',
} as const;
