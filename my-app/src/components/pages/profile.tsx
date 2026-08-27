"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ShieldCheck,
  TrendingUp,
  Scale,
  Zap,
  Flame,
  User,
  Sliders,
  RotateCcw,
  CheckCircle2,
  Lock,
  Mail,
  Target,
  AlertTriangle,
  ArrowRight,
  Sparkles
} from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RISK_PROFILES, getStoredUser, storeUser } from "@/lib/risk-assessment-data";
import { RiskLevel } from "@/types/risk-profile";

export function ProfileContent() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<"strategy" | "account" | "security">("strategy");
  const [userEmail, setUserEmail] = useState("investor@gotti.ai");
  const [riskLevel, setRiskLevel] = useState<RiskLevel>(2);
  const [riskScore, setRiskScore] = useState<number | undefined>(24);
  const [savedSuccess, setSavedSuccess] = useState(false);

  // Pop-up confirmation state for switching risk level
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [pendingLevel, setPendingLevel] = useState<RiskLevel | null>(null);

  useEffect(() => {
    const stored = getStoredUser();
    if (stored) {
      if (stored.email) setUserEmail(stored.email);
      if (stored.riskLevel) setRiskLevel(stored.riskLevel);
      if (stored.riskScore) setRiskScore(stored.riskScore);
    }
  }, []);

  const activeProfile = RISK_PROFILES[riskLevel];
  const pendingProfile = pendingLevel ? RISK_PROFILES[pendingLevel] : null;

  // Open confirmation pop-up if choosing a different level
  const handleInitiateLevelChange = (newLevel: RiskLevel) => {
    if (newLevel === riskLevel) return;
    setPendingLevel(newLevel);
    setIsConfirmOpen(true);
  };

  // Confirm and apply the risk level change
  const handleConfirmLevelChange = () => {
    if (!pendingLevel) return;
    setRiskLevel(pendingLevel);
    storeUser({
      email: userEmail,
      riskLevel: pendingLevel,
      riskScore: riskScore
    });
    setIsConfirmOpen(false);
    setPendingLevel(null);
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3500);
  };

  const getProfileIcon = (level: RiskLevel, className = "h-5 w-5") => {
    switch (level) {
      case 1: return <ShieldCheck className={`${className} text-emerald-500`} />;
      case 2: return <TrendingUp className={`${className} text-indigo-500`} />;
      case 3: return <Flame className={`${className} text-rose-500`} />;
    }
  };

  return (
    <div className="flex min-h-screen w-full flex-col">
      <div className="flex flex-1 flex-col gap-4 bg-muted/20 p-4 md:gap-8 md:p-8">
        <div className="mx-auto grid w-full max-w-6xl gap-2">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h1 className="text-3xl font-bold tracking-tight">Account & Strategy Settings</h1>
              <p className="text-sm text-muted-foreground">
                Manage your risk profile, automated ETF strategy, and login credentials.
              </p>
            </div>
            <Link href="/signup">
              <Button variant="outline" className="gap-2 text-xs">
                <RotateCcw className="h-3.5 w-3.5" /> Re-take 10-Q Risk Assessment
              </Button>
            </Link>
          </div>
        </div>

        <div className="mx-auto grid w-full max-w-6xl items-start gap-6 md:grid-cols-[200px_1fr] lg:grid-cols-[240px_1fr]">
          <nav className="grid gap-2 text-sm text-muted-foreground">
            <button
              onClick={() => setActiveTab("strategy")}
              className={`flex items-center gap-2.5 rounded-lg px-3 py-2 text-left font-medium transition-all ${
                activeTab === "strategy"
                  ? "bg-primary text-primary-foreground shadow-sm"
                  : "hover:bg-muted text-foreground"
              }`}
            >
              <Sliders className="h-4 w-4" /> Risk & ETF Strategy
            </button>
            <button
              onClick={() => setActiveTab("account")}
              className={`flex items-center gap-2.5 rounded-lg px-3 py-2 text-left font-medium transition-all ${
                activeTab === "account"
                  ? "bg-primary text-primary-foreground shadow-sm"
                  : "hover:bg-muted text-foreground"
              }`}
            >
              <User className="h-4 w-4" /> Account Profile
            </button>
            <button
              onClick={() => setActiveTab("security")}
              className={`flex items-center gap-2.5 rounded-lg px-3 py-2 text-left font-medium transition-all ${
                activeTab === "security"
                  ? "bg-primary text-primary-foreground shadow-sm"
                  : "hover:bg-muted text-foreground"
              }`}
            >
              <Lock className="h-4 w-4" /> Security & Password
            </button>
          </nav>

          <div className="grid gap-6">
            {activeTab === "strategy" && (
              <>
                {/* Active Strategy Card */}
                <Card className={`border-2 ${activeProfile.borderClass} shadow-md overflow-hidden bg-card`}>
                  <div className="h-2 w-full" style={{ backgroundColor: activeProfile.color }} />
                  <CardHeader className="pb-4">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                      <div className="flex items-center gap-2">
                        {getProfileIcon(activeProfile.level)}
                        <CardTitle className="text-xl font-bold">
                          Level {activeProfile.level}: {activeProfile.strategyName}
                        </CardTitle>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge className={activeProfile.badgeClass}>
                          Target: {activeProfile.targetReturn}
                        </Badge>
                        <Badge variant="outline" className="text-xs">
                          Active Strategy
                        </Badge>
                      </div>
                    </div>
                    <CardDescription className="text-sm pt-1">
                      {activeProfile.description}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4 text-xs pt-0">
                    <div className="grid gap-3 sm:grid-cols-2 rounded-lg bg-muted/40 p-3.5 border">
                      <div>
                        <span className="text-muted-foreground block text-[11px] font-medium mb-1">
                          Underlying Asset Universe
                        </span>
                        <p className="font-medium text-foreground leading-relaxed">
                          {activeProfile.assetUniverse}
                        </p>
                      </div>
                      <div>
                        <span className="text-muted-foreground block text-[11px] font-medium mb-1">
                          Turnover & Holding Strategy
                        </span>
                        <p className="font-medium text-foreground leading-relaxed">
                          {activeProfile.turnoverStrategy}
                        </p>
                      </div>
                    </div>

                    <div>
                      <span className="text-muted-foreground block text-xs font-medium mb-2">
                        Model ETF Portfolio Holdings:
                      </span>
                      <div className="flex flex-wrap gap-1.5">
                        {activeProfile.sampleTickers.map((ticker) => (
                          <span
                            key={ticker}
                            className="flex items-center gap-1 px-2.5 py-1 rounded bg-muted font-mono text-xs font-semibold border"
                          >
                            <Target className="h-3 w-3 text-muted-foreground" />
                            {ticker}
                          </span>
                        ))}
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Switch Risk Level Quick Selector */}
                <Card>
                  <CardHeader>
                    <CardTitle>Adjust Your Risk Profile Level</CardTitle>
                    <CardDescription>
                      Click any of the 3 Risk Level & ETF profiles below to switch your automated trading allocation. A confirmation prompt will verify your selection.
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    {([1, 2, 3] as RiskLevel[]).map((lvl) => {
                      const p = RISK_PROFILES[lvl];
                      const isSelected = riskLevel === lvl;
                      return (
                        <div
                          key={lvl}
                          onClick={() => handleInitiateLevelChange(lvl)}
                          className={`flex items-center justify-between p-3.5 rounded-xl border cursor-pointer transition-all ${
                            isSelected
                              ? `${p.borderClass} bg-primary/10 ring-1 ring-primary shadow-sm`
                              : "border-border/60 hover:bg-muted/50 hover:border-border"
                          }`}
                        >
                          <div className="flex items-center gap-3">
                            {getProfileIcon(lvl)}
                            <div>
                              <div className="flex items-center gap-2">
                                <strong className="text-sm font-bold text-foreground">
                                  Level {lvl}: {p.strategyName}
                                </strong>
                                <Badge className={p.badgeClass} variant="outline">
                                  {p.targetReturn}
                                </Badge>
                              </div>
                              <p className="text-xs text-muted-foreground mt-0.5 line-clamp-1">
                                {p.assetUniverse}
                              </p>
                            </div>
                          </div>
                          <Button
                            size="sm"
                            variant={isSelected ? "default" : "outline"}
                            className="text-xs shrink-0 ml-2"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleInitiateLevelChange(lvl);
                            }}
                          >
                            {isSelected ? "Active Profile" : "Switch to Level " + lvl}
                          </Button>
                        </div>
                      );
                    })}

                    {savedSuccess && (
                      <div className="flex items-center gap-2 text-emerald-600 dark:text-emerald-400 text-xs font-semibold pt-2 bg-emerald-500/10 p-2.5 rounded-lg border border-emerald-500/20">
                        <CheckCircle2 className="h-4 w-4" /> Strategy profile switched successfully to Level {riskLevel}: {activeProfile.strategyName}!
                      </div>
                    )}
                  </CardContent>
                  <CardFooter className="border-t pt-4 flex justify-between">
                    <Link href="/signup">
                      <Button variant="secondary" size="sm" className="gap-1.5 text-xs">
                        <RotateCcw className="h-3.5 w-3.5" /> Full 10-Question Assessment
                      </Button>
                    </Link>
                  </CardFooter>
                </Card>
              </>
            )}

            {activeTab === "account" && (
              <Card>
                <CardHeader>
                  <CardTitle>Account Details</CardTitle>
                  <CardDescription>
                    Your registered email address and primary portfolio preferences.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="email">Registered Email</Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="email"
                        value={userEmail}
                        onChange={(e) => setUserEmail(e.target.value)}
                        className="pl-9"
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="account-type">Portfolio Mode</Label>
                    <Input id="account-type" defaultValue="Automated Deep RL & ETF Execution" disabled />
                  </div>
                </CardContent>
                <CardFooter className="border-t px-6 py-4">
                  <Button size="sm" onClick={() => {
                    storeUser({ email: userEmail, riskLevel, riskScore });
                    setSavedSuccess(true);
                    setTimeout(() => setSavedSuccess(false), 3000);
                  }}>
                    Save Account Changes
                  </Button>
                </CardFooter>
              </Card>
            )}

            {activeTab === "security" && (
              <Card>
                <CardHeader>
                  <CardTitle>Password & Security</CardTitle>
                  <CardDescription>
                    Update your account password and security settings.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="current-pass">Current Password</Label>
                    <Input id="current-pass" type="password" placeholder="••••••••" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="new-pass">New Password</Label>
                    <Input id="new-pass" type="password" placeholder="••••••••" />
                  </div>
                </CardContent>
                <CardFooter className="border-t px-6 py-4">
                  <Button size="sm">Update Password</Button>
                </CardFooter>
              </Card>
            )}
          </div>
        </div>
      </div>

      {/* Confirmation Dialog Pop-up for Switching Risk Level */}
      <Dialog open={isConfirmOpen} onOpenChange={setIsConfirmOpen}>
        <DialogContent className="sm:max-w-lg border-2">
          {pendingProfile && (
            <>
              <DialogHeader className="space-y-2">
                <div className="flex items-center gap-2 text-amber-600 dark:text-amber-400">
                  <AlertTriangle className="h-5 w-5" />
                  <DialogTitle className="text-lg font-bold">
                    Confirm Risk Strategy Switch
                  </DialogTitle>
                </div>
                <DialogDescription className="text-xs text-muted-foreground">
                  Are you sure you want to change your active automated ETF portfolio strategy? Please review the calibration changes below.
                </DialogDescription>
              </DialogHeader>

              <div className="space-y-4 py-2 text-xs">
                {/* Comparison Card */}
                <div className="grid grid-cols-11 items-center gap-2 rounded-xl border bg-muted/40 p-3">
                  {/* Current */}
                  <div className="col-span-5 space-y-1">
                    <span className="text-[10px] uppercase font-semibold text-muted-foreground block">
                      Current Strategy
                    </span>
                    <div className="flex items-center gap-1.5 font-bold text-foreground">
                      {getProfileIcon(activeProfile.level, "h-4 w-4")}
                      <span>Level {activeProfile.level}</span>
                    </div>
                    <p className="text-[11px] text-muted-foreground truncate">{activeProfile.strategyName}</p>
                    <Badge variant="outline" className="text-[10px] mt-0.5">
                      {activeProfile.targetReturn}
                    </Badge>
                  </div>

                  {/* Arrow */}
                  <div className="col-span-1 flex justify-center text-primary">
                    <ArrowRight className="h-4 w-4" />
                  </div>

                  {/* New Pending */}
                  <div className="col-span-5 space-y-1">
                    <span className="text-[10px] uppercase font-semibold text-primary block">
                      New Strategy
                    </span>
                    <div className="flex items-center gap-1.5 font-bold text-foreground">
                      {getProfileIcon(pendingProfile.level, "h-4 w-4")}
                      <span>Level {pendingProfile.level}</span>
                    </div>
                    <p className="text-[11px] text-foreground font-semibold truncate">{pendingProfile.strategyName}</p>
                    <Badge className={pendingProfile.badgeClass}>
                      {pendingProfile.targetReturn}
                    </Badge>
                  </div>
                </div>

                {/* New Strategy Details */}
                <div className="rounded-xl border p-3 bg-card space-y-2 text-xs">
                  <div>
                    <span className="text-muted-foreground block text-[11px] font-medium">New Asset Universe:</span>
                    <p className="font-semibold text-foreground">{pendingProfile.assetUniverse}</p>
                  </div>
                  <div className="border-t pt-1.5">
                    <span className="text-muted-foreground block text-[11px] font-medium">New Turnover & Holding Strategy:</span>
                    <p className="text-foreground">{pendingProfile.turnoverStrategy}</p>
                  </div>
                  <div className="border-t pt-1.5">
                    <span className="text-muted-foreground block text-[11px] font-medium mb-1">Sample Model Holdings:</span>
                    <div className="flex flex-wrap gap-1">
                      {pendingProfile.sampleTickers.map((t) => (
                        <span key={t} className="px-1.5 py-0.5 rounded bg-muted text-[10px] font-mono border">
                          {t}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Important Notice */}
                <div className="rounded-lg bg-amber-500/10 border border-amber-500/20 p-2.5 text-[11px] text-amber-800 dark:text-amber-300 space-y-0.5">
                  <strong>Rebalancing Notice:</strong> Switching to Level {pendingProfile.level} ({pendingProfile.strategyName}) will immediately re-calibrate your automated risk thresholds and upcoming systematic trade allocations.
                </div>
              </div>

              <DialogFooter className="flex flex-col-reverse sm:flex-row sm:justify-end gap-2 border-t pt-3">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    setIsConfirmOpen(false);
                    setPendingLevel(null);
                  }}
                  className="text-xs"
                >
                  Cancel
                </Button>
                <Button
                  size="sm"
                  onClick={handleConfirmLevelChange}
                  className="text-xs font-semibold gap-1.5 bg-primary"
                >
                  <Sparkles className="h-3.5 w-3.5" /> Confirm & Switch to Level {pendingProfile.level}
                </Button>
              </DialogFooter>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
