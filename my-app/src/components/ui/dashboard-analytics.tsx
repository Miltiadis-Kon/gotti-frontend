"use client";

import React, { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { PnLChart } from "@/components/modified_ui/pnl_chart";
import { WeeklyPnLChart } from "@/components/ui/different-charts";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { ArrowUpRight, Activity } from "lucide-react";
import Link from "next/link";
import {
  RISK_PROFILES,
  getSubAccounts,
  getActiveSubAccountId,
  DEFAULT_SUB_ACCOUNTS
} from "@/lib/risk-assessment-data";
import { RiskLevel, SubAccount } from "@/types/risk-profile";
import { getBackendApiUrl } from "@/lib/api-config";

interface DashboardAnalyticsProps {
  subAccount?: SubAccount;
}

interface LiveOrderItem {
  id: number;
  date: string;
  symbol: string;
  name: string;
  etfLevel?: number;
  type: "Buy" | "Sell";
  buyPrice: number | "-";
  sellPrice: number | "-";
  profit: number | "-";
  orderAmount: number;
  totalAmount: number;
  status: "Open" | "Closed";
}

export function DashboardAnalytics({ subAccount }: DashboardAnalyticsProps) {
  const [activeAccount, setActiveAccount] = useState<SubAccount>(subAccount || DEFAULT_SUB_ACCOUNTS[0]);
  const [liveOrders, setLiveOrders] = useState<LiveOrderItem[]>([]);
  const [loadingOrders, setLoadingOrders] = useState<boolean>(true);

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

  useEffect(() => {
    let isMounted = true;
    const fetchLiveTrades = async () => {
      try {
        const baseUrl = getBackendApiUrl();
        // User requirement: depending on which sub account I am, update live trades and orders there
        const res = await fetch(`${baseUrl}/orders?limit=30&etf_level=${activeAccount.riskLevel}`, { cache: "no-store" });
        if (res.ok) {
          const data: LiveOrderItem[] = await res.json();
          if (isMounted) {
            setLiveOrders(data);
          }
        }
      } catch (err) {
        console.error("Failed to fetch live trades for dashboard:", err);
      } finally {
        if (isMounted) setLoadingOrders(false);
      }
    };

    fetchLiveTrades();
    const interval = setInterval(fetchLiveTrades, 4000);
    return () => {
      isMounted = false;
      clearInterval(interval);
    };
  }, [activeAccount.riskLevel]);

  const profile = RISK_PROFILES[activeAccount.riskLevel];
  const color = profile.color;

  // Extract unique active symbols or most recent orders
  const recentSymbolsMap = new Map<string, LiveOrderItem>();
  for (const o of liveOrders) {
    if (!recentSymbolsMap.has(o.symbol)) {
      recentSymbolsMap.set(o.symbol, o);
    }
  }
  const distinctRecentOrders = Array.from(recentSymbolsMap.values()).slice(0, 6);

  // Fallback model holdings if no live orders available
  const fallbackHoldings: Record<RiskLevel, Array<{ ticker: string; name: string; allocation: string; pnl: string; isPositive: boolean }>> = {
    1: [
      { ticker: "QQQ", name: "Invesco QQQ Trust (DCA)", allocation: "50%", pnl: "+$0.00", isPositive: true },
      { ticker: "SPY", name: "SPDR S&P 500 ETF (DCA)", allocation: "50%", pnl: "+$0.00", isPositive: true }
    ],
    2: [
      { ticker: "USD", name: "Cash Reserve (Awaiting Morning Catalysts)", allocation: "100%", pnl: "+$0.00", isPositive: true }
    ],
    3: [
      { ticker: "USD", name: "Tactical Cash Reserve", allocation: "100%", pnl: "+$0.00", isPositive: true }
    ]
  };

  const hasLiveOrders = distinctRecentOrders.length > 0;
  const openCount = liveOrders.filter((o) => String(o.status).toLowerCase() === "open").length;

  return (
    <div className="grid gap-4 md:gap-6 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 bg-transparent">
      {/* Charts Column */}
      <Card className="xl:col-span-2 bg-transparent p-0 border-0 shadow-none">
        <CardContent className="flex flex-col lg:flex-row gap-4 items-stretch p-0">
          <PnLChart subAccount={activeAccount} />
          <WeeklyPnLChart subAccount={activeAccount} />
        </CardContent>
      </Card>

      {/* Live Positions / Orders for Active ETF Column */}
      <Card
        className="border-2 shadow-md bg-card flex flex-col justify-between"
        style={{ borderColor: `${color}60`, boxShadow: `0 0 12px ${color}08` }}
        x-chunk="dashboard-01-chunk-5"
      >
        <CardHeader className="flex justify-between flex-row items-center pb-3">
          <div className="space-y-0.5">
            <div className="flex items-center gap-2">
              <CardTitle className="text-base font-bold">
                {hasLiveOrders ? "Live Systematic Trades" : "Model Portfolio Holdings"}
              </CardTitle>
              {hasLiveOrders && (
                <Badge className="bg-emerald-500/10 text-emerald-500 border-emerald-500/30 text-[10px] font-mono flex items-center gap-1">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
                  Alpaca Live
                </Badge>
              )}
            </div>
            <CardDescription className="text-xs">
              {hasLiveOrders
                ? `${openCount} active positions in ${activeAccount.name}`
                : `Systematic positions in ${activeAccount.name}`}
            </CardDescription>
          </div>
          <Button asChild size="sm" variant="ghost" className="h-8 text-xs gap-1">
            <Link href="/orders">
              All Orders
              <ArrowUpRight className="h-3.5 w-3.5" />
            </Link>
          </Button>
        </CardHeader>

        <Separator className="bg-border mb-2" />

        <CardContent className="grid gap-3 pt-0 pb-3">
          {hasLiveOrders ? (
            distinctRecentOrders.map((order) => {
              const isOpen = String(order.status).toLowerCase() === "open";
              const isBuy = String(order.type).toUpperCase() === "BUY";
              const entryPrice = isBuy
                ? Number(order.buyPrice) || 0
                : Number(order.sellPrice) || 0;
              const profitNum = Number(order.profit);
              const hasProfit = !isNaN(profitNum) && !isOpen;
              // Clean name: never show [L1], [L2], [L3]
              const cleanStrategy = String(order.name || "").replace(/^\[L[1-3]\]\s*/, "").replace(" Live", "");

              return (
                <div
                  key={`${order.symbol}-${order.id}`}
                  className="flex items-center justify-between gap-2 p-1.5 rounded-lg hover:bg-muted/40 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <Avatar
                      className="h-8 w-8 text-xs font-bold font-mono border"
                      style={{ backgroundColor: `${color}15`, borderColor: `${color}40`, color }}
                    >
                      <AvatarFallback style={{ backgroundColor: `${color}20`, color }}>
                        {order.symbol.slice(0, 3)}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <div className="flex items-center gap-1.5">
                        <span className="text-xs font-bold text-foreground font-mono">
                          {order.symbol}
                        </span>
                        <Badge
                          variant="outline"
                          className={
                            isBuy
                              ? "text-[9px] px-1 py-0 border-emerald-500/40 text-emerald-500 font-mono"
                              : "text-[9px] px-1 py-0 border-rose-500/40 text-rose-500 font-mono"
                          }
                        >
                          {order.type}
                        </Badge>
                        <span className="text-[10px] text-muted-foreground font-mono">
                          {Number(order.orderAmount).toLocaleString()} shs • {cleanStrategy}
                        </span>
                      </div>
                      <p className="text-[11px] text-muted-foreground line-clamp-1 font-mono">
                        Entry: ${entryPrice.toFixed(2)} | Total: ${(Number(order.totalAmount) || 0).toLocaleString(undefined, { maximumFractionDigits: 0 })}
                      </p>
                    </div>
                  </div>

                  <div className="text-right">
                    <Badge
                      variant="outline"
                      className={
                        isOpen
                          ? "bg-emerald-500/10 text-emerald-500 border-emerald-500/30 text-[10px] font-mono"
                          : "bg-muted text-muted-foreground text-[10px] font-mono"
                      }
                    >
                      {isOpen ? "Open" : "Closed"}
                    </Badge>
                    {hasProfit && (
                      <div
                        className={`font-mono text-[11px] font-bold mt-0.5 ${
                          profitNum >= 0 ? "text-emerald-500" : "text-rose-500"
                        }`}
                      >
                        {profitNum >= 0 ? `+$${profitNum.toFixed(2)}` : `$${profitNum.toFixed(2)}`}
                      </div>
                    )}
                  </div>
                </div>
              );
            })
          ) : (
            (fallbackHoldings[activeAccount.riskLevel] || fallbackHoldings[2]).map((pos) => (
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
            ))
          )}
        </CardContent>

        <CardFooter className="border-t pt-2.5 pb-2.5 text-[11px] text-muted-foreground flex justify-between bg-muted/10">
          <span>Broker: <strong className="text-emerald-500 font-mono">Alpaca Level {activeAccount.riskLevel} ({profile.strategyName})</strong></span>
          <span>Live Synchronized: <strong className="text-foreground">Every 4s</strong></span>
        </CardFooter>
      </Card>
    </div>
  );
}
