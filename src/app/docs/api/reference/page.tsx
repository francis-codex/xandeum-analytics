import { Badge } from "@/components/ui/badge";

export const metadata = {
  title: "API Reference - XandScan Documentation",
  description: "Complete API reference for pRPC integration",
};

export default function APIReferencePage() {
  return (
    <div className="space-y-8">
      <div>
        <Badge variant="outline" className="mb-4">API & Integration</Badge>
        <h1 className="text-4xl font-bold mb-4">API Reference</h1>
        <p className="text-xl text-muted-foreground">
          Complete reference for the pRPC API and XandScan data structures
        </p>
      </div>

      <div className="bg-muted rounded-lg p-6 border border-border">
        <h3 className="font-semibold mb-2">About pRPC</h3>
        <p className="text-sm text-muted-foreground">
          pRPC (pNode RPC) is the API protocol for communicating with Xandeum pNodes. XandScan
          connects to 8 verified endpoints on port 6000 to retrieve real-time network data.
        </p>
      </div>

      <div>
        <h2 className="text-2xl font-semibold mb-4">pNode Endpoints</h2>
        <p className="mb-4">XandScan uses these verified pRPC endpoints:</p>
        <pre className="bg-muted p-4 rounded-lg text-sm overflow-x-auto mb-6">
          <code>{`// Active pNode endpoints (port 6000)
178.18.243.183:6000
158.220.126.109:6000
62.171.147.216:6000
152.53.45.250:6000
192.99.8.88:6000
192.99.9.233:6000
167.235.193.133:6000
147.45.231.139:6000`}</code>
        </pre>
      </div>

      <div>
        <h2 className="text-2xl font-semibold mb-4">Data Structures</h2>

        <h3 className="text-lg font-semibold mb-3">PNode Type</h3>
        <pre className="bg-muted p-4 rounded-lg text-sm overflow-x-auto mb-6">
          <code>{`interface PNode {
  publicKey: string;
  moniker: string;
  ipAddress: string;
  version: string;
  status: 'active' | 'inactive' | 'syncing';
  uptime: number; // percentage (0-100)
  storage: {
    used: number; // bytes
    total: number; // bytes
    available: number; // bytes
    usagePercentage: number; // percentage (0-100)
  };
  performance: {
    avgLatency: number; // milliseconds
    successRate: number; // percentage (0-100)
    bandwidthMbps: number;
    responseTime: number; // milliseconds
    requestsPerSecond: number;
  };
  location: {
    country: string;
    countryCode: string; // ISO 3166-1 alpha-2
    city: string;
    region: string;
    lat: number;
    lng: number;
    timezone: string;
  };
  lastSeen: Date;
  stakingInfo?: {
    staked: number;
    weight: number;
    rewards: number;
    delegators: number;
  };
  healthScore: number; // calculated score (0-100)
}`}</code>
        </pre>

        <h3 className="text-lg font-semibold mb-3">NetworkStats Type</h3>
        <pre className="bg-muted p-4 rounded-lg text-sm overflow-x-auto mb-6">
          <code>{`interface NetworkStats {
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
}`}</code>
        </pre>

        <h3 className="text-lg font-semibold mb-3">NetworkHealthBreakdown Type</h3>
        <pre className="bg-muted p-4 rounded-lg text-sm overflow-x-auto mb-6">
          <code>{`interface NetworkHealthBreakdown {
  availability: number; // 0-100
  versionHealth: number; // 0-100
  distribution: number; // 0-100
  storageHealth: number; // 0-100
  totalScore: number; // weighted average
}`}</code>
        </pre>
      </div>

      <div>
        <h2 className="text-2xl font-semibold mb-4">React Query Hooks</h2>

        <h3 className="text-lg font-semibold mb-3">useAllPNodes</h3>
        <p className="mb-3 text-muted-foreground">Fetch all pNodes from the network</p>
        <pre className="bg-muted p-4 rounded-lg text-sm overflow-x-auto mb-6">
          <code>{`import { useAllPNodes } from '@/lib/hooks';

function MyComponent() {
  const {
    data: nodes,
    isLoading,
    error,
    refetch
  } = useAllPNodes();

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;

  return (
    <div>
      {nodes?.map(node => (
        <div key={node.publicKey}>{node.moniker}</div>
      ))}
    </div>
  );
}`}</code>
        </pre>

        <h3 className="text-lg font-semibold mb-3">useNetworkStats</h3>
        <p className="mb-3 text-muted-foreground">Fetch network-wide statistics</p>
        <pre className="bg-muted p-4 rounded-lg text-sm overflow-x-auto mb-6">
          <code>{`import { useNetworkStats } from '@/lib/hooks';

function Dashboard() {
  const { data: stats, isLoading } = useNetworkStats();

  return (
    <div>
      <h2>Total Nodes: {stats?.totalNodes}</h2>
      <h2>Active: {stats?.activeNodes}</h2>
      <h2>Avg Uptime: {stats?.avgUptime.toFixed(2)}%</h2>
    </div>
  );
}`}</code>
        </pre>

        <h3 className="text-lg font-semibold mb-3">usePNodeDetails</h3>
        <p className="mb-3 text-muted-foreground">Fetch specific pNode details by public key</p>
        <pre className="bg-muted p-4 rounded-lg text-sm overflow-x-auto mb-6">
          <code>{`import { usePNodeDetails } from '@/lib/hooks';

function NodePage({ publicKey }: { publicKey: string }) {
  const { data: node, isLoading } = usePNodeDetails(publicKey);

  if (!node) return null;

  return (
    <div>
      <h1>{node.moniker}</h1>
      <p>Uptime: {node.uptime}%</p>
      <p>Location: {node.location.city}, {node.location.country}</p>
    </div>
  );
}`}</code>
        </pre>
      </div>

      <div>
        <h2 className="text-2xl font-semibold mb-4">Direct PNodeClient Usage</h2>
        <p className="mb-4">For advanced use cases, use PNodeClient directly:</p>
        <pre className="bg-muted p-4 rounded-lg text-sm overflow-x-auto mb-6">
          <code>{`import { getPNodeClient } from '@/lib/pnode-client';

async function fetchCustomData() {
  const client = getPNodeClient();

  // Get all nodes
  const nodes = await client.getAllPNodes();

  // Get network stats
  const stats = await client.getNetworkStats();

  // Get specific node
  const node = await client.getPNodeDetails('publicKey123');

  return { nodes, stats, node };
}`}</code>
        </pre>
      </div>

      <div>
        <h2 className="text-2xl font-semibold mb-4">Health Score Calculation</h2>
        <p className="mb-4">Calculate network health breakdown:</p>
        <pre className="bg-muted p-4 rounded-lg text-sm overflow-x-auto mb-6">
          <code>{`import { calculateNetworkHealth } from '@/lib/intelligence';

const healthBreakdown = calculateNetworkHealth(stats, nodes);

// Returns:
// {
//   availability: 95.2,
//   versionHealth: 87.5,
//   distribution: 78.3,
//   storageHealth: 82.1,
//   totalScore: 87
// }`}</code>
        </pre>
      </div>

      <div>
        <h2 className="text-2xl font-semibold mb-4">Data Export Functions</h2>
        <pre className="bg-muted p-4 rounded-lg text-sm overflow-x-auto mb-6">
          <code>{`import {
  exportNodesCSV,
  exportNodesJSON,
  exportNetworkStatsCSV,
  exportNetworkStatsJSON
} from '@/lib/export';

// Export nodes to CSV
exportNodesCSV(nodes, 'xandscan-nodes.csv');

// Export nodes to JSON
exportNodesJSON(nodes, 'xandscan-nodes.json');

// Export network stats
exportNetworkStatsCSV(stats, nodes, 'network-stats.csv');
exportNetworkStatsJSON(stats, nodes, 'network-stats.json');`}</code>
        </pre>
      </div>

      <div>
        <h2 className="text-2xl font-semibold mb-4">Error Handling</h2>
        <p className="mb-4">React Query provides built-in error handling:</p>
        <pre className="bg-muted p-4 rounded-lg text-sm overflow-x-auto mb-6">
          <code>{`const { data, error, isError, isLoading } = useAllPNodes();

if (isError) {
  console.error('Failed to fetch nodes:', error);

  // Error types:
  // - Network errors (timeout, connection refused)
  // - pRPC errors (invalid response, parse errors)
  // - Circuit breaker (all endpoints failed)
}`}</code>
        </pre>
      </div>

      <div className="bg-muted rounded-lg p-6 border border-border">
        <h3 className="font-semibold mb-3">Cache Configuration</h3>
        <ul className="space-y-2 text-sm text-muted-foreground">
          <li>• <strong>Stale Time:</strong> 60 seconds - data considered fresh for 60s</li>
          <li>• <strong>Cache Time:</strong> 5 minutes - cached data persists for 5 minutes</li>
          <li>• <strong>Refetch:</strong> No automatic background refetch</li>
          <li>• <strong>Retry:</strong> No automatic retries (fail fast)</li>
        </ul>
      </div>

      <div>
        <h2 className="text-2xl font-semibold mb-4">Next Steps</h2>
        <ul className="space-y-2 text-muted-foreground">
          <li>• Review <a href="/docs/api/integration" className="text-primary hover:underline">Integration Guide</a> for practical examples</li>
          <li>• Check <a href="/docs/platform/architecture" className="text-primary hover:underline">Architecture</a> for system design</li>
          <li>• See <a href="/docs/guides/metrics" className="text-primary hover:underline">Metrics Guide</a> for scoring formulas</li>
        </ul>
      </div>
    </div>
  );
}
