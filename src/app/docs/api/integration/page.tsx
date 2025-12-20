import { Badge } from "@/components/ui/badge";

export const metadata = {
  title: "Integration Guide - XandScan Documentation",
  description: "Learn how to integrate with pRPC and build custom features",
};

export default function IntegrationPage() {
  return (
    <div className="space-y-8">
      <div>
        <Badge variant="outline" className="mb-4">API & Integration</Badge>
        <h1 className="text-4xl font-bold mb-4">Integration Guide</h1>
        <p className="text-xl text-muted-foreground">
          Practical examples for integrating pRPC and building custom features
        </p>
      </div>

      <div>
        <h2 className="text-2xl font-semibold mb-4">Building a Custom Dashboard</h2>
        <p className="mb-4">Create a custom dashboard showing specific metrics:</p>
        <pre className="bg-muted p-4 rounded-lg text-sm overflow-x-auto mb-6">
          <code>{`'use client';

import { useAllPNodes, useNetworkStats } from '@/lib/hooks';
import { Card } from '@/components/ui/card';

export function CustomDashboard() {
  const { data: nodes } = useAllPNodes();
  const { data: stats } = useNetworkStats();

  // Filter high-performance nodes
  const topNodes = nodes
    ?.filter(n => n.healthScore > 90)
    .slice(0, 10);

  // Calculate custom metric
  const avgStorageUsage = nodes?.reduce(
    (acc, node) => acc + node.storage.usagePercentage, 0
  ) / (nodes?.length || 1);

  return (
    <div>
      <h1>My Custom Dashboard</h1>

      <Card>
        <h2>Top 10 Nodes (Health &gt; 90)</h2>
        {topNodes?.map(node => (
          <div key={node.publicKey}>
            {node.moniker}: {node.healthScore}
          </div>
        ))}
      </Card>

      <Card>
        <h2>Network Metrics</h2>
        <p>Total Nodes: {stats?.totalNodes}</p>
        <p>Avg Storage Usage: {avgStorageUsage.toFixed(1)}%</p>
      </Card>
    </div>
  );
}`}</code>
        </pre>
      </div>

      <div>
        <h2 className="text-2xl font-semibold mb-4">Filtering and Searching Nodes</h2>
        <pre className="bg-muted p-4 rounded-lg text-sm overflow-x-auto mb-6">
          <code>{`import { useAllPNodes } from '@/lib/hooks';
import { useState, useMemo } from 'react';

export function NodeSearch() {
  const { data: nodes } = useAllPNodes();
  const [search, setSearch] = useState('');
  const [minHealth, setMinHealth] = useState(0);

  // Filter and sort nodes
  const filteredNodes = useMemo(() => {
    if (!nodes) return [];

    return nodes
      .filter(node =>
        node.moniker.toLowerCase().includes(search.toLowerCase()) &&
        node.healthScore >= minHealth
      )
      .sort((a, b) => b.healthScore - a.healthScore);
  }, [nodes, search, minHealth]);

  return (
    <div>
      <input
        type="text"
        placeholder="Search by moniker..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

      <input
        type="range"
        min="0"
        max="100"
        value={minHealth}
        onChange={(e) => setMinHealth(Number(e.target.value))}
      />
      <span>Min Health: {minHealth}</span>

      <div>
        Found {filteredNodes.length} nodes
      </div>
    </div>
  );
}`}</code>
        </pre>
      </div>

      <div>
        <h2 className="text-2xl font-semibold mb-4">Building Custom Analytics</h2>
        <pre className="bg-muted p-4 rounded-lg text-sm overflow-x-auto mb-6">
          <code>{`import { useAllPNodes } from '@/lib/hooks';
import { useMemo } from 'react';

export function GeoAnalytics() {
  const { data: nodes } = useAllPNodes();

  const analytics = useMemo(() => {
    if (!nodes) return null;

    // Group by country
    const byCountry = nodes.reduce((acc, node) => {
      const country = node.location.country;
      if (!acc[country]) {
        acc[country] = {
          count: 0,
          totalStorage: 0,
          avgHealth: 0,
        };
      }
      acc[country].count++;
      acc[country].totalStorage += node.storage.total;
      acc[country].avgHealth += node.healthScore;
      return acc;
    }, {} as Record<string, any>);

    // Calculate averages
    Object.values(byCountry).forEach((data: any) => {
      data.avgHealth /= data.count;
    });

    // Sort by count
    const sorted = Object.entries(byCountry)
      .sort(([, a]: any, [, b]: any) => b.count - a.count);

    return sorted;
  }, [nodes]);

  return (
    <div>
      <h2>Nodes by Country</h2>
      {analytics?.map(([country, data]: [string, any]) => (
        <div key={country}>
          <strong>{country}</strong>: {data.count} nodes,
          Avg Health: {data.avgHealth.toFixed(1)}
        </div>
      ))}
    </div>
  );
}`}</code>
        </pre>
      </div>

      <div>
        <h2 className="text-2xl font-semibold mb-4">Real-time Monitoring</h2>
        <p className="mb-4">Set up monitoring with custom refresh intervals:</p>
        <pre className="bg-muted p-4 rounded-lg text-sm overflow-x-auto mb-6">
          <code>{`import { useAllPNodes } from '@/lib/hooks';
import { useEffect } from 'react';

export function RealTimeMonitor() {
  const { data: nodes, refetch } = useAllPNodes();

  // Custom refresh interval (30 seconds)
  useEffect(() => {
    const interval = setInterval(() => {
      refetch();
    }, 30000);

    return () => clearInterval(interval);
  }, [refetch]);

  // Monitor for critical nodes
  const criticalNodes = nodes?.filter(node =>
    node.uptime < 95 ||
    node.storage.usagePercentage > 90 ||
    node.performance.avgLatency > 200
  );

  return (
    <div>
      <h2>Critical Nodes Alert</h2>
      {criticalNodes?.length === 0 ? (
        <p>All nodes healthy</p>
      ) : (
        criticalNodes?.map(node => (
          <div key={node.publicKey} className="alert">
            {node.moniker}:
            {node.uptime < 95 && ' Low uptime'}
            {node.storage.usagePercentage > 90 && ' High storage'}
            {node.performance.avgLatency > 200 && ' High latency'}
          </div>
        ))
      )}
    </div>
  );
}`}</code>
        </pre>
      </div>

      <div>
        <h2 className="text-2xl font-semibold mb-4">Custom Data Export</h2>
        <pre className="bg-muted p-4 rounded-lg text-sm overflow-x-auto mb-6">
          <code>{`import { useAllPNodes } from '@/lib/hooks';

export function CustomExport() {
  const { data: nodes } = useAllPNodes();

  const exportFilteredNodes = () => {
    // Filter nodes
    const filtered = nodes?.filter(n => n.healthScore > 80);

    // Create custom CSV
    const headers = ['Moniker', 'Country', 'Health', 'Uptime'];
    const rows = filtered?.map(n => [
      n.moniker,
      n.location.country,
      n.healthScore,
      n.uptime,
    ]);

    const csv = [
      headers.join(','),
      ...rows.map(row => row.join(',')),
    ].join('\\n');

    // Download
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'high-health-nodes.csv';
    a.click();
  };

  return (
    <button onClick={exportFilteredNodes}>
      Export High Health Nodes
    </button>
  );
}`}</code>
        </pre>
      </div>

      <div>
        <h2 className="text-2xl font-semibold mb-4">Building Alerts</h2>
        <pre className="bg-muted p-4 rounded-lg text-sm overflow-x-auto mb-6">
          <code>{`import { useAllPNodes } from '@/lib/hooks';
import { useEffect } from 'react';

export function NodeAlerts() {
  const { data: nodes } = useAllPNodes();

  useEffect(() => {
    if (!nodes) return;

    // Check for nodes with issues
    nodes.forEach(node => {
      if (node.uptime < 90) {
        console.warn(\`Low uptime alert: \${node.moniker}\`);
        // Could send notification here
      }

      if (node.storage.usagePercentage > 95) {
        console.error(\`Storage critical: \${node.moniker}\`);
        // Could trigger email/webhook
      }
    });
  }, [nodes]);

  return <div>Monitoring {nodes?.length} nodes...</div>;
}`}</code>
        </pre>
      </div>

      <div>
        <h2 className="text-2xl font-semibold mb-4">Integration with External APIs</h2>
        <p className="mb-4">Combine XandScan data with external services:</p>
        <pre className="bg-muted p-4 rounded-lg text-sm overflow-x-auto mb-6">
          <code>{`import { useAllPNodes } from '@/lib/hooks';

export async function enrichNodeData(publicKey: string) {
  // Get node from XandScan
  const client = getPNodeClient();
  const node = await client.getPNodeDetails(publicKey);

  // Enrich with external data
  const geoData = await fetch(
    \`https://api.ipgeolocation.io/ipgeo?ip=\${node.ipAddress}\`
  ).then(r => r.json());

  return {
    ...node,
    enriched: {
      isp: geoData.isp,
      continent: geoData.continent_name,
      currency: geoData.currency,
    },
  };
}`}</code>
        </pre>
      </div>

      <div className="bg-muted rounded-lg p-6 border border-border">
        <h3 className="font-semibold mb-3">Best Practices</h3>
        <ul className="space-y-2 text-sm text-muted-foreground">
          <li>• Use React Query hooks instead of direct PNodeClient calls</li>
          <li>• Leverage useMemo for expensive calculations</li>
          <li>• Respect the 60s cache - don't over-refetch</li>
          <li>• Handle loading and error states properly</li>
          <li>• Use TypeScript for type safety</li>
          <li>• Test with real pNode data before deploying</li>
        </ul>
      </div>

      <div>
        <h2 className="text-2xl font-semibold mb-4">Next Steps</h2>
        <ul className="space-y-2 text-muted-foreground">
          <li>• Review <a href="/docs/api/reference" className="text-primary hover:underline">API Reference</a> for complete type definitions</li>
          <li>• Check <a href="/docs/platform/architecture" className="text-primary hover:underline">Architecture</a> to understand data flow</li>
          <li>• See <a href="/docs/platform/deployment" className="text-primary hover:underline">Deployment</a> to publish your custom features</li>
        </ul>
      </div>
    </div>
  );
}
