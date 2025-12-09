'use client';

import { useMemo } from "react";
import Link from "next/link";
import { useAllPNodes, useNetworkStats } from "@/lib/hooks";
import { NetworkStatsDisplay } from "@/components/NetworkStats";
import { NodeCard } from "@/components/NodeCard";
import { InsightsPanel } from "@/components/InsightsPanel";
import { AtRiskNodesCard } from "@/components/AtRiskNodesCard";
import { HealthScoreBreakdown } from "@/components/HealthScoreBreakdown";
import { LoadingPage } from "@/components/ui/loading";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import {
  generateNetworkEvents,
  assessNetworkRisk,
  calculateNetworkHealth,
} from "@/lib/intelligence";

export default function Home() {
  const { data: stats, isLoading: statsLoading, error: statsError } = useNetworkStats();
  const { data: nodes, isLoading: nodesLoading, error: nodesError } = useAllPNodes();

  // Generate intelligent insights
  const networkEvents = useMemo(() => {
    if (!stats || !nodes) return [];
    return generateNetworkEvents(stats, nodes);
  }, [stats, nodes]);

  const riskAssessment = useMemo(() => {
    if (!nodes) return {
      atRiskCount: 0,
      atRiskNodes: [],
      criticalCount: 0,
      warningCount: 0,
      riskCategories: { storage: 0, uptime: 0, version: 0, latency: 0 },
    };
    return assessNetworkRisk(nodes);
  }, [nodes]);

  const healthBreakdown = useMemo(() => {
    if (!stats || !nodes) return {
      availability: 0,
      versionHealth: 0,
      distribution: 0,
      storageHealth: 0,
      totalScore: 0,
    };
    return calculateNetworkHealth(stats, nodes);
  }, [stats, nodes]);

  if (statsLoading || nodesLoading) {
    return <LoadingPage message="Loading pNode network data..." />;
  }

  if (statsError || nodesError) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center p-8">
        <h1 className="text-2xl font-bold text-red-500 mb-4">Error Loading Data</h1>
        <p className="text-gray-600 dark:text-gray-400">
          {statsError?.message || nodesError?.message || 'An unknown error occurred'}
        </p>
      </div>
    );
  }

  // Get top nodes by health score
  const topNodes = nodes
    ?.filter(node => node.status === 'active')
    .sort((a, b) => (b.healthScore || 0) - (a.healthScore || 0))
    .slice(0, 8);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
      {/* Header */}
      <header className="border-b border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-50">
                Xandeum pNode Analytics
              </h1>
              <p className="text-gray-600 dark:text-gray-400 mt-1">
                Real-time monitoring for Xandeum storage provider nodes
              </p>
            </div>
            <nav className="flex gap-4">
              <Link href="/">
                <Button variant="ghost">Dashboard</Button>
              </Link>
              <Link href="/nodes">
                <Button variant="ghost">Nodes</Button>
              </Link>
            </nav>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        {/* Network Stats */}
        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4 text-gray-900 dark:text-gray-50">
            Network Overview
          </h2>
          {stats && <NetworkStatsDisplay stats={stats} />}
        </section>

        {/* Intelligence Layer - Phase 1 */}
        <section className="mb-8">
          <div className="grid gap-6 lg:grid-cols-3 mb-6">
            {/* Insights Panel */}
            <div className="lg:col-span-2">
              <InsightsPanel events={networkEvents} />
            </div>

            {/* At Risk Nodes */}
            <div className="lg:col-span-1">
              <AtRiskNodesCard assessment={riskAssessment} />
            </div>
          </div>

          {/* Health Score Breakdown */}
          <HealthScoreBreakdown health={healthBreakdown} />
        </section>

        {/* Top Performing Nodes */}
        <section>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-gray-50">
              Top Performing Nodes
            </h2>
            <Link href="/nodes">
              <Button variant="outline" className="gap-2">
                View All Nodes
                <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
          </div>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {topNodes?.map((node) => (
              <NodeCard key={node.publicKey} node={node} />
            ))}
          </div>
        </section>

        {/* Additional Info */}
        <section className="mt-12 bg-blue-50 dark:bg-blue-950/20 rounded-lg p-6">
          <h3 className="text-xl font-semibold mb-2 text-gray-900 dark:text-gray-50">
            About Xandeum pNodes
          </h3>
          <p className="text-gray-600 dark:text-gray-400 mb-4">
            Xandeum pNodes are decentralized storage provider nodes that form the backbone
            of the Xandeum storage layer. Each pNode contributes storage capacity, bandwidth,
            and compute power to create a resilient, high-performance storage network.
          </p>
          <div className="grid md:grid-cols-3 gap-4">
            <div className="bg-white dark:bg-gray-900 p-4 rounded-lg">
              <h4 className="font-semibold mb-1 text-gray-900 dark:text-gray-50">Decentralized</h4>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Distributed globally across multiple countries and regions
              </p>
            </div>
            <div className="bg-white dark:bg-gray-900 p-4 rounded-lg">
              <h4 className="font-semibold mb-1 text-gray-900 dark:text-gray-50">High Performance</h4>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Low latency and high bandwidth for fast data access
              </p>
            </div>
            <div className="bg-white dark:bg-gray-900 p-4 rounded-lg">
              <h4 className="font-semibold mb-1 text-gray-900 dark:text-gray-50">Scalable</h4>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Growing capacity towards exabyte-scale storage
              </p>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-gray-200 dark:border-gray-800 mt-16">
        <div className="container mx-auto px-4 py-6 text-center text-sm text-gray-500 dark:text-gray-400">
          <p>Xandeum pNode Analytics v{process.env.NEXT_PUBLIC_APP_VERSION || '1.0.0'}</p>
          <p className="mt-1">
            Data refreshes every 30 seconds | Built with Next.js and React Query
          </p>
        </div>
      </footer>
    </div>
  );
}
