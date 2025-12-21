'use client';

import { memo } from "react";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Badge } from "./ui/badge";
import { StatusBadge } from "./StatusBadge";
import {
  formatBytes,
  formatPercentage,
  truncatePublicKey,
  formatTimeAgo,
} from "@/lib/utils";
import { MapPin, HardDrive, Zap, Clock, Lock, Unlock } from "lucide-react";
import type { PNode } from "@/types/pnode";

interface NodeCardProps {
  node: PNode;
}

export const NodeCard = memo(function NodeCard({ node }: NodeCardProps) {
  const healthScoreColor =
    node.healthScore && node.healthScore >= 90
      ? "text-green-500"
      : node.healthScore && node.healthScore >= 70
      ? "text-yellow-500"
      : "text-red-500";

  return (
    <Link href={`/nodes/${node.ipAddress}`}>
      <Card className="hover:shadow-lg transition-shadow cursor-pointer">
        <CardHeader className="pb-3">
          <div className="flex items-start justify-between">
            <div className="space-y-1 flex-1">
              <div className="flex items-center gap-2">
                <CardTitle className="text-lg font-semibold">
                  {node.moniker}
                </CardTitle>
                {node.isPublic !== undefined && (
                  <Badge
                    variant={node.isPublic ? "default" : "secondary"}
                    className="text-xs flex items-center gap-1"
                  >
                    {node.isPublic ? (
                      <>
                        <Unlock className="h-3 w-3" />
                        Public
                      </>
                    ) : (
                      <>
                        <Lock className="h-3 w-3" />
                        Private
                      </>
                    )}
                  </Badge>
                )}
              </div>
              <p className="text-xs text-gray-500 dark:text-gray-400 font-mono">
                {truncatePublicKey(node.publicKey)}
              </p>
            </div>
            <StatusBadge status={node.status} />
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {/* Location */}
            <div className="flex items-center text-sm">
              <MapPin className="h-4 w-4 mr-2 text-gray-400" />
              <span className="text-gray-600 dark:text-gray-300">
                {node.location.city}, {node.location.countryCode}
              </span>
            </div>

            {/* Storage */}
            <div className="flex items-center text-sm">
              <HardDrive className="h-4 w-4 mr-2 text-gray-400" />
              <div className="flex-1">
                <div className="flex justify-between mb-1">
                  <span className="text-gray-600 dark:text-gray-300">
                    {formatBytes(node.storage.used)} / {formatBytes(node.storage.total)}
                  </span>
                  <span className="text-gray-500 dark:text-gray-400 text-xs">
                    {formatPercentage(node.storage.usagePercentage, 1)}
                  </span>
                </div>
                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-1.5">
                  <div
                    className="bg-blue-500 h-1.5 rounded-full transition-all"
                    style={{ width: `${Math.min(node.storage.usagePercentage, 100)}%` }}
                  />
                </div>
              </div>
            </div>

            {/* Performance */}
            <div className="flex items-center justify-between text-sm">
              <div className="flex items-center">
                <Zap className="h-4 w-4 mr-2 text-gray-400" />
                <span className="text-gray-600 dark:text-gray-300">
                  Uptime: {formatPercentage(node.uptime, 2)}
                </span>
              </div>
              {node.healthScore && (
                <span className={`font-semibold ${healthScoreColor}`}>
                  {node.healthScore.toFixed(1)} / 100
                </span>
              )}
            </div>

            {/* Last Seen */}
            <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
              <Clock className="h-4 w-4 mr-2" />
              <span>Last seen {formatTimeAgo(node.lastSeen)}</span>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 gap-2 pt-2 border-t border-gray-200 dark:border-gray-800">
              <div>
                <p className="text-xs text-gray-500 dark:text-gray-400">Latency</p>
                <p className="text-sm font-medium">
                  {node.performance.avgLatency.toFixed(0)}ms
                </p>
              </div>
              <div>
                <p className="text-xs text-gray-500 dark:text-gray-400">Success Rate</p>
                <p className="text-sm font-medium">
                  {formatPercentage(node.performance.successRate, 1)}
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
});
