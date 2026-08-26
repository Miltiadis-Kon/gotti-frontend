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
    1: { returnStr: "4% – 7%", riskStr: "4.8%", drawdownStr: "3.2%", divStr: "85%" },
    2: { returnStr: "8% – 12%", riskStr: "8.5%", drawdownStr: "5.4%", divStr: "80%" },
    3: { returnStr: "13% – 20%", riskStr: "13.5%", drawdownStr: "8.1%", divStr: "75%" },
    4: { returnStr: "20% – 30%", riskStr: "24.0%", drawdownStr: "14.5%", divStr: "68%" },
    5: { returnStr: "30%+", riskStr: "34.5%", drawdownStr: "22.0%", divStr: "60%" }
  };

  const stats = riskStatsMap[activeAccount.riskLevel] || riskStatsMap[3];

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
