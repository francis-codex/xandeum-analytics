'use client';

import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import {
  AlertTriangle,
  HardDrive,
  Wifi,
  Package,
  Zap,
  ChevronRight,
} from "lucide-react";
import type { RiskAssessment } from "@/types/pnode";
import { truncatePublicKey } from "@/lib/utils";

interface AtRiskNodesCardProps {
  assessment: RiskAssessment;
}

export function AtRiskNodesCard({ assessment }: AtRiskNodesCardProps) {
  const { atRiskCount, criticalCount, warningCount, riskCategories, atRiskNodes } = assessment;

  const riskLevelColor =
    criticalCount > 0 ? 'text-red-500 border-red-500' :
    warningCount > 5 ? 'text-yellow-500 border-yellow-500' :
    atRiskCount > 0 ? 'text-yellow-500 border-yellow-500' :
    'text-green-500 border-green-500';

  const riskLevelBg =
    criticalCount > 0 ? 'bg-red-50 dark:bg-red-950/20' :
    warningCount > 5 ? 'bg-yellow-50 dark:bg-yellow-950/20' :
    atRiskCount > 0 ? 'bg-yellow-50 dark:bg-yellow-950/20' :
    'bg-green-50 dark:bg-green-950/20';

  return (
    <Card className={`border-2 ${riskLevelColor.includes('red') ? 'border-red-200 dark:border-red-900' : riskLevelColor.includes('yellow') ? 'border-yellow-200 dark:border-yellow-900' : 'border-green-200 dark:border-green-900'}`}>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <AlertTriangle className={`h-5 w-5 ${riskLevelColor}`} />
            Nodes At Risk
          </CardTitle>
          <Badge
            variant={criticalCount > 0 ? 'destructive' : warningCount > 0 ? 'secondary' : 'default'}
            className="text-lg px-3 py-1"
          >
            {atRiskCount}
          </Badge>
        </div>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
          {atRiskCount === 0
            ? 'All pNodes operating normally'
            : `${criticalCount} critical, ${warningCount} warning`}
        </p>
      </CardHeader>
      <CardContent>
        {atRiskCount === 0 ? (
          <div className={`p-6 rounded-lg ${riskLevelBg} text-center`}>
            <div className="flex flex-col items-center gap-3">
              <div className="w-16 h-16 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
                <svg
                  className="w-8 h-8 text-green-500"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
              <div>
                <h3 className="font-semibold text-green-900 dark:text-green-100">
                  Network Healthy
                </h3>
                <p className="text-sm text-green-700 dark:text-green-300 mt-1">
                  No storage nodes require immediate attention
                </p>
              </div>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            {/* Risk Categories Breakdown */}
            <div className="grid grid-cols-2 gap-3">
              <div className="flex items-center gap-2 p-3 bg-gray-50 dark:bg-gray-900 rounded-lg">
                <HardDrive className="h-4 w-4 text-purple-500" />
                <div className="flex-1">
                  <p className="text-xs text-gray-500 dark:text-gray-400">Storage</p>
                  <p className="text-lg font-bold">
                    {riskCategories.storage}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2 p-3 bg-gray-50 dark:bg-gray-900 rounded-lg">
                <Wifi className="h-4 w-4 text-blue-500" />
                <div className="flex-1">
                  <p className="text-xs text-gray-500 dark:text-gray-400">Uptime</p>
                  <p className="text-lg font-bold">
                    {riskCategories.uptime}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2 p-3 bg-gray-50 dark:bg-gray-900 rounded-lg">
                <Package className="h-4 w-4 text-green-500" />
                <div className="flex-1">
                  <p className="text-xs text-gray-500 dark:text-gray-400">Version</p>
                  <p className="text-lg font-bold">
                    {riskCategories.version}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2 p-3 bg-gray-50 dark:bg-gray-900 rounded-lg">
                <Zap className="h-4 w-4 text-yellow-500" />
                <div className="flex-1">
                  <p className="text-xs text-gray-500 dark:text-gray-400">Latency</p>
                  <p className="text-lg font-bold">
                    {riskCategories.latency}
                  </p>
                </div>
              </div>
            </div>

            {/* Top At-Risk Nodes */}
            {atRiskNodes.length > 0 && (
              <div>
                <h4 className="text-sm font-semibold mb-2 text-gray-900 dark:text-gray-50">
                  Top At-Risk Nodes
                </h4>
                <div className="space-y-2">
                  {atRiskNodes.slice(0, 3).map(node => {
                    const issues = [];
                    if (node.status === 'inactive') issues.push('Offline');
                    if (node.storage.usagePercentage > 95) issues.push('Storage Full');
                    if (node.uptime < 95) issues.push('Low Uptime');
                    if (node.performance.avgLatency > 500) issues.push('High Latency');

                    return (
                      <Link
                        key={node.publicKey}
                        href={`/nodes/${node.publicKey}`}
                        className="block"
                      >
                        <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-900 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium truncate">
                              {node.moniker}
                            </p>
                            <p className="text-xs text-gray-500 dark:text-gray-400 font-mono">
                              {truncatePublicKey(node.publicKey, 6)}
                            </p>
                            <div className="flex flex-wrap gap-1 mt-1">
                              {issues.map(issue => (
                                <Badge
                                  key={issue}
                                  variant="outline"
                                  className="text-xs"
                                >
                                  {issue}
                                </Badge>
                              ))}
                            </div>
                          </div>
                          <ChevronRight className="h-4 w-4 text-gray-400 flex-shrink-0" />
                        </div>
                      </Link>
                    );
                  })}
                </div>
              </div>
            )}

            {/* View All Button */}
            {atRiskNodes.length > 3 && (
              <Link href="/nodes">
                <Button variant="outline" className="w-full">
                  View All {atRiskCount} At-Risk Nodes
                  <ChevronRight className="h-4 w-4 ml-2" />
                </Button>
              </Link>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
