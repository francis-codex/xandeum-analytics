import { Badge } from "@/components/ui/badge";

export const metadata = {
  title: "Deployment Guide - XandScan Documentation",
  description: "Deploy XandScan to production on various platforms",
};

export default function DeploymentPage() {
  return (
    <div className="space-y-8">
      <div>
        <Badge variant="outline" className="mb-4">Platform</Badge>
        <h1 className="text-4xl font-bold mb-4">Deployment Guide</h1>
        <p className="text-xl text-muted-foreground">
          Deploy XandScan to production on Docker, Railway, Vercel, or custom infrastructure
        </p>
      </div>

      <div className="bg-muted rounded-lg p-6 border border-border">
        <h3 className="font-semibold mb-2">Before You Deploy</h3>
        <p className="text-sm text-muted-foreground">
          Ensure you have completed local development setup and testing. See the <a href="/docs/guides/quick-start" className="text-primary hover:underline">Quick Start Guide</a> first.
        </p>
      </div>

      <div>
        <h2 className="text-2xl font-semibold mb-4">Docker Deployment</h2>
        <p className="mb-4">The recommended method for production deployments.</p>

        <h3 className="text-lg font-semibold mb-3">Step 1: Create Dockerfile</h3>
        <p className="mb-3 text-sm text-muted-foreground">Create a <code className="bg-muted px-2 py-1 rounded">Dockerfile</code> in the project root:</p>
        <pre className="bg-muted p-4 rounded-lg overflow-x-auto mb-6 text-sm">
          <code>{`FROM node:20-alpine AS base

# Install dependencies only when needed
FROM base AS deps
RUN apk add --no-cache libc6-compat
WORKDIR /app

COPY package*.json ./
RUN npm ci

# Rebuild the source code only when needed
FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Set environment variables
ENV NEXT_PUBLIC_APP_VERSION=1.0.0
ENV NODE_ENV=production

RUN npm run build

# Production image
FROM base AS runner
WORKDIR /app

ENV NODE_ENV=production

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

COPY --from=builder /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs

EXPOSE 3000

ENV PORT=3000

CMD ["node", "server.js"]`}</code>
        </pre>

        <h3 className="text-lg font-semibold mb-3">Step 2: Build and Run</h3>
        <pre className="bg-muted p-4 rounded-lg overflow-x-auto mb-6 text-sm">
          <code>{`# Build the image
docker build -t xandscan .

# Run the container
docker run -p 3000:3000 \\
  -e NEXT_PUBLIC_APP_VERSION=1.0.0 \\
  xandscan`}</code>
        </pre>

        <h3 className="text-lg font-semibold mb-3">Step 3: Docker Compose (Optional)</h3>
        <p className="mb-3 text-sm text-muted-foreground">Create <code className="bg-muted px-2 py-1 rounded">docker-compose.yml</code>:</p>
        <pre className="bg-muted p-4 rounded-lg overflow-x-auto mb-6 text-sm">
          <code>{`version: '3.8'
services:
  xandscan:
    build: .
    ports:
      - "3000:3000"
    environment:
      - NEXT_PUBLIC_APP_VERSION=1.0.0
      - NODE_ENV=production
    restart: unless-stopped`}</code>
        </pre>
        <pre className="bg-muted p-4 rounded-lg overflow-x-auto mb-6 text-sm">
          <code>docker-compose up -d</code>
        </pre>
      </div>

      <div>
        <h2 className="text-2xl font-semibold mb-4">Railway Deployment</h2>
        <p className="mb-4">Deploy to Railway with zero configuration.</p>

        <h3 className="text-lg font-semibold mb-3">Option 1: One-Click Deploy</h3>
        <ol className="space-y-2 text-muted-foreground mb-6">
          <li>1. Click the "Deploy on Railway" button (if available in repository)</li>
          <li>2. Connect your GitHub account</li>
          <li>3. Configure environment variables (optional)</li>
          <li>4. Deploy</li>
        </ol>

        <h3 className="text-lg font-semibold mb-3">Option 2: Manual Deployment</h3>
        <ol className="space-y-2 text-muted-foreground mb-6">
          <li>1. Visit <a href="https://railway.app" className="text-primary hover:underline" target="_blank" rel="noopener noreferrer">railway.app</a> and sign in</li>
          <li>2. Click "New Project" → "Deploy from GitHub repo"</li>
          <li>3. Select your XandScan repository</li>
          <li>4. Railway auto-detects Next.js and configures build settings</li>
          <li>5. Add environment variables (optional):
            <ul className="ml-6 mt-2 space-y-1">
              <li>• <code className="bg-background px-2 py-1 rounded text-xs">NEXT_PUBLIC_APP_VERSION</code></li>
            </ul>
          </li>
          <li>6. Click "Deploy" - Railway handles the rest</li>
        </ol>

        <p className="text-sm text-muted-foreground mb-4">
          Railway provides: Automatic HTTPS, custom domains, auto-scaling, and CDN integration.
        </p>
      </div>

      <div>
        <h2 className="text-2xl font-semibold mb-4">Custom VPS/Server Deployment</h2>
        <p className="mb-4">Deploy on any Linux server with Node.js.</p>

        <h3 className="text-lg font-semibold mb-3">Prerequisites</h3>
        <ul className="space-y-1 text-muted-foreground mb-6">
          <li>• Ubuntu 20.04+ or similar Linux distribution</li>
          <li>• Node.js 20+ installed</li>
          <li>• Nginx or Apache for reverse proxy</li>
          <li>• PM2 for process management</li>
        </ul>

        <h3 className="text-lg font-semibold mb-3">Deployment Steps</h3>
        <pre className="bg-muted p-4 rounded-lg overflow-x-auto mb-6 text-sm">
          <code>{`# 1. Clone and build
git clone https://github.com/your-org/xandscan.git
cd xandscan
npm install
npm run build

# 2. Install PM2
npm install -g pm2

# 3. Start with PM2
pm2 start npm --name "xandscan" -- start

# 4. Set up PM2 to start on boot
pm2 startup
pm2 save

# 5. Check status
pm2 status`}</code>
        </pre>

        <h3 className="text-lg font-semibold mb-3">Nginx Configuration</h3>
        <p className="mb-3 text-sm text-muted-foreground">Create <code className="bg-muted px-2 py-1 rounded">/etc/nginx/sites-available/xandscan</code>:</p>
        <pre className="bg-muted p-4 rounded-lg overflow-x-auto mb-6 text-sm">
          <code>{`server {
    listen 80;
    server_name your-domain.com;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}`}</code>
        </pre>
        <pre className="bg-muted p-4 rounded-lg overflow-x-auto mb-6 text-sm">
          <code>{`# Enable site
sudo ln -s /etc/nginx/sites-available/xandscan /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl reload nginx`}</code>
        </pre>
      </div>

      <div>
        <h2 className="text-2xl font-semibold mb-4">Environment Variables</h2>
        <p className="mb-4">Configuration options for all deployment methods:</p>
        <div className="space-y-3">
          <div className="border-l-4 border-primary pl-4">
            <p className="font-mono text-sm mb-1">NEXT_PUBLIC_APP_VERSION</p>
            <p className="text-sm text-muted-foreground">Version number displayed in UI (default: 1.0.0)</p>
          </div>
          <div className="border-l-4 border-muted-foreground pl-4">
            <p className="font-mono text-sm mb-1">NODE_ENV</p>
            <p className="text-sm text-muted-foreground">Set to "production" for production builds (auto-set by most platforms)</p>
          </div>
        </div>
      </div>

      <div>
        <h2 className="text-2xl font-semibold mb-4">Post-Deployment Checklist</h2>
        <ul className="space-y-2 text-muted-foreground">
          <li className="flex items-start gap-2">
            <input type="checkbox" className="mt-1" />
            <span>Verify dashboard loads and shows network data</span>
          </li>
          <li className="flex items-start gap-2">
            <input type="checkbox" className="mt-1" />
            <span>Test node search and filtering</span>
          </li>
          <li className="flex items-start gap-2">
            <input type="checkbox" className="mt-1" />
            <span>Confirm data export (CSV/JSON) works</span>
          </li>
          <li className="flex items-start gap-2">
            <input type="checkbox" className="mt-1" />
            <span>Check mobile responsiveness</span>
          </li>
          <li className="flex items-start gap-2">
            <input type="checkbox" className="mt-1" />
            <span>Verify HTTPS is enabled (if custom domain)</span>
          </li>
          <li className="flex items-start gap-2">
            <input type="checkbox" className="mt-1" />
            <span>Monitor performance (should load in 6-7 seconds)</span>
          </li>
        </ul>
      </div>

      <div className="bg-muted rounded-lg p-6 border border-border">
        <h3 className="font-semibold mb-3">Production Best Practices</h3>
        <ul className="space-y-2 text-sm text-muted-foreground">
          <li>• Use a CDN for static assets (automatic on Railway/Vercel)</li>
          <li>• Enable compression (gzip/brotli)</li>
          <li>• Set up monitoring and error tracking</li>
          <li>• Configure automated backups</li>
          <li>• Use environment-specific configurations</li>
          <li>• Keep dependencies up to date</li>
        </ul>
      </div>
    </div>
  );
}
