import { Badge } from "@/components/ui/badge";

export const metadata = {
  title: "Understanding Metrics - XandScan Documentation",
  description: "Learn how XandScan calculates health scores and metrics",
};

export default function MetricsPage() {
  return (
    <div className="space-y-8">
      <div>
        <Badge variant="outline" className="mb-4">User Guide</Badge>
        <h1 className="text-4xl font-bold mb-4">Understanding Metrics</h1>
        <p className="text-xl text-muted-foreground">
          Deep dive into health scores, performance metrics, and network analytics
        </p>
      </div>

      <div>
        <h2 className="text-2xl font-semibold mb-4">Health Score System</h2>
        <p className="mb-4">
          XandScan uses a storage-first scoring system optimized for Xandeum's mission
          to provide exabyte-scale storage for Solana dApps.
        </p>

        <h3 className="text-lg font-semibold mb-3">Score Components</h3>
        <div className="space-y-4 mb-6">
          <div>
            <p className="font-medium mb-1">Storage Health (30% weight)</p>
            <p className="text-sm text-muted-foreground">
              Optimal capacity utilization between 60-80%. Too low means wasted capacity,
              too high risks running out of space.
            </p>
          </div>
          <div>
            <p className="font-medium mb-1">Availability (30% weight)</p>
            <p className="text-sm text-muted-foreground">
              Percentage of nodes actively providing storage access. Higher is better.
            </p>
          </div>
          <div>
            <p className="font-medium mb-1">Version Health (25% weight)</p>
            <p className="text-sm text-muted-foreground">
              Percentage of nodes running the latest software version for compatibility.
            </p>
          </div>
          <div>
            <p className="font-medium mb-1">Distribution (15% weight)</p>
            <p className="text-sm text-muted-foreground">
              Geographic diversity and decentralization across countries and regions.
            </p>
          </div>
        </div>

        <div className="bg-muted p-4 rounded-lg mb-6">
          <p className="font-mono text-sm">
            Health Score = (Storage × 30%) + (Availability × 30%) + (Version × 25%) + (Distribution × 15%)
          </p>
        </div>
      </div>

      <div>
        <h2 className="text-2xl font-semibold mb-4">Network Health Grade</h2>
        <p className="mb-4">
          The letter grade system provides quick assessment based on composite scoring:
        </p>

        <div className="space-y-3 mb-6">
          <div className="border-l-4 border-primary pl-4">
            <p className="font-semibold">A+ / A (90-100 points)</p>
            <p className="text-sm text-muted-foreground">
              Excellent: Uptime 99%+, latency &lt;50ms, active nodes &gt;90%, optimal storage
            </p>
          </div>
          <div className="border-l-4 border-primary/60 pl-4">
            <p className="font-semibold">B (70-89 points)</p>
            <p className="text-sm text-muted-foreground">
              Good: Uptime 95%+, latency &lt;100ms, active nodes 80-90%, good storage management
            </p>
          </div>
          <div className="border-l-4 border-primary/30 pl-4">
            <p className="font-semibold">C (50-69 points)</p>
            <p className="text-sm text-muted-foreground">
              Fair: Uptime 90%+, latency &lt;200ms, monitoring recommended
            </p>
          </div>
          <div className="border-l-4 border-muted-foreground pl-4">
            <p className="font-semibold">D / F (&lt;50 points)</p>
            <p className="text-sm text-muted-foreground">
              Poor: Low uptime, high latency, or critical storage/availability issues
            </p>
          </div>
        </div>
      </div>

      <div>
        <h2 className="text-2xl font-semibold mb-4">Performance Metrics Explained</h2>

        <h3 className="text-lg font-semibold mb-3">Uptime</h3>
        <p className="mb-3 text-muted-foreground">
          Percentage of time a node is online and responsive. Calculated as:
        </p>
        <div className="bg-muted p-4 rounded-lg mb-4">
          <p className="font-mono text-sm">Uptime = (Time Online / Total Time) × 100</p>
        </div>
        <ul className="space-y-1 text-sm text-muted-foreground mb-6">
          <li>• 99%+ = Exceptional (less than 7 hours downtime per month)</li>
          <li>• 95-99% = Very good (1-2 days downtime per month)</li>
          <li>• 90-95% = Good (2-3 days downtime per month)</li>
          <li>• &lt;90% = Needs improvement</li>
        </ul>

        <h3 className="text-lg font-semibold mb-3">Latency</h3>
        <p className="mb-3 text-muted-foreground">
          Average time for a node to respond to requests, measured in milliseconds (ms):
        </p>
        <ul className="space-y-1 text-sm text-muted-foreground mb-6">
          <li>• &lt;50ms = Excellent (local/nearby node)</li>
          <li>• 50-100ms = Very good (regional node)</li>
          <li>• 100-200ms = Good (distant node)</li>
          <li>• 200-500ms = Fair (international node)</li>
          <li>• &gt;500ms = Poor (very distant or overloaded)</li>
        </ul>

        <h3 className="text-lg font-semibold mb-3">Storage Efficiency</h3>
        <p className="mb-3 text-muted-foreground">
          How well storage capacity is utilized:
        </p>
        <ul className="space-y-1 text-sm text-muted-foreground mb-6">
          <li>• 60-80% used = Optimal (room to grow, actively used)</li>
          <li>• 40-60% used = Good (some capacity available)</li>
          <li>• &lt;40% used = Underutilized (wasted capacity)</li>
          <li>• &gt;80% used = High utilization (may need expansion soon)</li>
          <li>• &gt;90% used = Critical (expansion recommended)</li>
        </ul>

        <h3 className="text-lg font-semibold mb-3">Success Rate</h3>
        <p className="mb-3 text-muted-foreground">
          Percentage of successful operations vs. total operations:
        </p>
        <ul className="space-y-1 text-sm text-muted-foreground mb-6">
          <li>• 99%+ = Excellent (very reliable)</li>
          <li>• 95-99% = Good (occasional failures)</li>
          <li>• 90-95% = Fair (frequent failures)</li>
          <li>• &lt;90% = Poor (unreliable node)</li>
        </ul>
      </div>

      <div>
        <h2 className="text-2xl font-semibold mb-4">Decentralization Score</h2>
        <p className="mb-4 text-muted-foreground">
          Measures geographic distribution and network resilience (0-100):
        </p>
        <ul className="space-y-2 text-muted-foreground mb-6">
          <li>• Based on number of unique countries and regions</li>
          <li>• Considers distribution evenness (not just total countries)</li>
          <li>• Higher scores indicate better fault tolerance</li>
          <li>• 90+ = Highly decentralized</li>
          <li>• 70-89 = Well distributed</li>
          <li>• 50-69 = Moderately distributed</li>
          <li>• &lt;50 = Centralized (concentration risk)</li>
        </ul>
      </div>

      <div className="bg-muted rounded-lg p-6 border border-border">
        <h3 className="font-semibold mb-3">Key Takeaways</h3>
        <ul className="space-y-2 text-sm text-muted-foreground">
          <li>• Storage and availability are weighted highest (60% combined)</li>
          <li>• Health scores update every 30 seconds with live data</li>
          <li>• Geographic diversity improves network resilience</li>
          <li>• Version health ensures network-wide compatibility</li>
          <li>• All metrics are calculated from real pNode data via pRPC</li>
        </ul>
      </div>
    </div>
  );
}
