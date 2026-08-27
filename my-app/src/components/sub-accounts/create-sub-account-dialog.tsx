"use client";

import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import {
  ShieldCheck,
  TrendingUp,
  Scale,
  Zap,
  Flame,
  PlusCircle,
  DollarSign,
  Sparkles,
  AlertTriangle,
  Lock
} from "lucide-react";
import { RISK_PROFILES, createSubAccount, getSubAccounts, getAvailableRiskLevels } from "@/lib/risk-assessment-data";
import { RiskLevel, SubAccount } from "@/types/risk-profile";

interface CreateSubAccountDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onCreated: (newAccount: SubAccount) => void;
}

export function CreateSubAccountDialog({ open, onOpenChange, onCreated }: CreateSubAccountDialogProps) {
  const [subAccounts, setSubAccounts] = useState<SubAccount[]>([]);
  const [riskLevel, setRiskLevel] = useState<RiskLevel>(2);
  const [capital, setCapital] = useState("10000");
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (open) {
      const existing = getSubAccounts();
      setSubAccounts(existing);
      const available = getAvailableRiskLevels();
      if (available.length > 0) {
        setRiskLevel(available[0]);
      }
      setError(null);
    }
  }, [open]);

  const occupiedMap = new Map<number, string>();
  subAccounts.forEach((acc) => {
    occupiedMap.set(acc.riskLevel, acc.name);
  });

  const isAllOccupied = subAccounts.length >= 3;
  const selectedProfile = RISK_PROFILES[riskLevel];

  const getProfileIcon = (level: RiskLevel, className = "h-4 w-4") => {
    switch (level) {
      case 1: return <ShieldCheck className={`${className} text-emerald-500`} />;
      case 2: return <TrendingUp className={`${className} text-indigo-500`} />;
      case 3: return <Flame className={`${className} text-rose-500`} />;
    }
  };

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (isAllOccupied) {
      setError("Maximum 3/3 sub-accounts reached (1 per Risk Level 1–3).");
      return;
    }

    if (occupiedMap.has(riskLevel)) {
      setError(`Rule 1: Level ${riskLevel} is already active (${occupiedMap.get(riskLevel)}). Only 1 sub-account allowed per risk level.`);
      return;
    }

    const numCapital = parseFloat(capital.replace(/[^0-9.]/g, ""));
    if (isNaN(numCapital) || numCapital < 100) {
      setError("Minimum allocated capital is $100.");
      return;
    }

    try {
      const autoAccountName = `Level ${riskLevel}: ${selectedProfile.strategyName}`;
      const newAcc = createSubAccount(autoAccountName, riskLevel, numCapital);
      setCapital("10000");
      onOpenChange(false);
      onCreated(newAcc);
    } catch (err: any) {
      setError(err.message || "Failed to create sub-account.");
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-xl max-h-[90vh] overflow-y-auto">
        <DialogHeader className="space-y-1">
          <div className="flex items-center gap-2 text-primary font-bold text-base">
            <PlusCircle className="h-5 w-5" />
            <DialogTitle>Create New ETF Sub-Account</DialogTitle>
          </div>
          <DialogDescription className="text-xs">
            Open a dedicated sub-account. <strong>Rule:</strong> Each Risk Level (1–3) supports exactly 1 active sub-account.
          </DialogDescription>
        </DialogHeader>

        {isAllOccupied ? (
          <div className="space-y-4 py-4">
            <div className="rounded-xl border border-amber-500/30 bg-amber-500/10 p-4 text-xs text-amber-900 dark:text-amber-300 space-y-2">
              <div className="flex items-center gap-2 font-bold text-sm">
                <AlertTriangle className="h-5 w-5 text-amber-500" />
                All 3 Risk Level Sub-Accounts Are Currently Active
              </div>
              <p className="leading-relaxed">
                Under <strong>Rule 1</strong>, you can maintain at most one sub-account per risk level (Levels 1 to 3). All 3 slots are currently occupied. To launch a different strategy, delete or adjust an existing sub-account in the Hub.
              </p>
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" size="sm" onClick={() => onOpenChange(false)} className="w-full text-xs">
                Close
              </Button>
            </DialogFooter>
          </div>
        ) : (
          <form onSubmit={handleCreate} className="space-y-4 py-2 text-xs">
            {error && (
              <div className="rounded-lg bg-destructive/10 border border-destructive/20 p-2.5 text-xs text-destructive font-medium flex items-center gap-2">
                <AlertTriangle className="h-4 w-4 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            {/* Risk Level & Strategy Selection (Rule 1 Enforced) */}
            <div className="space-y-2 pt-1">
              <div className="flex items-center justify-between">
                <Label className="text-xs font-semibold">Select Strategy Risk Level</Label>
                <span className="text-[11px] text-muted-foreground font-medium">1 Sub-Account per Level</span>
              </div>

              <div className="grid gap-2">
                {([1, 2, 3] as RiskLevel[]).map((lvl) => {
                  const p = RISK_PROFILES[lvl];
                  const occupiedByName = occupiedMap.get(lvl);
                  const isOccupied = Boolean(occupiedByName);
                  const isSelected = riskLevel === lvl && !isOccupied;

                  return (
                    <div
                      key={lvl}
                      onClick={() => {
                        if (!isOccupied) setRiskLevel(lvl);
                      }}
                      className={`flex items-center justify-between p-2.5 rounded-lg border transition-all ${
                        isOccupied
                          ? "opacity-50 bg-muted/40 border-dashed cursor-not-allowed"
                          : isSelected
                          ? `${p.borderClass} bg-primary/10 ring-1 ring-primary shadow-xs cursor-pointer`
                          : "border-border/60 hover:bg-muted/50 cursor-pointer"
                      }`}
                    >
                      <div className="flex items-center gap-2.5 truncate">
                        {getProfileIcon(lvl)}
                        <div className="truncate">
                          <div className="flex items-center gap-2">
                            <strong className="text-xs font-bold text-foreground">
                              Level {lvl}: {p.strategyName}
                            </strong>
                            <Badge className={p.badgeClass} variant="outline">
                              {p.targetReturn}
                            </Badge>
                          </div>
                          {isOccupied ? (
                            <span className="text-[10px] text-amber-600 dark:text-amber-400 font-medium flex items-center gap-1 mt-0.5">
                              <Lock className="h-3 w-3" /> Already Active
                            </span>
                          ) : (
                            <p className="text-[11px] text-muted-foreground line-clamp-1 mt-0.5">
                              {p.assetUniverse}
                            </p>
                          )}
                        </div>
                      </div>

                      <div className="shrink-0 ml-2">
                        {isOccupied ? (
                          <Badge variant="outline" className="text-[9px] text-muted-foreground border-dashed">
                            Active
                          </Badge>
                        ) : (
                          <div className={`h-4 w-4 rounded-full border flex items-center justify-center ${
                            isSelected ? "border-primary bg-primary text-primary-foreground" : "border-muted-foreground"
                          }`}>
                            {isSelected && <div className="h-1.5 w-1.5 rounded-full bg-background" />}
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Initial Capital Allocation */}
            <div className="space-y-1.5">
              <Label htmlFor="subacc-capital" className="text-xs font-semibold">Allocated Initial Capital ($ USD)</Label>
              <div className="relative">
                <DollarSign className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  id="subacc-capital"
                  type="number"
                  min="1"
                  step="any"
                  placeholder="10000"
                  value={capital}
                  onChange={(e) => setCapital(e.target.value)}
                  className="pl-8 text-xs font-mono font-semibold"
                  required
                />
              </div>
            </div>

            {/* Selected Strategy Summary Preview */}
            <div className={`rounded-lg border-2 p-3 ${selectedProfile.borderClass} bg-card space-y-1.5 text-xs`}>
              <div className="flex items-center justify-between">
                <span className="font-semibold text-foreground">
                  Sub-Account: Level {selectedProfile.level} • {selectedProfile.strategyName}
                </span>
                <Badge className={selectedProfile.badgeClass}>
                  Target: {selectedProfile.targetReturn}
                </Badge>
              </div>
              <p className="text-muted-foreground text-[11px]">
                {selectedProfile.description}
              </p>
              <div className="flex flex-wrap gap-1 pt-1">
                {selectedProfile.sampleTickers.map((t) => (
                  <span key={t} className="px-1.5 py-0.5 rounded bg-muted text-[10px] font-mono border">
                    {t}
                  </span>
                ))}
              </div>
            </div>

            <DialogFooter className="flex flex-col-reverse sm:flex-row sm:justify-end gap-2 border-t pt-3">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => onOpenChange(false)}
                className="text-xs"
              >
                Cancel
              </Button>
              <Button type="submit" size="sm" className="text-xs font-semibold gap-1.5">
                <Sparkles className="h-3.5 w-3.5" /> Launch Level {selectedProfile.level} Sub-Account
              </Button>
            </DialogFooter>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
}
