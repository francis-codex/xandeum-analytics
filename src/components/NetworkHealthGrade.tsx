'use client';

import { memo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Shield, TrendingUp, AlertTriangle, CheckCircle } from "lucide-react";
import type { NetworkStats } from "@/types/pnode";

interface NetworkHealthGradeProps {
  stats: NetworkStats;
}

function calculateNetworkGrade(stats: NetworkStats): {
  grade: string;
  score: number;
  color: string;
  status: string;
  icon: React.ComponentType<{ className?: string }>;
} {
  let score = 0;

  // Uptime score (30 points)
  const uptimeScore = (stats.avgUptime / 100) * 30;
  score += uptimeScore;

  // Active nodes ratio (25 points)
  const activeRatio = stats.totalNodes > 0 ? (stats.activeNodes / stats.totalNodes) : 0;
  const activeScore = activeRatio * 25;
  score += activeScore;

  // Storage availability (20 points)
  const availableStorage = stats.totalStorage - stats.usedStorage;
  const storageRatio = stats.totalStorage > 0 ? (availableStorage / stats.totalStorage) : 0;
  const storageScore = storageRatio * 20;
  score += storageScore;

  // Latency score (15 points) - lower is better
  const latencyScore = Math.max(0, 15 - (stats.avgLatency / 100));
  score += latencyScore;

  // Decentralization score (10 points)
  const decentScore = (stats.decentralizationScore / 100) * 10;
  score += decentScore;

  // Determine grade
  let grade = 'F';
  let color = 'text-foreground';
  let status = 'Critical';
  let icon = AlertTriangle;

  if (score >= 90) {
    grade = 'A+';
    color = 'text-foreground';
    status = 'Excellent';
    icon = CheckCircle;
  } else if (score >= 85) {
    grade = 'A';
    color = 'text-foreground';
    status = 'Excellent';
    icon = CheckCircle;
  } else if (score >= 80) {
    grade = 'A-';
    color = 'text-foreground';
    status = 'Very Good';
    icon = TrendingUp;
  } else if (score >= 75) {
    grade = 'B+';
    color = 'text-foreground';
    status = 'Good';
    icon = TrendingUp;
  } else if (score >= 70) {
    grade = 'B';
    color = 'text-foreground';
    status = 'Good';
    icon = TrendingUp;
  } else if (score >= 65) {
    grade = 'B-';
    color = 'text-foreground';
    status = 'Fair';
    icon = Shield;
  } else if (score >= 60) {
    grade = 'C+';
    color = 'text-foreground';
    status = 'Fair';
    icon = Shield;
  } else if (score >= 55) {
    grade = 'C';
    color = 'text-foreground';
    status = 'Average';
    icon = Shield;
  } else if (score >= 50) {
    grade = 'C-';
    color = 'text-foreground';
    status = 'Below Average';
    icon = AlertTriangle;
  } else if (score >= 40) {
    grade = 'D';
    color = 'text-foreground';
    status = 'Poor';
    icon = AlertTriangle;
  } else {
    grade = 'F';
    color = 'text-foreground';
    status = 'Critical';
    icon = AlertTriangle;
  }

  return { grade, score: Math.round(score), color, status, icon };
}

export const NetworkHealthGrade = memo(function NetworkHealthGrade({ stats }: NetworkHealthGradeProps) {
  const { grade, score, color, status, icon: Icon } = calculateNetworkGrade(stats);

  return (
    <Card className="border-2 bg-gradient-to-br from-card to-card/50">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-lg">
          <Shield className="h-5 w-5 text-foreground" />
          Network Health Grade
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-4">
            <div className={`text-6xl font-bold ${color}`}>
              {grade}
            </div>
            <div className="flex flex-col">
              <span className={`text-2xl font-semibold ${color}`}>
                {score}/100
              </span>
              <span className="text-sm text-muted-foreground">
                Health Score
              </span>
            </div>
          </div>
          <Icon className={`h-12 w-12 ${color}`} />
        </div>

        <div className="text-center py-2 px-4 rounded-lg bg-muted text-foreground">
          <span className="text-sm font-semibold">
            Network Status: {status}
          </span>
        </div>

        <div className="mt-4 space-y-2">
          <div className="flex justify-between text-xs">
            <span className="text-muted-foreground">Uptime</span>
            <span className="font-medium">{stats.avgUptime.toFixed(1)}%</span>
          </div>
          <div className="flex justify-between text-xs">
            <span className="text-muted-foreground">Active Nodes</span>
            <span className="font-medium">{stats.activeNodes}/{stats.totalNodes}</span>
          </div>
          <div className="flex justify-between text-xs">
            <span className="text-muted-foreground">Avg Latency</span>
            <span className="font-medium">{stats.avgLatency.toFixed(0)}ms</span>
          </div>
          <div className="flex justify-between text-xs">
            <span className="text-muted-foreground">Decentralization</span>
            <span className="font-medium">{stats.decentralizationScore.toFixed(0)}%</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
});
