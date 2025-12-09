'use client';

import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Badge } from "./ui/badge";
import { Info, TrendingUp, TrendingDown, Minus } from "lucide-react";
import type { NetworkHealthBreakdown } from "@/types/pnode";

interface HealthScoreBreakdownProps {
  health: NetworkHealthBreakdown;
}

export function HealthScoreBreakdown({ health }: HealthScoreBreakdownProps) {
  const {
    availability,
    versionHealth,
    distribution,
    storageHealth,
    totalScore,
  } = health;

  // Weights for Xandeum storage-focused scoring
  const weights = {
    storage: 0.30, // Primary focus - storage capacity management
    availability: 0.30, // Critical - nodes must be accessible
    version: 0.25, // Important - network compatibility
    distribution: 0.15, // Nice to have - geographic diversity
  };

  const getScoreColor = (score: number) => {
    if (score >= 90) return 'text-green-500';
    if (score >= 70) return 'text-yellow-500';
    if (score >= 50) return 'text-orange-500';
    return 'text-red-500';
  };

  const getScoreBg = (score: number) => {
    if (score >= 90) return 'bg-green-50 dark:bg-green-950/20';
    if (score >= 70) return 'bg-yellow-50 dark:bg-yellow-950/20';
    if (score >= 50) return 'bg-orange-50 dark:bg-orange-950/20';
    return 'bg-red-50 dark:bg-red-950/20';
  };

  const getTrendIcon = (score: number) => {
    if (score >= 90) return <TrendingUp className="h-4 w-4 text-green-500" />;
    if (score >= 70) return <Minus className="h-4 w-4 text-yellow-500" />;
    return <TrendingDown className="h-4 w-4 text-orange-500" />;
  };

  const getStatusLabel = (score: number) => {
    if (score >= 90) return 'Excellent';
    if (score >= 70) return 'Good';
    if (score >= 50) return 'Fair';
    return 'Poor';
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            Network Health Score
            <Info className="h-4 w-4 text-gray-400" />
          </CardTitle>
          <Badge variant="outline">
            {getStatusLabel(totalScore)}
          </Badge>
        </div>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
          Weighted calculation optimized for Xandeum storage network
        </p>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {/* Total Score Display */}
          <div className={`text-center p-8 rounded-xl ${getScoreBg(totalScore)} border-2 ${getScoreColor(totalScore).replace('text', 'border')}`}>
            <div className="flex items-center justify-center gap-3 mb-2">
              {getTrendIcon(totalScore)}
              <div className={`text-6xl font-bold ${getScoreColor(totalScore)}`}>
                {totalScore}
              </div>
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400">
              Overall Network Health
            </div>
          </div>

          {/* Component Breakdown */}
          <div className="space-y-3">
            <h4 className="font-semibold text-sm text-gray-900 dark:text-gray-50 mb-3">
              Score Components:
            </h4>

            {/* Storage Health */}
            <div className="p-4 bg-gradient-to-r from-purple-50 to-transparent dark:from-purple-950/20 dark:to-transparent rounded-lg border border-purple-200 dark:border-purple-900">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <span className="font-medium text-gray-900 dark:text-gray-50">Storage Health</span>
                  <Badge variant="secondary" className="text-xs">30% weight</Badge>
                </div>
                <span className={`font-bold ${getScoreColor(storageHealth)}`}>
                  {storageHealth.toFixed(0)}
                </span>
              </div>
              <div className="flex items-center justify-between text-sm text-gray-600 dark:text-gray-400">
                <span>Optimal capacity utilization (60-80%)</span>
                <span className="font-mono">× 0.30 = {(storageHealth * weights.storage).toFixed(1)}</span>
              </div>
              <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2 mt-2">
                <div
                  className="bg-purple-500 h-2 rounded-full transition-all"
                  style={{ width: `${storageHealth}%` }}
                />
              </div>
            </div>

            {/* Availability */}
            <div className="p-4 bg-gradient-to-r from-blue-50 to-transparent dark:from-blue-950/20 dark:to-transparent rounded-lg border border-blue-200 dark:border-blue-900">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <span className="font-medium text-gray-900 dark:text-gray-50">Availability</span>
                  <Badge variant="secondary" className="text-xs">30% weight</Badge>
                </div>
                <span className={`font-bold ${getScoreColor(availability)}`}>
                  {availability.toFixed(0)}
                </span>
              </div>
              <div className="flex items-center justify-between text-sm text-gray-600 dark:text-gray-400">
                <span>Active nodes providing storage access</span>
                <span className="font-mono">× 0.30 = {(availability * weights.availability).toFixed(1)}</span>
              </div>
              <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2 mt-2">
                <div
                  className="bg-blue-500 h-2 rounded-full transition-all"
                  style={{ width: `${availability}%` }}
                />
              </div>
            </div>

            {/* Version Health */}
            <div className="p-4 bg-gradient-to-r from-green-50 to-transparent dark:from-green-950/20 dark:to-transparent rounded-lg border border-green-200 dark:border-green-900">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <span className="font-medium text-gray-900 dark:text-gray-50">Version Health</span>
                  <Badge variant="secondary" className="text-xs">25% weight</Badge>
                </div>
                <span className={`font-bold ${getScoreColor(versionHealth)}`}>
                  {versionHealth.toFixed(0)}
                </span>
              </div>
              <div className="flex items-center justify-between text-sm text-gray-600 dark:text-gray-400">
                <span>Nodes on latest version</span>
                <span className="font-mono">× 0.25 = {(versionHealth * weights.version).toFixed(1)}</span>
              </div>
              <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2 mt-2">
                <div
                  className="bg-green-500 h-2 rounded-full transition-all"
                  style={{ width: `${versionHealth}%` }}
                />
              </div>
            </div>

            {/* Distribution */}
            <div className="p-4 bg-gradient-to-r from-orange-50 to-transparent dark:from-orange-950/20 dark:to-transparent rounded-lg border border-orange-200 dark:border-orange-900">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <span className="font-medium text-gray-900 dark:text-gray-50">Distribution</span>
                  <Badge variant="secondary" className="text-xs">15% weight</Badge>
                </div>
                <span className={`font-bold ${getScoreColor(distribution)}`}>
                  {distribution.toFixed(0)}
                </span>
              </div>
              <div className="flex items-center justify-between text-sm text-gray-600 dark:text-gray-400">
                <span>Geographic diversity & decentralization</span>
                <span className="font-mono">× 0.15 = {(distribution * weights.distribution).toFixed(1)}</span>
              </div>
              <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2 mt-2">
                <div
                  className="bg-orange-500 h-2 rounded-full transition-all"
                  style={{ width: `${distribution}%` }}
                />
              </div>
            </div>
          </div>

          {/* Formula Display */}
          <div className="mt-6 p-4 bg-gradient-to-r from-blue-50 via-purple-50 to-blue-50 dark:from-blue-950/20 dark:via-purple-950/20 dark:to-blue-950/20 rounded-lg border-2 border-blue-300 dark:border-blue-800">
            <p className="text-xs text-gray-600 dark:text-gray-400 mb-2 text-center">
              Health Score Formula:
            </p>
            <div className="font-mono text-sm text-center text-gray-900 dark:text-gray-50 leading-relaxed">
              <div className="text-lg font-bold mb-1">
                {totalScore} =
              </div>
              <div className="text-xs space-y-1">
                <div>({storageHealth.toFixed(0)} × 30%) + ({availability.toFixed(0)} × 30%)</div>
                <div>+ ({versionHealth.toFixed(0)} × 25%) + ({distribution.toFixed(0)} × 15%)</div>
              </div>
            </div>
          </div>

          {/* Storage Focus Callout */}
          <div className="mt-4 p-3 bg-purple-50 dark:bg-purple-950/20 rounded-lg border border-purple-200 dark:border-purple-800">
            <p className="text-xs text-purple-900 dark:text-purple-100">
              <strong>Storage-First Scoring:</strong> Optimized for Xandeum's mission to provide exabyte-scale storage for Solana dApps. Storage health and availability are weighted highest (60% combined).
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
