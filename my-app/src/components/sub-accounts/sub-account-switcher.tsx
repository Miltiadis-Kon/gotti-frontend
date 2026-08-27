"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  ShieldCheck,
  TrendingUp,
  Scale,
  Zap,
  Flame,
  ChevronDown,
  PlusCircle,
  Layers,
  Check,
  ArrowUpRight
} from "lucide-react";
import { RiskLevel, SubAccount } from "@/types/risk-profile";
import { RISK_PROFILES, getSubAccounts, setActiveSubAccountId } from "@/lib/risk-assessment-data";
import { CreateSubAccountDialog } from "./create-sub-account-dialog";

interface SubAccountSwitcherProps {
  activeAccount: SubAccount;
  onAccountSwitched: (newAccount: SubAccount) => void;
  className?: string;
}

export function SubAccountSwitcher({ activeAccount, onAccountSwitched, className = "" }: SubAccountSwitcherProps) {
  const [subAccounts, setSubAccounts] = useState<SubAccount[]>(getSubAccounts());
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const router = useRouter();

  const getProfileIcon = (level: RiskLevel, className = "h-3.5 w-3.5") => {
    switch (level) {
      case 1: return <ShieldCheck className={`${className} text-emerald-500`} />;
      case 2: return <TrendingUp className={`${className} text-indigo-500`} />;
      case 3: return <Flame className={`${className} text-rose-500`} />;
    }
  };

  const handleSelectAccount = (account: SubAccount) => {
    setActiveSubAccountId(account.id);
    onAccountSwitched(account);
  };

  const handleAccountCreated = (newAcc: SubAccount) => {
    const updated = getSubAccounts();
    setSubAccounts(updated);
    onAccountSwitched(newAcc);
  };

  const activeProfile = RISK_PROFILES[activeAccount.riskLevel];

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="outline"
            className={`flex items-center justify-between gap-2 h-9 px-2.5 text-xs bg-background/95 hover:bg-muted/80 border-border/80 ${className}`}
          >
            <div className="flex items-center gap-1.5 truncate">
              {getProfileIcon(activeAccount.riskLevel)}
              <span className="font-bold text-foreground truncate max-w-[120px] sm:max-w-[160px]">
                {activeProfile.strategyName}
              </span>
              <Badge className={`${activeProfile.badgeClass} px-1.5 py-0 text-[10px]`}>
                L{activeAccount.riskLevel}
              </Badge>
            </div>
            <ChevronDown className="h-3.5 w-3.5 text-muted-foreground shrink-0 opacity-60" />
          </Button>
        </DropdownMenuTrigger>

        <DropdownMenuContent align="start" className="w-72 p-1.5">
          <div className="px-2 py-1.5 flex items-center justify-between">
            <span className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">
              Segregated Sub-Accounts ({subAccounts.length})
            </span>
            <Link href="/sub-accounts" className="text-[11px] text-primary hover:underline font-medium flex items-center gap-0.5">
              View Hub <ArrowUpRight className="h-3 w-3" />
            </Link>
          </div>
          <DropdownMenuSeparator />

          <div className="max-h-60 overflow-y-auto space-y-1">
            {[...subAccounts]
              .sort((a, b) => a.riskLevel - b.riskLevel)
              .map((acc) => {
                const profile = RISK_PROFILES[acc.riskLevel];
              const isActive = acc.id === activeAccount.id;
              return (
                <DropdownMenuItem
                  key={acc.id}
                  onClick={() => handleSelectAccount(acc)}
                  className={`flex items-center justify-between p-2 rounded-md cursor-pointer ${
                    isActive ? "bg-primary/10 font-semibold" : ""
                  }`}
                >
                  <div className="flex items-start gap-2 truncate">
                    <div className="mt-0.5">{getProfileIcon(acc.riskLevel)}</div>
                    <div className="truncate">
                      {/* Top Line: Strategy Name + Level Badge */}
                      <div className="flex items-center gap-1.5">
                        <span className="truncate text-xs font-bold text-foreground">
                          {profile.strategyName}
                        </span>
                        <Badge className={`${profile.badgeClass} text-[9px] px-1 py-0`} variant="outline">
                          L{acc.riskLevel}
                        </Badge>
                      </div>
                      {/* Bottom Line: NAV Balance + Yield Target */}
                      <span className="text-[10px] text-muted-foreground block truncate mt-0.5">
                        NAV: ${acc.currentValue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })} • {profile.targetReturn}
                      </span>
                    </div>
                  </div>
                  {isActive && <Check className="h-3.5 w-3.5 text-primary shrink-0 ml-2" />}
                </DropdownMenuItem>
              );
            })}
          </div>

          <DropdownMenuSeparator />

          <DropdownMenuItem
            onClick={() => setIsCreateOpen(true)}
            className="flex items-center gap-2 text-primary font-semibold text-xs cursor-pointer p-2 rounded-md hover:bg-primary/10"
          >
            <PlusCircle className="h-4 w-4" />
            <span>Create New Sub-Account</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <CreateSubAccountDialog
        open={isCreateOpen}
        onOpenChange={setIsCreateOpen}
        onCreated={handleAccountCreated}
      />
    </>
  );
}
