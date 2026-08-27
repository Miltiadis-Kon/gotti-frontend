"use client";

import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DollarSign, ShieldCheck, Activity, Layers, TrendingUp, AlertTriangle } from "lucide-react";
import {
  RISK_PROFILES,
  getSubAccounts,
  getActiveSubAccountId,
  DEFAULT_SUB_ACCOUNTS
} from "@/lib/risk-assessment-data";
import { RiskLevel, SubAccount } from "@/types/risk-profile";

interface PortofolioNotesProps {
  subAccount?: SubAccount;
}

export function PortofolioNotes({ subAccount }: PortofolioNotesProps) {
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

  const cardStyle = {
    borderColor: `${color}60`,
    boxShadow: `0 0 12px ${color}08`
  };

  const riskStatsMap: Record<RiskLevel, { returnStr: string; riskStr: string; drawdownStr: string; divStr: string }> = {
    1: { returnStr: "5% – 9%", riskStr: "< 22%", drawdownStr: "< 15%", divStr: "85%" },
    2: { returnStr: "10% – 18%", riskStr: "22% – 48%", drawdownStr: "15% – 30%", divStr: "78%" },
    3: { returnStr: "20%+", riskStr: "> 48%", drawdownStr: "30% – 55%+", divStr: "65%" }
  };

  const stats = riskStatsMap[activeAccount.riskLevel] || riskStatsMap[2];

  return (
    <div className="grid gap-4 md:grid-cols-2 md:gap-6 lg:grid-cols-4">
      {/* Return */}
      <Card className="border-2 shadow-sm bg-card hover:shadow-md transition-all" style={cardStyle}>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            Target 1Y Return
          </CardTitle>
          <div
            className="flex h-7 w-7 items-center justify-center rounded-lg border"
            style={{ backgroundColor: `${color}15`, borderColor: `${color}40`, color }}
          >
            <DollarSign className="h-4 w-4" />
          </div>
        </CardHeader>
        <CardContent>
          <div className="text-xl sm:text-2xl font-bold font-mono text-foreground">{stats.returnStr}</div>
          <p className="text-xs text-muted-foreground mt-1">
            Target annualized profile for {activeAccount.name}.
          </p>
        </CardContent>
      </Card>

      {/* Risk */}
      <Card className="border-2 shadow-sm bg-card hover:shadow-md transition-all" style={cardStyle}>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            Volatility Risk
          </CardTitle>
          <div
            className="flex h-7 w-7 items-center justify-center rounded-lg border"
            style={{ backgroundColor: `${color}15`, borderColor: `${color}40`, color }}
          >
            <Activity className="h-4 w-4" />
          </div>
        </CardHeader>
        <CardContent>
          <div className="text-xl sm:text-2xl font-bold font-mono text-foreground">{stats.riskStr}</div>
          <p className="text-xs text-muted-foreground mt-1">
            Standard deviation annualized boundary.
          </p>
        </CardContent>
      </Card>

      {/* Drawdown */}
      <Card className="border-2 shadow-sm bg-card hover:shadow-md transition-all" style={cardStyle}>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            Historical Max Drawdown
          </CardTitle>
          <div
            className="flex h-7 w-7 items-center justify-center rounded-lg border"
            style={{ backgroundColor: `${color}15`, borderColor: `${color}40`, color }}
          >
            <AlertTriangle className="h-4 w-4" />
          </div>
        </CardHeader>
        <CardContent>
          <div className="text-xl sm:text-2xl font-bold font-mono text-foreground">{stats.drawdownStr}</div>
          <p className="text-xs text-muted-foreground mt-1">
            Maximum historical cycle pullback.
          </p>
        </CardContent>
      </Card>

      {/* Diversification */}
      <Card className="border-2 shadow-sm bg-card hover:shadow-md transition-all" style={cardStyle}>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            Diversification Index
          </CardTitle>
          <div
            className="flex h-7 w-7 items-center justify-center rounded-lg border"
            style={{ backgroundColor: `${color}15`, borderColor: `${color}40`, color }}
          >
            <Layers className="h-4 w-4" />
          </div>
        </CardHeader>
        <CardContent>
          <div className="text-xl sm:text-2xl font-bold font-mono text-foreground">{stats.divStr}</div>
          <p className="text-xs text-muted-foreground mt-1">
            Multi-asset dispersion rating.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
