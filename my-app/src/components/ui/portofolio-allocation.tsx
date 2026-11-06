"use client";

import React, { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { TrendingUp, PieChart as PieIcon, Layers, BarChart3, Activity } from "lucide-react";
import {
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  Cell,
  Bar,
  BarChart,
  CartesianGrid,
  XAxis,
  YAxis,
  Line,
  LineChart
} from "recharts";
import {
  RISK_PROFILES,
  getSubAccounts,
  getActiveSubAccountId,
  DEFAULT_SUB_ACCOUNTS
} from "@/lib/risk-assessment-data";
import { RiskLevel, SubAccount } from "@/types/risk-profile";
import { getBackendApiUrl } from "@/lib/api-config";

interface AllocationProps {
  subAccount?: SubAccount;
}

interface LiveHoldingItem {
  ticker: string;
  name: string;
  weightPercentage: number;
  weightDecimal: number;
  allocatedAmount: number;
  unrealizedPnl: number;
  unrealizedPnlPercentage: number;
  currentPrice: number;
  sharesOwned: number;
  sector: string;
  isPositive: boolean;
}

export function PortofolioAllocation({ subAccount }: AllocationProps) {
  const [activeAccount, setActiveAccount] = useState<SubAccount>(subAccount || DEFAULT_SUB_ACCOUNTS[0]);
  const [liveHoldings, setLiveHoldings] = useState<LiveHoldingItem[]>([]);
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

  useEffect(() => {
    let isMounted = true;
    const fetchHoldings = async () => {
      try {
        const baseUrl = getBackendApiUrl();
        const res = await fetch(`${baseUrl}/sub-accounts/${activeAccount.id}`, { cache: "no-store" });
        if (res.ok) {
          const data = await res.json();
          if (isMounted && data.holdings) {
            setLiveHoldings(data.holdings);
          }
        }
      } catch (err) {
        console.debug("Notice: Live holdings fetch error:", err);
      } finally {
        if (isMounted) setLoading(false);
      }
    };
    fetchHoldings();
    const interval = setInterval(fetchHoldings, 5000);
    return () => {
      isMounted = false;
      clearInterval(interval);
    };
  }, [activeAccount.id]);

  const profile = RISK_PROFILES[activeAccount.riskLevel];
  const color = profile.color;
  const totalVal = activeAccount.currentValue;

  return (
    <Card
      className="xl:col-span-2 md:col-span-1 border-2 shadow-md bg-card flex flex-col justify-between"
      style={{ borderColor: `${color}60`, boxShadow: `0 0 12px ${color}08` }}
    >
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-base font-bold">Asset Allocation Blueprint</CardTitle>
          <Badge className={profile.badgeClass}>
            Level {activeAccount.riskLevel}: {profile.strategyName}
          </Badge>
        </div>
        <CardDescription className="text-xs">
          Live holdings and cash liquidity for {activeAccount.name}
        </CardDescription>
      </CardHeader>
      <CardContent className="pt-0">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="text-xs">Ticker</TableHead>
              <TableHead className="text-xs">Asset Name</TableHead>
              <TableHead className="text-right text-xs">Weight</TableHead>
              <TableHead className="text-right text-xs">Shares</TableHead>
              <TableHead className="text-right text-xs">Price</TableHead>
              <TableHead className="text-right text-xs">Balance</TableHead>
              <TableHead className="text-right text-xs">Unrealized P&L</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {liveHoldings.length > 0 ? (
              liveHoldings.map((item) => (
                <TableRow key={item.ticker}>
                  <TableCell className="font-mono font-bold text-xs" style={{ color: item.ticker === 'USD' ? '#10b981' : color }}>
                    {item.ticker}
                  </TableCell>
                  <TableCell className="text-xs text-foreground font-medium">{item.name}</TableCell>
                  <TableCell className="text-right font-mono text-xs">{item.weightPercentage.toFixed(1)}%</TableCell>
                  <TableCell className="text-right font-mono text-xs text-muted-foreground">
                    {item.ticker === 'USD' ? '-' : `${Math.abs(item.sharesOwned).toLocaleString()}`}
                  </TableCell>
                  <TableCell className="text-right font-mono text-xs text-muted-foreground">
                    ${item.currentPrice.toFixed(2)}
                  </TableCell>
                  <TableCell className="text-right font-mono font-bold text-xs">
                    ${Math.abs(item.allocatedAmount).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  </TableCell>
                  <TableCell className="text-right font-mono font-bold text-xs">
                    {item.ticker === 'USD' ? (
                      <span className="text-muted-foreground text-[11px] font-normal">Cash Liquid</span>
                    ) : (
                      <span className={item.unrealizedPnl >= 0 ? "text-emerald-500" : "text-rose-500"}>
                        {item.unrealizedPnl >= 0 ? "+" : ""}${item.unrealizedPnl.toFixed(2)}
                      </span>
                    )}
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell className="font-mono font-bold text-xs" style={{ color: '#10b981' }}>USD</TableCell>
                <TableCell className="text-xs text-foreground font-medium">US Dollar Liquidity & Cash Reserves</TableCell>
                <TableCell className="text-right font-mono text-xs">100.0%</TableCell>
                <TableCell className="text-right font-mono text-xs text-muted-foreground">-</TableCell>
                <TableCell className="text-right font-mono text-xs text-muted-foreground">$1.00</TableCell>
                <TableCell className="text-right font-mono font-bold text-xs">
                  ${totalVal.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                </TableCell>
                <TableCell className="text-right font-mono text-xs text-muted-foreground">Cash Liquid</TableCell>
              </TableRow>
            )}
          </TableBody>
          <TableFooter>
            <TableRow>
              <TableCell className="font-bold text-xs">Total Portfolio NAV</TableCell>
              <TableCell colSpan={4}></TableCell>
              <TableCell className="text-right font-mono font-extrabold text-xs" style={{ color }}>
                ${totalVal.toLocaleString(undefined, { minimumFractionDigits: 2 })}
              </TableCell>
              <TableCell></TableCell>
            </TableRow>
          </TableFooter>
        </Table>
      </CardContent>
    </Card>
  );
}

export function PortfolioPieChart({ subAccount }: AllocationProps) {
  const [activeAccount, setActiveAccount] = useState<SubAccount>(subAccount || DEFAULT_SUB_ACCOUNTS[0]);
  const [liveHoldings, setLiveHoldings] = useState<LiveHoldingItem[]>([]);

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
    const fetchHoldings = async () => {
      try {
        const baseUrl = getBackendApiUrl();
        const res = await fetch(`${baseUrl}/sub-accounts/${activeAccount.id}`, { cache: "no-store" });
        if (res.ok) {
          const data = await res.json();
          if (isMounted && data.holdings) {
            setLiveHoldings(data.holdings);
          }
        }
      } catch (err) {
        console.debug("Notice: Live holdings pie fetch error:", err);
      }
    };
    fetchHoldings();
    const interval = setInterval(fetchHoldings, 5000);
    return () => {
      isMounted = false;
      clearInterval(interval);
    };
  }, [activeAccount.id]);

  const profile = RISK_PROFILES[activeAccount.riskLevel];
  const color = profile.color;

  const palette = ["#ef4444", "#f87171", "#6366f1", "#818cf8", "#3b82f6", "#10b981", "#f59e0b", "#ec4899", "#8b5cf6"];
  const chartData = liveHoldings.length > 0
    ? liveHoldings.map((h, i) => ({
        name: h.ticker,
        value: Math.max(1, Math.round(h.weightPercentage)),
        color: h.ticker === "USD" ? "#10b981" : palette[i % palette.length]
      }))
    : [{ name: "USD", value: 100, color: "#10b981" }];

  return (
    <Card
      className="flex flex-col border-2 shadow-md bg-card justify-between"
      style={{ borderColor: `${color}60`, boxShadow: `0 0 12px ${color}08` }}
    >
      <CardHeader className="pb-2">
        <CardTitle className="text-base font-bold">Holdings Dispersion</CardTitle>
        <CardDescription className="text-xs">Asset weighting split for {activeAccount.name}</CardDescription>
      </CardHeader>
      <CardContent className="flex-1 pb-2">
        <div className="mx-auto aspect-square max-h-[220px]">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Tooltip
                content={({ active, payload }) => {
                  if (active && payload && payload.length) {
                    return (
                      <div className="rounded-lg border bg-background p-2 shadow-md text-xs">
                        <strong className="text-foreground">{payload[0].name}</strong>: {payload[0].value}% Weight
                      </div>
                    );
                  }
                  return null;
                }}
              />
              <Pie
                data={chartData}
                dataKey="value"
                nameKey="name"
                innerRadius={50}
                outerRadius={75}
                strokeWidth={2}
                stroke="hsl(var(--background))"
              >
                {chartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
            </PieChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
      <CardFooter className="border-t pt-3 bg-muted/10 text-xs">
        <div className="flex items-center gap-2 font-medium text-foreground">
          <TrendingUp className="h-4 w-4" style={{ color }} />
          <span>Target Yield: <strong style={{ color }}>{profile.targetReturn}</strong></span>
        </div>
      </CardFooter>
    </Card>
  );
}

export function SectorBarChart({ subAccount }: AllocationProps) {
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

  const sectorDataMap: Record<RiskLevel, Array<{ sector: string; pct: number }>> = {
    1: [
      { sector: "Consumer Staples", pct: 42 },
      { sector: "Healthcare", pct: 28 },
      { sector: "Mega-Cap Tech", pct: 20 },
      { sector: "Defensive Value", pct: 10 }
    ],
    2: [
      { sector: "Technology Benchmark", pct: 35 },
      { sector: "Semiconductors & AI", pct: 32 },
      { sector: "Interactive Media", pct: 18 },
      { sector: "Semiconductor Equipment", pct: 15 }
    ],
    3: [
      { sector: "Bitcoin Alpha Holding", pct: 30 },
      { sector: "Autonomous & EV", pct: 24 },
      { sector: "Enterprise AI Software", pct: 22 },
      { sector: "Crypto Mining & Momentum", pct: 24 }
    ]
  };

  const sectors = sectorDataMap[activeAccount.riskLevel] || sectorDataMap[2];

  return (
    <Card
      className="border-2 shadow-md bg-card flex flex-col justify-between"
      style={{ borderColor: `${color}60`, boxShadow: `0 0 12px ${color}08` }}
    >
      <CardHeader className="pb-2">
        <CardTitle className="text-base font-bold">Sector Diversification</CardTitle>
        <CardDescription className="text-xs">Industry breakdown for {activeAccount.name}</CardDescription>
      </CardHeader>
      <CardContent className="pt-2">
        <div className="h-[180px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={sectors} layout="vertical" margin={{ left: 10, right: 20, top: 5, bottom: 5 }}>
              <CartesianGrid horizontal={false} strokeDasharray="3 3" opacity={0.2} />
              <XAxis type="number" hide domain={[0, 50]} />
              <YAxis dataKey="sector" type="category" tickLine={false} axisLine={false} fontSize={10} width={90} />
              <Tooltip
                content={({ active, payload }) => {
                  if (active && payload && payload.length) {
                    return (
                      <div className="rounded-lg border bg-background p-2 shadow-md text-xs font-mono">
                        <strong>{payload[0].payload.sector}</strong>: {payload[0].value}% of portfolio
                      </div>
                    );
                  }
                  return null;
                }}
              />
              <Bar dataKey="pct" fill={color} radius={4} fillOpacity={0.8} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
      <CardFooter className="border-t pt-3 bg-muted/10 text-xs text-muted-foreground">
        Optimized asset allocation for <strong>Level {activeAccount.riskLevel}</strong> risk boundaries
      </CardFooter>
    </Card>
  );
}

export function AssetAllocationPieChart({ subAccount }: AllocationProps) {
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

  const data = [
    { name: "Equities / Stocks", value: 85, color: color },
    { name: "Cash Reserve Buffer", value: 15, color: "#64748b" }
  ];

  return (
    <Card
      className="border-2 shadow-md bg-card flex flex-col justify-between"
      style={{ borderColor: `${color}60`, boxShadow: `0 0 12px ${color}08` }}
    >
      <CardHeader className="pb-2">
        <CardTitle className="text-base font-bold">Asset Class Split</CardTitle>
        <CardDescription className="text-xs">Equity exposure vs cash reserves</CardDescription>
      </CardHeader>
      <CardContent className="flex-1 pb-2">
        <div className="mx-auto aspect-square max-h-[180px]">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Tooltip
                content={({ active, payload }) => {
                  if (active && payload && payload.length) {
                    return (
                      <div className="rounded-lg border bg-background p-2 shadow-md text-xs">
                        <strong>{payload[0].name}</strong>: {payload[0].value}%
                      </div>
                    );
                  }
                  return null;
                }}
              />
              <Pie data={data} dataKey="value" nameKey="name" innerRadius={40} outerRadius={65} strokeWidth={2} stroke="hsl(var(--background))">
                <Cell fill={color} />
                <Cell fill="#64748b" />
              </Pie>
            </PieChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
      <CardFooter className="border-t pt-3 bg-muted/10 text-xs text-muted-foreground">
        85% Active Equity Deployment • 15% Tactical Cash
      </CardFooter>
    </Card>
  );
}

export function EquityPieChart({ subAccount }: AllocationProps) {
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

  const data = [
    { name: "Mega & Large-Cap", value: activeAccount.riskLevel === 1 ? 85 : activeAccount.riskLevel === 2 ? 65 : 20, color: color },
    { name: "Mid-Cap Growth", value: activeAccount.riskLevel === 1 ? 15 : activeAccount.riskLevel === 2 ? 30 : 35, color: "#818cf8" },
    { name: "High-Beta / Small-Caps", value: activeAccount.riskLevel === 1 ? 0 : activeAccount.riskLevel === 2 ? 5 : 45, color: "#ef4444" }
  ];

  return (
    <Card
      className="border-2 shadow-md bg-card flex flex-col justify-between"
      style={{ borderColor: `${color}60`, boxShadow: `0 0 12px ${color}08` }}
    >
      <CardHeader className="pb-2">
        <CardTitle className="text-base font-bold">Market Cap Breakdown</CardTitle>
        <CardDescription className="text-xs">Capitalization exposure tier</CardDescription>
      </CardHeader>
      <CardContent className="flex-1 pb-2">
        <div className="mx-auto aspect-square max-h-[180px]">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Tooltip
                content={({ active, payload }) => {
                  if (active && payload && payload.length) {
                    return (
                      <div className="rounded-lg border bg-background p-2 shadow-md text-xs">
                        <strong>{payload[0].name}</strong>: {payload[0].value}%
                      </div>
                    );
                  }
                  return null;
                }}
              />
              <Pie data={data} dataKey="value" nameKey="name" innerRadius={40} outerRadius={65} strokeWidth={2} stroke="hsl(var(--background))">
                {data.map((entry, index) => (
                  <Cell key={`cell-cap-${index}`} fill={entry.color} />
                ))}
              </Pie>
            </PieChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
      <CardFooter className="border-t pt-3 bg-muted/10 text-xs text-muted-foreground">
        Calibrated to <strong>Level {activeAccount.riskLevel}</strong> equity beta profile
      </CardFooter>
    </Card>
  );
}

export function ExpectedAnnualReturns({ subAccount }: AllocationProps) {
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

  const base = activeAccount.currentValue / 15;
  const data = [
    { month: "Jan", expected: Math.round(base * 0.4), actual: Math.round(base * 0.45) },
    { month: "Feb", expected: Math.round(base * 0.8), actual: Math.round(base * 0.95) },
    { month: "Mar", expected: Math.round(base * 1.2), actual: Math.round(base * 1.35) },
    { month: "Apr", expected: Math.round(base * 1.6), actual: Math.round(base * 1.55) },
    { month: "May", expected: Math.round(base * 2.0), actual: Math.round(base * 2.25) },
    { month: "Jun", expected: Math.round(base * 2.4), actual: Math.round(base * 2.80) },
  ];

  return (
    <Card
      className="border-2 shadow-md bg-card flex flex-col justify-between"
      style={{ borderColor: `${color}60`, boxShadow: `0 0 12px ${color}08` }}
    >
      <CardHeader className="pb-2">
        <CardTitle className="text-base font-bold">Estimated vs Realized Returns</CardTitle>
        <CardDescription className="text-xs">Cumulative trajectory for {activeAccount.name}</CardDescription>
      </CardHeader>
      <CardContent className="pt-2">
        <div className="h-[200px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data} margin={{ left: 10, right: 10, top: 10, bottom: 5 }}>
              <CartesianGrid vertical={false} strokeDasharray="3 3" opacity={0.2} />
              <XAxis dataKey="month" tickLine={false} axisLine={false} fontSize={11} />
              <YAxis tickLine={false} axisLine={false} fontSize={10} tickFormatter={(v) => `$${v}`} />
              <Tooltip
                content={({ active, payload }) => {
                  if (active && payload && payload.length) {
                    return (
                      <div className="rounded-lg border bg-background p-2 shadow-md text-xs font-mono">
                        <div style={{ color }}>Realized: ${payload[0]?.value?.toLocaleString()}</div>
                        <div className="text-muted-foreground">Expected: ${payload[1]?.value?.toLocaleString()}</div>
                      </div>
                    );
                  }
                  return null;
                }}
              />
              <Line dataKey="actual" type="natural" stroke={color} strokeWidth={2.5} dot={{ fill: color, r: 3 }} />
              <Line dataKey="expected" type="natural" stroke="hsl(var(--muted-foreground))" strokeWidth={1.5} strokeDasharray="3 3" dot={false} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
      <CardFooter className="border-t pt-3 bg-muted/10 text-xs">
        <div className="flex items-center gap-1.5 font-medium text-foreground">
          Strategy target: <strong style={{ color }}>{profile.targetReturn}</strong>
          <TrendingUp className="h-4 w-4" style={{ color }} />
        </div>
      </CardFooter>
    </Card>
  );
}
