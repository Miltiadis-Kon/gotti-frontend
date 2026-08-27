"use client";

import React, { useState, useEffect } from "react";
import { Separator } from "../ui/separator";
import { Badge } from "@/components/ui/badge";
import { PortofolioNotes } from "../ui/portofolio-overview";
import {
  PortofolioAllocation,
  PortfolioPieChart,
  SectorBarChart,
  EquityPieChart,
  AssetAllocationPieChart,
  ExpectedAnnualReturns,
} from "../ui/portofolio-allocation";
import {
  RISK_PROFILES,
  getSubAccounts,
  getActiveSubAccountId,
  DEFAULT_SUB_ACCOUNTS
} from "@/lib/risk-assessment-data";
import { SubAccount, RiskLevel } from "@/types/risk-profile";
import { ShieldCheck, TrendingUp, Scale, Zap, Flame, PieChart as PieIcon, Layers, BarChart2 } from "lucide-react";

export function TradesContent() {
  const [activeAccount, setActiveAccount] = useState<SubAccount>(DEFAULT_SUB_ACCOUNTS[0]);

  useEffect(() => {
    const loadAccount = () => {
      const accs = getSubAccounts();
      const activeId = getActiveSubAccountId();
      const current = accs.find((a) => a.id === activeId) || accs[0] || DEFAULT_SUB_ACCOUNTS[0];
      setActiveAccount(current);
    };

    loadAccount();
    const interval = setInterval(loadAccount, 1000);
    return () => clearInterval(interval);
  }, []);

  const profile = RISK_PROFILES[activeAccount.riskLevel];

  const getProfileIcon = (level: RiskLevel) => {
    switch (level) {
      case 1: return <ShieldCheck className="h-4 w-4 text-emerald-500" />;
      case 2: return <TrendingUp className="h-4 w-4 text-indigo-500" />;
      case 3: return <Flame className="h-4 w-4 text-rose-500" />;
    }
  };

  return (
    <div className="flex w-full flex-col space-y-8 max-w-7xl mx-auto pb-12">
      {/* Portfolio Strategy Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b pb-5">
        <div className="space-y-1">
          <div className="flex items-center gap-2.5">
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground">
              {activeAccount.name} Portfolio
            </h1>
            <Badge className={profile.badgeClass}>
              Level {activeAccount.riskLevel}
            </Badge>
          </div>
          <p className="text-xs sm:text-sm text-muted-foreground flex items-center gap-2">
            {getProfileIcon(activeAccount.riskLevel)}
            <span>Strategy: <strong className="text-foreground">{profile.strategyName}</strong></span>
            <span>•</span>
            <span>Target Annual Yield: <strong className="text-foreground">{profile.targetReturn}</strong></span>
          </p>
        </div>

        <div className="flex items-center gap-3 text-xs font-mono">
          <Badge variant="outline" className="bg-card border-border/80 px-3 py-1.5 font-medium">
            Allocated: <strong className="ml-1 text-foreground">${activeAccount.allocatedCapital.toLocaleString()}</strong>
          </Badge>
          <Badge variant="outline" className="bg-card border-border/80 px-3 py-1.5 font-medium">
            NAV: <strong className="ml-1 text-foreground">${activeAccount.currentValue.toLocaleString(undefined, { minimumFractionDigits: 2 })}</strong>
          </Badge>
        </div>
      </div>

      {/* 1. Highlights & Performance Metrics */}
      <section className="space-y-3.5">
        <div className="flex items-center gap-2">
          <BarChart2 className="h-4 w-4 text-muted-foreground" />
          <h2 className="text-lg font-bold text-foreground tracking-tight">Portfolio Metrics & Risk Boundaries</h2>
        </div>
        <PortofolioNotes subAccount={activeAccount} />
      </section>

      <Separator className="bg-border/60" />

      {/* 2. Asset Universe Breakdown (Table + Pie Chart) */}
      <section className="space-y-3.5">
        <div className="flex items-center gap-2">
          <PieIcon className="h-4 w-4 text-muted-foreground" />
          <h2 className="text-lg font-bold text-foreground tracking-tight">Asset Universe & Holdings Distribution</h2>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <PortofolioAllocation subAccount={activeAccount} />
          </div>
          <div className="lg:col-span-1">
            <PortfolioPieChart subAccount={activeAccount} />
          </div>
        </div>
      </section>

      <Separator className="bg-border/60" />

      {/* 3. Expected vs Realized Performance Chart */}
      <section className="space-y-3.5">
        <div className="flex items-center gap-2">
          <TrendingUp className="h-4 w-4 text-muted-foreground" />
          <h2 className="text-lg font-bold text-foreground tracking-tight">Trajectory & Realized Yield vs Benchmark</h2>
        </div>
        <ExpectedAnnualReturns subAccount={activeAccount} />
      </section>

      <Separator className="bg-border/60" />

      {/* 4. Diversification Analytics (Sectors, Asset Class, Market Cap) */}
      <section className="space-y-3.5">
        <div className="flex items-center gap-2">
          <Layers className="h-4 w-4 text-muted-foreground" />
          <h2 className="text-lg font-bold text-foreground tracking-tight">Diversification & Exposure Breakdown</h2>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          <SectorBarChart subAccount={activeAccount} />
          <AssetAllocationPieChart subAccount={activeAccount} />
          <EquityPieChart subAccount={activeAccount} />
        </div>
      </section>
    </div>
  );
}
