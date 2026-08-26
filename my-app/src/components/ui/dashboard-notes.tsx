"use client";

import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  DollarSign,
  ChefHat,
  TrendingUp,
  Activity
} from "lucide-react";
import {
  RISK_PROFILES,
  getSubAccounts,
  getActiveSubAccountId,
  DEFAULT_SUB_ACCOUNTS
} from "@/lib/risk-assessment-data";
import { RiskLevel, SubAccount } from "@/types/risk-profile";

interface DashboardNotesProps {
  subAccount?: SubAccount;
}

export function DashboardNotes({ subAccount }: DashboardNotesProps) {
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

  // Level-specific statistical benchmarks
  const winRateMap: Record<RiskLevel, { rate: string; ratio: string; sub: string }> = {
    1: { rate: "88%", ratio: "44/50", sub: "Ultra-high stability & dividend capture" },
    2: { rate: "79%", ratio: "39/50", sub: "Reliable index-tracking execution" },
    3: { rate: "71%", ratio: "35/50", sub: "Systematic trend momentum rebalancing" },
    4: { rate: "64%", ratio: "32/50", sub: "High-beta growth swing execution" },
    5: { rate: "58%", ratio: "29/50", sub: "Asymmetric upside momentum rotations" }
  };

  const volatilityMap: Record<RiskLevel, { vol: string; beta: string; status: string }> = {
    1: { vol: "4.8%", beta: "< 0.65", status: "Boomer Haven • Capital preservation & zero stress" },
    2: { vol: "8.5%", beta: "0.75–0.90", status: "Sleep-Tight • Quality compounders & low drawdown" },
    3: { vol: "13.5%", beta: "1.00", status: "Steady Grind • Market Beta & systematic tactical alpha" },
    4: { vol: "24.0%", beta: "1.20–1.50", status: "Apex Hunter • Aggressive momentum & breakout expansion" },
    5: { vol: "34.5%", beta: "> 1.60", status: "Diamond Hands • Micro-cap breakouts & explosive upside" }
  };

  const winStats = winRateMap[activeAccount.riskLevel] || winRateMap[3];
  const volStats = volatilityMap[activeAccount.riskLevel] || volatilityMap[3];

  const targetGoal = (activeAccount.allocatedCapital || 10000) * (1 + (profile.level * 0.06 + 0.05));

  const cardBorderStyle = {
    borderColor: `${color}60`,
    boxShadow: `0 0 12px ${color}10`
  };

  return (
    <div className="grid gap-4 md:grid-cols-2 md:gap-6 lg:grid-cols-4">
      {/* Card 1: Account Balance / Goal */}
      <Card
        className="border-2 shadow-sm bg-card hover:shadow-md transition-all"
        style={cardBorderStyle}
      >
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            Account Balance / Goal
          </CardTitle>
          <div
            className="flex h-7 w-7 items-center justify-center rounded-lg border"
            style={{ backgroundColor: `${color}15`, borderColor: `${color}40`, color }}
          >
            <DollarSign className="h-4 w-4" />
          </div>
        </CardHeader>
        <CardContent className="space-y-1">
          <div className="text-xl sm:text-2xl font-extrabold font-mono text-foreground">
            ${activeAccount.currentValue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </div>
          <div className="text-[11px] text-muted-foreground flex items-center justify-between pt-0.5 border-t border-border/40">
            <span>Cash: <strong className="text-foreground font-mono">${(activeAccount.cashBalance || activeAccount.currentValue * 0.1).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</strong></span>
            <span>Invested: <strong className="text-foreground font-mono">${(activeAccount.investedAmount || activeAccount.currentValue * 0.9).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</strong></span>
          </div>
        </CardContent>
      </Card>

      {/* Card 2: Profitable Trades */}
      <Card
        className="border-2 shadow-sm bg-card hover:shadow-md transition-all"
        style={cardBorderStyle}
      >
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            Systematic Win Rate
          </CardTitle>
          <div
            className="flex h-7 w-7 items-center justify-center rounded-lg border"
            style={{ backgroundColor: `${color}15`, borderColor: `${color}40`, color }}
          >
            <ChefHat className="h-4 w-4" />
          </div>
        </CardHeader>
        <CardContent className="space-y-1">
          <div className="text-xl sm:text-2xl font-extrabold font-mono text-foreground">
            {winStats.rate}
          </div>
          <p className="text-xs text-muted-foreground leading-snug">
            Gotti executed <strong className="text-foreground">{winStats.ratio}</strong> profitable trades for {activeAccount.name}.
          </p>
        </CardContent>
      </Card>

      {/* Card 3: Account Growth / PnL */}
      <Card
        className="border-2 shadow-sm bg-card hover:shadow-md transition-all"
        style={cardBorderStyle}
      >
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            Account Growth (PnL)
          </CardTitle>
          <div
            className="flex h-7 w-7 items-center justify-center rounded-lg border"
            style={{ backgroundColor: `${color}15`, borderColor: `${color}40`, color }}
          >
            <TrendingUp className="h-4 w-4" />
          </div>
        </CardHeader>
        <CardContent className="space-y-1">
          <div
            className="text-xl sm:text-2xl font-extrabold font-mono"
            style={{ color: activeAccount.pnl >= 0 ? color : "hsl(var(--destructive))" }}
          >
            {activeAccount.pnl >= 0 ? "+" : ""}${activeAccount.pnl.toLocaleString(undefined, { minimumFractionDigits: 2 })}
          </div>
          <p className="text-xs text-muted-foreground">
            <strong className="text-foreground font-semibold">
              {activeAccount.pnlPercentage >= 0 ? "+" : ""}{activeAccount.pnlPercentage.toFixed(2)}%
            </strong> yield on ${activeAccount.allocatedCapital.toLocaleString()} allocated.
          </p>
        </CardContent>
      </Card>

      {/* Card 4: Risk & Volatility */}
      <Card
        className="border-2 shadow-sm bg-card hover:shadow-md transition-all"
        style={cardBorderStyle}
      >
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            Strategy Volatility & Risk
          </CardTitle>
          <div
            className="flex h-7 w-7 items-center justify-center rounded-lg border"
            style={{ backgroundColor: `${color}15`, borderColor: `${color}40`, color }}
          >
            <Activity className="h-4 w-4" />
          </div>
        </CardHeader>
        <CardContent className="space-y-1">
          <div className="text-xl sm:text-2xl font-extrabold font-mono text-foreground">
            {volStats.vol}{" "}
            <span className="text-xs font-sans font-medium text-muted-foreground">
              (β {volStats.beta})
            </span>
          </div>
          <p className="text-xs text-muted-foreground leading-snug truncate" title={volStats.status}>
            {volStats.status}
          </p>
        </CardContent>
      </Card>
    </div>
  );
}