'use client';

import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Badge } from "./ui/badge";
import {
  AlertCircle,
  CheckCircle,
  Info,
  AlertTriangle,
  HardDrive,
  Activity,
  Package,
  Zap,
  TrendingUp,
} from "lucide-react";
import type { NetworkEvent } from "@/types/pnode";
import { formatTimeAgo } from "@/lib/utils";

interface InsightsPanelProps {
  events: NetworkEvent[];
}

export function InsightsPanel({ events }: InsightsPanelProps) {
  const getIcon = (type: NetworkEvent['type'], category: NetworkEvent['category']) => {
    const iconClass = "h-5 w-5";

    // Color by type
    const color =
      type === 'success' ? 'text-green-500' :
      type === 'warning' ? 'text-yellow-500' :
      type === 'critical' ? 'text-red-500' :
      'text-blue-500';

    // Icon by category
    switch (category) {
      case 'storage':
        return <HardDrive className={`${iconClass} ${color}`} />;
      case 'network':
        return <Activity className={`${iconClass} ${color}`} />;
      case 'version':
        return <Package className={`${iconClass} ${color}`} />;
      case 'performance':
        return <Zap className={`${iconClass} ${color}`} />;
      case 'capacity':
        return <TrendingUp className={`${iconClass} ${color}`} />;
      default:
        if (type === 'success') return <CheckCircle className={`${iconClass} ${color}`} />;
        if (type === 'warning') return <AlertTriangle className={`${iconClass} ${color}`} />;
        if (type === 'critical') return <AlertCircle className={`${iconClass} ${color}`} />;
        return <Info className={`${iconClass} ${color}`} />;
    }
  };

  const getBadgeVariant = (type: NetworkEvent['type']) => {
    switch (type) {
      case 'success':
        return 'default' as const;
      case 'warning':
        return 'secondary' as const;
      case 'critical':
        return 'destructive' as const;
      default:
        return 'outline' as const;
    }
  };

  const getBorderColor = (type: NetworkEvent['type']) => {
    switch (type) {
      case 'success':
        return 'border-l-4 border-l-green-500';
      case 'warning':
        return 'border-l-4 border-l-yellow-500';
      case 'critical':
        return 'border-l-4 border-l-red-500';
      default:
        return 'border-l-4 border-l-blue-500';
    }
  };

  if (events.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Info className="h-5 w-5" />
            Network Insights
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Loading network insights...
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Activity className="h-5 w-5 text-blue-500" />
            Network Insights
          </CardTitle>
          <Badge variant="outline" className="text-xs">
            {events.length} {events.length === 1 ? 'Event' : 'Events'}
          </Badge>
        </div>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
          Real-time analysis of Xandeum storage network health
        </p>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {events.map(event => (
            <div
              key={event.id}
              className={`flex items-start gap-3 p-4 rounded-lg bg-gray-50 dark:bg-gray-900 transition-all hover:shadow-md ${getBorderColor(event.type)}`}
            >
              <div className="flex-shrink-0 mt-0.5">
                {getIcon(event.type, event.category)}
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-2 mb-1">
                  <h4 className="font-semibold text-sm text-gray-900 dark:text-gray-50">
                    {event.title}
                  </h4>
                  <Badge variant={getBadgeVariant(event.type)} className="text-xs capitalize flex-shrink-0">
                    {event.type}
                  </Badge>
                </div>

                <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
                  {event.message}
                </p>

                {/* Metadata */}
                <div className="flex items-center gap-3 mt-2 text-xs text-gray-500 dark:text-gray-500">
                  <span className="capitalize">{event.category}</span>
                  {event.affectedNodes !== undefined && (
                    <>
                      <span>•</span>
                      <span>{event.affectedNodes} node{event.affectedNodes !== 1 ? 's' : ''} affected</span>
                    </>
                  )}
                  <span>•</span>
                  <span>{formatTimeAgo(event.timestamp)}</span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Storage-specific callout */}
        {events.some(e => e.category === 'storage') && (
          <div className="mt-4 p-3 bg-blue-50 dark:bg-blue-950/20 rounded-lg border border-blue-200 dark:border-blue-800">
            <p className="text-xs text-blue-900 dark:text-blue-100 flex items-center gap-2">
              <HardDrive className="h-4 w-4" />
              <span>
                <strong>Xandeum Storage Layer:</strong> Monitoring exabyte-scale capacity for Solana dApp data
              </span>
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
