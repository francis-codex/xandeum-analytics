import { Badge } from "@/components/ui/badge";

export const metadata = {
  title: "Architecture - XandScan Documentation",
  description: "Technical architecture and design of XandScan",
};

export default function ArchitecturePage() {
  return (
    <div className="space-y-8">
      <div>
        <Badge variant="outline" className="mb-4">Platform</Badge>
        <h1 className="text-4xl font-bold mb-4">Architecture Overview</h1>
        <p className="text-xl text-muted-foreground">
          Technical architecture, data flow, and system design of XandScan
        </p>
      </div>

      <div>
        <h2 className="text-2xl font-semibold mb-4">System Architecture</h2>
        <pre className="bg-muted p-6 rounded-lg mb-6 text-sm overflow-x-auto">
          <code>{`┌──────────────────────────────────────────────────┐
│              User Browser/Client                 │
└───────────────────┬──────────────────────────────┘
                    │
          ┌─────────▼─────────┐
          │   Next.js App     │
          │   (React 19)      │
          └─────────┬─────────┘
                    │
     ┌──────────────┴──────────────┐
     │                             │
┌────▼────┐               ┌───────▼────────┐
│ React   │               │   API Routes   │
│ Query   │               │   /api/prpc    │
└────┬────┘               └───────┬────────┘
     │                             │
┌────▼──────────┐          ┌──────▼────────┐
│ PNodeClient   │──────────│  Axios Client │
│ (with Circuit │          │  (Timeout:5s) │
│  Breaker)     │          └──────┬────────┘
└───────────────┘                 │
                          ┌───────▼────────┐
                          │  8 pNode RPC   │
                          │   Endpoints    │
                          │   (Port 6000)  │
                          └────────────────┘`}</code>
        </pre>
      </div>

      <div>
        <h2 className="text-2xl font-semibold mb-4">Tech Stack</h2>

        <h3 className="text-lg font-semibold mb-3">Frontend</h3>
        <ul className="space-y-2 text-muted-foreground mb-6">
          <li>• <strong>Next.js 16.1+:</strong> React framework with App Router</li>
          <li>• <strong>React 19:</strong> Latest React with Server Components</li>
          <li>• <strong>TypeScript 5:</strong> Type-safe development</li>
          <li>• <strong>Tailwind CSS 4:</strong> Utility-first styling</li>
          <li>• <strong>Lucide React:</strong> Icon library</li>
          <li>• <strong>Recharts 3:</strong> Data visualization</li>
        </ul>

        <h3 className="text-lg font-semibold mb-3">Data Layer</h3>
        <ul className="space-y-2 text-muted-foreground mb-6">
          <li>• <strong>TanStack React Query v5:</strong> Server state management</li>
          <li>• <strong>Axios:</strong> HTTP client with interceptors</li>
          <li>• <strong>Circuit Breaker Pattern:</strong> Fault tolerance</li>
          <li>• <strong>Smart Caching:</strong> 60s stale time, no auto-refetch</li>
        </ul>

        <h3 className="text-lg font-semibold mb-3">Performance</h3>
        <ul className="space-y-2 text-muted-foreground mb-6">
          <li>• <strong>React.memo:</strong> Component memoization</li>
          <li>• <strong>Parallel Fetching:</strong> Simultaneous pNode queries</li>
          <li>• <strong>Code Splitting:</strong> Route-based lazy loading</li>
          <li>• <strong>Tree Shaking:</strong> Unused code elimination</li>
        </ul>
      </div>

      <div>
        <h2 className="text-2xl font-semibold mb-4">Data Flow</h2>

        <h3 className="text-lg font-semibold mb-3">Request Flow</h3>
        <ol className="space-y-3 text-muted-foreground mb-6">
          <li>
            <strong>1. User Action</strong>
            <p className="text-sm ml-4">User navigates to dashboard or nodes page</p>
          </li>
          <li>
            <strong>2. React Query Hook</strong>
            <p className="text-sm ml-4">Component calls <code className="bg-muted px-2 py-1 rounded">useAllPNodes()</code> or <code className="bg-muted px-2 py-1 rounded">useNetworkStats()</code></p>
          </li>
          <li>
            <strong>3. Cache Check</strong>
            <p className="text-sm ml-4">React Query checks if data is cached and fresh (&lt;60s old)</p>
          </li>
          <li>
            <strong>4. PNodeClient Request</strong>
            <p className="text-sm ml-4">If stale, PNodeClient fetches from pRPC endpoints</p>
          </li>
          <li>
            <strong>5. Circuit Breaker</strong>
            <p className="text-sm ml-4">Skips failing nodes, queries 8 endpoints in parallel</p>
          </li>
          <li>
            <strong>6. Data Transform</strong>
            <p className="text-sm ml-4">Raw pRPC data transformed to PNode type</p>
          </li>
          <li>
            <strong>7. Cache Update</strong>
            <p className="text-sm ml-4">React Query caches result for 60s</p>
          </li>
          <li>
            <strong>8. Component Render</strong>
            <p className="text-sm ml-4">Component receives data and renders UI</p>
          </li>
        </ol>
      </div>

      <div>
        <h2 className="text-2xl font-semibold mb-4">Key Components</h2>

        <h3 className="text-lg font-semibold mb-3">PNodeClient</h3>
        <p className="mb-3 text-muted-foreground">Core API client with resilience patterns:</p>
        <ul className="space-y-2 text-muted-foreground mb-6">
          <li>• 5-second timeout per request</li>
          <li>• Circuit breaker tracks failing nodes</li>
          <li>• Parallel execution across endpoints</li>
          <li>• No retry logic (fail fast)</li>
          <li>• Automatic data validation</li>
        </ul>

        <h3 className="text-lg font-semibold mb-3">React Query Hooks</h3>
        <p className="mb-3 text-muted-foreground">Custom hooks for data fetching:</p>
        <ul className="space-y-2 text-muted-foreground mb-6">
          <li>• <code className="bg-muted px-2 py-1 rounded text-xs">useAllPNodes()</code> - Fetch all pNodes</li>
          <li>• <code className="bg-muted px-2 py-1 rounded text-xs">usePNodeDetails(id)</code> - Fetch specific node</li>
          <li>• <code className="bg-muted px-2 py-1 rounded text-xs">useNetworkStats()</code> - Network statistics</li>
          <li>• 60s stale time prevents excessive requests</li>
          <li>• No background refetching (explicit refresh only)</li>
        </ul>

        <h3 className="text-lg font-semibold mb-3">Intelligence Layer</h3>
        <p className="mb-3 text-muted-foreground">AI-powered analytics:</p>
        <ul className="space-y-2 text-muted-foreground mb-6">
          <li>• <code className="bg-muted px-2 py-1 rounded text-xs">generateNetworkEvents()</code> - Detects events</li>
          <li>• <code className="bg-muted px-2 py-1 rounded text-xs">assessNetworkRisk()</code> - Risk analysis</li>
          <li>• <code className="bg-muted px-2 py-1 rounded text-xs">calculateNetworkHealth()</code> - Health scoring</li>
          <li>• Client-side computation using useMemo</li>
        </ul>
      </div>

      <div>
        <h2 className="text-2xl font-semibold mb-4">Performance Optimizations</h2>

        <h3 className="text-lg font-semibold mb-3">Bundle Size</h3>
        <ul className="space-y-2 text-muted-foreground mb-6">
          <li>• Tree shaking removes unused code</li>
          <li>• Route-based code splitting</li>
          <li>• Dynamic imports for heavy components</li>
          <li>• Zero runtime dependencies in production</li>
        </ul>

        <h3 className="text-lg font-semibold mb-3">Rendering Strategy</h3>
        <ul className="space-y-2 text-muted-foreground mb-6">
          <li>• Server Components for static content</li>
          <li>• Client Components for interactive UI</li>
          <li>• React.memo for expensive components</li>
          <li>• useMemo for complex calculations</li>
        </ul>

        <h3 className="text-lg font-semibold mb-3">Network Efficiency</h3>
        <ul className="space-y-2 text-muted-foreground mb-6">
          <li>• Parallel pNode endpoint queries</li>
          <li>• 60s cache reduces API calls</li>
          <li>• Circuit breaker prevents slow requests</li>
          <li>• 5s timeout ensures fast failure</li>
        </ul>
      </div>

      <div>
        <h2 className="text-2xl font-semibold mb-4">Security Considerations</h2>
        <ul className="space-y-2 text-muted-foreground">
          <li>• No authentication required (read-only platform)</li>
          <li>• Environment variables for sensitive config</li>
          <li>• CORS configured for API routes</li>
          <li>• Input validation on all user inputs</li>
          <li>• XSS protection via React's automatic escaping</li>
          <li>• HTTPS enforced in production</li>
        </ul>
      </div>

      <div className="bg-muted rounded-lg p-6 border border-border">
        <h3 className="font-semibold mb-3">Design Principles</h3>
        <ul className="space-y-2 text-sm text-muted-foreground">
          <li>• <strong>Fail Fast:</strong> 5s timeout, no retries</li>
          <li>• <strong>Resilience:</strong> Circuit breaker prevents cascading failures</li>
          <li>• <strong>Performance:</strong> Parallel fetching, smart caching</li>
          <li>• <strong>User Experience:</strong> Loading states, error boundaries</li>
          <li>• <strong>Maintainability:</strong> TypeScript, modular components</li>
        </ul>
      </div>
    </div>
  );
}
