"use client";

import React, { useState, useEffect } from "react";
import { TrendingUp, TrendingDown, Activity } from "lucide-react";
import { CartesianGrid, LabelList, Line, LineChart, XAxis, YAxis, ResponsiveContainer, Tooltip } from "recharts";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  RISK_PROFILES,
  getSubAccounts,
  getActiveSubAccountId,
  DEFAULT_SUB_ACCOUNTS
} from "@/lib/risk-assessment-data";
import { SubAccount } from "@/types/risk-profile";
import { getBackendApiUrl } from "@/lib/api-config";

interface PnLChartProps {
  subAccount?: SubAccount;
}

interface DailyPoint {
  date: string;
  realizedPnl: number;
  cumulativePnl: number;
  volume: number;
  tradesCount: number;
  winRate: number;
}

export function PnLChart({ subAccount }: PnLChartProps) {
  const [activeAccount, setActiveAccount] = useState<SubAccount>(subAccount || DEFAULT_SUB_ACCOUNTS[0]);
  const [dailyData, setDailyData] = useState<DailyPoint[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (subAccount) {
      setActiveAccount(subAccount);
      return;
    }
    const loadCurrent = () => {
      const accs = getSubAccounts();
      const activeId = getActiveSubAccountId();
      const current = accs.find((a) => a.id === activeId) || accs[0] || DEFAULT_SUB_ACCOUNTS[0];
      setActiveAccount(current);
    };
    loadCurrent();

    const handleUpdate = (e: any) => {
      const accs: SubAccount[] = e.detail || getSubAccounts();
      const activeId = getActiveSubAccountId();
      const current = accs.find((a) => a.id === activeId) || accs[0] || DEFAULT_SUB_ACCOUNTS[0];
      setActiveAccount(current);
    };

    window.addEventListener("gotti_sub_accounts_updated", handleUpdate);
    return () => window.removeEventListener("gotti_sub_accounts_updated", handleUpdate);
  }, [subAccount]);

  // Fetch real day-by-day PnL from backend
  useEffect(() => {
    let isMounted = true;
    const fetchDailyPnL = async () => {
      try {
        const baseUrl = getBackendApiUrl();
        const res = await fetch(`${baseUrl}/sub-accounts/${activeAccount.id}/daily-pnl`, { cache: "no-store" });
        if (res.ok) {
          const data: DailyPoint[] = await res.json();
          if (isMounted) {
            setDailyData(data);
          }
        }
      } catch (err) {
        console.debug("Failed to fetch daily PnL:", err);
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    fetchDailyPnL();
    const interval = setInterval(fetchDailyPnL, 5000);
    return () => {
      isMounted = false;
      clearInterval(interval);
    };
  }, [activeAccount.id]);

  const profile = RISK_PROFILES[activeAccount.riskLevel];
  const color = profile.color;

  // Format chart items
  const chartData = dailyData.length > 0
    ? dailyData.map((d) => ({
        day: d.date.slice(0, 5), // e.g. "05/11", "06/11"
        fullDate: d.date,
        pnl: d.realizedPnl,
        cumulativePnl: d.cumulativePnl,
        formattedPnl: d.realizedPnl >= 0 ? `+$${d.realizedPnl.toLocaleString()}` : `-$${Math.abs(d.realizedPnl).toLocaleString()}`,
        formattedCumulative: d.cumulativePnl >= 0 ? `+$${d.cumulativePnl.toLocaleString()}` : `-$${Math.abs(d.cumulativePnl).toLocaleString()}`,
        trades: d.tradesCount
      }))
    : [
        { day: "Day 1", fullDate: "Baseline", pnl: 0, cumulativePnl: 0, formattedPnl: "$0.00", formattedCumulative: "$0.00", trades: 0 },
        { day: "Today", fullDate: "Current", pnl: activeAccount.pnl || 0, cumulativePnl: activeAccount.pnl || 0, formattedPnl: `$${(activeAccount.pnl || 0).toFixed(2)}`, formattedCumulative: `$${(activeAccount.pnl || 0).toFixed(2)}`, trades: 0 }
      ];

  const totalCumulative = chartData[chartData.length - 1].cumulativePnl;
  const isPositive = totalCumulative >= 0;

  return (
    <Card
      className="lg:max-w-md flex-grow border-2 shadow-md bg-card flex flex-col justify-between"
      style={{ borderColor: `${color}60`, boxShadow: `0 0 12px ${color}08` }}
      x-chunk="charts-01-chunk-0"
    >
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="text-base font-bold">Day-by-Day Realized P&L</CardTitle>
          <Badge variant="outline" className="text-[10px] font-mono" style={{ borderColor: `${color}50`, color }}>
            {isPositive ? "Profitable" : "Drawdown"}
          </Badge>
        </div>
        <CardDescription className="text-xs">
          Live daily executed trade P&L • {activeAccount.name}
        </CardDescription>
      </CardHeader>

      <CardContent className="pt-2 pb-2">
        <div className="h-[200px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart
              data={chartData}
              margin={{
                top: 22,
                left: 6,
                right: 6,
                bottom: 4,
              }}
            >
              <CartesianGrid vertical={false} strokeDasharray="3 3" opacity={0.2} />
              <XAxis
                dataKey="day"
                tickLine={false}
                axisLine={false}
                tickMargin={6}
                fontSize={11}
                stroke="hsl(var(--muted-foreground))"
              />
              <YAxis hide domain={["dataMin - 100", "dataMax + 200"]} />
              <Tooltip
                content={({ active, payload }) => {
                  if (active && payload && payload.length) {
                    const row = payload[0].payload;
                    return (
                      <div className="rounded-lg border bg-background p-2.5 shadow-md text-xs font-mono space-y-1">
                        <span className="text-muted-foreground block text-[10px]">Date: {row.fullDate}</span>
                        <div className="text-foreground text-xs">
                          Daily Realized: <strong style={{ color: row.pnl >= 0 ? "#10b981" : "#ef4444" }}>{row.formattedPnl}</strong>
                        </div>
                        <div className="text-muted-foreground text-[11px]">
                          Cumulative P&L: <strong className="text-foreground">{row.formattedCumulative}</strong>
                        </div>
                        {row.trades > 0 && (
                          <div className="text-[10px] text-muted-foreground">
                            Trades Executed: <strong>{row.trades}</strong>
                          </div>
                        )}
                      </div>
                    );
                  }
                  return null;
                }}
              />
              <Line
                dataKey="pnl"
                type="monotone"
                stroke={color}
                strokeWidth={3}
                dot={{
                  fill: color,
                  r: 5,
                  strokeWidth: 2,
                  stroke: "var(--background)"
                }}
                activeDot={{
                  r: 7,
                  fill: color,
                  stroke: "var(--background)",
                  strokeWidth: 2
                }}
              >
                <LabelList
                  dataKey="pnl"
                  position="top"
                  offset={10}
                  fontSize={10}
                  fontWeight="bold"
                  fill="hsl(var(--foreground))"
                  formatter={(val: any) => {
                    const n = Number(val);
                    return n >= 0 ? `+$${n.toLocaleString()}` : `-$${Math.abs(n).toLocaleString()}`;
                  }}
                />
              </Line>
            </LineChart>
          </ResponsiveContainer>
        </div>
      </CardContent>

      <CardFooter className="flex-col items-start gap-1 text-xs border-t pt-3 bg-muted/10">
        <div className="flex items-center gap-1.5 font-semibold text-foreground">
          <span style={{ color }}>{activeAccount.name}</span>
          <span>Net: <strong className="font-mono" style={{ color: isPositive ? "#10b981" : "#ef4444" }}>{chartData[chartData.length - 1].formattedCumulative}</strong></span>
          {isPositive ? <TrendingUp className="h-4 w-4 text-emerald-500" /> : <TrendingDown className="h-4 w-4 text-rose-500" />}
        </div>
        <div className="leading-none text-muted-foreground text-[11px]">
          Target Annual Profile: <strong>{profile.targetReturn}</strong> ({profile.strategyName})
        </div>
      </CardFooter>
    </Card>
  );
}
