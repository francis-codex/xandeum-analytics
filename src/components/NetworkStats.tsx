'use client';

import { memo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { formatBytes, formatPercentage, formatNumber } from "@/lib/utils";
import { Server, HardDrive, Activity, Globe } from "lucide-react";
import type { NetworkStats } from "@/types/pnode";

interface NetworkStatsProps {
  stats: NetworkStats;
}

export const NetworkStatsDisplay = memo(function NetworkStatsDisplay({ stats }: NetworkStatsProps) {
  const storageUsagePercentage = (stats.usedStorage / stats.totalStorage) * 100;

  const statCards = [
    {
      title: "Total Nodes",
      value: formatNumber(stats.totalNodes),
      subtitle: `${stats.activeNodes} active, ${stats.inactiveNodes} inactive`,
      icon: Server,
      color: "text-foreground",
      pulse: true, // Add pulse animation
    },
    {
      title: "Storage Capacity",
      value: formatBytes(stats.totalStorage),
      subtitle: `${formatBytes(stats.usedStorage)} used (${formatPercentage(storageUsagePercentage, 1)})`,
      icon: HardDrive,
      color: "text-foreground",
    },
    {
      title: "Network Uptime",
      value: formatPercentage(stats.avgUptime, 2),
      subtitle: `Avg latency: ${stats.avgLatency.toFixed(0)}ms`,
      icon: Activity,
      color: "text-foreground",
    },
    {
      title: "Decentralization",
      value: formatPercentage(stats.decentralizationScore, 1),
      subtitle: `Version: ${stats.networkVersion}`,
      icon: Globe,
      color: "text-foreground",
    },
  ];

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {statCards.map((stat) => {
        const Icon = stat.icon;
        return (
          <Card key={stat.title} className="relative overflow-hidden">
            {stat.pulse && (
              <div className="absolute top-2 right-2">
                <div className="relative">
                  <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                  <div className="absolute top-0 left-0 w-2 h-2 bg-green-500 rounded-full animate-ping"></div>
                </div>
              </div>
            )}
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                {stat.title}
              </CardTitle>
              <Icon className={`h-4 w-4 ${stat.color}`} />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                {stat.subtitle}
              </p>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
});
