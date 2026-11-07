"use client";

import React, { useState, useEffect, useMemo } from "react";
import {
  ShieldCheck,
  TrendingUp,
  Scale,
  Zap,
  Flame,
  CreditCard,
  Banknote,
  DollarSign,
  CheckCircle2,
  Layers,
  ArrowRight,
  Sparkles,
  ListFilter,
  File,
  Landmark,
  Wallet,
  ArrowDownLeft,
  ArrowUpRight,
  ArrowLeftRight,
  Building,
  Clock,
  AlertTriangle,
  AlertCircle,
  RefreshCw,
  Check,
  Lock,
  Send
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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  RISK_PROFILES,
  getSubAccounts,
  getActiveSubAccountId,
  fundSubAccountApi,
  withdrawFromSubAccountApi,
  transferCashBetweenSubAccountsApi,
  syncTransactionsWithBackend,
  syncSubAccountsWithBackend,
  getAllTransactions,
} from "@/lib/risk-assessment-data";
import { RiskLevel, SubAccount } from "@/types/risk-profile";
import { TransactionRecord } from "@/types/user-data";

interface AddFundsContentProps {
  initialTab?: "deposit" | "withdraw" | "transfer";
  onTabChange?: (tab: "deposit" | "withdraw" | "transfer") => void;
}

export function AddFundsContent({ initialTab = "deposit", onTabChange }: AddFundsContentProps) {
  const [activeTab, setActiveTab] = useState<"deposit" | "withdraw" | "transfer">(initialTab);
  const [subAccounts, setSubAccounts] = useState<SubAccount[]>([]);
  const [activeContextId, setActiveContextId] = useState<string>("");
  const [selectedSubAccountId, setSelectedSubAccountId] = useState<string>("");

  // Deposit Form State
  const [depositAmount, setDepositAmount] = useState<string>("1000");
  const [depositMethod, setDepositMethod] = useState<string>("Instant Card (Stripe)");

  // Withdraw Form State
  const [withdrawAmount, setWithdrawAmount] = useState<string>("500");
  const [withdrawDestination, setWithdrawDestination] = useState<string>("Chase Bank Checking (•••• 4821)");

  // Transfer Form State
  const [transferAmount, setTransferAmount] = useState<string>("250");
  const [transferTargetId, setTransferTargetId] = useState<string>("");

  // Ledger & Status States
  const [transactions, setTransactions] = useState<TransactionRecord[]>([]);
  const [txFilter, setTxFilter] = useState<"all" | "Deposit" | "Withdrawal">("all");
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [isRefreshingTx, setIsRefreshingTx] = useState<boolean>(false);
  const [successNotice, setSuccessNotice] = useState<{
    title: string;
    message: string;
    type: "deposit" | "withdraw" | "transfer";
  } | null>(null);
  const [errorNotice, setErrorNotice] = useState<string | null>(null);

  // Sync state on load
  const reloadData = () => {
    const accs = getSubAccounts();
    setSubAccounts(accs);
    const activeId = getActiveSubAccountId();
    setActiveContextId(activeId);
    if (!selectedSubAccountId && accs.length > 0) {
      setSelectedSubAccountId(activeId || accs[0].id);
    }
    const currentTx = getAllTransactions();
    setTransactions(currentTx);
  };

  useEffect(() => {
    reloadData();

    // Listen for cross-component navigation events
    const handleNavigate = (e: any) => {
      if (e.detail?.tab) {
        setActiveTab(e.detail.tab);
        if (onTabChange) onTabChange(e.detail.tab);
      }
      if (e.detail?.subAccountId) {
        setSelectedSubAccountId(e.detail.subAccountId);
      }
      setSuccessNotice(null);
      setErrorNotice(null);
    };

    const handleSubAccountsUpdate = () => reloadData();
    const handleTxUpdate = () => {
      setTransactions(getAllTransactions());
    };

    window.addEventListener("gotti_navigate", handleNavigate);
    window.addEventListener("gotti_sub_accounts_updated", handleSubAccountsUpdate);
    window.addEventListener("gotti_transactions_updated", handleTxUpdate);

    // Initial background sync with backend
    syncSubAccountsWithBackend();
    syncTransactionsWithBackend();

    return () => {
      window.removeEventListener("gotti_navigate", handleNavigate);
      window.removeEventListener("gotti_sub_accounts_updated", handleSubAccountsUpdate);
      window.removeEventListener("gotti_transactions_updated", handleTxUpdate);
    };
  }, []);

  // Update selected sub-account if subAccounts loads
  useEffect(() => {
    if (subAccounts.length > 0 && !selectedSubAccountId) {
      setSelectedSubAccountId(activeContextId || subAccounts[0].id);
    }
    // Set default transfer target if empty
    if (subAccounts.length > 1 && !transferTargetId) {
      const other = subAccounts.find((a) => a.id !== selectedSubAccountId);
      if (other) setTransferTargetId(other.id);
    }
  }, [subAccounts, selectedSubAccountId, activeContextId]);

  const selectedAccount = subAccounts.find((a) => a.id === selectedSubAccountId) || subAccounts[0];
  const selectedProfile = selectedAccount ? RISK_PROFILES[selectedAccount.riskLevel] : RISK_PROFILES[2];

  // Calculations
  const availableCash = selectedAccount?.cashBalance ?? (selectedAccount?.currentValue || 0);
  const totalCapitalAll = subAccounts.reduce((sum, a) => sum + (a.allocatedCapital || 0), 0);
  const totalNavAll = subAccounts.reduce((sum, a) => sum + (a.currentValue || 0), 0);

  const getProfileIcon = (level: RiskLevel, className = "h-4 w-4") => {
    switch (level) {
      case 1: return <ShieldCheck className={`${className} text-emerald-500`} />;
      case 2: return <TrendingUp className={`${className} text-indigo-500`} />;
      case 3: return <Flame className={`${className} text-rose-500`} />;
    }
  };

  // Tab change handler
  const handleTabSwitch = (tab: "deposit" | "withdraw" | "transfer") => {
    setActiveTab(tab);
    setSuccessNotice(null);
    setErrorNotice(null);
    if (onTabChange) onTabChange(tab);
  };

  // -------------------------------------------------------------
  // DEPOSIT HANDLER
  // -------------------------------------------------------------
  const handleDeposit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorNotice(null);
    const num = parseFloat(depositAmount.replace(/[^0-9.]/g, ""));
    if (isNaN(num) || num <= 0) {
      setErrorNotice("Please enter a valid deposit amount greater than $0.");
      return;
    }

    setIsProcessing(true);
    try {
      const updated = await fundSubAccountApi(selectedSubAccountId, num, depositMethod);
      reloadData();
      setSuccessNotice({
        title: "Deposit Confirmed & Capital Deployed!",
        message: `Successfully funded $${num.toLocaleString(undefined, { minimumFractionDigits: 2 })} into "${updated.name}" via ${depositMethod}. Systematic ETF allocation algorithm is live.`,
        type: "deposit"
      });
      setDepositAmount("1000");
    } catch (err: any) {
      setErrorNotice(err.message || "Failed to process deposit. Please check connection.");
    } finally {
      setIsProcessing(false);
    }
  };

  // -------------------------------------------------------------
  // WITHDRAW HANDLER
  // -------------------------------------------------------------
  const handleWithdraw = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorNotice(null);
    const num = parseFloat(withdrawAmount.replace(/[^0-9.]/g, ""));
    if (isNaN(num) || num <= 0) {
      setErrorNotice("Please enter a valid withdrawal amount greater than $0.");
      return;
    }
    if (num < 10) {
      setErrorNotice("Minimum withdrawal amount is $10.00.");
      return;
    }
    if (num > availableCash) {
      setErrorNotice(
        `Withdrawal request ($${num.toLocaleString()}) exceeds available cash ($${availableCash.toLocaleString(undefined, { minimumFractionDigits: 2 })}) for ${selectedAccount?.name}.`
      );
      return;
    }

    setIsProcessing(true);
    try {
      const updated = await withdrawFromSubAccountApi(selectedSubAccountId, num, withdrawDestination);
      reloadData();
      setSuccessNotice({
        title: "Withdrawal Successfully Initiated!",
        message: `Successfully transferred $${num.toLocaleString(undefined, { minimumFractionDigits: 2 })} from "${updated.name}" to ${withdrawDestination}. Remaining cash balance: $${(updated.cashBalance || 0).toLocaleString(undefined, { minimumFractionDigits: 2 })}.`,
        type: "withdraw"
      });
      setWithdrawAmount(Math.min(500, Math.max(0, (updated.cashBalance || 0))).toString());
    } catch (err: any) {
      setErrorNotice(err.message || "Failed to process withdrawal. Please verify balance.");
    } finally {
      setIsProcessing(false);
    }
  };

  // -------------------------------------------------------------
  // TRANSFER HANDLER
  // -------------------------------------------------------------
  const handleTransfer = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorNotice(null);
    const num = parseFloat(transferAmount.replace(/[^0-9.]/g, ""));
    if (isNaN(num) || num <= 0) {
      setErrorNotice("Please enter a valid transfer amount.");
      return;
    }
    if (!transferTargetId || transferTargetId === selectedSubAccountId) {
      setErrorNotice("Please select a different destination ETF sub-account.");
      return;
    }
    if (num > availableCash) {
      setErrorNotice(`Transfer amount exceeds available cash ($${availableCash.toLocaleString()}).`);
      return;
    }

    setIsProcessing(true);
    try {
      const res = await transferCashBetweenSubAccountsApi(selectedSubAccountId, transferTargetId, num);
      reloadData();
      setSuccessNotice({
        title: "Internal Transfer Completed!",
        message: `Successfully rebalanced $${num.toLocaleString(undefined, { minimumFractionDigits: 2 })} from "${res.fromAccount.name}" to "${res.toAccount.name}". Zero liquidation fees applied.`,
        type: "transfer"
      });
    } catch (err: any) {
      setErrorNotice(err.message || "Failed to transfer funds.");
    } finally {
      setIsProcessing(false);
    }
  };

  // Manual transaction ledger refresh
  const handleRefreshTransactions = async () => {
    setIsRefreshingTx(true);
    try {
      await syncTransactionsWithBackend();
      setTransactions(getAllTransactions());
    } finally {
      setTimeout(() => setIsRefreshingTx(false), 400);
    }
  };

  // Quick percentage presets for withdrawal
  const handleWithdrawPercentage = (pct: number) => {
    const calculated = (availableCash * pct) / 100;
    setWithdrawAmount(calculated > 0 ? calculated.toFixed(2) : "0");
  };

  const filteredTransactions = useMemo(() => {
    if (txFilter === "all") return transactions;
    return transactions.filter((t) => t.type === txFilter);
  }, [transactions, txFilter]);

  return (
    <div className="flex min-h-screen w-full flex-col items-center">
      <div className="grid flex-1 items-start gap-4 p-2 sm:px-4 sm:py-0 md:gap-6 w-full max-w-6xl">
        
        {/* Page Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b pb-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">Payments, Deposits & Withdrawals</h1>
            <p className="text-xs sm:text-sm text-muted-foreground mt-1">
              Manage cash liquidity, inject capital into systematic ETF models, or withdraw funds to your verified bank accounts.
            </p>
          </div>
          <div className="flex items-center gap-2 flex-wrap">
            <Badge variant="outline" className="text-xs font-semibold px-3 py-1 bg-primary/5 text-primary border-primary/20">
              <Wallet className="h-3.5 w-3.5 mr-1.5" /> Total Portfolio NAV: ${totalNavAll.toLocaleString(undefined, { minimumFractionDigits: 2 })}
            </Badge>
            <Badge variant="outline" className="text-xs font-semibold px-3 py-1 bg-emerald-500/10 text-emerald-500 border-emerald-500/20">
              <Building className="h-3.5 w-3.5 mr-1.5" /> Chase •••• 4821 Connected
            </Badge>
          </div>
        </div>

        {/* Global Notifications */}
        {successNotice && (
          <div className="flex items-start gap-3 bg-emerald-500/10 border border-emerald-500/30 text-emerald-700 dark:text-emerald-300 p-4 rounded-xl text-xs font-medium animate-in fade-in slide-in-from-top-2">
            <CheckCircle2 className="h-5 w-5 text-emerald-500 shrink-0 mt-0.5" />
            <div className="space-y-1">
              <strong className="block text-sm font-bold text-foreground">{successNotice.title}</strong>
              <span>{successNotice.message}</span>
            </div>
          </div>
        )}

        {errorNotice && (
          <div className="flex items-start gap-3 bg-rose-500/10 border border-rose-500/30 text-rose-700 dark:text-rose-300 p-4 rounded-xl text-xs font-medium animate-in fade-in slide-in-from-top-2">
            <AlertCircle className="h-5 w-5 text-rose-500 shrink-0 mt-0.5" />
            <div className="space-y-1">
              <strong className="block text-sm font-bold text-foreground">Transaction Blocked</strong>
              <span>{errorNotice}</span>
            </div>
          </div>
        )}

        {/* Step 1: Sub-Account Selection Bar */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label className="text-sm font-bold text-foreground flex items-center gap-2">
              <span className="flex h-5 w-5 items-center justify-center rounded-full bg-primary text-primary-foreground text-xs font-bold">1</span>
              {activeTab === "withdraw" ? "Select Source Sub-Account to Withdraw From" : "Select Target Sub-Account"}
            </Label>
            <span className="text-xs text-muted-foreground font-medium">
              Click a card to switch active account
            </span>
          </div>

          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {[...subAccounts]
              .sort((a, b) => a.riskLevel - b.riskLevel)
              .map((account) => {
                const profile = RISK_PROFILES[account.riskLevel];
                const isSelected = account.id === selectedSubAccountId;
                const isCurrentDashboardContext = account.id === activeContextId;
                const accountCash = account.cashBalance ?? account.currentValue;

                return (
                  <div
                    key={account.id}
                    onClick={() => {
                      setSelectedSubAccountId(account.id);
                      setSuccessNotice(null);
                      setErrorNotice(null);
                    }}
                    className={`relative flex flex-col justify-between p-4 rounded-xl border-2 cursor-pointer transition-all ${
                      isSelected
                        ? `${profile.borderClass} bg-primary/10 ring-2 ring-primary shadow-md`
                        : "border-border/60 hover:border-primary/50 bg-card hover:bg-muted/40"
                    }`}
                  >
                    <div className="space-y-2">
                      <div className="flex items-center justify-between gap-1.5">
                        <Badge className={profile.badgeClass} variant="outline">
                          Level {account.riskLevel}
                        </Badge>
                        {isSelected && (
                          <Badge className="bg-primary text-primary-foreground text-[10px] font-bold">
                            ✓ Selected
                          </Badge>
                        )}
                        {!isSelected && isCurrentDashboardContext && (
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
                          <span className="font-sans text-muted-foreground">Available Cash:</span>
                          <strong className="text-emerald-500 font-bold">${accountCash.toLocaleString(undefined, { minimumFractionDigits: 2 })}</strong>
                        </div>
                      </div>
                    </div>

                    <div className="mt-3 pt-2 border-t flex items-center justify-between text-[11px]">
                      <span className="text-muted-foreground">Target Return: {profile.targetReturn}</span>
                      <div className={`h-4 w-4 rounded-full border flex items-center justify-center ${
                        isSelected ? "border-primary bg-primary text-primary-foreground" : "border-muted-foreground"
                      }`}>
                        {isSelected && <div className="h-1.5 w-1.5 rounded-full bg-background" />}
                      </div>
                    </div>
                  </div>
                );
              })}
          </div>
        </div>

        {/* Step 2: Main Action Tabs (Deposit vs Withdraw vs Transfer) */}
        <div className="space-y-4">
          <div className="flex items-center justify-between flex-wrap gap-2">
            <div className="flex items-center gap-1 p-1 bg-muted rounded-xl border">
              <Button
                variant={activeTab === "deposit" ? "default" : "ghost"}
                size="sm"
                onClick={() => handleTabSwitch("deposit")}
                className="gap-2 text-xs font-semibold rounded-lg px-4"
              >
                <ArrowDownLeft className="h-3.5 w-3.5 text-emerald-400" />
                Deposit Funds
              </Button>
              <Button
                variant={activeTab === "withdraw" ? "default" : "ghost"}
                size="sm"
                onClick={() => handleTabSwitch("withdraw")}
                className="gap-2 text-xs font-semibold rounded-lg px-4"
              >
                <ArrowUpRight className="h-3.5 w-3.5 text-rose-400" />
                Withdraw Funds
              </Button>
              <Button
                variant={activeTab === "transfer" ? "default" : "ghost"}
                size="sm"
                onClick={() => handleTabSwitch("transfer")}
                className="gap-2 text-xs font-semibold rounded-lg px-4"
              >
                <ArrowLeftRight className="h-3.5 w-3.5 text-blue-400" />
                Transfer Between ETFs
              </Button>
            </div>

            <div className="text-xs text-muted-foreground font-mono">
              Active Strategy: <strong className="text-foreground">{selectedProfile.strategyName}</strong>
            </div>
          </div>

          {/* TAB 1: DEPOSIT FUNDS */}
          {activeTab === "deposit" && (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              <Card className="lg:col-span-2 border-2 shadow-md bg-card">
                <CardHeader className="pb-3 border-b">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-base font-bold flex items-center gap-2">
                      <ArrowDownLeft className="h-4 w-4 text-emerald-500" />
                      Deposit Capital into &quot;{selectedProfile.strategyName}&quot;
                    </CardTitle>
                    <Badge className={selectedProfile.badgeClass}>
                      Level {selectedAccount?.riskLevel} Strategy
                    </Badge>
                  </div>
                  <CardDescription className="text-xs">
                    Deposit funds securely. Capital is automatically allocated across the ETF basket positions.
                  </CardDescription>
                </CardHeader>

                <form onSubmit={handleDeposit}>
                  <CardContent className="space-y-4 pt-4 text-xs">
                    {/* Quick Presets */}
                    <div className="space-y-1.5">
                      <Label className="text-xs font-semibold text-foreground">Select Preset Amount ($ USD)</Label>
                      <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
                        {[250, 500, 1000, 2500, 5000, 10000].map((preset) => (
                          <Button
                            key={preset}
                            type="button"
                            variant={depositAmount === preset.toString() ? "default" : "outline"}
                            size="sm"
                            onClick={() => setDepositAmount(preset.toString())}
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
                          value={depositAmount}
                          onChange={(e) => setDepositAmount(e.target.value)}
                          className="pl-9 font-mono font-bold text-sm"
                          required
                        />
                      </div>
                    </div>

                    {/* Payment Method Selector */}
                    <div className="space-y-1.5">
                      <Label className="text-xs font-semibold">Payment Method</Label>
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                        {[
                          { id: "Instant Card (Stripe)", name: "Credit / Debit Card", icon: CreditCard,
  Banknote, detail: "Instant Execution", tag: "Stripe" },
                          { id: "Direct Bank Wire", name: "Direct Bank Transfer", icon: Landmark, detail: "Zero Fees (Wire)", tag: "Fedwire" },
                          { id: "Connected Bank (Chase)", name: "Chase •••• 4821", icon: Building, detail: "ACH Verified Account", tag: "ACH" }
                        ].map((m) => (
                          <div
                            key={m.id}
                            onClick={() => setDepositMethod(m.id)}
                            className={`flex flex-col justify-between p-3 rounded-lg border cursor-pointer transition-all ${
                              depositMethod === m.id
                                ? "border-primary bg-primary/10 ring-1 ring-primary font-medium"
                                : "border-border/60 hover:bg-muted/50"
                            }`}
                          >
                            <div className="flex items-center justify-between">
                              <m.icon className="h-4 w-4 text-primary" />
                              <Badge variant="outline" className="text-[9px] px-1.5 py-0">{m.tag}</Badge>
                            </div>
                            <div className="mt-2">
                              <span className="text-xs block font-semibold text-foreground">{m.name}</span>
                              <span className="text-[10px] text-muted-foreground">{m.detail}</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Allocation Blueprint Notice */}
                    <div className="rounded-lg bg-muted/40 p-3 border space-y-1 text-[11px] text-muted-foreground">
                      <strong className="text-foreground font-semibold flex items-center gap-1">
                        <Sparkles className="h-3.5 w-3.5 text-primary" /> Systematic Allocation Blueprint:
                      </strong>
                      <p>
                        Depositing <strong>${Number(depositAmount || 0).toLocaleString()}</strong> into <strong>{selectedProfile.strategyName}</strong> triggers automated routing across its Level {selectedAccount?.riskLevel} basket ({selectedProfile.sampleTickers.slice(0, 4).join(", ")}...).
                      </p>
                    </div>
                  </CardContent>

                  <CardFooter className="flex items-center justify-between border-t pt-4 bg-muted/10">
                    <span className="text-xs text-muted-foreground">
                      Target Account: <strong className="text-foreground">{selectedProfile.strategyName}</strong>
                    </span>
                    <Button
                      type="submit"
                      disabled={isProcessing || !depositAmount || Number(depositAmount) <= 0}
                      className="gap-2 font-semibold text-xs px-5 bg-emerald-600 hover:bg-emerald-700 text-white"
                    >
                      {isProcessing ? "Processing Deposit..." : `Deposit $${Number(depositAmount || 0).toLocaleString()} Now`}
                      <ArrowRight className="h-3.5 w-3.5" />
                    </Button>
                  </CardFooter>
                </form>
              </Card>

              {/* Sidebar Summary */}
              <Card className="border-border/60 shadow-sm bg-card flex flex-col justify-between">
                <CardHeader className="pb-2">
                  <CardDescription className="text-xs">Deposit Impact Preview</CardDescription>
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
                      <strong className="text-emerald-500 font-bold">
                        ${((selectedAccount?.allocatedCapital || 0) + Number(depositAmount || 0)).toLocaleString()}
                      </strong>
                    </div>
                    <div className="flex justify-between items-center border-t pt-1.5">
                      <span className="font-sans text-muted-foreground text-[11px]">Deposit Fee:</span>
                      <span className="font-sans text-emerald-500 font-bold">$0.00 (Free)</span>
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
                <CardFooter className="border-t pt-3 text-[11px] text-muted-foreground flex items-center gap-1.5">
                  <Lock className="h-3 w-3 text-emerald-500" /> Encrypted 256-bit SSL Banking Gateway
                </CardFooter>
              </Card>
            </div>
          )}

          {/* TAB 2: WITHDRAW FUNDS (USER REQUEST IMPLEMENTATION) */}
          {activeTab === "withdraw" && (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              <Card className="lg:col-span-2 border-2 shadow-md bg-card border-rose-500/30">
                <CardHeader className="pb-3 border-b">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-base font-bold flex items-center gap-2">
                      <ArrowUpRight className="h-4 w-4 text-rose-500" />
                      Withdraw Funds from &quot;{selectedProfile.strategyName}&quot;
                    </CardTitle>
                    <Badge variant="outline" className="border-rose-500/40 text-rose-400 bg-rose-500/10">
                      Capital Redemption
                    </Badge>
                  </div>
                  <CardDescription className="text-xs">
                    Withdraw liquidity to your verified bank account or debit card. Withdrawals are processed instantly without penalty.
                  </CardDescription>
                </CardHeader>

                <form onSubmit={handleWithdraw}>
                  <CardContent className="space-y-4 pt-4 text-xs">
                    {/* Source Sub-Account Liquidity Banner */}
                    <div className="rounded-xl bg-muted/40 p-3.5 border flex items-center justify-between flex-wrap gap-3">
                      <div>
                        <span className="text-[11px] text-muted-foreground block font-medium">Source Account:</span>
                        <strong className="text-sm font-bold text-foreground flex items-center gap-1.5 mt-0.5">
                          {getProfileIcon(selectedAccount?.riskLevel || 2)}
                          {selectedAccount?.name}
                        </strong>
                      </div>
                      <div className="text-right font-mono">
                        <span className="text-[11px] text-muted-foreground block font-sans">Available Cash:</span>
                        <strong className="text-base font-bold text-emerald-500">
                          ${availableCash.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                        </strong>
                      </div>
                    </div>

                    {/* Percentage Quick Selectors */}
                    <div className="space-y-1.5">
                      <div className="flex items-center justify-between">
                        <Label className="text-xs font-semibold text-foreground">Withdrawal Amount Preset</Label>
                        <span className="text-[11px] text-muted-foreground font-mono">
                          Max available: ${availableCash.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                        </span>
                      </div>
                      <div className="grid grid-cols-4 gap-2">
                        {[
                          { label: "25%", pct: 25 },
                          { label: "50%", pct: 50 },
                          { label: "75%", pct: 75 },
                          { label: "100% (Max)", pct: 100 }
                        ].map((btn) => (
                          <Button
                            key={btn.label}
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={() => handleWithdrawPercentage(btn.pct)}
                            className="text-xs font-mono font-semibold h-8 hover:border-rose-500/50"
                          >
                            {btn.label}
                          </Button>
                        ))}
                      </div>
                    </div>

                    {/* Custom Amount Input */}
                    <div className="space-y-1.5">
                      <Label htmlFor="withdraw-amount" className="text-xs font-semibold">Custom Withdrawal Amount ($ USD)</Label>
                      <div className="relative">
                        <DollarSign className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                        <Input
                          id="withdraw-amount"
                          type="number"
                          min="10"
                          step="any"
                          max={availableCash}
                          placeholder="500.00"
                          value={withdrawAmount}
                          onChange={(e) => setWithdrawAmount(e.target.value)}
                          className="pl-9 font-mono font-bold text-sm"
                          required
                        />
                      </div>
                      {Number(withdrawAmount) > availableCash && (
                        <p className="text-[11px] text-rose-500 flex items-center gap-1 font-semibold">
                          <AlertTriangle className="h-3 w-3" /> Amount exceeds available cash (${availableCash.toLocaleString(undefined, { minimumFractionDigits: 2 })}).
                        </p>
                      )}
                    </div>

                    {/* Destination Account Selection */}
                    <div className="space-y-1.5">
                      <Label className="text-xs font-semibold">Payout Destination</Label>
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                        {[
                          {
                            id: "Chase Bank Checking (•••• 4821)",
                            name: "Chase Checking •••• 4821",
                            detail: "ACH Verified Account (1-2 Days)",
                            icon: Building,
                            badge: "Default"
                          },
                          {
                            id: "Direct Bank Wire (IBAN/SWIFT)",
                            name: "Direct Wire Transfer",
                            detail: "Same-Day Fedwire Express",
                            icon: Landmark,
                            badge: "Zero Fee"
                          },
                          {
                            id: "Instant Debit Card (•••• 1234)",
                            name: "Visa Direct Card •••• 1234",
                            detail: "Instant 30s Payout",
                            icon: CreditCard,
  Banknote,
                            badge: "Instant"
                          }
                        ].map((dest) => (
                          <div
                            key={dest.id}
                            onClick={() => setWithdrawDestination(dest.id)}
                            className={`flex flex-col justify-between p-3 rounded-lg border cursor-pointer transition-all ${
                              withdrawDestination === dest.id
                                ? "border-rose-500 bg-rose-500/10 ring-1 ring-rose-500 font-medium"
                                : "border-border/60 hover:bg-muted/50"
                            }`}
                          >
                            <div className="flex items-center justify-between">
                              <dest.icon className="h-4 w-4 text-rose-500" />
                              <Badge variant="outline" className="text-[9px] px-1.5 py-0">{dest.badge}</Badge>
                            </div>
                            <div className="mt-2">
                              <span className="text-xs block font-semibold text-foreground">{dest.name}</span>
                              <span className="text-[10px] text-muted-foreground">{dest.detail}</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Compliance & Safety Guarantee */}
                    <div className="rounded-lg bg-muted/30 p-3 border space-y-1 text-[11px] text-muted-foreground">
                      <strong className="text-foreground font-semibold flex items-center gap-1">
                        <ShieldCheck className="h-3.5 w-3.5 text-emerald-500" /> Regulatory & Custody Guarantee:
                      </strong>
                      <p>
                        Client assets are held in segregated custody at member SIPC/FINRA banking partners. There are no lockup periods or exit fees.
                      </p>
                    </div>
                  </CardContent>

                  <CardFooter className="flex items-center justify-between border-t pt-4 bg-muted/10">
                    <span className="text-xs text-muted-foreground">
                      Remaining Balance: <strong className="text-foreground font-mono">${Math.max(0, availableCash - Number(withdrawAmount || 0)).toLocaleString(undefined, { minimumFractionDigits: 2 })}</strong>
                    </span>
                    <Button
                      type="submit"
                      disabled={
                        isProcessing ||
                        !withdrawAmount ||
                        Number(withdrawAmount) < 10 ||
                        Number(withdrawAmount) > availableCash
                      }
                      className="gap-2 font-semibold text-xs px-5 bg-rose-600 hover:bg-rose-700 text-white"
                    >
                      {isProcessing ? "Processing Payout..." : `Withdraw $${Number(withdrawAmount || 0).toLocaleString()} Now`}
                      <ArrowRight className="h-3.5 w-3.5" />
                    </Button>
                  </CardFooter>
                </form>
              </Card>

              {/* Withdrawal Settlement Summary Card */}
              <Card className="border-border/60 shadow-sm bg-card flex flex-col justify-between">
                <CardHeader className="pb-2">
                  <CardDescription className="text-xs">Settlement Breakdown</CardDescription>
                  <CardTitle className="text-xl font-bold flex items-center gap-2 text-rose-500">
                    <Banknote className="h-5 w-5" />
                    Payout Summary
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3 text-xs pt-0">
                  <div className="rounded-lg bg-muted/30 p-3 border space-y-2 font-mono">
                    <div className="flex justify-between items-center">
                      <span className="font-sans text-muted-foreground text-[11px]">Gross Withdrawal:</span>
                      <strong className="text-foreground">${Number(withdrawAmount || 0).toLocaleString(undefined, { minimumFractionDigits: 2 })}</strong>
                    </div>
                    <div className="flex justify-between items-center border-t pt-1.5">
                      <span className="font-sans text-muted-foreground text-[11px]">Transfer Fee:</span>
                      <strong className="text-emerald-500 font-bold">$0.00 (Waived)</strong>
                    </div>
                    <div className="flex justify-between items-center border-t pt-1.5 text-xs">
                      <span className="font-sans text-muted-foreground font-semibold">Net Payout to Bank:</span>
                      <strong className="text-rose-500 font-extrabold text-sm">
                        ${Number(withdrawAmount || 0).toLocaleString(undefined, { minimumFractionDigits: 2 })}
                      </strong>
                    </div>
                    <div className="flex justify-between items-center border-t pt-1.5">
                      <span className="font-sans text-muted-foreground text-[11px]">Estimated Arrival:</span>
                      <span className="font-sans text-foreground font-semibold flex items-center gap-1">
                        <Clock className="h-3 w-3 text-muted-foreground" /> 1-2 Business Days
                      </span>
                    </div>
                  </div>

                  <div className="space-y-1">
                    <span className="text-muted-foreground text-[11px] font-medium block">Destination Account:</span>
                    <p className="text-foreground text-[11px] font-semibold">
                      {withdrawDestination}
                    </p>
                  </div>
                </CardContent>
                <CardFooter className="border-t pt-3 text-[11px] text-muted-foreground flex items-center gap-1.5">
                  <ShieldCheck className="h-3.5 w-3.5 text-emerald-500" /> Verified ACH Anti-Fraud Clearing
                </CardFooter>
              </Card>
            </div>
          )}

          {/* TAB 3: INTERNAL CASH TRANSFER */}
          {activeTab === "transfer" && (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              <Card className="lg:col-span-2 border-2 shadow-md bg-card border-blue-500/30">
                <CardHeader className="pb-3 border-b">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-base font-bold flex items-center gap-2">
                      <ArrowLeftRight className="h-4 w-4 text-blue-500" />
                      Transfer Cash Between Segregated ETFs
                    </CardTitle>
                    <Badge variant="outline" className="border-blue-500/40 text-blue-400 bg-blue-500/10">
                      Zero Liquidation Rebalance
                    </Badge>
                  </div>
                  <CardDescription className="text-xs">
                    Instantly move liquidity between your Level 1, Level 2, and Level 3 sub-accounts without withdrawing to your external bank.
                  </CardDescription>
                </CardHeader>

                <form onSubmit={handleTransfer}>
                  <CardContent className="space-y-4 pt-4 text-xs">
                    {/* Source and Target Account Selectors */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 items-center">
                      <div className="space-y-1.5">
                        <Label className="text-xs font-semibold">From (Source Sub-Account)</Label>
                        <Select value={selectedSubAccountId} onValueChange={(val) => setSelectedSubAccountId(val)}>
                          <SelectTrigger className="text-xs">
                            <SelectValue placeholder="Select Source" />
                          </SelectTrigger>
                          <SelectContent>
                            {subAccounts.map((a) => (
                              <SelectItem key={a.id} value={a.id} className="text-xs">
                                Level {a.riskLevel}: {a.strategyName} (${(a.cashBalance || 0).toLocaleString()} cash)
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="space-y-1.5">
                        <Label className="text-xs font-semibold">To (Destination Sub-Account)</Label>
                        <Select value={transferTargetId} onValueChange={(val) => setTransferTargetId(val)}>
                          <SelectTrigger className="text-xs">
                            <SelectValue placeholder="Select Destination" />
                          </SelectTrigger>
                          <SelectContent>
                            {subAccounts
                              .filter((a) => a.id !== selectedSubAccountId)
                              .map((a) => (
                                <SelectItem key={a.id} value={a.id} className="text-xs">
                                  Level {a.riskLevel}: {a.strategyName}
                                </SelectItem>
                              ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    {/* Amount Input */}
                    <div className="space-y-1.5">
                      <div className="flex items-center justify-between">
                        <Label htmlFor="transfer-amount" className="text-xs font-semibold">Transfer Amount ($ USD)</Label>
                        <span className="text-[11px] text-muted-foreground font-mono">
                          Source cash: ${availableCash.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                        </span>
                      </div>
                      <div className="relative">
                        <DollarSign className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                        <Input
                          id="transfer-amount"
                          type="number"
                          min="1"
                          step="any"
                          max={availableCash}
                          placeholder="250"
                          value={transferAmount}
                          onChange={(e) => setTransferAmount(e.target.value)}
                          className="pl-9 font-mono font-bold text-sm"
                          required
                        />
                      </div>
                    </div>

                    {/* Quick percentage buttons */}
                    <div className="grid grid-cols-3 gap-2">
                      {[25, 50, 100].map((pct) => (
                        <Button
                          key={pct}
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            const val = (availableCash * pct) / 100;
                            setTransferAmount(val > 0 ? val.toFixed(2) : "0");
                          }}
                          className="text-xs font-mono font-semibold h-8"
                        >
                          {pct === 100 ? "100% (All Cash)" : `${pct}%`}
                        </Button>
                      ))}
                    </div>
                  </CardContent>

                  <CardFooter className="flex items-center justify-between border-t pt-4 bg-muted/10">
                    <span className="text-xs text-muted-foreground">
                      Execution: <strong className="text-foreground">Instant internal ledger transfer</strong>
                    </span>
                    <Button
                      type="submit"
                      disabled={isProcessing || !transferAmount || Number(transferAmount) <= 0 || Number(transferAmount) > availableCash}
                      className="gap-2 font-semibold text-xs px-5 bg-blue-600 hover:bg-blue-700 text-white"
                    >
                      {isProcessing ? "Transferring Cash..." : `Transfer $${Number(transferAmount || 0).toLocaleString()} Now`}
                      <ArrowRight className="h-3.5 w-3.5" />
                    </Button>
                  </CardFooter>
                </form>
              </Card>

              {/* Transfer Overview Card */}
              <Card className="border-border/60 shadow-sm bg-card flex flex-col justify-between">
                <CardHeader className="pb-2">
                  <CardDescription className="text-xs">Transfer Summary</CardDescription>
                  <CardTitle className="text-xl font-bold flex items-center gap-2 text-blue-500">
                    <ArrowLeftRight className="h-5 w-5" />
                    Internal Transfer
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3 text-xs pt-0">
                  <div className="rounded-lg bg-muted/30 p-3 border space-y-2 font-mono">
                    <div className="flex justify-between items-center">
                      <span className="font-sans text-muted-foreground text-[11px]">Transfer Amount:</span>
                      <strong className="text-foreground">${Number(transferAmount || 0).toLocaleString(undefined, { minimumFractionDigits: 2 })}</strong>
                    </div>
                    <div className="flex justify-between items-center border-t pt-1.5">
                      <span className="font-sans text-muted-foreground text-[11px]">Fee:</span>
                      <strong className="text-emerald-500 font-bold">$0.00 (Zero Fee)</strong>
                    </div>
                    <div className="flex justify-between items-center border-t pt-1.5">
                      <span className="font-sans text-muted-foreground text-[11px]">Speed:</span>
                      <span className="font-sans text-foreground font-semibold">Immediate</span>
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="border-t pt-3 text-[11px] text-muted-foreground">
                  🔄 Isolated sub-account balance protection
                </CardFooter>
              </Card>
            </div>
          )}
        </div>

        {/* Step 3: Transaction Ledger (Real-time Live Table) */}
        <div className="space-y-3 pt-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <h3 className="text-base font-bold text-foreground">Transaction & Activity History</h3>
              <Badge variant="outline" className="text-[11px]">
                {transactions.length} Total Records
              </Badge>
            </div>

            <div className="flex items-center gap-2">
              <div className="flex items-center gap-1 p-0.5 bg-muted rounded-lg border">
                <Button
                  variant={txFilter === "all" ? "default" : "ghost"}
                  size="sm"
                  onClick={() => setTxFilter("all")}
                  className="h-7 text-[11px] px-2.5"
                >
                  All
                </Button>
                <Button
                  variant={txFilter === "Deposit" ? "default" : "ghost"}
                  size="sm"
                  onClick={() => setTxFilter("Deposit")}
                  className="h-7 text-[11px] px-2.5 text-emerald-500"
                >
                  Deposits
                </Button>
                <Button
                  variant={txFilter === "Withdrawal" ? "default" : "ghost"}
                  size="sm"
                  onClick={() => setTxFilter("Withdrawal")}
                  className="h-7 text-[11px] px-2.5 text-rose-500"
                >
                  Withdrawals
                </Button>
              </div>

              <Button
                variant="outline"
                size="sm"
                onClick={handleRefreshTransactions}
                disabled={isRefreshingTx}
                className="h-7 text-xs gap-1.5"
                title="Refresh transactions from backend"
              >
                <RefreshCw className={`h-3 w-3 ${isRefreshingTx ? "animate-spin" : ""}`} />
                <span>Refresh</span>
              </Button>
            </div>
          </div>

          <Card className="border-border/60">
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="text-xs">Type & Method</TableHead>
                    <TableHead className="text-xs">Sub-Account</TableHead>
                    <TableHead className="text-xs hidden sm:table-cell">Strategy Profile</TableHead>
                    <TableHead className="text-xs hidden sm:table-cell">Status</TableHead>
                    <TableHead className="text-xs hidden md:table-cell">Date</TableHead>
                    <TableHead className="text-right text-xs">Amount ($ USD)</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredTransactions.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={6} className="text-center py-8 text-xs text-muted-foreground">
                        No transactions found for this filter.
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredTransactions.map((tx) => {
                      const isDeposit = tx.type === "Deposit";
                      return (
                        <TableRow key={tx.id}>
                          <TableCell className="font-medium text-xs">
                            <div className="flex items-center gap-2">
                              {isDeposit ? (
                                <div className="h-6 w-6 rounded-full bg-emerald-500/10 flex items-center justify-center text-emerald-500">
                                  <ArrowDownLeft className="h-3.5 w-3.5" />
                                </div>
                              ) : (
                                <div className="h-6 w-6 rounded-full bg-rose-500/10 flex items-center justify-center text-rose-500">
                                  <ArrowUpRight className="h-3.5 w-3.5" />
                                </div>
                              )}
                              <div>
                                <span className="block font-semibold text-foreground">{tx.type}</span>
                                <span className="text-[10px] text-muted-foreground">{tx.method}</span>
                              </div>
                            </div>
                          </TableCell>
                          <TableCell className="text-xs font-semibold text-foreground">
                            {tx.subAccountName}
                          </TableCell>
                          <TableCell className="text-xs text-muted-foreground hidden sm:table-cell">
                            {tx.strategyName}
                          </TableCell>
                          <TableCell className="hidden sm:table-cell">
                            <Badge
                              variant="outline"
                              className={
                                tx.status === "Fulfilled" || (tx.status as string) === "Completed"
                                  ? "bg-emerald-500/10 text-emerald-500 border-emerald-500/20 text-[10px]"
                                  : "bg-amber-500/10 text-amber-500 border-amber-500/20 text-[10px]"
                              }
                            >
                              {tx.status}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-xs text-muted-foreground hidden md:table-cell font-mono">
                            {tx.date}
                          </TableCell>
                          <TableCell
                            className={`text-right font-mono font-bold text-xs ${
                              isDeposit ? "text-emerald-500" : "text-rose-500"
                            }`}
                          >
                            {isDeposit ? "+" : "-"} ${tx.amount.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                          </TableCell>
                        </TableRow>
                      );
                    })
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </div>

      </div>
    </div>
  );
}
