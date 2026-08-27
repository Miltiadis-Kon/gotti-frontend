"use client";

import React, { useState, useEffect } from "react";
import {
  ShieldCheck,
  TrendingUp,
  Scale,
  Zap,
  Flame,
  CreditCard,
  DollarSign,
  CheckCircle2,
  Layers,
  ArrowRight,
  Sparkles,
  ListFilter,
  File,
  Landmark,
  Wallet
} from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import {
  RISK_PROFILES,
  getSubAccounts,
  getActiveSubAccountId,
  fundSubAccount,
  getFundTransactions,
  FundTransaction
} from "@/lib/risk-assessment-data";
import { RiskLevel, SubAccount } from "@/types/risk-profile";

export function AddFundsContent() {
  const [subAccounts, setSubAccounts] = useState<SubAccount[]>([]);
  const [activeContextId, setActiveContextId] = useState<string>("");
  const [selectedSubAccountId, setSelectedSubAccountId] = useState<string>("");
  const [amount, setAmount] = useState<string>("1000");
  const [paymentMethod, setPaymentMethod] = useState<string>("Instant Card (Stripe)");
  const [transactions, setTransactions] = useState<FundTransaction[]>([]);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState<boolean>(false);

  useEffect(() => {
    const accs = getSubAccounts();
    setSubAccounts(accs);
    const activeId = getActiveSubAccountId();
    setActiveContextId(activeId);
    setSelectedSubAccountId(activeId || accs[0]?.id || "");
    setTransactions(getFundTransactions());
  }, []);

  const selectedAccount = subAccounts.find((a) => a.id === selectedSubAccountId) || subAccounts[0];
  const selectedProfile = selectedAccount ? RISK_PROFILES[selectedAccount.riskLevel] : RISK_PROFILES[2];

  const getProfileIcon = (level: RiskLevel, className = "h-4 w-4") => {
    switch (level) {
      case 1: return <ShieldCheck className={`${className} text-emerald-500`} />;
      case 2: return <TrendingUp className={`${className} text-indigo-500`} />;
      case 3: return <Flame className={`${className} text-rose-500`} />;
    }
  };

  const handleQuickAmount = (val: number) => {
    setAmount(val.toString());
  };

  const handleDeposit = (e: React.FormEvent) => {
    e.preventDefault();
    const numAmount = parseFloat(amount.replace(/[^0-9.]/g, ""));
    if (isNaN(numAmount) || numAmount <= 0) return;

    setIsProcessing(true);

    setTimeout(() => {
      try {
        const updated = fundSubAccount(selectedSubAccountId, numAmount, paymentMethod);
        const refreshedAccounts = getSubAccounts();
        setSubAccounts(refreshedAccounts);
        setTransactions(getFundTransactions());
        setSuccessMessage(
          `Successfully deposited $${numAmount.toLocaleString(undefined, { minimumFractionDigits: 2 })} into "${updated.name}" (Level ${updated.riskLevel}: ${updated.strategyName})! Funds are now active in the automated ETF model.`
        );
      } catch (err: any) {
        console.error(err);
      } finally {
        setIsProcessing(false);
      }
    }, 600);
  };

  const totalCapitalAll = subAccounts.reduce((sum, a) => sum + (a.allocatedCapital || 0), 0);

  return (
    <div className="flex min-h-screen w-full flex-col items-center">
      <div className="grid flex-1 items-start gap-4 p-2 sm:px-4 sm:py-0 md:gap-6 w-full max-w-6xl">
        {/* Page Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b pb-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">Deposit & Fund Sub-Account</h1>
            <p className="text-xs sm:text-sm text-muted-foreground mt-1">
              Select which segregated strategy ETF sub-account to fund. Capital is systematically allocated upon deposit.
            </p>
          </div>
          <Badge variant="outline" className="text-xs font-semibold px-3 py-1 bg-primary/5 text-primary border-primary/20 w-fit">
            <Wallet className="h-3.5 w-3.5 mr-1.5" /> Total Capital: ${totalCapitalAll.toLocaleString()}
          </Badge>
        </div>

        {/* Success Alert Banner */}
        {successMessage && (
          <div className="flex items-start gap-3 bg-emerald-500/10 border border-emerald-500/30 text-emerald-700 dark:text-emerald-300 p-4 rounded-xl text-xs font-medium animate-in fade-in slide-in-from-top-2">
            <CheckCircle2 className="h-5 w-5 text-emerald-500 shrink-0 mt-0.5" />
            <div className="space-y-1">
              <strong className="block text-sm font-bold text-foreground">Deposit Confirmed & Deployed!</strong>
              <span>{successMessage}</span>
            </div>
          </div>
        )}

        {/* Step 1: Sub-Account Selection Grid (Highlighted Choice) */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <Label className="text-sm font-bold text-foreground flex items-center gap-2">
              <span className="flex h-5 w-5 items-center justify-center rounded-full bg-primary text-primary-foreground text-xs font-bold">1</span>
              Select Target Sub-Account to Fund
            </Label>
            <span className="text-xs text-muted-foreground font-medium">
              Click any sub-account card to select
            </span>
          </div>

          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {[...subAccounts]
              .sort((a, b) => a.riskLevel - b.riskLevel)
              .map((account) => {
                const profile = RISK_PROFILES[account.riskLevel];
              const isSelectedForFunding = account.id === selectedSubAccountId;
              const isCurrentDashboardContext = account.id === activeContextId;

              return (
                <div
                  key={account.id}
                  onClick={() => {
                    setSelectedSubAccountId(account.id);
                    setSuccessMessage(null);
                  }}
                  className={`relative flex flex-col justify-between p-4 rounded-xl border-2 cursor-pointer transition-all ${
                    isSelectedForFunding
                      ? `${profile.borderClass} bg-primary/10 ring-2 ring-primary shadow-md`
                      : "border-border/60 hover:border-primary/50 bg-card hover:bg-muted/40"
                  }`}
                >
                  <div className="space-y-2">
                    <div className="flex items-center justify-between gap-1.5">
                      <Badge className={profile.badgeClass} variant="outline">
                        Level {account.riskLevel}
                      </Badge>
                      {isSelectedForFunding && (
                        <Badge className="bg-primary text-primary-foreground text-[10px] font-bold">
                          ✓ Target for Deposit
                        </Badge>
                      )}
                      {!isSelectedForFunding && isCurrentDashboardContext && (
                        <Badge variant="secondary" className="text-[10px]">
                          Dashboard Context
                        </Badge>
                      )}
                    </div>

                    <div>
                      <h4 className="text-sm font-bold text-foreground flex items-center gap-1.5">
                        {getProfileIcon(account.riskLevel)}
                        <span className="truncate">{profile.strategyName}</span>
                      </h4>
                      <p className="text-xs text-muted-foreground font-medium truncate mt-0.5">
                        {profile.tagline}
                      </p>
                    </div>

                    <div className="rounded-lg bg-muted/50 p-2.5 border text-xs font-mono space-y-1">
                      <div className="flex justify-between items-center">
                        <span className="text-[11px] font-sans text-muted-foreground">Current NAV:</span>
                        <strong className="text-foreground font-bold">${account.currentValue.toLocaleString(undefined, { minimumFractionDigits: 2 })}</strong>
                      </div>
                      <div className="flex justify-between items-center border-t pt-1 text-[11px]">
                        <span className="font-sans text-muted-foreground">Target Return:</span>
                        <span className="text-foreground font-semibold">{profile.targetReturn}</span>
                      </div>
                    </div>
                  </div>

                  <div className="mt-3 pt-2 border-t flex items-center justify-between text-[11px]">
                    <span className="text-muted-foreground">Turnover: {profile.turnoverStrategy.split(",")[0]}</span>
                    <div className={`h-4 w-4 rounded-full border flex items-center justify-center ${
                      isSelectedForFunding ? "border-primary bg-primary text-primary-foreground" : "border-muted-foreground"
                    }`}>
                      {isSelectedForFunding && <div className="h-1.5 w-1.5 rounded-full bg-background" />}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Step 2: Deposit Form & Monthly Summary */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {/* Funding Form Card */}
          <Card className="lg:col-span-2 border-2 shadow-md bg-card">
            <CardHeader className="pb-3 border-b">
              <div className="flex items-center justify-between">
                <CardTitle className="text-base font-bold flex items-center gap-2">
                  <span className="flex h-5 w-5 items-center justify-center rounded-full bg-primary text-primary-foreground text-xs font-bold">2</span>
                  Add Funds to &quot;{selectedProfile.strategyName}&quot;
                </CardTitle>
                <Badge className={selectedProfile.badgeClass}>
                  Level {selectedAccount?.riskLevel} Strategy
                </Badge>
              </div>
              <CardDescription className="text-xs">
                Payments are securely processed through Stripe. Funds are instantly deployed to the underlying ETF model.
              </CardDescription>
            </CardHeader>

            <form onSubmit={handleDeposit}>
              <CardContent className="space-y-4 pt-4 text-xs">
                {/* Quick Presets */}
                <div className="space-y-1.5">
                  <Label className="text-xs font-semibold text-foreground">Select Amount ($ USD)</Label>
                  <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
                    {[250, 500, 1000, 2500, 5000, 10000].map((preset) => (
                      <Button
                        key={preset}
                        type="button"
                        variant={amount === preset.toString() ? "default" : "outline"}
                        size="sm"
                        onClick={() => handleQuickAmount(preset)}
                        className="text-xs font-mono font-semibold h-8"
                      >
                        ${preset.toLocaleString()}
                      </Button>
                    ))}
                  </div>
                </div>

                {/* Custom Amount Input */}
                <div className="space-y-1.5">
                  <Label htmlFor="deposit-amount" className="text-xs font-semibold">Custom Deposit Amount</Label>
                  <div className="relative">
                    <DollarSign className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="deposit-amount"
                      type="number"
                      min="1"
                      step="any"
                      placeholder="1000"
                      value={amount}
                      onChange={(e) => setAmount(e.target.value)}
                      className="pl-9 font-mono font-bold text-sm"
                      required
                    />
                  </div>
                </div>

                {/* Payment Method Selector */}
                <div className="space-y-1.5">
                  <Label className="text-xs font-semibold">Payment Method</Label>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {[
                      { id: "Instant Card (Stripe)", name: "Credit / Debit Card (Stripe)", icon: CreditCard, detail: "Instant Execution" },
                      { id: "Bank Wire Transfer", name: "Direct Bank Transfer", icon: Landmark, detail: "Zero Fees" }
                    ].map((m) => (
                      <div
                        key={m.id}
                        onClick={() => setPaymentMethod(m.id)}
                        className={`flex items-center justify-between p-2.5 rounded-lg border cursor-pointer transition-all ${
                          paymentMethod === m.id
                            ? "border-primary bg-primary/10 ring-1 ring-primary font-medium"
                            : "border-border/60 hover:bg-muted/50"
                        }`}
                      >
                        <div className="flex items-center gap-2">
                          <m.icon className="h-4 w-4 text-primary" />
                          <div>
                            <span className="text-xs block text-foreground">{m.name}</span>
                            <span className="text-[10px] text-muted-foreground">{m.detail}</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Allocation Notice */}
                <div className="rounded-lg bg-muted/40 p-3 border space-y-1 text-[11px] text-muted-foreground">
                  <strong className="text-foreground font-semibold flex items-center gap-1">
                    <Sparkles className="h-3.5 w-3.5 text-primary" /> Systematic Allocation Blueprint:
                  </strong>
                  <p>
                    Depositing <strong>${Number(amount || 0).toLocaleString()}</strong> into <strong>{selectedProfile.strategyName}</strong> will instantly trigger algorithmic order routing across its Level {selectedAccount?.riskLevel} basket ({selectedProfile.sampleTickers.slice(0, 4).join(", ")}...).
                  </p>
                </div>
              </CardContent>

              <CardFooter className="flex items-center justify-between border-t pt-4 bg-muted/10">
                <span className="text-xs text-muted-foreground">
                  Target Account: <strong className="text-foreground">{selectedProfile.strategyName}</strong>
                </span>
                <Button
                  type="submit"
                  disabled={isProcessing || !amount || Number(amount) <= 0}
                  className="gap-2 font-semibold text-xs px-5"
                >
                  {isProcessing ? "Processing Stripe Transfer..." : `Deposit $${Number(amount || 0).toLocaleString()} Now`}
                  <ArrowRight className="h-3.5 w-3.5" />
                </Button>
              </CardFooter>
            </form>
          </Card>

          {/* Quick Overview Sidebar Card */}
          <Card className="border-border/60 shadow-sm bg-card flex flex-col justify-between">
            <CardHeader className="pb-2">
              <CardDescription className="text-xs">Selected Sub-Account Summary</CardDescription>
              <CardTitle className="text-xl font-bold flex items-center gap-2">
                {getProfileIcon(selectedAccount?.riskLevel || 3)}
                <span className="truncate">{selectedProfile.strategyName}</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-xs pt-0">
              <div className="rounded-lg bg-muted/30 p-3 border space-y-2 font-mono">
                <div className="flex justify-between items-center">
                  <span className="font-sans text-muted-foreground text-[11px]">Current Capital:</span>
                  <strong className="text-foreground">${selectedAccount?.allocatedCapital.toLocaleString()}</strong>
                </div>
                <div className="flex justify-between items-center border-t pt-1.5">
                  <span className="font-sans text-muted-foreground text-[11px]">New Projected Capital:</span>
                  <strong className="text-primary font-bold">
                    ${((selectedAccount?.allocatedCapital || 0) + Number(amount || 0)).toLocaleString()}
                  </strong>
                </div>
                <div className="flex justify-between items-center border-t pt-1.5">
                  <span className="font-sans text-muted-foreground text-[11px]">Strategy Target:</span>
                  <span className="font-sans text-foreground font-semibold">{selectedProfile.targetReturn}</span>
                </div>
              </div>

              <div className="space-y-1">
                <span className="text-muted-foreground text-[11px] font-medium block">Underlying Asset Universe:</span>
                <p className="text-foreground text-[11px] leading-relaxed">
                  {selectedProfile.assetUniverse}
                </p>
              </div>
            </CardContent>
            <CardFooter className="border-t pt-3 text-[11px] text-muted-foreground">
              🛡️ Encrypted 256-bit SSL Stripe Gateway
            </CardFooter>
          </Card>
        </div>

        {/* Step 3: Transaction History */}
        <Tabs defaultValue="all" className="space-y-4">
          <div className="flex items-center justify-between">
            <TabsList>
              <TabsTrigger value="all" className="text-xs">All Transactions</TabsTrigger>
              <TabsTrigger value="recent" className="text-xs">Recent Deposits</TabsTrigger>
            </TabsList>
            <div className="flex items-center gap-2 text-xs text-muted-foreground font-medium">
              <ListFilter className="h-3.5 w-3.5" /> Total Deposits: {transactions.length}
            </div>
          </div>

          <TabsContent value="all">
            <Card className="border-border/60">
              <CardHeader className="px-6 py-4">
                <CardTitle className="text-base font-bold">Funding & Deposit History</CardTitle>
                <CardDescription className="text-xs">
                  Real-time log of deposits and capital deployments across your segregated ETF sub-accounts.
                </CardDescription>
              </CardHeader>
              <CardContent className="px-6 pb-6 pt-0">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="text-xs">Method</TableHead>
                      <TableHead className="text-xs">Target Sub-Account</TableHead>
                      <TableHead className="text-xs hidden sm:table-cell">Strategy Profile</TableHead>
                      <TableHead className="text-xs hidden sm:table-cell">Status</TableHead>
                      <TableHead className="text-xs hidden md:table-cell">Date</TableHead>
                      <TableHead className="text-right text-xs">Amount</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {transactions.map((tx) => (
                      <TableRow key={tx.id}>
                        <TableCell className="font-medium text-xs">
                          <div className="flex items-center gap-2">
                            <CreditCard className="h-3.5 w-3.5 text-muted-foreground" />
                            <span>{tx.method}</span>
                          </div>
                        </TableCell>
                        <TableCell className="text-xs font-semibold text-foreground">
                          {tx.subAccountName}
                        </TableCell>
                        <TableCell className="text-xs text-muted-foreground hidden sm:table-cell">
                          {tx.strategyName}
                        </TableCell>
                        <TableCell className="hidden sm:table-cell">
                          <Badge variant="outline" className="bg-emerald-500/10 text-emerald-600 border-emerald-500/20 text-[10px]">
                            {tx.status}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-xs text-muted-foreground hidden md:table-cell font-mono">
                          {tx.date}
                        </TableCell>
                        <TableCell className="text-right font-mono font-bold text-xs text-emerald-600 dark:text-emerald-400">
                          + ${tx.amount.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
