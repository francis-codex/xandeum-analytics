import { Badge } from "@/components/ui/badge";

export const metadata = {
  title: "Quick Start - XandScan Documentation",
  description: "Get up and running with XandScan in minutes",
};

export default function QuickStartPage() {
  return (
    <div className="space-y-8">
      <div>
        <Badge variant="outline" className="mb-4">Getting Started</Badge>
        <h1 className="text-4xl font-bold mb-4">Quick Start Guide</h1>
        <p className="text-xl text-muted-foreground">
          Get XandScan up and running in under 5 minutes
        </p>
      </div>

      <div>
        <h2 className="text-2xl font-semibold mb-4">Prerequisites</h2>
        <p className="mb-3">Before you begin, ensure you have:</p>
        <ul className="space-y-2 text-muted-foreground">
          <li className="flex items-start gap-2">
            <span className="text-primary mt-1">•</span>
            <span><strong>Node.js 20.x or higher</strong> - <a href="https://nodejs.org" className="text-primary hover:underline" target="_blank" rel="noopener noreferrer">Download here</a></span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-primary mt-1">•</span>
            <span><strong>npm</strong> or <strong>yarn</strong> package manager (comes with Node.js)</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-primary mt-1">•</span>
            <span><strong>Git</strong> - For cloning the repository</span>
          </li>
        </ul>
      </div>

      <div>
        <h2 className="text-2xl font-semibold mb-4">Installation</h2>

        <h3 className="text-lg font-semibold mb-3">Step 1: Clone the Repository</h3>
        <pre className="bg-muted p-4 rounded-lg overflow-x-auto mb-6">
          <code>git clone https://github.com/your-org/xandscan.git{'\n'}cd xandscan</code>
        </pre>

        <h3 className="text-lg font-semibold mb-3">Step 2: Install Dependencies</h3>
        <pre className="bg-muted p-4 rounded-lg overflow-x-auto mb-6">
          <code>npm install{'\n'}# or{'\n'}yarn install</code>
        </pre>

        <h3 className="text-lg font-semibold mb-3">Step 3: Set Up Environment Variables</h3>
        <p className="mb-3">Create a <code className="bg-muted px-2 py-1 rounded">.env.local</code> file in the root directory:</p>
        <pre className="bg-muted p-4 rounded-lg overflow-x-auto mb-6">
          <code>{`# Optional: Customize version
NEXT_PUBLIC_APP_VERSION=1.0.0

# Optional: API configuration (uses defaults if not set)
NEXT_PUBLIC_XANDEUM_RPC_URL=https://api.xandeum.network`}</code>
        </pre>
        <p className="text-sm text-muted-foreground mb-6">
          Note: Environment variables are optional. XandScan uses hardcoded pNode endpoints by default.
        </p>

        <h3 className="text-lg font-semibold mb-3">Step 4: Run Development Server</h3>
        <pre className="bg-muted p-4 rounded-lg overflow-x-auto mb-6">
          <code>npm run dev{'\n'}# or{'\n'}yarn dev</code>
        </pre>
        <p className="mb-6">
          Open <a href="http://localhost:3000" className="text-primary hover:underline">http://localhost:3000</a> in your browser to see XandScan running!
        </p>
      </div>

      <div>
        <h2 className="text-2xl font-semibold mb-4">Building for Production</h2>
        <p className="mb-4">To create an optimized production build:</p>

        <pre className="bg-muted p-4 rounded-lg overflow-x-auto mb-4">
          <code>npm run build{'\n'}npm run start</code>
        </pre>

        <p className="text-muted-foreground mb-4">
          The build process:
        </p>
        <ul className="space-y-2 text-muted-foreground mb-6">
          <li className="flex items-start gap-2">
            <span className="text-primary mt-1">•</span>
            <span>Compiles TypeScript to JavaScript</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-primary mt-1">•</span>
            <span>Optimizes bundles with code splitting</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-primary mt-1">•</span>
            <span>Generates static pages where possible</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-primary mt-1">•</span>
            <span>Minifies CSS and JavaScript</span>
          </li>
        </ul>
      </div>

      <div>
        <h2 className="text-2xl font-semibold mb-4">Verifying Installation</h2>
        <p className="mb-4">Once the server is running, you should see:</p>
        <ul className="space-y-2 text-muted-foreground mb-6">
          <li className="flex items-start gap-2">
            <span className="text-primary mt-1">•</span>
            <span><strong>Dashboard:</strong> Network statistics and health grade</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-primary mt-1">•</span>
            <span><strong>Top Nodes:</strong> Grid of best performing pNodes</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-primary mt-1">•</span>
            <span><strong>Network Analytics:</strong> Geographic distribution and insights</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-primary mt-1">•</span>
            <span><strong>Loading Time:</strong> Initial load in 6-7 seconds (live data)</span>
          </li>
        </ul>
      </div>

      <div className="bg-muted rounded-lg p-6 border border-border">
        <h3 className="font-semibold mb-3">Common Issues</h3>
        <div className="space-y-4 text-sm">
          <div>
            <p className="font-medium mb-1">Port 3000 already in use</p>
            <p className="text-muted-foreground">Solution: Change the port by running <code className="bg-background px-2 py-1 rounded">PORT=3001 npm run dev</code></p>
          </div>
          <div>
            <p className="font-medium mb-1">Module not found errors</p>
            <p className="text-muted-foreground">Solution: Delete <code className="bg-background px-2 py-1 rounded">node_modules</code> and <code className="bg-background px-2 py-1 rounded">.next</code>, then run <code className="bg-background px-2 py-1 rounded">npm install</code> again</p>
          </div>
          <div>
            <p className="font-medium mb-1">Data not loading</p>
            <p className="text-muted-foreground">Solution: This is normal if pNode endpoints are unreachable. Check your internet connection and firewall settings.</p>
          </div>
        </div>
      </div>

      <div>
        <h2 className="text-2xl font-semibold mb-4">Next Steps</h2>
        <ul className="space-y-2 text-muted-foreground">
          <li className="flex items-start gap-2">
            <span className="text-primary mt-1">•</span>
            <span>Read the <a href="/docs/guides/platform-guide" className="text-primary hover:underline">Platform Guide</a> to learn about all features</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-primary mt-1">•</span>
            <span>Deploy to production with the <a href="/docs/platform/deployment" className="text-primary hover:underline">Deployment Guide</a></span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-primary mt-1">•</span>
            <span>Explore the <a href="/docs/api/reference" className="text-primary hover:underline">API Reference</a> for custom integrations</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-primary mt-1">•</span>
            <span>Understand <a href="/docs/guides/metrics" className="text-primary hover:underline">Metrics and Health Scoring</a></span>
          </li>
        </ul>
      </div>
    </div>
  );
}
