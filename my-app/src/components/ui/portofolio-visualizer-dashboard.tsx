"use client";

import React, { useState, useEffect } from "react";
import { Info, TrendingDown, TrendingUp, WalletMinimal } from "lucide-react";
import {
  Label,
  Pie,
  PieChart,
  Area,
  AreaChart,
  CartesianGrid,
  XAxis,
  YAxis,
  ResponsiveContainer,
  Tooltip
} from "recharts";

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
import { RiskLevel, SubAccount } from "@/types/risk-profile";
import { getBackendApiUrl } from "@/lib/api-config";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

interface VisualizerProps {
  subAccount?: SubAccount;
}

export function PorotfolioPieChart({ subAccount }: VisualizerProps) {
  const [internalAccount, setInternalAccount] = useState<SubAccount>(subAccount || DEFAULT_SUB_ACCOUNTS[0]);
  const [liveHoldings, setLiveHoldings] = useState<Array<{ name: string; value: number; fill: string }>>([]);

  useEffect(() => {
    if (subAccount) {
      setInternalAccount(subAccount);
      return;
    }
    const loadCurrent = () => {
      const accs = getSubAccounts();
      const activeId = getActiveSubAccountId();
      const current = accs.find((a) => a.id === activeId) || accs[0] || DEFAULT_SUB_ACCOUNTS[0];
      setInternalAccount(current);
    };
    loadCurrent();

    const handleUpdate = (e: any) => {
      const accs: SubAccount[] = e.detail || getSubAccounts();
      const activeId = getActiveSubAccountId();
      const current = accs.find((a) => a.id === activeId) || accs[0] || DEFAULT_SUB_ACCOUNTS[0];
      setInternalAccount(current);
    };
    window.addEventListener("gotti_sub_accounts_updated", handleUpdate);
    return () => window.removeEventListener("gotti_sub_accounts_updated", handleUpdate);
  }, [subAccount]);

  const activeAccount = subAccount || internalAccount;
  const profile = RISK_PROFILES[activeAccount.riskLevel] || RISK_PROFILES[2];
  const color = profile.color;

  useEffect(() => {
    let isMounted = true;
    const fetchHoldings = async () => {
      try {
        const baseUrl = getBackendApiUrl();
        const res = await fetch(`${baseUrl}/sub-accounts/${activeAccount.id}`, { cache: "no-store" });
        if (res.ok) {
          const data = await res.json();
          if (isMounted && Array.isArray(data.holdings) && data.holdings.length > 0) {
            const palette = ["#ef4444", "#f87171", "#6366f1", "#818cf8", "#3b82f6", "#10b981", "#f59e0b", "#8b5cf6"];
            setLiveHoldings(data.holdings.map((h: any, i: number) => ({
              name: `${h.ticker} (${h.name.replace(" Live Position", "")})`,
              value: Math.max(1, Math.round(h.weightPercentage)),
              fill: h.ticker === "USD" ? "#10b981" : palette[i % palette.length]
            })));
          }
        }
      } catch (err) {
        console.debug("Notice: Visualizer holdings fetch error:", err);
      }
    };
    fetchHoldings();
    const interval = setInterval(fetchHoldings, 5000);
    return () => {
      isMounted = false;
      clearInterval(interval);
    };
  }, [activeAccount.id]);

  const chartData = liveHoldings.length > 0
    ? liveHoldings
    : [{ name: "USD Cash Reserve", value: 100, fill: "#10b981" }];

  return (
    <Card
      className="flex flex-col border-2 shadow-md bg-card justify-between transition-all"
      style={{ borderColor: `${color}60`, boxShadow: `0 0 16px ${color}10` }}
    >
      <CardHeader className="items-center pb-0 space-y-1">
        <div className="flex items-center gap-1.5">
          <Badge className={profile.badgeClass}>
            Level {activeAccount.riskLevel} Tier
          </Badge>
        </div>
        <CardTitle className="text-base font-bold">Portfolio Stock Coverage</CardTitle>
        <CardDescription className="text-xs">{profile.strategyName}</CardDescription>
      </CardHeader>
      <CardContent className="flex-1 pb-0">
        <div className="mx-auto aspect-square max-h-[230px]">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Tooltip
                content={({ active, payload }) => {
                  if (active && payload && payload.length) {
                    return (
                      <div className="rounded-lg border bg-background p-2 shadow-md text-xs">
                        <strong className="text-foreground">{payload[0].name}</strong>: {payload[0].value}% Allocation
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
                innerRadius={55}
                outerRadius={80}
                strokeWidth={3}
                stroke="hsl(var(--background))"
              >
                <Label
                  content={({ viewBox }) => {
                    if (viewBox && "cx" in viewBox && "cy" in viewBox) {
                      return (
                        <text
                          x={viewBox.cx}
                          y={viewBox.cy}
                          textAnchor="middle"
                          dominantBaseline="middle"
                        >
                          <tspan
                            x={viewBox.cx}
                            y={viewBox.cy}
                            className="text-xl font-bold font-mono"
                            style={{ fill: color }}
                          >
                            {profile.targetReturn.split(" ")[0]}
                          </tspan>
                          <tspan
                            x={viewBox.cx}
                            y={(viewBox.cy || 0) + 18}
                            className="text-[10px] fill-muted-foreground font-medium"
                          >
                            Target Yield
                          </tspan>
                        </text>
                      );
                    }
                  }}
                />
              </Pie>
            </PieChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
      <CardFooter className="flex-col gap-1.5 text-xs border-t pt-3 bg-muted/10">
        <div className="flex items-center gap-2 font-medium leading-none text-foreground">
          <WalletMinimal size={15} style={{ color }} />
          <span>Underlying basket of <strong style={{ color }}>{profile.sampleTickers.length} core assets</strong></span>
        </div>
        <div className="leading-none text-muted-foreground text-[11px]">
          Turnover: <strong>{profile.turnoverStrategy.split(",")[0]}</strong>
        </div>
      </CardFooter>
    </Card>
  );
}

export function PortofolioReturnChart({ subAccount }: VisualizerProps) {
  const [internalAccount, setInternalAccount] = useState<SubAccount>(subAccount || DEFAULT_SUB_ACCOUNTS[0]);

  useEffect(() => {
    if (subAccount) {
      setInternalAccount(subAccount);
      return;
    }
    const accs = getSubAccounts();
    const activeId = getActiveSubAccountId();
    const current = accs.find((a) => a.id === activeId) || accs[0] || DEFAULT_SUB_ACCOUNTS[0];
    setInternalAccount(current);
  }, [subAccount]);

  const activeAccount = subAccount || internalAccount;
  const profile = RISK_PROFILES[activeAccount.riskLevel] || RISK_PROFILES[3];
  const color = profile.color;

  const baseGrowth = (activeAccount.currentValue || 50000) / 20;
  const snp_data = [
    { month: "Jan", portfolio: Math.round(baseGrowth * 0), snp500: 0 },
    { month: "Feb", portfolio: Math.round(baseGrowth * 0.45 * (activeAccount.riskLevel * 0.4)), snp500: Math.round(baseGrowth * 0.35) },
    { month: "Mar", portfolio: Math.round(baseGrowth * 1.15 * (activeAccount.riskLevel * 0.4)), snp500: Math.round(baseGrowth * 0.85) },
    { month: "Apr", portfolio: Math.round(baseGrowth * -0.30 * (activeAccount.riskLevel * 0.4)), snp500: Math.round(baseGrowth * -0.55) },
    { month: "May", portfolio: Math.round(baseGrowth * 1.45 * (activeAccount.riskLevel * 0.4)), snp500: Math.round(baseGrowth * 0.95) },
    { month: "Jun", portfolio: Math.round(baseGrowth * 2.20 * (activeAccount.riskLevel * 0.4)), snp500: Math.round(baseGrowth * 1.50) },
  ];

  const diff = snp_data[snp_data.length - 1].portfolio - snp_data[snp_data.length - 1].snp500;
  const isOutperforming = diff >= 0;

  return (
    <Card
      className="border-2 shadow-md bg-card flex flex-col justify-between transition-all"
      style={{ borderColor: `${color}60`, boxShadow: `0 0 16px ${color}10` }}
    >
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between gap-2">
          <CardTitle className="text-base font-bold">Portfolio vs S&P 500 Benchmark</CardTitle>
          <Badge className={profile.badgeClass}>
            Level {activeAccount.riskLevel}
          </Badge>
        </div>
        <CardDescription className="text-xs">
          6-Month cumulative performance trajectory for {profile.strategyName}
        </CardDescription>
      </CardHeader>
      <CardContent className="pt-2">
        <div className="h-[200px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={snp_data} margin={{ top: 10, left: 0, right: 0, bottom: 0 }}>
              <defs>
                <linearGradient id={`fillPortfolio-${activeAccount.riskLevel}`} x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor={color} stopOpacity={0.4} />
                  <stop offset="95%" stopColor={color} stopOpacity={0.0} />
                </linearGradient>
                <linearGradient id="fillSnp" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="hsl(var(--muted-foreground))" stopOpacity={0.2} />
                  <stop offset="95%" stopColor="hsl(var(--muted-foreground))" stopOpacity={0.0} />
                </linearGradient>
              </defs>
              <CartesianGrid vertical={false} strokeDasharray="3 3" opacity={0.2} />
              <XAxis dataKey="month" tickLine={false} axisLine={false} fontSize={11} />
              <YAxis tickLine={false} axisLine={false} fontSize={10} tickFormatter={(v) => `$${v}`} />
              <Tooltip
                content={({ active, payload }) => {
                  if (active && payload && payload.length) {
                    return (
                      <div className="rounded-lg border bg-background p-2 shadow-md text-xs font-mono">
                        <div style={{ color }}>{profile.strategyName}: ${payload[0]?.value?.toLocaleString()}</div>
                        <div className="text-muted-foreground">S&P 500: ${payload[1]?.value?.toLocaleString()}</div>
                      </div>
                    );
                  }
                  return null;
                }}
              />
              <Area
                dataKey="portfolio"
                type="natural"
                fill={`url(#fillPortfolio-${activeAccount.riskLevel})`}
                stroke={color}
                strokeWidth={2.5}
              />
              <Area
                dataKey="snp500"
                type="natural"
                fill="url(#fillSnp)"
                stroke="hsl(var(--muted-foreground))"
                strokeWidth={1.5}
                strokeDasharray="4 4"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
      <CardFooter className="border-t pt-3 bg-muted/10 text-xs">
        <div className="flex items-center gap-1.5 font-medium text-foreground">
          {profile.strategyName} is{" "}
          <strong style={{ color }}>{isOutperforming ? "outperforming" : "tracking"}</strong> S&P 500 benchmark
          {isOutperforming ? <TrendingUp size={15} style={{ color }} /> : <TrendingDown size={15} className="text-muted-foreground" />}
        </div>
      </CardFooter>
    </Card>
  );
}

export function PortofolioDifferenceTable({ subAccount }: VisualizerProps) {
  const [internalAccount, setInternalAccount] = useState<SubAccount>(subAccount || DEFAULT_SUB_ACCOUNTS[0]);

  useEffect(() => {
    if (subAccount) {
      setInternalAccount(subAccount);
      return;
    }
    const accs = getSubAccounts();
    const activeId = getActiveSubAccountId();
    const current = accs.find((a) => a.id === activeId) || accs[0] || DEFAULT_SUB_ACCOUNTS[0];
    setInternalAccount(current);
  }, [subAccount]);

  const activeAccount = subAccount || internalAccount;
  const profile = RISK_PROFILES[activeAccount.riskLevel] || RISK_PROFILES[2];
  const color = profile.color;

  const metricMap: Record<RiskLevel, Array<{ metric: string; gotti_metric: string; snp_metric: string }>> = {
    1: [
      { metric: "Target 1-Year Yield", gotti_metric: "5% – 9%", snp_metric: "9.80%" },
      { metric: "Sharpe Ratio", gotti_metric: "1.85", snp_metric: "1.10" },
      { metric: "Max Drawdown", gotti_metric: "< -15% (3.2%)", snp_metric: "8.50%" },
      { metric: "Volatility (Beta)", gotti_metric: "< 22% (β < 0.75)", snp_metric: "14.20% (β 1.00)" }
    ],
    2: [
      { metric: "Target 1-Year Yield", gotti_metric: "10% – 18%", snp_metric: "9.80%" },
      { metric: "Sharpe Ratio", gotti_metric: "1.55", snp_metric: "1.10" },
      { metric: "Max Drawdown", gotti_metric: "-15% to -30% (8.1%)", snp_metric: "8.50%" },
      { metric: "Volatility (Beta)", gotti_metric: "22%–48% (β 0.85–1.25)", snp_metric: "14.20% (β 1.00)" }
    ],
    3: [
      { metric: "Target 1-Year Yield", gotti_metric: "20%+", snp_metric: "9.80%" },
      { metric: "Sharpe Ratio", gotti_metric: "1.25", snp_metric: "1.10" },
      { metric: "Max Drawdown", gotti_metric: "-30% to -55%+ (22.0%)", snp_metric: "8.50%" },
      { metric: "Volatility (Beta)", gotti_metric: "> 48% (β > 1.35)", snp_metric: "14.20% (β 1.00)" }
    ]
  };

  const metrics = metricMap[activeAccount.riskLevel] || metricMap[2];

  return (
    <Card
      className="border-2 shadow-md bg-card flex flex-col justify-between transition-all"
      style={{ borderColor: `${color}60`, boxShadow: `0 0 16px ${color}10` }}
    >
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between gap-2">
          <CardTitle className="text-base font-bold">Strategy Risk Metrics</CardTitle>
          <Badge className={profile.badgeClass}>
            Level {activeAccount.riskLevel}
          </Badge>
        </div>
        <CardDescription className="text-xs">
          Statistical profile compared with market benchmark
        </CardDescription>
      </CardHeader>
      <CardContent className="pt-0">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="text-xs">Metric</TableHead>
              <TableHead className="text-right text-xs font-bold" style={{ color }}>{profile.strategyName}</TableHead>
              <TableHead className="text-right text-xs text-muted-foreground">S&P 500</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {metrics.map((m) => (
              <TableRow key={m.metric}>
                <TableCell className="text-xs font-medium">{m.metric}</TableCell>
                <TableCell className="text-right text-xs font-mono font-bold" style={{ color }}>
                  {m.gotti_metric}
                </TableCell>
                <TableCell className="text-right text-xs font-mono text-muted-foreground">
                  {m.snp_metric}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
      <CardFooter className="border-t pt-3 bg-muted/10 text-[11px] text-muted-foreground">
        Level {activeAccount.riskLevel}: <strong className="text-foreground ml-1">{profile.strategyName}</strong>
      </CardFooter>
    </Card>
  );
}

export function PortofolioVisualizerDashboard({ subAccount }: VisualizerProps) {
  return (
    <div className="grid gap-4 md:gap-6 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 bg-transparent">
      <PortofolioReturnChart subAccount={subAccount} />
      <PorotfolioPieChart subAccount={subAccount} />
      <PortofolioDifferenceTable subAccount={subAccount} />
    </div>
  );
}
