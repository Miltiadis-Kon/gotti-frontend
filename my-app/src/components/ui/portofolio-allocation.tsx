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

interface AllocationProps {
  subAccount?: SubAccount;
}

export function PortofolioAllocation({ subAccount }: AllocationProps) {
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
  const totalVal = activeAccount.currentValue;

  const holdingsMap: Record<RiskLevel, Array<{ ticker: string; name: string; allocationNum: number; allocation: string }>> = {
    1: [
      { ticker: "KO", name: "The Coca-Cola Company", allocationNum: 0.22, allocation: "22%" },
      { ticker: "PG", name: "Procter & Gamble Co.", allocationNum: 0.20, allocation: "20%" },
      { ticker: "JNJ", name: "Johnson & Johnson", allocationNum: 0.18, allocation: "18%" },
      { ticker: "MSFT", name: "Microsoft Corporation", allocationNum: 0.20, allocation: "20%" },
      { ticker: "AAPL", name: "Apple Inc.", allocationNum: 0.20, allocation: "20%" }
    ],
    2: [
      { ticker: "SPY", name: "SPDR S&P 500 ETF Trust", allocationNum: 0.30, allocation: "30%" },
      { ticker: "GOOGL", name: "Alphabet Inc.", allocationNum: 0.20, allocation: "20%" },
      { ticker: "AMZN", name: "Amazon.com Inc.", allocationNum: 0.18, allocation: "18%" },
      { ticker: "UNH", name: "UnitedHealth Group", allocationNum: 0.16, allocation: "16%" },
      { ticker: "V", name: "Visa Inc.", allocationNum: 0.16, allocation: "16%" }
    ],
    3: [
      { ticker: "QQQ", name: "Invesco QQQ ETF", allocationNum: 0.28, allocation: "28%" },
      { ticker: "NVDA", name: "Nvidia Corporation", allocationNum: 0.22, allocation: "22%" },
      { ticker: "META", name: "Meta Platforms Inc.", allocationNum: 0.18, allocation: "18%" },
      { ticker: "AMD", name: "Advanced Micro Devices", allocationNum: 0.16, allocation: "16%" },
      { ticker: "ASML", name: "ASML Holding N.V.", allocationNum: 0.16, allocation: "16%" }
    ],
    4: [
      { ticker: "TSLA", name: "Tesla Inc.", allocationNum: 0.25, allocation: "25%" },
      { ticker: "PLTR", name: "Palantir Technologies", allocationNum: 0.22, allocation: "22%" },
      { ticker: "ARM", name: "Arm Holdings plc", allocationNum: 0.20, allocation: "20%" },
      { ticker: "COIN", name: "Coinbase Global Inc.", allocationNum: 0.18, allocation: "18%" },
      { ticker: "SMCI", name: "Super Micro Computer", allocationNum: 0.15, allocation: "15%" }
    ],
    5: [
      { ticker: "MSTR", name: "MicroStrategy Inc.", allocationNum: 0.30, allocation: "30%" },
      { ticker: "NVDA", name: "Nvidia Alpha Momentum", allocationNum: 0.25, allocation: "25%" },
      { ticker: "RIVN", name: "Rivian Automotive", allocationNum: 0.18, allocation: "18%" },
      { ticker: "MARA", name: "MARA Holdings Inc.", allocationNum: 0.15, allocation: "15%" },
      { ticker: "SOUN", name: "SoundHound AI Inc.", allocationNum: 0.12, allocation: "12%" }
    ]
  };

  const list = holdingsMap[activeAccount.riskLevel] || holdingsMap[3];

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
          Systematic basket allocation for {activeAccount.name}
        </CardDescription>
      </CardHeader>
      <CardContent className="pt-0">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="text-xs">Ticker</TableHead>
              <TableHead className="text-xs">Asset Name</TableHead>
              <TableHead className="text-right text-xs">Weight</TableHead>
              <TableHead className="text-right text-xs">Balance</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {list.map((item) => (
              <TableRow key={item.ticker}>
                <TableCell className="font-mono font-bold text-xs" style={{ color }}>{item.ticker}</TableCell>
                <TableCell className="text-xs text-foreground font-medium">{item.name}</TableCell>
                <TableCell className="text-right font-mono text-xs">{item.allocation}</TableCell>
                <TableCell className="text-right font-mono font-bold text-xs">
                  ${Math.round(totalVal * item.allocationNum).toLocaleString()}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
          <TableFooter>
            <TableRow>
              <TableCell className="font-bold text-xs">Total Portfolio NAV</TableCell>
              <TableCell></TableCell>
              <TableCell className="text-right font-mono font-bold text-xs">100%</TableCell>
              <TableCell className="text-right font-mono font-extrabold text-xs" style={{ color }}>
                ${totalVal.toLocaleString(undefined, { minimumFractionDigits: 2 })}
              </TableCell>
            </TableRow>
          </TableFooter>
        </Table>
      </CardContent>
    </Card>
  );
}

export function PortfolioPieChart({ subAccount }: AllocationProps) {
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

  const pieData: Record<RiskLevel, Array<{ name: string; value: number; color: string }>> = {
    1: [
      { name: "KO", value: 22, color: "#10b981" },
      { name: "PG", value: 20, color: "#34d399" },
      { name: "JNJ", value: 18, color: "#6ee7b7" },
      { name: "MSFT", value: 20, color: "#059669" },
      { name: "AAPL", value: 20, color: "#047857" }
    ],
    2: [
      { name: "SPY", value: 30, color: "#06b6d4" },
      { name: "GOOGL", value: 20, color: "#38bdf8" },
      { name: "AMZN", value: 18, color: "#0284c7" },
      { name: "UNH", value: 16, color: "#7dd3fc" },
      { name: "V", value: 16, color: "#0369a1" }
    ],
    3: [
      { name: "QQQ", value: 28, color: "#6366f1" },
      { name: "NVDA", value: 22, color: "#818cf8" },
      { name: "META", value: 18, color: "#4f46e5" },
      { name: "AMD", value: 16, color: "#a5b4fc" },
      { name: "ASML", value: 16, color: "#4338ca" }
    ],
    4: [
      { name: "TSLA", value: 25, color: "#f59e0b" },
      { name: "PLTR", value: 22, color: "#fbbf24" },
      { name: "ARM", value: 20, color: "#d97706" },
      { name: "COIN", value: 18, color: "#fde68a" },
      { name: "SMCI", value: 15, color: "#b45309" }
    ],
    5: [
      { name: "MSTR", value: 30, color: "#ef4444" },
      { name: "NVDA", value: 25, color: "#f87171" },
      { name: "RIVN", value: 18, color: "#dc2626" },
      { name: "MARA", value: 15, color: "#fca5a5" },
      { name: "SOUN", value: 12, color: "#b91c1c" }
    ]
  };

  const chartData = pieData[activeAccount.riskLevel] || pieData[3];

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
      { sector: "Utilities", pct: 10 }
    ],
    2: [
      { sector: "Broad Equity (S&P)", pct: 35 },
      { sector: "Technology Core", pct: 30 },
      { sector: "Healthcare", pct: 18 },
      { sector: "Financials", pct: 17 }
    ],
    3: [
      { sector: "Semiconductors & AI", pct: 44 },
      { sector: "Software & Cloud", pct: 32 },
      { sector: "Digital Media", pct: 16 },
      { sector: "Hardware", pct: 8 }
    ],
    4: [
      { sector: "Autonomous & EV", pct: 32 },
      { sector: "Enterprise AI", pct: 28 },
      { sector: "Crypto Infrastructure", pct: 22 },
      { sector: "Semiconductors", pct: 18 }
    ],
    5: [
      { sector: "Bitcoin Alpha Holding", pct: 40 },
      { sector: "High-Beta Tech Swings", pct: 30 },
      { sector: "Speculative AI / Robotics", pct: 20 },
      { sector: "Micro-Cap Breakouts", pct: 10 }
    ]
  };

  const sectors = sectorDataMap[activeAccount.riskLevel] || sectorDataMap[3];

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
    { name: "Mega & Large-Cap", value: activeAccount.riskLevel <= 2 ? 80 : activeAccount.riskLevel === 3 ? 60 : 35, color: color },
    { name: "Mid-Cap Growth", value: activeAccount.riskLevel <= 2 ? 20 : activeAccount.riskLevel === 3 ? 30 : 40, color: "#818cf8" },
    { name: "High-Beta / Speculative", value: activeAccount.riskLevel <= 2 ? 0 : activeAccount.riskLevel === 3 ? 10 : 25, color: "#f59e0b" }
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
