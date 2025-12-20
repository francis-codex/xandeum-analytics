'use client';

import { memo, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Trophy, Zap, HardDrive, Activity } from "lucide-react";
import { Badge } from "./ui/badge";
import type { PNode } from "@/types/pnode";

interface TopPerformersProps {
  nodes: PNode[];
}

interface LeaderboardCategory {
  title: string;
  icon: React.ComponentType<{ className?: string }>;
  color: string;
  nodes: Array<{
    node: PNode;
    value: number;
    label: string;
  }>;
}

export const TopPerformers = memo(function TopPerformers({ nodes }: TopPerformersProps) {
  const leaderboards = useMemo((): LeaderboardCategory[] => {
    const activeNodes = nodes.filter(n => n.status === 'active');

    if (activeNodes.length === 0) return [];

    return [
      {
        title: 'Highest Uptime',
        icon: Activity,
        color: 'text-foreground',
        nodes: activeNodes
          .sort((a, b) => b.uptime - a.uptime)
          .slice(0, 3)
          .map(node => ({
            node,
            value: node.uptime,
            label: `${node.uptime.toFixed(2)}%`,
          })),
      },
      {
        title: 'Most Storage',
        icon: HardDrive,
        color: 'text-foreground',
        nodes: activeNodes
          .sort((a, b) => b.storage.total - a.storage.total)
          .slice(0, 3)
          .map(node => ({
            node,
            value: node.storage.total,
            label: `${(node.storage.total / (1024 ** 4)).toFixed(2)} TB`,
          })),
      },
      {
        title: 'Lowest Latency',
        icon: Zap,
        color: 'text-foreground',
        nodes: activeNodes
          .sort((a, b) => a.performance.avgLatency - b.performance.avgLatency)
          .slice(0, 3)
          .map(node => ({
            node,
            value: node.performance.avgLatency,
            label: `${node.performance.avgLatency.toFixed(0)}ms`,
          })),
      },
    ];
  }, [nodes]);

  if (leaderboards.length === 0) {
    return null;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Trophy className="h-5 w-5 text-foreground" />
          Top Performers
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {leaderboards.map((category, idx) => {
            const Icon = category.icon;

            return (
              <div key={idx}>
                <div className="flex items-center gap-2 mb-3">
                  <Icon className={`h-4 w-4 ${category.color}`} />
                  <h3 className="font-semibold text-sm text-foreground">
                    {category.title}
                  </h3>
                </div>

                <div className="space-y-2">
                  {category.nodes.map((item, rank) => {
                    const rankLabels = ['#1', '#2', '#3'];
                    const bgColors = [
                      'bg-muted border-border',
                      'bg-muted border-border',
                      'bg-muted border-border',
                    ];

                    return (
                      <div
                        key={item.node.publicKey}
                        className={`flex items-center justify-between p-3 rounded-lg border ${bgColors[rank]} hover:border-primary transition-colors`}
                      >
                        <div className="flex items-center gap-3 flex-1 min-w-0">
                          <span className="text-sm font-bold text-muted-foreground">{rankLabels[rank]}</span>
                          <div className="flex-1 min-w-0">
                            <div className="font-medium text-sm text-foreground truncate">
                              {item.node.moniker}
                            </div>
                            <div className="text-xs text-muted-foreground truncate">
                              {item.node.location?.city}, {item.node.location?.country}
                            </div>
                          </div>
                        </div>

                        <Badge variant="outline" className="ml-2 font-mono">
                          {item.label}
                        </Badge>
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
});
