'use client';

import { useState, useMemo } from "react";
import { useAllPNodes, useNetworkStats } from "@/lib/hooks";
import { Header } from "@/components/Header";
import { NodeCard } from "@/components/NodeCard";
import { NodeGridSkeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Search, SlidersHorizontal, ArrowUpDown } from "lucide-react";

type SortField = 'moniker' | 'uptime' | 'storage' | 'latency' | 'healthScore';
type SortDirection = 'asc' | 'desc';
type StatusFilter = 'all' | 'active' | 'inactive' | 'syncing';

export default function NodesPage() {
  const { data: nodes, isLoading, error } = useAllPNodes();
  const { data: stats } = useNetworkStats();
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('all');
  const [sortField, setSortField] = useState<SortField>('healthScore');
  const [sortDirection, setSortDirection] = useState<SortDirection>('desc');

  // Filter and sort nodes
  const filteredAndSortedNodes = useMemo(() => {
    if (!nodes) return [];

    let filtered = [...nodes];

    // Apply search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        node =>
          node.moniker.toLowerCase().includes(query) ||
          node.publicKey.toLowerCase().includes(query) ||
          node.location.city.toLowerCase().includes(query) ||
          node.location.country.toLowerCase().includes(query)
      );
    }

    // Apply status filter
    if (statusFilter !== 'all') {
      filtered = filtered.filter(node => node.status === statusFilter);
    }

    // Apply sorting
    filtered.sort((a, b) => {
      let aVal: number | string;
      let bVal: number | string;

      switch (sortField) {
        case 'moniker':
          aVal = a.moniker.toLowerCase();
          bVal = b.moniker.toLowerCase();
          break;
        case 'uptime':
          aVal = a.uptime;
          bVal = b.uptime;
          break;
        case 'storage':
          aVal = a.storage.usagePercentage;
          bVal = b.storage.usagePercentage;
          break;
        case 'latency':
          aVal = a.performance.avgLatency;
          bVal = b.performance.avgLatency;
          break;
        case 'healthScore':
          aVal = a.healthScore || 0;
          bVal = b.healthScore || 0;
          break;
        default:
          return 0;
      }

      if (aVal < bVal) return sortDirection === 'asc' ? -1 : 1;
      if (aVal > bVal) return sortDirection === 'asc' ? 1 : -1;
      return 0;
    });

    return filtered;
  }, [nodes, searchQuery, statusFilter, sortField, sortDirection]);

  const toggleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('desc');
    }
  };


  if (error) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center p-8">
        <h1 className="text-2xl font-bold text-red-500 mb-4">Error Loading Nodes</h1>
        <p className="text-gray-600 dark:text-gray-400">{error.message}</p>
      </div>
    );
  }

  const statusCounts = {
    all: nodes?.length || 0,
    active: nodes?.filter(n => n.status === 'active').length || 0,
    inactive: nodes?.filter(n => n.status === 'inactive').length || 0,
    syncing: nodes?.filter(n => n.status === 'syncing').length || 0,
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950">
      <Header />

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        {isLoading ? (
          <div className="space-y-6">
            <div className="h-12 bg-muted rounded-lg animate-pulse"></div>
            <div className="h-10 bg-muted rounded-lg animate-pulse"></div>
            <NodeGridSkeleton count={12} />
          </div>
        ) : (
          <>
            {/* Search and Filters */}
            <div className="mb-6 space-y-4">
              {/* Search Bar */}
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <input
                  type="text"
                  placeholder="Search by moniker, public key, or location..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 rounded-lg border border-border bg-card text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>

              {/* Status Filters */}
              <div className="flex flex-wrap gap-2 items-center">
                <SlidersHorizontal className="h-4 w-4 text-muted-foreground mr-2" />
                <span className="text-sm text-muted-foreground mr-2">Status:</span>
            {(['all', 'active', 'inactive', 'syncing'] as StatusFilter[]).map((status) => (
              <Button
                key={status}
                variant={statusFilter === status ? 'default' : 'outline'}
                size="sm"
                onClick={() => setStatusFilter(status)}
                className="capitalize"
              >
                {status}
                <Badge variant="secondary" className="ml-2">
                  {statusCounts[status]}
                </Badge>
              </Button>
            ))}
          </div>

              {/* Sort Options */}
              <div className="flex flex-wrap gap-2 items-center">
                <ArrowUpDown className="h-4 w-4 text-muted-foreground mr-2" />
                <span className="text-sm text-muted-foreground mr-2">Sort by:</span>
            {[
              { field: 'healthScore' as SortField, label: 'Health Score' },
              { field: 'uptime' as SortField, label: 'Uptime' },
              { field: 'storage' as SortField, label: 'Storage Usage' },
              { field: 'latency' as SortField, label: 'Latency' },
              { field: 'moniker' as SortField, label: 'Name' },
            ].map(({ field, label }) => (
              <Button
                key={field}
                variant={sortField === field ? 'default' : 'outline'}
                size="sm"
                onClick={() => toggleSort(field)}
                className="gap-1"
              >
                {label}
                {sortField === field && (
                  <span className="text-xs">
                    {sortDirection === 'asc' ? '↑' : '↓'}
                  </span>
                )}
                  </Button>
                ))}
              </div>
            </div>

            {/* Results Count */}
            <div className="mb-4">
              <p className="text-sm text-muted-foreground">
                Showing {filteredAndSortedNodes.length} of {nodes?.length || 0} nodes
              </p>
            </div>

            {/* Nodes Grid */}
            {filteredAndSortedNodes.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-muted-foreground">
                  No nodes found matching your criteria
                </p>
              </div>
            ) : (
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {filteredAndSortedNodes.map((node) => (
                  <NodeCard key={node.publicKey} node={node} />
                ))}
              </div>
            )}
          </>
        )}
      </main>
    </div>
  );
}
