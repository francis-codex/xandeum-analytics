import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowRight, Code, Server, BookOpen, Zap } from "lucide-react";

export const metadata = {
  title: "Documentation - XandScan",
  description: "Complete documentation for XandScan - Xandeum pNode Network Explorer",
};

export default function DocsHome() {
  return (
    <div className="space-y-8">
      <div>
        <Badge variant="outline" className="mb-4">Documentation</Badge>
        <h1 className="text-4xl font-bold mb-4">XandScan Documentation</h1>
        <p className="text-xl text-muted-foreground">
          Complete guide to deploying, using, and integrating with the Xandeum pNode Network Explorer
        </p>
      </div>

      <div className="border-l-4 border-primary pl-6 my-8">
        <h2 className="text-2xl font-semibold mb-3">What is XandScan?</h2>
        <p className="text-muted-foreground mb-4">
          XandScan is a comprehensive network explorer and analytics platform for Xandeum pNodes (storage provider nodes).
          Built with Next.js and React, it provides real-time monitoring, performance metrics, and intelligent insights
          for the decentralized storage network.
        </p>
        <p className="text-muted-foreground">
          The platform connects to 8 live Xandeum pNode endpoints via pRPC API, delivering accurate network data
          with optimized performance and intelligent caching.
        </p>
      </div>

      <div>
        <h2 className="text-2xl font-semibold mb-4">Key Features</h2>
        <ul className="space-y-2 text-muted-foreground">
          <li className="flex items-start gap-2">
            <span className="text-primary mt-1">•</span>
            <span><strong>Live pNode Monitoring:</strong> Real-time data from 8 verified endpoints with automatic failover</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-primary mt-1">•</span>
            <span><strong>Network Health Grading:</strong> A-F letter grade system with composite scoring</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-primary mt-1">•</span>
            <span><strong>Intelligence Layer:</strong> AI-powered insights with real-time event detection</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-primary mt-1">•</span>
            <span><strong>Geographic Distribution:</strong> Interactive visualizations showing node distribution by country</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-primary mt-1">•</span>
            <span><strong>Performance Analytics:</strong> Historical trends, charts, and health score breakdowns</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-primary mt-1">•</span>
            <span><strong>Data Export:</strong> Export network and node data to CSV/JSON formats</span>
          </li>
        </ul>
      </div>

      <div>
        <h2 className="text-2xl font-semibold mb-4">Quick Navigation</h2>
        <div className="grid md:grid-cols-2 gap-4">
          <Link href="/docs/guides/quick-start">
            <Card className="hover:border-primary transition-colors cursor-pointer h-full">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Zap className="h-5 w-5 text-primary" />
                  Quick Start
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Get up and running with XandScan in minutes. Installation, configuration, and first deployment.
                </p>
                <div className="flex items-center gap-1 text-primary text-sm mt-3">
                  Get started <ArrowRight className="h-4 w-4" />
                </div>
              </CardContent>
            </Card>
          </Link>

          <Link href="/docs/guides/platform-guide">
            <Card className="hover:border-primary transition-colors cursor-pointer h-full">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BookOpen className="h-5 w-5 text-primary" />
                  Platform Guide
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Learn how to use XandScan effectively. Features, metrics, search, and data export.
                </p>
                <div className="flex items-center gap-1 text-primary text-sm mt-3">
                  Read guide <ArrowRight className="h-4 w-4" />
                </div>
              </CardContent>
            </Card>
          </Link>

          <Link href="/docs/platform/deployment">
            <Card className="hover:border-primary transition-colors cursor-pointer h-full">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Server className="h-5 w-5 text-primary" />
                  Deployment
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Deploy XandScan to production. Docker, Railway, Vercel, and custom deployment options.
                </p>
                <div className="flex items-center gap-1 text-primary text-sm mt-3">
                  Deploy now <ArrowRight className="h-4 w-4" />
                </div>
              </CardContent>
            </Card>
          </Link>

          <Link href="/docs/api/reference">
            <Card className="hover:border-primary transition-colors cursor-pointer h-full">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Code className="h-5 w-5 text-primary" />
                  API Reference
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Integrate with the pRPC API. Endpoints, authentication, and code examples.
                </p>
                <div className="flex items-center gap-1 text-primary text-sm mt-3">
                  View API docs <ArrowRight className="h-4 w-4" />
                </div>
              </CardContent>
            </Card>
          </Link>
        </div>
      </div>

      <div className="bg-muted rounded-lg p-6 border border-border">
        <h3 className="font-semibold mb-3">Technical Stack</h3>
        <div className="grid md:grid-cols-2 gap-4 text-sm">
          <div>
            <p className="font-medium mb-2">Frontend</p>
            <ul className="space-y-1 text-muted-foreground">
              <li>• Next.js 16.1+ (React 19)</li>
              <li>• TypeScript 5</li>
              <li>• Tailwind CSS 4</li>
              <li>• TanStack React Query v5</li>
            </ul>
          </div>
          <div>
            <p className="font-medium mb-2">Backend & Data</p>
            <ul className="space-y-1 text-muted-foreground">
              <li>• pRPC API Integration</li>
              <li>• Axios with Circuit Breaker</li>
              <li>• Smart Caching (60s stale time)</li>
              <li>• Parallel Data Fetching</li>
            </ul>
          </div>
        </div>
      </div>

      <div>
        <h3 className="text-xl font-semibold mb-3">Need Help?</h3>
        <p className="text-muted-foreground mb-4">
          If you encounter any issues or have questions:
        </p>
        <ul className="space-y-2 text-muted-foreground">
          <li className="flex items-start gap-2">
            <span className="text-primary mt-1">•</span>
            <span>Check the <Link href="/docs/guides/platform-guide" className="text-primary hover:underline">Platform Guide</Link> for common questions</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-primary mt-1">•</span>
            <span>Review the <Link href="/docs/api/reference" className="text-primary hover:underline">API Reference</Link> for integration help</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-primary mt-1">•</span>
            <span>Visit <a href="https://discord.gg/uqRSmmM5m" className="text-primary hover:underline" target="_blank" rel="noopener noreferrer">Xandeum Discord</a> for community support</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-primary mt-1">•</span>
            <span>Explore <a href="https://xandeum.network" className="text-primary hover:underline" target="_blank" rel="noopener noreferrer">xandeum.network</a> for network documentation</span>
          </li>
        </ul>
      </div>
    </div>
  );
}
