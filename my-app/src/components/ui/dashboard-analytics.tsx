"use client";

import React, { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { PnLChart } from "@/components/modified_ui/pnl_chart";
import { WeeklyPnLChart } from "@/components/ui/different-charts";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { ArrowUpRight, Target } from "lucide-react";
import Link from "next/link";
import {
  RISK_PROFILES,
  getSubAccounts,
  getActiveSubAccountId,
  DEFAULT_SUB_ACCOUNTS
} from "@/lib/risk-assessment-data";
import { RiskLevel, SubAccount } from "@/types/risk-profile";

interface DashboardAnalyticsProps {
  subAccount?: SubAccount;
}

export function DashboardAnalytics({ subAccount }: DashboardAnalyticsProps) {
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
  const color = profile.color;

  // Real underlying stock holdings per strategy
  const holdingsMap: Record<RiskLevel, Array<{ ticker: string; name: string; allocation: string; pnl: string; isPositive: boolean }>> = {
    1: [
      { ticker: "KO", name: "The Coca-Cola Company", allocation: "22%", pnl: "+$840.00", isPositive: true },
      { ticker: "PG", name: "Procter & Gamble Co.", allocation: "20%", pnl: "+$620.50", isPositive: true },
      { ticker: "JNJ", name: "Johnson & Johnson", allocation: "18%", pnl: "+$410.00", isPositive: true },
      { ticker: "MSFT", name: "Microsoft Corporation", allocation: "20%", pnl: "+$1,250.00", isPositive: true },
      { ticker: "AAPL", name: "Apple Inc.", allocation: "20%", pnl: "+$980.00", isPositive: true }
    ],
    2: [
      { ticker: "QQQ", name: "Invesco QQQ Trust", allocation: "25%", pnl: "+$2,450.00", isPositive: true },
      { ticker: "NVDA", name: "Nvidia Corporation", allocation: "20%", pnl: "+$3,120.00", isPositive: true },
      { ticker: "META", name: "Meta Platforms Inc.", allocation: "18%", pnl: "+$1,480.00", isPositive: true },
      { ticker: "AMD", name: "Advanced Micro Devices", allocation: "15%", pnl: "-$430.00", isPositive: false },
      { ticker: "ASML", name: "ASML Holding N.V.", allocation: "12%", pnl: "+$960.00", isPositive: true },
      { ticker: "TSM", name: "Taiwan Semiconductor", allocation: "10%", pnl: "+$820.00", isPositive: true }
    ],
    3: [
      { ticker: "MSTR", name: "MicroStrategy Inc.", allocation: "25%", pnl: "+$6,250.00", isPositive: true },
      { ticker: "TSLA", name: "Tesla Inc.", allocation: "20%", pnl: "+$3,420.00", isPositive: true },
      { ticker: "PLTR", name: "Palantir Technologies", allocation: "18%", pnl: "+$2,950.00", isPositive: true },
      { ticker: "COIN", name: "Coinbase Global Inc.", allocation: "15%", pnl: "-$860.00", isPositive: false },
      { ticker: "RIVN", name: "Rivian Automotive", allocation: "12%", pnl: "-$1,240.00", isPositive: false },
      { ticker: "MARA", name: "MARA Holdings Inc.", allocation: "10%", pnl: "+$1,890.00", isPositive: true }
    ]
  };

  const positions = holdingsMap[activeAccount.riskLevel] || holdingsMap[2];

  return (
    <div className="grid gap-4 md:gap-6 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 bg-transparent">
      {/* Charts Column */}
      <Card className="xl:col-span-2 bg-transparent p-0 border-0 shadow-none">
        <CardContent className="flex flex-col lg:flex-row gap-4 items-stretch p-0">
          <PnLChart subAccount={activeAccount} />
          <WeeklyPnLChart subAccount={activeAccount} />
        </CardContent>
      </Card>

      {/* Recent Positions for Active ETF Column */}
      <Card
        className="border-2 shadow-md bg-card flex flex-col justify-between"
        style={{ borderColor: `${color}60`, boxShadow: `0 0 12px ${color}08` }}
        x-chunk="dashboard-01-chunk-5"
      >
        <CardHeader className="flex justify-between flex-row items-center pb-3">
          <div className="space-y-0.5">
            <CardTitle className="text-base font-bold">Model Portfolio Holdings</CardTitle>
            <CardDescription className="text-xs">
              Systematic positions in {activeAccount.name}
            </CardDescription>
          </div>
          <Button asChild size="sm" variant="ghost" className="h-8 text-xs gap-1">
            <Link href="/sub-accounts">
              All ETF Hub
              <ArrowUpRight className="h-3.5 w-3.5" />
            </Link>
          </Button>
        </CardHeader>

        <Separator className="bg-border mb-2" />

        <CardContent className="grid gap-3 pt-0 pb-3">
          {positions.map((pos) => (
            <div key={pos.ticker} className="flex items-center justify-between gap-2 p-1.5 rounded-lg hover:bg-muted/40 transition-colors">
              <div className="flex items-center gap-3">
                <Avatar
                  className="h-8 w-8 text-xs font-bold font-mono border"
                  style={{ backgroundColor: `${color}15`, borderColor: `${color}40`, color }}
                >
                  <AvatarFallback style={{ backgroundColor: `${color}20`, color }}>
                    {pos.ticker.slice(0, 3)}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <div className="flex items-center gap-1.5">
                    <span className="text-xs font-bold text-foreground font-mono">{pos.ticker}</span>
                    <span className="text-[10px] text-muted-foreground font-medium">({pos.allocation})</span>
                  </div>
                  <p className="text-[11px] text-muted-foreground line-clamp-1">
                    {pos.name}
                  </p>
                </div>
              </div>
              <div
                className="font-mono text-xs font-bold text-right"
                style={{ color: pos.isPositive ? color : "hsl(var(--destructive))" }}
              >
                {pos.pnl}
              </div>
            </div>
          ))}
        </CardContent>

        <CardFooter className="border-t pt-2.5 pb-2.5 text-[11px] text-muted-foreground flex justify-between bg-muted/10">
          <span>Universe: <strong className="text-foreground">{profile.sampleTickers.length} Assets</strong></span>
          <span>Rebalanced: <strong className="text-foreground">Today</strong></span>
        </CardFooter>
      </Card>
    </div>
  );
}