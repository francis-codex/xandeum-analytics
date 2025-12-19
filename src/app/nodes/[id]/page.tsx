'use client';

import { useState, use } from "react";
import Link from "next/link";
import { usePNodeDetails, usePNodeMetrics } from "@/lib/hooks";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { StatusBadge } from "@/components/StatusBadge";
import { LoadingPage } from "@/components/ui/loading";
import { Button } from "@/components/ui/button";
import { PerformanceChart } from "@/components/PerformanceChart";
import {
  formatBytes,
  formatPercentage,
  formatTimeAgo,
  getStatusColor,
} from "@/lib/utils";
import {
  ArrowLeft,
  MapPin,
  Server,
  HardDrive,
  Zap,
  Clock,
  Activity,
  TrendingUp,
  Network,
} from "lucide-react";

interface NodeDetailPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default function NodeDetailPage({ params }: NodeDetailPageProps) {
  const [timeframe, setTimeframe] = useState<'24h' | '7d' | '30d' | '90d'>('24h');

  // Unwrap the Promise params using React.use()
  const { id } = use(params);

  // ID is the IP address of the node
  const { data: node, isLoading: nodeLoading, error: nodeError } = usePNodeDetails(id);
  const { data: metrics, isLoading: metricsLoading } = usePNodeMetrics(id, timeframe);

  if (nodeLoading) {
    return <LoadingPage message="Loading pNode details..." />;
  }

  if (nodeError || !node) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center p-8">
        <h1 className="text-2xl font-bold text-red-500 mb-4">Node Not Found</h1>
        <p className="text-gray-600 dark:text-gray-400 mb-4">
          {nodeError?.message || 'The requested pNode could not be found'}
        </p>
        <Link href="/nodes">
          <Button>Back to Nodes</Button>
        </Link>
      </div>
    );
  }

  const healthScoreColor = getStatusColor(node.healthScore || 0);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
      {/* Header */}
      <header className="border-b border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link href="/nodes">
                <Button variant="ghost" size="icon">
                  <ArrowLeft className="h-5 w-5" />
                </Button>
              </Link>
              <div>
                <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-50">
                  {node.moniker}
                </h1>
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-1 font-mono">
                  {node.publicKey}
                </p>
              </div>
            </div>
            <StatusBadge status={node.status} />
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        {/* Overview Stats */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Health Score</CardTitle>
              <Activity className={`h-4 w-4 ${healthScoreColor}`} />
            </CardHeader>
            <CardContent>
              <div className={`text-2xl font-bold ${healthScoreColor}`}>
                {node.healthScore?.toFixed(1) || 'N/A'} / 100
              </div>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                Overall performance metric
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Uptime</CardTitle>
              <Zap className="h-4 w-4 text-green-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{formatPercentage(node.uptime, 2)}</div>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                Success rate: {formatPercentage(node.performance.successRate, 1)}
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Storage</CardTitle>
              <HardDrive className="h-4 w-4 text-purple-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {formatBytes(node.storage.used)}
              </div>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                of {formatBytes(node.storage.total)} ({formatPercentage(node.storage.usagePercentage, 1)})
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Latency</CardTitle>
              <TrendingUp className="h-4 w-4 text-blue-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {node.performance.avgLatency.toFixed(0)}ms
              </div>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                Response time: {node.performance.responseTime.toFixed(0)}ms
              </p>
            </CardContent>
          </Card>
        </div>

        <div className="grid gap-6 lg:grid-cols-3 mb-8">
          {/* Node Information */}
          <Card className="lg:col-span-1">
            <CardHeader>
              <CardTitle>Node Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-start gap-3">
                <Server className="h-5 w-5 text-gray-400 mt-0.5" />
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-900 dark:text-gray-50">
                    Version
                  </p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {node.version}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Network className="h-5 w-5 text-gray-400 mt-0.5" />
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-900 dark:text-gray-50">
                    IP Address
                  </p>
                  <p className="text-sm text-gray-600 dark:text-gray-400 font-mono">
                    {node.ipAddress}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <MapPin className="h-5 w-5 text-gray-400 mt-0.5" />
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-900 dark:text-gray-50">
                    Location
                  </p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {node.location.city}, {node.location.region}
                  </p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {node.location.country}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">
                    {node.location.lat.toFixed(4)}, {node.location.lng.toFixed(4)}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Clock className="h-5 w-5 text-gray-400 mt-0.5" />
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-900 dark:text-gray-50">
                    Last Seen
                  </p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {formatTimeAgo(node.lastSeen)}
                  </p>
                </div>
              </div>

              {node.stakingInfo && (
                <div className="pt-4 border-t border-gray-200 dark:border-gray-800">
                  <p className="text-sm font-medium text-gray-900 dark:text-gray-50 mb-2">
                    Staking Information
                  </p>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600 dark:text-gray-400">Staked:</span>
                      <span className="font-medium">
                        {node.stakingInfo.staked.toLocaleString()} tokens
                      </span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600 dark:text-gray-400">Weight:</span>
                      <span className="font-medium">
                        {formatPercentage(node.stakingInfo.weight, 2)}
                      </span>
                    </div>
                    {node.stakingInfo.rewards !== undefined && (
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600 dark:text-gray-400">Rewards:</span>
                        <span className="font-medium">
                          {node.stakingInfo.rewards.toLocaleString()} tokens
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Performance Metrics */}
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle>Performance Metrics</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">
                    Bandwidth
                  </p>
                  <p className="text-2xl font-bold">
                    {node.performance.bandwidthMbps.toFixed(0)} Mbps
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">
                    Requests/sec
                  </p>
                  <p className="text-2xl font-bold">
                    {node.performance.requestsPerSecond.toLocaleString()}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">
                    Available Storage
                  </p>
                  <p className="text-2xl font-bold">
                    {formatBytes(node.storage.available)}
                  </p>
                </div>
              </div>

              <div className="mt-6">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-gray-600 dark:text-gray-400">
                    Storage Usage
                  </span>
                  <span className="text-sm font-medium">
                    {formatPercentage(node.storage.usagePercentage, 1)}
                  </span>
                </div>
                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3">
                  <div
                    className="bg-blue-500 h-3 rounded-full transition-all"
                    style={{ width: `${Math.min(node.storage.usagePercentage, 100)}%` }}
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Historical Charts */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-gray-50">
              Historical Performance
            </h2>
            <div className="flex gap-2">
              {(['24h', '7d', '30d', '90d'] as const).map((tf) => (
                <Button
                  key={tf}
                  variant={timeframe === tf ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setTimeframe(tf)}
                >
                  {tf}
                </Button>
              ))}
            </div>
          </div>

          {metricsLoading ? (
            <div className="text-center py-12">
              <p className="text-gray-500 dark:text-gray-400">Loading metrics...</p>
            </div>
          ) : metrics ? (
            <div className="grid gap-6 md:grid-cols-2">
              <PerformanceChart
                title="Uptime"
                data={metrics.metrics.uptime}
                dataKey="Uptime"
                color="#10b981"
                unit="%"
              />
              <PerformanceChart
                title="Latency"
                data={metrics.metrics.latency}
                dataKey="Latency"
                color="#3b82f6"
                unit="ms"
              />
              <PerformanceChart
                title="Storage Usage"
                data={metrics.metrics.storage}
                dataKey="Storage"
                color="#8b5cf6"
                unit="bytes"
              />
              <PerformanceChart
                title="Bandwidth"
                data={metrics.metrics.bandwidth}
                dataKey="Bandwidth"
                color="#f59e0b"
                unit="Mbps"
              />
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-gray-500 dark:text-gray-400">No metrics available</p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
