"use client";

import React, { useState, useEffect } from "react";
import { TrendingUp, ShieldCheck, TrendingDown } from "lucide-react";
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

interface PnLChartProps {
  subAccount?: SubAccount;
}

export function PnLChart({ subAccount }: PnLChartProps) {
  const [activeAccount, setActiveAccount] = useState<SubAccount>(subAccount || DEFAULT_SUB_ACCOUNTS[0]);

  useEffect(() => {
    if (subAccount) {
      setActiveAccount(subAccount);
      return;
    }
    const accs = getSubAccounts();
    const activeId = getActiveSubAccountId();
    const current = accs.find((a) => a.id === activeId) || accs[0] || DEFAULT_SUB_ACCOUNTS[0];
    setActiveAccount(current);
  }, [subAccount]);

  const profile = RISK_PROFILES[activeAccount.riskLevel];
  const color = profile.color; // #10b981 (L1), #06b6d4 (L2), #6366f1 (L3), #f59e0b (L4), #ef4444 (L5)

  // Generate customized historical monthly data scaled to the active account's capital & risk level
  const baseFactor = activeAccount.currentValue / 100;
  const multiplierMap: Record<number, number[]> = {
    1: [140, 165, 180, 195, 210, 225, 240], // steady, low volatility upward trend
    2: [150, 190, 175, 210, 205, 230, 260], // modest growth with minor pullbacks
    3: [186, 305, 237, 210, 209, 214, 285], // balanced momentum trend
    4: [220, 390, 280, 180, 310, 420, 490], // high beta growth swings
    5: [250, 520, 310, 140, 460, 380, 620]  // aggressive speculative volatility
  };

  const curve = multiplierMap[activeAccount.riskLevel] || multiplierMap[3];
  const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul"];

  const chartData = months.map((m, idx) => ({
    month: m,
    pnl: Math.round(curve[idx] * (baseFactor / 200)),
    formattedPnl: `$${Math.round(curve[idx] * (baseFactor / 200)).toLocaleString()}`
  }));

  const startVal = chartData[0].pnl;
  const endVal = chartData[chartData.length - 1].pnl;
  const percentageChange = startVal > 0 ? (((endVal - startVal) / startVal) * 100).toFixed(1) : "14.2";

  return (
    <Card
      className="lg:max-w-md flex-grow border-2 shadow-md bg-card flex flex-col justify-between"
      style={{ borderColor: `${color}60`, boxShadow: `0 0 12px ${color}08` }}
      x-chunk="charts-01-chunk-0"
    >
      <CardHeader className="pb-2">
        <CardTitle className="text-base font-bold">Monthly Realised PnL</CardTitle>
        <CardDescription className="text-xs">
          {chartData[0].month} – {chartData[chartData.length - 1].month} 2026 • {activeAccount.name}
        </CardDescription>
      </CardHeader>

      <CardContent className="pt-2 pb-2">
        <div className="h-[200px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart
              data={chartData}
              margin={{
                top: 18,
                left: 6,
                right: 6,
                bottom: 4,
              }}
            >
              <CartesianGrid vertical={false} strokeDasharray="3 3" opacity={0.2} />
              <XAxis
                dataKey="month"
                tickLine={false}
                axisLine={false}
                tickMargin={6}
                fontSize={11}
                stroke="hsl(var(--muted-foreground))"
              />
              <YAxis hide domain={["dataMin - 20", "dataMax + 40"]} />
              <Tooltip
                content={({ active, payload }) => {
                  if (active && payload && payload.length) {
                    return (
                      <div className="rounded-lg border bg-background p-2 shadow-md text-xs font-mono">
                        <span className="text-muted-foreground block text-[10px]">{payload[0].payload.month} PnL</span>
                        <strong className="text-foreground text-sm font-bold" style={{ color }}>
                          {payload[0].payload.formattedPnl}
                        </strong>
                      </div>
                    );
                  }
                  return null;
                }}
              />
              <Line
                dataKey="pnl"
                type="natural"
                stroke={color}
                strokeWidth={3}
                dot={{
                  fill: color,
                  r: 4,
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
                  fontSize={11}
                  fontWeight="bold"
                  fill="hsl(var(--foreground))"
                  formatter={(val: any) => `$${Number(val).toLocaleString()}`}
                />
              </Line>
            </LineChart>
          </ResponsiveContainer>
        </div>
      </CardContent>

      <CardFooter className="flex-col items-start gap-1 text-xs border-t pt-3 bg-muted/10">
        <div className="flex items-center gap-1.5 font-semibold text-foreground">
          <span style={{ color }}>{activeAccount.name}</span> is trending +{percentageChange}% this cycle
          <TrendingUp className="h-4 w-4" style={{ color }} />
        </div>
        <div className="leading-none text-muted-foreground text-[11px]">
          Target Yield Profile: <strong>{profile.targetReturn}</strong>
        </div>
      </CardFooter>
    </Card>
  );
}
