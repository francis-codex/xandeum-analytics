import { Badge } from "@/components/ui/badge";
import Link from "next/link";

export const metadata = {
  title: "Platform Guide - XandScan Documentation",
  description: "Learn how to use XandScan effectively",
};

export default function PlatformGuidePage() {
  return (
    <div className="space-y-8">
      <div>
        <Badge variant="outline" className="mb-4">User Guide</Badge>
        <h1 className="text-4xl font-bold mb-4">Platform Guide</h1>
        <p className="text-xl text-muted-foreground">
          Complete guide to using XandScan for pNode network analysis
        </p>
      </div>

      <div>
        <h2 className="text-2xl font-semibold mb-4">Dashboard Overview</h2>
        <p className="mb-4">The XandScan dashboard provides a comprehensive view of the Xandeum pNode network:</p>

        <h3 className="text-lg font-semibold mb-3">Network Health Grade</h3>
        <p className="mb-4">The A-F letter grade system provides an at-a-glance assessment of network health:</p>
        <ul className="space-y-2 text-muted-foreground mb-6">
          <li>• <strong>A+/A (90-100):</strong> Excellent network performance</li>
          <li>• <strong>B (70-89):</strong> Good performance with room for improvement</li>
          <li>• <strong>C (50-69):</strong> Fair performance, monitoring recommended</li>
          <li>• <strong>D/F (&lt;50):</strong> Poor performance, action required</li>
        </ul>

        <h3 className="text-lg font-semibold mb-3">Network Statistics</h3>
        <p className="mb-3">Four key metrics displayed as cards:</p>
        <ul className="space-y-2 text-muted-foreground mb-6">
          <li>• <strong>Total Nodes:</strong> Active and inactive pNodes in the network</li>
          <li>• <strong>Total Storage:</strong> Combined storage capacity across all nodes</li>
          <li>• <strong>Average Uptime:</strong> Network-wide uptime percentage</li>
          <li>• <strong>Decentralization Score:</strong> Geographic distribution metric (0-100)</li>
        </ul>
      </div>

      <div>
        <h2 className="text-2xl font-semibold mb-4">Intelligence Panel</h2>
        <p className="mb-4">AI-powered insights detect important network events:</p>
        <ul className="space-y-2 text-muted-foreground mb-6">
          <li>• <strong>Critical Alerts:</strong> Immediate attention required (low uptime, storage issues)</li>
          <li>• <strong>Warnings:</strong> Potential problems (version outdated, high latency)</li>
          <li>• <strong>Info Events:</strong> Normal network activity and upgrades</li>
          <li>• <strong>Positive Trends:</strong> Network improvements and milestones</li>
        </ul>
      </div>

      <div>
        <h2 className="text-2xl font-semibold mb-4">Node Exploration</h2>

        <h3 className="text-lg font-semibold mb-3">Search & Filters</h3>
        <p className="mb-3">Find nodes quickly using the search bar:</p>
        <ul className="space-y-2 text-muted-foreground mb-6">
          <li>• Search by moniker (node name)</li>
          <li>• Search by public key</li>
          <li>• Search by location (city or country)</li>
          <li>• Filter by status: Active, Inactive, Syncing</li>
        </ul>

        <h3 className="text-lg font-semibold mb-3">Sort Options</h3>
        <p className="mb-3">Sort nodes by various metrics:</p>
        <ul className="space-y-2 text-muted-foreground mb-6">
          <li>• <strong>Health Score:</strong> Overall node performance (default)</li>
          <li>• <strong>Uptime:</strong> Highest to lowest availability</li>
          <li>• <strong>Storage:</strong> Most to least capacity</li>
          <li>• <strong>Latency:</strong> Fastest to slowest response time</li>
          <li>• <strong>Name:</strong> Alphabetical by moniker</li>
        </ul>
      </div>

      <div>
        <h2 className="text-2xl font-semibold mb-4">Node Details</h2>
        <p className="mb-4">Click any node card to view comprehensive details:</p>

        <h3 className="text-lg font-semibold mb-3">Basic Information</h3>
        <ul className="space-y-2 text-muted-foreground mb-6">
          <li>• Node moniker and public key</li>
          <li>• IP address and network port</li>
          <li>• Geographic location (country, city)</li>
          <li>• Software version</li>
          <li>• Last seen timestamp</li>
        </ul>

        <h3 className="text-lg font-semibold mb-3">Performance Metrics</h3>
        <ul className="space-y-2 text-muted-foreground mb-6">
          <li>• <strong>Uptime:</strong> Percentage of time online</li>
          <li>• <strong>Latency:</strong> Average response time in milliseconds</li>
          <li>• <strong>Storage:</strong> Used vs. total capacity with utilization percentage</li>
          <li>• <strong>Bandwidth:</strong> Data transfer rate in Mbps</li>
          <li>• <strong>Success Rate:</strong> Percentage of successful operations</li>
        </ul>
      </div>

      <div>
        <h2 className="text-2xl font-semibold mb-4">Network Analytics</h2>

        <h3 className="text-lg font-semibold mb-3">Geographic Distribution</h3>
        <p className="mb-4">
          View node distribution across countries with metrics for each region including
          node count, active nodes, and average health score.
        </p>

        <h3 className="text-lg font-semibold mb-3">Top Performers</h3>
        <p className="mb-4">
          Leaderboards showcasing the best nodes across three categories:
        </p>
        <ul className="space-y-2 text-muted-foreground mb-6">
          <li>• <strong>Highest Uptime:</strong> Most reliable nodes</li>
          <li>• <strong>Most Storage:</strong> Largest capacity providers</li>
          <li>• <strong>Lowest Latency:</strong> Fastest response times</li>
        </ul>

        <h3 className="text-lg font-semibold mb-3">Version Intelligence</h3>
        <p className="mb-4">
          Track software version distribution across the network, identify upgrade trends,
          and ensure network compatibility.
        </p>
      </div>

      <div>
        <h2 className="text-2xl font-semibold mb-4">Data Export</h2>
        <p className="mb-4">Export network data for offline analysis:</p>
        <ul className="space-y-2 text-muted-foreground mb-6">
          <li>• <strong>CSV Format:</strong> Import into Excel, Google Sheets, or data analysis tools</li>
          <li>• <strong>JSON Format:</strong> Use in scripts, APIs, or custom applications</li>
          <li>• <strong>Network Stats:</strong> Export complete network overview</li>
          <li>• <strong>Node Data:</strong> Export filtered node lists</li>
        </ul>
      </div>

      <div className="bg-muted rounded-lg p-6 border border-border">
        <h3 className="font-semibold mb-3">Pro Tips</h3>
        <ul className="space-y-2 text-sm text-muted-foreground">
          <li>• Use search + filters together for precise node discovery</li>
          <li>• Check the Intelligence Panel regularly for network health updates</li>
          <li>• Export data periodically to track network growth over time</li>
          <li>• Compare health scores across different countries for insights</li>
          <li>• Monitor version distribution to identify when upgrades are needed</li>
        </ul>
      </div>

      <div>
        <h2 className="text-2xl font-semibold mb-4">Next Steps</h2>
        <ul className="space-y-2 text-muted-foreground">
          <li>• Learn about <Link href="/docs/guides/metrics" className="text-primary hover:underline">Metrics and Health Scoring</Link></li>
          <li>• Explore the <Link href="/docs/api/reference" className="text-primary hover:underline">API Reference</Link> for integrations</li>
          <li>• Deploy your own instance with the <Link href="/docs/platform/deployment" className="text-primary hover:underline">Deployment Guide</Link></li>
        </ul>
      </div>
    </div>
  );
}
