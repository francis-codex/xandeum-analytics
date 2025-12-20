# XandScan - Xandeum pNode Network Explorer

A comprehensive, production-ready network explorer and analytics platform for Xandeum pNodes (storage provider nodes). Built with Next.js 16, React 19, and TypeScript 5, XandScan delivers real-time monitoring, intelligent insights, and professional-grade analytics for the decentralized storage network.

## Live Status

**PRODUCTION READY** - Currently monitoring **8 live Xandeum pNode endpoints** via pRPC API (port 6000) with optimized performance, intelligent caching, and automatic failover.

## Table of Contents

- [Features](#features)
- [Quick Start](#quick-start)
- [Documentation](#documentation)
- [Deployment](#deployment)
- [Usage Guide](#usage-guide)
- [Technical Architecture](#technical-architecture)
- [API Integration](#api-integration)
- [Performance](#performance)
- [Contributing](#contributing)
- [Support](#support)

## Features

### Core Capabilities

- **Live pNode Monitoring**: Real-time data from 8 verified endpoints with automatic failover and circuit breaker protection
- **Network Health Grading**: A-F letter grade system with weighted composite scoring optimized for storage networks
- **Intelligence Layer**: AI-powered insights detecting network events, risks, and performance trends
- **Geographic Analytics**: Interactive visualizations showing node distribution across countries with detailed metrics
- **Performance Tracking**: Historical trends, charts, and comprehensive health score breakdowns
- **Advanced Search**: Multi-field search with real-time filtering by moniker, public key, location, and status
- **Data Export**: Export network and node data to CSV/JSON formats for offline analysis
- **Professional UI**: Dark mode support, loading skeletons, and fully responsive design

### Unique Differentiators

- **Storage-First Scoring**: Health metrics weighted for Xandeum's exabyte-scale storage mission (60% combined weight on storage and availability)
- **Circuit Breaker Pattern**: Intelligent failover prevents cascading delays from unresponsive nodes
- **Version Intelligence**: Track software version distribution and upgrade trends across the network
- **At-Risk Node Detection**: Proactive monitoring with categorized risk levels and actionable insights
- **Zero Auto-Refetch**: Smart caching strategy prevents excessive network requests while maintaining data freshness

## Quick Start

### Prerequisites

- Node.js 20.x or higher
- npm or yarn package manager
- Git for repository cloning

### Installation (5 minutes)

```bash
# 1. Clone repository
git clone https://github.com/your-org/xandscan.git
cd xandscan

# 2. Install dependencies
npm install

# 3. Run development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) - XandScan is now running with live pNode data.

### Environment Configuration (Optional)

Create `.env.local` to customize:

```env
NEXT_PUBLIC_APP_VERSION=1.0.0
```

Note: XandScan uses hardcoded pNode endpoints by default. No additional configuration required.

### Production Build

```bash
npm run build
npm run start
```

Production builds include:
- TypeScript compilation
- Code splitting and tree shaking
- CSS minification
- Static page generation
- Bundle optimization

## Documentation

Comprehensive documentation is available at `/docs` when running XandScan:

### Getting Started
- **Introduction** - Overview and key features
- **Quick Start** - Installation and first deployment

### User Guides
- **Platform Guide** - Complete feature walkthrough
- **Understanding Metrics** - Health scores and performance calculations

### Platform
- **Deployment** - Docker, Railway, Vercel, and VPS deployment guides
- **Architecture** - Technical design and data flow

### API & Integration
- **API Reference** - Complete type definitions and React Query hooks
- **Integration Guide** - Practical examples for custom features

## Deployment

### Docker (Recommended for Production)

```bash
# Build image
docker build -t xandscan .

# Run container
docker run -p 3000:3000 -e NEXT_PUBLIC_APP_VERSION=1.0.0 xandscan
```

### Railway (Zero Configuration)

1. Visit [railway.app](https://railway.app)
2. Create new project from GitHub repository
3. Railway auto-detects Next.js and deploys
4. Automatic HTTPS, custom domains, and CDN included

### Vercel (Optimal Next.js Performance)

```bash
# Install Vercel CLI
npm install -g vercel

# Deploy
vercel
```

Or use the Vercel dashboard at [vercel.com/new](https://vercel.com/new)

### Custom VPS/Server

```bash
# Install PM2 process manager
npm install -g pm2

# Build and start
npm run build
pm2 start npm --name "xandscan" -- start
pm2 startup
pm2 save
```

Configure Nginx reverse proxy:

```nginx
server {
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
}
```

For detailed deployment instructions, see [docs/platform/deployment](/docs/platform/deployment).

## Usage Guide

### Dashboard

The main dashboard provides:
- **Network Health Grade**: A-F scoring based on uptime, storage, latency, and decentralization
- **Network Statistics**: Total nodes, storage capacity, average uptime, and decentralization metrics
- **Intelligence Panel**: AI-powered insights detecting critical events and network trends
- **Health Score Breakdown**: Weighted scoring showing storage (30%), availability (30%), version (25%), and distribution (15%)
- **Geographic Distribution**: Node counts and health metrics by country
- **Top Performers**: Leaderboards for highest uptime, most storage, and lowest latency

### Node Exploration

Navigate to `/nodes` to:
- **Search**: Find nodes by moniker, public key, city, or country
- **Filter**: Show only active, inactive, or syncing nodes
- **Sort**: Order by health score, uptime, storage usage, latency, or name
- **View Details**: Click any node for comprehensive metrics and historical charts

### Understanding Health Scores

XandScan uses storage-optimized scoring:

**Formula**: Health Score = (Storage × 30%) + (Availability × 30%) + (Version × 25%) + (Distribution × 15%)

**Score Components**:
- **Storage Health (30%)**: Optimal utilization at 60-80% capacity
- **Availability (30%)**: Percentage of nodes providing active storage access
- **Version Health (25%)**: Nodes running latest software for compatibility
- **Distribution (15%)**: Geographic diversity across countries and regions

**Grade Ranges**:
- A+/A (90-100): Excellent - Network performing optimally
- B (70-89): Good - Minor improvements recommended
- C (50-69): Fair - Monitoring and optimization needed
- D/F (<50): Poor - Critical issues require immediate attention

### Data Export

Export network data for analysis:
- **CSV Format**: Compatible with Excel, Google Sheets, and data analysis tools
- **JSON Format**: For scripts, APIs, and custom applications
- **Network Stats**: Complete network overview with all metrics
- **Filtered Nodes**: Export search results and filtered node lists

## Technical Architecture

### Tech Stack

**Frontend**
- Next.js 16.1+ (React 19, App Router, Server Components)
- TypeScript 5 (strict mode, full type safety)
- Tailwind CSS 4 (utility-first, dark mode)
- TanStack React Query v5 (server state, caching)
- Recharts 3 (data visualization)

**Data Layer**
- pRPC API Integration (port 6000 endpoints)
- Axios with circuit breaker pattern
- 5-second timeout per request
- 60-second cache stale time
- No automatic background refetch

**Performance**
- React.memo for expensive components
- useMemo for complex calculations
- Parallel endpoint querying
- Route-based code splitting
- Tree shaking and bundle optimization

### Data Flow

```
User → Component → React Query Hook → PNodeClient → Circuit Breaker → 8 pRPC Endpoints
                       ↓                                                       ↓
                   Cache (60s) ←──── Data Transform ←───── pRPC Response
                       ↓
                   Component Render
```

### Key Design Principles

- **Fail Fast**: 5-second timeout, no retry logic
- **Resilience**: Circuit breaker skips failing nodes
- **Performance**: Parallel fetching, smart caching
- **User Experience**: Loading states, error boundaries, responsive design
- **Maintainability**: TypeScript, modular architecture, comprehensive documentation

## API Integration

### React Query Hooks

```typescript
import { useAllPNodes, useNetworkStats } from '@/lib/hooks';

function Dashboard() {
  const { data: nodes, isLoading, error } = useAllPNodes();
  const { data: stats } = useNetworkStats();

  return (
    <div>
      <h2>Total Nodes: {stats?.totalNodes}</h2>
      <h2>Active: {stats?.activeNodes}</h2>
    </div>
  );
}
```

### PNode Data Structure

```typescript
interface PNode {
  publicKey: string;
  moniker: string;
  ipAddress: string;
  version: string;
  status: 'active' | 'inactive' | 'syncing';
  uptime: number;
  storage: {
    used: number;
    total: number;
    available: number;
    usagePercentage: number;
  };
  performance: {
    avgLatency: number;
    successRate: number;
    bandwidthMbps: number;
  };
  location: {
    country: string;
    countryCode: string;
    city: string;
    lat: number;
    lng: number;
  };
  healthScore: number;
}
```

For complete API documentation, see [docs/api/reference](/docs/api/reference).

## Performance

### Metrics

- **Initial Load**: 6-7 seconds (live data from 8 endpoints)
- **Subsequent Loads**: <1 second (cached data)
- **Node Detail Page**: 2-3 seconds
- **Bundle Size**: Optimized with code splitting
- **Mobile Responsiveness**: 100% compatible

### Optimizations

- Circuit breaker prevents slow endpoints from blocking UI
- Parallel fetching queries all 8 endpoints simultaneously
- 60-second cache prevents excessive network requests
- React.memo reduces unnecessary re-renders
- Tree shaking eliminates unused code
- Route-based lazy loading reduces initial bundle size

## Project Structure

```
xandscan/
├── src/
│   ├── app/                    # Next.js app directory
│   │   ├── docs/              # Documentation pages
│   │   │   ├── guides/        # User guides
│   │   │   ├── platform/      # Platform documentation
│   │   │   └── api/           # API reference
│   │   ├── nodes/             # Node list and details
│   │   ├── api/               # API routes (pRPC proxy)
│   │   └── page.tsx           # Dashboard
│   ├── components/            # React components
│   │   ├── ui/                # Reusable UI components
│   │   ├── Header.tsx         # Shared navigation
│   │   ├── DocsSidebar.tsx    # Documentation sidebar
│   │   ├── NetworkStats.tsx   # Statistics display
│   │   └── NodeCard.tsx       # Node card component
│   ├── lib/                   # Core libraries
│   │   ├── pnode-client.ts    # pRPC API client
│   │   ├── hooks.ts           # React Query hooks
│   │   ├── intelligence.ts    # AI analytics
│   │   ├── export.ts          # Data export utilities
│   │   └── constants.ts       # App constants
│   └── types/                 # TypeScript definitions
│       └── pnode.ts           # pNode types
├── docs/                      # Markdown documentation (reference)
├── public/                    # Static assets
└── package.json
```

## Contributing

Contributions are welcome! Please follow these guidelines:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Development Guidelines

- Follow TypeScript strict mode
- Use Tailwind CSS for styling (no inline styles)
- Write tests for new features
- Update documentation for API changes
- No emojis in code, docs, or README (professional presentation)

## Support

### Resources

- **Documentation**: [/docs](/docs) - Complete platform documentation
- **GitHub Issues**: [Report bugs or request features](https://github.com/your-org/xandscan/issues)
- **Xandeum Discord**: [Join community](https://discord.gg/uqRSmmM5m)
- **Website**: [xandeum.network](https://xandeum.network)

### Common Issues

**Port 3000 in use**
```bash
PORT=3001 npm run dev
```

**Module not found**
```bash
rm -rf node_modules .next
npm install
```

**Data not loading**
- Check internet connection
- Verify firewall allows port 6000 connections
- Check browser console for errors

## License

MIT License - see [LICENSE](LICENSE) file for details.

## Acknowledgments

- Built with [Next.js](https://nextjs.org/) and modern React ecosystem
- Powered by the Xandeum pNode network
- Created for the Xandeum pNode Analytics Bounty
- Design inspired by professional blockchain explorers

---

**Project**: XandScan - Xandeum pNode Network Explorer
**Version**: 1.0.0
**Status**: Production Ready
**Last Updated**: December 2025
**Built By**: XandScan Team for Xandeum Labs
