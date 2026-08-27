"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import {
  ShieldCheck,
  TrendingUp,
  Scale,
  Zap,
  Flame,
  PlusCircle,
  Layers,
  ArrowRight,
  Sliders,
  DollarSign,
  TrendingDown,
  Trash2,
  ExternalLink,
  Target,
  ArrowLeft,
  Sparkles,
  CheckCircle2,
  AlertTriangle,
  Lock
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  RISK_PROFILES,
  getSubAccounts,
  storeSubAccounts,
  getActiveSubAccountId,
  setActiveSubAccountId,
  deleteSubAccount,
  updateSubAccountRiskLevel
} from "@/lib/risk-assessment-data";
import { RiskLevel, SubAccount } from "@/types/risk-profile";
import { CreateSubAccountDialog } from "@/components/sub-accounts/create-sub-account-dialog";

export default function SubAccountsHubPage() {
  const router = useRouter();
  const [subAccounts, setSubAccounts] = useState<SubAccount[]>([]);
  const [activeId, setActiveId] = useState<string>("");
  const [isCreateOpen, setIsCreateOpen] = useState(false);

  // Edit risk strategy dialog state
  const [editingAccount, setEditingAccount] = useState<SubAccount | null>(null);
  const [selectedEditLevel, setSelectedEditLevel] = useState<RiskLevel>(2);
  const [editError, setEditError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  useEffect(() => {
    const accs = getSubAccounts();
    setSubAccounts(accs);
    setActiveId(getActiveSubAccountId());
  }, []);

  const totalCapital = subAccounts.reduce((sum, a) => sum + (a.allocatedCapital || 0), 0);
  const totalValue = subAccounts.reduce((sum, a) => sum + (a.currentValue || 0), 0);
  const totalPnl = totalValue - totalCapital;
  const totalPnlPercent = totalCapital > 0 ? (totalPnl / totalCapital) * 100 : 0;

  const getProfileIcon = (level: RiskLevel, className = "h-5 w-5") => {
    switch (level) {
      case 1: return <ShieldCheck className={`${className} text-emerald-500`} />;
      case 2: return <TrendingUp className={`${className} text-indigo-500`} />;
      case 3: return <Flame className={`${className} text-rose-500`} />;
    }
  };

  const handleOpenAccount = (id: string) => {
    setActiveSubAccountId(id);
    setActiveId(id);
    router.push("/");
  };

  const handleDelete = (id: string, name: string) => {
    if (subAccounts.length <= 1) {
      alert("You must maintain at least one active sub-account.");
      return;
    }
    if (confirm(`Are you sure you want to delete sub-account "${name}"? Allocated funds will be returned to your main cash reserve.`)) {
      deleteSubAccount(id);
      const updated = getSubAccounts();
      setSubAccounts(updated);
      setActiveId(getActiveSubAccountId());
      showFeedback(`Sub-account "${name}" was deleted successfully.`);
    }
  };

  const handleOpenEditLevel = (account: SubAccount) => {
    setEditingAccount(account);
    setSelectedEditLevel(account.riskLevel);
    setEditError(null);
  };

  const handleSaveRiskLevel = () => {
    if (!editingAccount) return;
    try {
      updateSubAccountRiskLevel(editingAccount.id, selectedEditLevel);
      const updated = getSubAccounts();
      setSubAccounts(updated);
      showFeedback(`Strategy for "${editingAccount.name}" switched to Level ${selectedEditLevel}: ${RISK_PROFILES[selectedEditLevel].strategyName}`);
      setEditingAccount(null);
    } catch (err: any) {
      setEditError(err.message || "Failed to update risk level.");
    }
  };

  const showFeedback = (msg: string) => {
    setSuccessMessage(msg);
    setTimeout(() => setSuccessMessage(null), 4000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-background via-muted/30 to-background flex flex-col justify-between">
      {/* Top Navbar */}
      <header className="border-b bg-card/60 backdrop-blur-md sticky top-0 z-40">
        <div className="container max-w-7xl mx-auto flex h-16 items-center justify-between px-4">
          <Link href="/" className="flex items-center gap-2 font-bold text-lg">
            <Image src="/icons/face.ico" alt="Gotti Logo" width={28} height={28} />
            <span className="tracking-tight font-extrabold text-foreground">Gotti<span className="text-primary">.ai</span></span>
          </Link>
          <div className="flex items-center gap-4 text-xs sm:text-sm font-medium">
            <Link href="/" className="text-muted-foreground hover:text-foreground flex items-center gap-1">
              <ArrowLeft className="h-3.5 w-3.5" /> Back to Dashboard
            </Link>
            <Link href="/orders" className="text-muted-foreground hover:text-foreground">
              Orders
            </Link>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="container max-w-7xl mx-auto px-4 py-8 flex-1 space-y-8">
        {/* Hub Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b pb-6">
          <div>
            <div className="flex items-center gap-2">
              <Layers className="h-6 w-6 text-primary" />
              <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">Segregated ETF Sub-Accounts Hub</h1>
            </div>
            <p className="text-sm text-muted-foreground mt-1">
              Manage multiple automated strategy portfolios under your account. <strong>Rule:</strong> Maximum 1 sub-account per Risk Level (Levels 1 to 3).
            </p>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <Button
              onClick={() => setIsCreateOpen(true)}
              className="gap-2 font-medium text-xs sm:text-sm"
              disabled={subAccounts.length >= 3}
            >
              <PlusCircle className="h-4 w-4" />
              {subAccounts.length >= 3 ? "Max 3/3 Sub-Accounts Reached" : "Create New Sub-Account"}
            </Button>
          </div>
        </div>

        {successMessage && (
          <div className="flex items-center gap-2 bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400 p-3 rounded-lg text-xs font-semibold">
            <CheckCircle2 className="h-4 w-4 shrink-0" />
            <span>{successMessage}</span>
          </div>
        )}

        {/* Global Aggregate Metrics */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <Card className="bg-card/90 shadow-sm border-border/60">
            <CardHeader className="pb-2">
              <CardDescription className="text-xs">Total Net Asset Value (NAV)</CardDescription>
              <CardTitle className="text-2xl font-extrabold font-mono">${totalValue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</CardTitle>
            </CardHeader>
            <CardContent className="pt-0 text-[11px] text-muted-foreground">
              Combined wealth across all {subAccounts.length} sub-accounts
            </CardContent>
          </Card>

          <Card className="bg-card/90 shadow-sm border-border/60">
            <CardHeader className="pb-2">
              <CardDescription className="text-xs">Total Allocated Capital</CardDescription>
              <CardTitle className="text-2xl font-extrabold font-mono">${totalCapital.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</CardTitle>
            </CardHeader>
            <CardContent className="pt-0 text-[11px] text-muted-foreground">
              Principal capital deployed to automated models
            </CardContent>
          </Card>

          <Card className="bg-card/90 shadow-sm border-border/60">
            <CardHeader className="pb-2">
              <CardDescription className="text-xs">Total Realized/Unrealized PnL</CardDescription>
              <CardTitle className={`text-2xl font-extrabold font-mono flex items-center gap-1 ${
                totalPnl >= 0 ? "text-emerald-600 dark:text-emerald-400" : "text-rose-600 dark:text-rose-400"
              }`}>
                {totalPnl >= 0 ? "+" : ""}${totalPnl.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-0 text-[11px] flex items-center gap-1 font-medium">
              {totalPnl >= 0 ? <TrendingUp className="h-3.5 w-3.5 text-emerald-500" /> : <TrendingDown className="h-3.5 w-3.5 text-rose-500" />}
              <span className={totalPnl >= 0 ? "text-emerald-600 dark:text-emerald-400" : "text-rose-600 dark:text-rose-400"}>
                {totalPnlPercent >= 0 ? "+" : ""}{totalPnlPercent.toFixed(2)}% Overall Yield
              </span>
            </CardContent>
          </Card>

          <Card className="bg-card/90 shadow-sm border-border/60">
            <CardHeader className="pb-2">
              <CardDescription className="text-xs">Sub-Accounts Capacity</CardDescription>
              <CardTitle className="text-2xl font-extrabold font-mono">{subAccounts.length} / 3</CardTitle>
            </CardHeader>
            <CardContent className="pt-0 text-[11px] text-muted-foreground">
              {3 - subAccounts.length} Risk Levels available to activate
            </CardContent>
          </Card>
        </div>

        {/* Sub-Accounts Grid */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-foreground">Active Segregated ETF Portfolios</h2>
            <span className="text-xs text-muted-foreground">Click &apos;Open Dashboard&apos; to switch active context</span>
          </div>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {[...subAccounts]
              .sort((a, b) => a.riskLevel - b.riskLevel)
              .map((account) => {
                const profile = RISK_PROFILES[account.riskLevel];
              const isActive = account.id === activeId;

              return (
                <Card
                  key={account.id}
                  className={`flex flex-col justify-between border-2 transition-all shadow-md overflow-hidden bg-card ${
                    isActive ? `${profile.borderClass} ring-2 ring-primary/40` : "border-border/60 hover:border-primary/40"
                  }`}
                >
                  <div className="h-2 w-full" style={{ backgroundColor: profile.color }} />
                  <CardHeader className="pb-3 space-y-2">
                    <div className="flex items-center justify-between gap-2">
                      <Badge className={profile.badgeClass}>
                        Level {account.riskLevel}
                      </Badge>
                      {isActive && (
                        <Badge variant="default" className="text-[10px] bg-primary text-primary-foreground font-semibold">
                          Active Context
                        </Badge>
                      )}
                    </div>

                    <div>
                      <CardTitle className="text-lg font-bold flex items-center gap-2">
                        {getProfileIcon(account.riskLevel)}
                        <span className="truncate">{profile.strategyName}</span>
                      </CardTitle>
                      <CardDescription className="text-xs text-muted-foreground pt-0.5 line-clamp-1">
                        {profile.tagline}
                      </CardDescription>
                    </div>
                  </CardHeader>

                  <CardContent className="space-y-3 text-xs pt-0 flex-1">
                    {/* Financial Metrics */}
                    <div className="rounded-lg bg-muted/40 p-3 border space-y-1.5 font-mono">
                      <div className="flex justify-between items-center text-xs">
                        <span className="text-muted-foreground font-sans font-medium text-[11px]">Current NAV:</span>
                        <strong className="text-foreground text-sm font-bold">${account.currentValue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</strong>
                      </div>
                      <div className="flex justify-between items-center text-xs border-t pt-1">
                        <span className="text-muted-foreground font-sans font-medium text-[11px]">Cash Reserve:</span>
                        <span className="text-foreground font-semibold font-mono">${(account.cashBalance || account.currentValue * 0.1).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                      </div>
                      <div className="flex justify-between items-center text-xs border-t pt-1">
                        <span className="text-muted-foreground font-sans font-medium text-[11px]">Allocated Capital:</span>
                        <span className="text-muted-foreground">${account.allocatedCapital.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                      </div>
                      <div className="flex justify-between items-center text-xs border-t pt-1">
                        <span className="text-muted-foreground font-sans font-medium text-[11px]">Unrealized PnL:</span>
                        <span className={`font-bold flex items-center gap-0.5 ${
                          account.pnl >= 0 ? "text-emerald-600 dark:text-emerald-400" : "text-rose-600 dark:text-rose-400"
                        }`}>
                          {account.pnl >= 0 ? "+" : ""}${account.pnl.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })} ({account.pnlPercentage >= 0 ? "+" : ""}{account.pnlPercentage.toFixed(2)}%)
                        </span>
                      </div>
                    </div>

                    {/* Strategy Specifications */}
                    <div className="rounded-lg bg-card p-2.5 border space-y-1 text-[11px]">
                      <div>
                        <span className="text-muted-foreground block text-[10px]">Target 1-Year Return:</span>
                        <strong className="text-foreground font-semibold">{profile.targetReturn}</strong>
                      </div>
                      <div className="border-t pt-1">
                        <span className="text-muted-foreground block text-[10px]">Turnover Strategy:</span>
                        <span className="text-muted-foreground leading-tight block">{profile.turnoverStrategy}</span>
                      </div>
                    </div>

                    {/* Holdings preview */}
                    <div>
                      <span className="text-muted-foreground block text-[10px] mb-1 font-medium">Underlying Basket Tickers:</span>
                      <div className="flex flex-wrap gap-1">
                        {profile.sampleTickers.map((t) => (
                          <span key={t} className="px-1.5 py-0.5 rounded bg-muted text-[10px] font-mono border">
                            {t}
                          </span>
                        ))}
                      </div>
                    </div>
                  </CardContent>

                  <CardFooter className="flex flex-col gap-2 border-t pt-3 bg-muted/10">
                    <Button
                      onClick={() => handleOpenAccount(account.id)}
                      className="w-full text-xs font-semibold gap-1.5"
                      variant={isActive ? "default" : "secondary"}
                    >
                      {isActive ? "Currently Viewing Dashboard" : "Open Sub-Account Dashboard"}
                      <ArrowRight className="h-3.5 w-3.5" />
                    </Button>

                    <div className="flex items-center justify-between w-full gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleOpenEditLevel(account)}
                        className="flex-1 text-[11px] gap-1 h-7"
                      >
                        <Sliders className="h-3 w-3" /> Adjust Risk Level
                      </Button>

                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDelete(account.id, account.name)}
                        className="text-muted-foreground hover:text-destructive h-7 px-2"
                        title="Delete Sub-Account"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </Button>
                    </div>
                  </CardFooter>
                </Card>
              );
            })}
          </div>
        </div>
      </main>

      {/* Create Dialog */}
      <CreateSubAccountDialog
        open={isCreateOpen}
        onOpenChange={setIsCreateOpen}
        onCreated={(newAcc) => {
          const updated = getSubAccounts();
          setSubAccounts(updated);
          setActiveId(newAcc.id);
          showFeedback(`New sub-account "${newAcc.name}" created with Level ${newAcc.riskLevel} strategy.`);
        }}
      />

      {/* Edit Risk Level Dialog (Rule 1 Enforced) */}
      <Dialog open={Boolean(editingAccount)} onOpenChange={(open) => !open && setEditingAccount(null)}>
        <DialogContent className="sm:max-w-md">
          {editingAccount && (
            <>
              <DialogHeader>
                <DialogTitle className="text-base font-bold flex items-center gap-2">
                  <Sliders className="h-4 w-4 text-primary" />
                  Adjust Risk Level: {editingAccount.name}
                </DialogTitle>
                <DialogDescription className="text-xs">
                  Change the assigned ETF strategy. <strong>Rule:</strong> Each risk level supports 1 sub-account.
                </DialogDescription>
              </DialogHeader>

              {editError && (
                <div className="rounded bg-destructive/10 border border-destructive/20 p-2 text-xs text-destructive flex items-center gap-1.5">
                  <AlertTriangle className="h-4 w-4 shrink-0" />
                  <span>{editError}</span>
                </div>
              )}

              <div className="space-y-2 py-2">
                {([1, 2, 3] as RiskLevel[]).map((lvl) => {
                  const p = RISK_PROFILES[lvl];
                  const occupiedBy = subAccounts.find((a) => a.riskLevel === lvl && a.id !== editingAccount.id);
                  const isOccupiedByOther = Boolean(occupiedBy);
                  const isSel = selectedEditLevel === lvl;

                  return (
                    <div
                      key={lvl}
                      onClick={() => {
                        if (!isOccupiedByOther) {
                          setSelectedEditLevel(lvl);
                          setEditError(null);
                        }
                      }}
                      className={`flex items-center justify-between p-2.5 rounded-lg border text-xs transition-all ${
                        isOccupiedByOther
                          ? "opacity-50 bg-muted/40 border-dashed cursor-not-allowed"
                          : isSel
                          ? `${p.borderClass} bg-primary/10 ring-1 ring-primary font-bold cursor-pointer`
                          : "border-border/60 hover:bg-muted cursor-pointer"
                      }`}
                    >
                      <div className="flex items-center gap-2 truncate">
                        {getProfileIcon(lvl)}
                        <div className="truncate">
                          <span>Level {lvl}: {p.strategyName}</span>
                          {isOccupiedByOther ? (
                            <span className="text-[10px] text-amber-600 dark:text-amber-400 font-medium flex items-center gap-1">
                              <Lock className="h-3 w-3" /> In Use by &quot;{occupiedBy?.name}&quot;
                            </span>
                          ) : (
                            <span className="text-[10px] text-muted-foreground block font-normal">{p.targetReturn}</span>
                          )}
                        </div>
                      </div>
                      <Badge className={p.badgeClass} variant="outline">
                        L{lvl}
                      </Badge>
                    </div>
                  );
                })}
              </div>

              <DialogFooter className="flex justify-end gap-2 border-t pt-3">
                <Button variant="outline" size="sm" onClick={() => setEditingAccount(null)} className="text-xs">
                  Cancel
                </Button>
                <Button size="sm" onClick={handleSaveRiskLevel} className="text-xs font-semibold">
                  Confirm & Apply Strategy
                </Button>
              </DialogFooter>
            </>
          )}
        </DialogContent>
      </Dialog>

      {/* Footer */}
      <footer className="border-t py-6 text-center text-xs text-muted-foreground bg-card/40">
        <div className="container max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-2">
          <p>© 2026 Gotti.ai — Intelligent Investment Portfolio Management</p>
          <div className="flex items-center gap-4">
            <Link href="/" className="hover:underline">Dashboard</Link>
            <Link href="/sub-accounts" className="hover:underline">Sub-Accounts Hub</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
