'use client';

import { memo, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Globe, MapPin } from "lucide-react";
import type { PNode } from "@/types/pnode";

interface GeographicDistributionProps {
  nodes: PNode[];
}

interface CountryData {
  country: string;
  countryCode: string;
  count: number;
  percentage: number;
  activeCount: number;
  avgHealth: number;
}

export const GeographicDistribution = memo(function GeographicDistribution({
  nodes
}: GeographicDistributionProps) {
  const countryData = useMemo(() => {
    const countryMap = new Map<string, CountryData>();

    nodes.forEach(node => {
      const country = node.location?.country || 'Unknown';
      const countryCode = node.location?.countryCode || 'XX';

      if (!countryMap.has(country)) {
        countryMap.set(country, {
          country,
          countryCode,
          count: 0,
          percentage: 0,
          activeCount: 0,
          avgHealth: 0,
        });
      }

      const data = countryMap.get(country)!;
      data.count++;
      if (node.status === 'active') {
        data.activeCount++;
      }
      data.avgHealth += node.healthScore || 0;
    });

    // Calculate percentages and average health
    const totalNodes = nodes.length;
    const countries = Array.from(countryMap.values()).map(data => ({
      ...data,
      percentage: (data.count / totalNodes) * 100,
      avgHealth: data.avgHealth / data.count,
    }));

    // Sort by count descending
    return countries.sort((a, b) => b.count - a.count);
  }, [nodes]);

  const totalCountries = countryData.length;
  const topCountry = countryData[0];

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Globe className="h-5 w-5 text-foreground" />
          Geographic Distribution
        </CardTitle>
      </CardHeader>
      <CardContent className="p-6">
        {/* Summary Stats */}
        <div className="grid grid-cols-2 gap-4 mb-4">
          <div className="bg-muted rounded-lg p-3">
            <div className="text-2xl font-bold text-foreground">{totalCountries}</div>
            <div className="text-xs text-muted-foreground">Countries</div>
          </div>
          {topCountry && (
            <div className="bg-muted rounded-lg p-3">
              <div className="text-2xl font-bold text-foreground">{topCountry.count}</div>
              <div className="text-xs text-muted-foreground">in {topCountry.country}</div>
            </div>
          )}
        </div>

        {/* Country List */}
        <div className="space-y-2.5 max-h-[400px] overflow-y-auto pr-1">
          {countryData.map((data, index) => {
            const healthColor = 'text-muted-foreground';

            return (
              <div
                key={data.countryCode}
                className="flex items-center gap-3 p-3 rounded-lg bg-card border border-border hover:border-primary transition-colors"
              >
                {/* Rank Badge */}
                <div className="flex items-center justify-center w-8 h-8 rounded-full text-xs font-bold bg-muted text-muted-foreground">
                  {index + 1}
                </div>

                {/* Country Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1.5">
                    <MapPin className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                    <span className="font-semibold text-foreground truncate">
                      {data.country}
                    </span>
                    <span className="text-xs text-muted-foreground flex-shrink-0">
                      ({data.countryCode})
                    </span>
                  </div>

                  {/* Progress Bar */}
                  <div className="w-full bg-muted rounded-full h-1.5 mb-1.5">
                    <div
                      className="bg-primary h-1.5 rounded-full transition-all"
                      style={{ width: `${data.percentage}%` }}
                    />
                  </div>

                  {/* Stats Row */}
                  <div className="flex items-center gap-2 text-xs flex-wrap">
                    <span className="text-muted-foreground whitespace-nowrap">
                      {data.count} nodes
                    </span>
                    <span className="text-muted-foreground">•</span>
                    <span className="text-muted-foreground whitespace-nowrap">
                      {data.activeCount} active
                    </span>
                    <span className="text-muted-foreground">•</span>
                    <span className={`${healthColor} whitespace-nowrap`}>
                      {data.avgHealth.toFixed(0)}% health
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {countryData.length === 0 && (
          <div className="text-center py-8 text-muted-foreground">
            No geographic data available
          </div>
        )}
      </CardContent>
    </Card>
  );
});
