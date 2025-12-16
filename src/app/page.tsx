'use client';

import { useMemo } from "react";
import Link from "next/link";
import { useAllPNodes, useNetworkStats } from "@/lib/hooks";
import { NetworkStatsDisplay } from "@/components/NetworkStats";
import { NodeCard } from "@/components/NodeCard";
import { InsightsPanel } from "@/components/InsightsPanel";
import { AtRiskNodesCard } from "@/components/AtRiskNodesCard";
import { HealthScoreBreakdown } from "@/components/HealthScoreBreakdown";
import { VersionDistribution } from "@/components/VersionDistribution";
import { ExportButtons } from "@/components/ExportButtons";
import { NetworkStatsGridSkeleton, NodeGridSkeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
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

  const isLoading = statsLoading || nodesLoading;

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
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950">
      {/* Header */}
      <header className="sticky top-0 z-50 border-b border-border bg-card/80 backdrop-blur-lg">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent">
                XandScan
              </h1>
              <p className="text-muted-foreground text-sm mt-1">
                Xandeum pNode Network Explorer
              </p>
            </div>
            <nav className="flex gap-2">
              <Link href="/">
                <Button variant="ghost" className="text-foreground hover:text-primary">Dashboard</Button>
              </Link>
              <Link href="/nodes">
                <Button variant="ghost" className="text-foreground hover:text-primary">Nodes</Button>
              </Link>
            </nav>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        {/* Network Stats */}
        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4 text-foreground">
            Network Overview
          </h2>
          {isLoading ? (
            <NetworkStatsGridSkeleton />
          ) : stats ? (
            <NetworkStatsDisplay stats={stats} />
          ) : null}
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

        {/* Version Intelligence - Phase 2 */}
        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4 text-gray-900 dark:text-gray-50">
            Version Intelligence
          </h2>
          {nodes && <VersionDistribution nodes={nodes} />}
        </section>

        {/* Top Performing Nodes */}
        <section>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-2xl font-semibold text-foreground">
              Top Performing Nodes
            </h2>
            <Link href="/nodes">
              <Button variant="outline" className="gap-2 border-primary text-primary hover:bg-primary hover:text-primary-foreground">
                View All Nodes
                <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
          </div>
          {isLoading ? (
            <NodeGridSkeleton count={8} />
          ) : (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {topNodes?.map((node) => (
                <NodeCard key={node.publicKey} node={node} />
              ))}
            </div>
          )}
        </section>

        {/* Data Export - Phase 3 */}
        {nodes && stats && (
          <section className="mt-12">
            <Card>
              <CardContent className="p-6">
                <ExportButtons nodes={nodes} stats={stats} />
              </CardContent>
            </Card>
          </section>
        )}

        {/* Additional Info */}
        <section className="mt-12 bg-gradient-to-br from-primary/5 via-secondary/5 to-accent/5 dark:from-primary/10 dark:via-secondary/10 dark:to-accent/10 rounded-xl p-8 border border-border">
          <h3 className="text-xl font-semibold mb-2 text-foreground">
            About Xandeum pNodes
          </h3>
          <p className="text-muted-foreground mb-6">
            Xandeum pNodes are decentralized storage provider nodes that form the backbone
            of the Xandeum storage layer. Each pNode contributes storage capacity, bandwidth,
            and compute power to create a resilient, high-performance storage network.
          </p>
          <div className="grid md:grid-cols-3 gap-4">
            <div className="bg-card p-5 rounded-lg border border-border hover:border-primary transition-colors">
              <h4 className="font-semibold mb-2 text-foreground flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-primary"></div>
                Decentralized
              </h4>
              <p className="text-sm text-muted-foreground">
                Distributed globally across multiple countries and regions
              </p>
            </div>
            <div className="bg-card p-5 rounded-lg border border-border hover:border-secondary transition-colors">
              <h4 className="font-semibold mb-2 text-foreground flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-secondary"></div>
                High Performance
              </h4>
              <p className="text-sm text-muted-foreground">
                Low latency and high bandwidth for fast data access
              </p>
            </div>
            <div className="bg-card p-5 rounded-lg border border-border hover:border-accent transition-colors">
              <h4 className="font-semibold mb-2 text-foreground flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-accent"></div>
                Scalable
              </h4>
              <p className="text-sm text-muted-foreground">
                Growing capacity towards exabyte-scale storage
              </p>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-border mt-16 bg-card">
        <div className="container mx-auto px-4 py-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="text-center md:text-left">
              <p className="text-sm font-semibold text-foreground">
                XandScan v{process.env.NEXT_PUBLIC_APP_VERSION || '1.0.0'}
              </p>
              <p className="text-xs text-muted-foreground mt-1">
                Xandeum pNode Network Explorer
              </p>
            </div>
            <div className="flex items-center gap-4 text-xs text-muted-foreground">
              <span className="flex items-center gap-1">
                <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
                Live Data
              </span>
              <span>•</span>
              <span>Updates every 30s</span>
              <span>•</span>
              <span>Next.js + React Query</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
