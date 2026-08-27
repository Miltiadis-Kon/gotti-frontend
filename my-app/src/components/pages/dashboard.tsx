"use client";

import React, { useState, useEffect } from "react";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { DashboardNotes } from "../ui/dashboard-notes";
import { DashboardAnalytics } from "../ui/dashboard-analytics";
import { PortofolioVisualizerDashboard } from "../ui/portofolio-visualizer-dashboard";
import {
  RISK_PROFILES,
  getSubAccounts,
  getActiveSubAccountId,
  DEFAULT_SUB_ACCOUNTS
} from "@/lib/risk-assessment-data";
import { SubAccount, RiskLevel } from "@/types/risk-profile";
import { ShieldCheck, TrendingUp, Scale, Zap, Flame, Target } from "lucide-react";

export function DashboardContent() {
  const [activeAccount, setActiveAccount] = useState<SubAccount>(DEFAULT_SUB_ACCOUNTS[0]);

  useEffect(() => {
    const loadAccount = () => {
      const accs = getSubAccounts();
      const activeId = getActiveSubAccountId();
      const current = accs.find((a) => a.id === activeId) || accs[0] || DEFAULT_SUB_ACCOUNTS[0];
      setActiveAccount(current);
    };

    loadAccount();
    // Poll for changes when switching in header/switcher
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
    <div className="flex min-h-screen w-full flex-col space-y-6">
      {/* Active Sub-Account Strategy Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b pb-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold tracking-tight text-foreground">
              {activeAccount.name}
            </h1>
            <Badge className={profile.badgeClass}>
              Level {activeAccount.riskLevel}
            </Badge>
          </div>
          <p className="text-xs text-muted-foreground mt-0.5 flex items-center gap-1.5">
            {getProfileIcon(activeAccount.riskLevel)}
            <span>Strategy: <strong>{profile.strategyName}</strong> ({profile.targetReturn})</span>
          </p>
        </div>

        <div className="flex items-center gap-2 text-xs font-mono">
          <Badge variant="outline" className="bg-background">
            Allocated: ${activeAccount.allocatedCapital.toLocaleString()}
          </Badge>
          <Badge variant="outline" className="bg-background">
            NAV: ${activeAccount.currentValue.toLocaleString(undefined, { minimumFractionDigits: 2 })}
          </Badge>
        </div>
      </div>

      {/* Overview Cards */}
      <div className="space-y-3">
        <h2 className="text-lg font-semibold text-foreground">Overview</h2>
        <DashboardNotes subAccount={activeAccount} />
      </div>

      <Separator className="bg-border" />

      {/* Analytics & Realized PnL Charts */}
      <div className="space-y-3">
        <h2 className="text-lg font-semibold text-foreground">Strategy Analytics & Holdings</h2>
        <DashboardAnalytics subAccount={activeAccount} />
      </div>

      <Separator className="bg-border" />

      {/* Portfolio Allocation Visualizer */}
      <div className="space-y-3">
        <h2 className="text-lg font-semibold text-foreground">Asset Universe Visualizer</h2>
        <PortofolioVisualizerDashboard subAccount={activeAccount} />
      </div>
    </div>
  );
}
