"use client";

import Link from "next/link";
import Image from "next/image";
import {
  Bell,
  CircleUser,
  Home,
  Menu,
  Gauge,
  Search,
  UserRound,
  Landmark,
  Banknote,
  ShieldCheck,
  TrendingUp,
  Scale,
  Zap,
  Flame,
  UserPlus,
  Sliders,
  Layers,
  ChevronDown,
  ArrowUpRight,
  LogOut
} from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Sheet, SheetClose, SheetContent, SheetTrigger } from "@/components/ui/sheet";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

import { DashboardContent } from "@/components/pages/dashboard";
import { TradesContent } from "@/components/pages/portfolio";
import EvaluationContent from "@/components/pages/evaluation";
import { AddFundsContent } from "@/components/pages/addFunds";
import { ProfileContent } from "@/components/pages/profile";
import {
  RISK_PROFILES,
  getStoredUser,
  getSubAccounts,
  getActiveSubAccountId,
  setActiveSubAccountId,
  DEFAULT_SUB_ACCOUNTS,
  isUserLoggedIn,
  logoutUser
} from "@/lib/risk-assessment-data";
import { RiskLevel, SubAccount } from "@/types/risk-profile";
import { SubAccountSwitcher } from "@/components/sub-accounts/sub-account-switcher";

export default function Dashboard() {
  const [view, setView] = useState("dashboard");
  const [activeLink, setActiveLink] = useState("dashboard");
  const [subAccounts, setSubAccounts] = useState<SubAccount[]>(DEFAULT_SUB_ACCOUNTS);
  const [activeSubAccount, setActiveSubAccount] = useState<SubAccount>(DEFAULT_SUB_ACCOUNTS[0]);
  const [userEmail, setUserEmail] = useState<string>("investor@gotti.ai");
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(true);
  const router = useRouter();

  useEffect(() => {
    const accs = getSubAccounts();
    setSubAccounts(accs);
    const activeId = getActiveSubAccountId();
    const current = accs.find((a) => a.id === activeId) || accs[0] || DEFAULT_SUB_ACCOUNTS[0];
    setActiveSubAccount(current);

    const stored = getStoredUser();
    if (stored?.email) {
      setUserEmail(stored.email);
      setIsLoggedIn(true);
    } else {
      setIsLoggedIn(isUserLoggedIn());
    }
  }, []);

  const handleSubAccountSwitched = (account: SubAccount) => {
    setActiveSubAccount(account);
    const all = getSubAccounts();
    setSubAccounts(all);
  };

  const handleSignOut = () => {
    logoutUser();
    setIsLoggedIn(false);
    router.push("/signup");
  };

  const activeProfile = RISK_PROFILES[activeSubAccount.riskLevel];

  const getProfileIcon = (level: RiskLevel) => {
    switch (level) {
      case 1: return <ShieldCheck className="h-3.5 w-3.5 text-emerald-500" />;
      case 2: return <TrendingUp className="h-3.5 w-3.5 text-indigo-500" />;
      case 3: return <Flame className="h-3.5 w-3.5 text-rose-500" />;
    }
  };

  const renderContent = () => {
    switch (view) {
      case "dashboard":
        return <DashboardContent />;
      case "trades":
        return <TradesContent />;
      case "evaluation":
        return <EvaluationContent />;
      case "addFunds":
        return <AddFundsContent />;
      case "profile":
        return <ProfileContent />;
      default:
        return <DashboardContent />;
    }
  };

  const handleLinkClick = (viewName: string) => {
    setActiveLink(viewName);
    setView(viewName);
  };

  const getLinkClass = (viewName: string) => {
    return activeLink === viewName
      ? "flex items-center gap-3 rounded-lg px-3 py-2 bg-muted text-foreground font-semibold transition-all hover:text-primary"
      : "flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary";
  };

  const getLinkClassMobile = (viewName: string) => {
    return activeLink === viewName
      ? "mx-[-0.65rem] flex items-center gap-4 rounded-xl px-3 py-2 text-foreground font-semibold bg-muted hover:text-foreground"
      : "mx-[-0.65rem] flex items-center gap-4 rounded-xl px-3 py-2 text-muted-foreground hover:text-foreground";
  };

  return (
    <div className="grid min-h-screen w-full md:grid-cols-[220px_1fr] lg:grid-cols-[280px_1fr]">
      {/* Sidebar Desktop */}
      <div className="hidden border-r bg-muted/40 md:block">
        <div className="flex h-full max-h-screen flex-col gap-2">
          <div className="flex h-14 items-center border-b px-4 lg:h-[60px] lg:px-6">
            <Link
              href="/"
              className="flex items-center gap-2 font-bold text-base"
              onClick={() => handleLinkClick("dashboard")}
            >
              <Image src="/icons/face.ico" alt="Gotti" width={28} height={28} />
              <span>Gotti<span className="text-primary">.ai</span></span>
            </Link>
            <Button variant="outline" size="icon" className="ml-auto h-8 w-8">
              <Bell className="h-4 w-4" />
              <span className="sr-only">Toggle notifications</span>
            </Button>
          </div>

          {/* Sub-Account Switcher Widget */}
          <div className="px-3 pt-2">
            <div className="space-y-1">
              <div className="flex items-center justify-between px-1 text-[11px] text-muted-foreground">
                <span className="font-semibold uppercase tracking-wider">Sub-Account Context:</span>
                <Link href="/sub-accounts" className="text-primary hover:underline text-[11px] font-medium flex items-center gap-0.5">
                  Hub <ArrowUpRight className="h-3 w-3" />
                </Link>
              </div>
              <SubAccountSwitcher
                activeAccount={activeSubAccount}
                onAccountSwitched={handleSubAccountSwitched}
                className="w-full"
              />
            </div>
          </div>

          {/* Navigation Links */}
          <div className="flex-1">
            <nav className="grid items-start px-2 text-sm font-medium lg:px-4 space-y-1 mt-2">
              <Link
                href="#"
                className={getLinkClass("dashboard")}
                onClick={() => handleLinkClick("dashboard")}
              >
                <Home className="h-4 w-4" />
                Dashboard
              </Link>
              <Link
                href="#"
                className={getLinkClass("trades")}
                onClick={() => handleLinkClick("trades")}
              >
                <Banknote className="h-4 w-4" />
                Portfolio
                <Badge className="ml-auto flex h-5 w-5 shrink-0 items-center justify-center rounded-full text-[11px]">
                  5
                </Badge>
              </Link>
              <Link
                href="/sub-accounts"
                className="flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary"
              >
                <Layers className="h-4 w-4" />
                Sub-Accounts Hub
                <Badge variant="secondary" className="ml-auto flex h-5 px-1.5 shrink-0 items-center justify-center rounded-full text-[10px]">
                  {subAccounts.length}/3
                </Badge>
              </Link>
              <Link
                href="#"
                className={getLinkClass("evaluation")}
                onClick={() => handleLinkClick("evaluation")}
              >
                <Gauge className="h-4 w-4" />
                Stock Evaluation
              </Link>
              <Link
                href="#"
                className={getLinkClass("addFunds")}
                onClick={() => handleLinkClick("addFunds")}
              >
                <Landmark className="h-4 w-4" />
                Add Funds
              </Link>
              <Link
                href="#"
                className={getLinkClass("profile")}
                onClick={() => handleLinkClick("profile")}
              >
                <UserRound className="h-4 w-4" />
                Profile & Risk
              </Link>
            </nav>
          </div>

          <div className="mt-auto p-4 space-y-3">
            <Link href="/sub-accounts">
              <Button variant="outline" size="sm" className="w-full gap-1.5 text-xs">
                <Layers className="h-3.5 w-3.5" /> Manage {subAccounts.length}/3 Sub-Accounts
              </Button>
            </Link>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex flex-col">
        <header className="flex h-14 items-center gap-3 border-b bg-muted/40 px-4 lg:h-[60px] lg:px-6">
          <Sheet>
            <SheetTrigger asChild>
              <Button
                variant="outline"
                size="icon"
                className="shrink-0 md:hidden"
              >
                <Menu className="h-5 w-5" />
                <span className="sr-only">Toggle navigation menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="flex flex-col">
              <nav className="grid gap-2 text-lg font-medium">
                <Link
                  href="#"
                  className="flex items-center gap-2 text-lg font-semibold"
                  onClick={() => handleLinkClick("dashboard")}
                >
                  <Image src="/icons/face.ico" alt="Gotti" width={28} height={28} />
                  <span>Gotti<span className="text-primary">.ai</span></span>
                </Link>

                {/* Mobile ETF Strategy Selector Widget */}
                <div className="py-2.5 my-1 border-y space-y-1.5">
                  <div className="flex items-center justify-between text-[11px] text-muted-foreground px-0.5">
                    <span className="font-semibold uppercase tracking-wider">Active ETF Strategy:</span>
                    <Link href="/sub-accounts" className="text-primary hover:underline text-[11px] font-medium flex items-center gap-0.5">
                      Hub <ArrowUpRight className="h-3 w-3" />
                    </Link>
                  </div>
                  <SubAccountSwitcher
                    activeAccount={activeSubAccount}
                    onAccountSwitched={handleSubAccountSwitched}
                    className="w-full justify-between"
                  />
                </div>

                <SheetClose asChild>
                  <Link
                    href="#"
                    className={getLinkClassMobile("dashboard")}
                    onClick={() => handleLinkClick("dashboard")}
                  >
                    <Home className="h-5 w-5" />
                    Dashboard
                  </Link>
                </SheetClose>
                <SheetClose asChild>
                  <Link
                    href="#"
                    className={getLinkClassMobile("trades")}
                    onClick={() => handleLinkClick("trades")}
                  >
                    <Banknote className="h-5 w-5" />
                    Portfolio
                  </Link>
                </SheetClose>
                <SheetClose asChild>
                  <Link
                    href="/sub-accounts"
                    className="mx-[-0.65rem] flex items-center gap-4 rounded-xl px-3 py-2 text-muted-foreground hover:text-foreground"
                  >
                    <Layers className="h-5 w-5" />
                    Sub-Accounts Hub ({subAccounts.length}/3)
                  </Link>
                </SheetClose>
                <SheetClose asChild>
                  <Link
                    href="#"
                    className={getLinkClassMobile("evaluation")}
                    onClick={() => handleLinkClick("evaluation")}
                  >
                    <Gauge className="h-5 w-5" />
                    Evaluation
                  </Link>
                </SheetClose>
                <SheetClose asChild>
                  <Link
                    href="#"
                    className={getLinkClassMobile("addFunds")}
                    onClick={() => handleLinkClick("addFunds")}
                  >
                    <Landmark className="h-5 w-5" />
                    Add Funds
                  </Link>
                </SheetClose>
                <SheetClose asChild>
                  <Link
                    href="#"
                    className={getLinkClassMobile("profile")}
                    onClick={() => handleLinkClick("profile")}
                  >
                    <UserRound className="h-5 w-5" />
                    Profile & Risk
                  </Link>
                </SheetClose>
              </nav>
              <div className="mt-auto space-y-2">
                <Link href="/sub-accounts">
                  <Button className="w-full text-xs gap-1.5">
                    <Layers className="h-3.5 w-3.5" /> Sub-Accounts Hub ({subAccounts.length}/3)
                  </Button>
                </Link>
              </div>
            </SheetContent>
          </Sheet>

          <div className="w-full flex-1">
            <form>
              <div className="relative max-w-md">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  type="search"
                  placeholder="Search tickers, models, equities..."
                  className="w-full appearance-none bg-background pl-8 shadow-none text-xs"
                />
              </div>
            </form>
          </div>

          {/* Rule 2: Only show Sign Up button if user is NOT logged in */}
          {!isLoggedIn && (
            <Link href="/signup">
              <Button size="sm" variant="default" className="text-xs gap-1.5">
                <UserPlus className="h-3.5 w-3.5" /> Sign Up
              </Button>
            </Link>
          )}

          {/* User Profile Avatar Dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="secondary" size="icon" className="rounded-full ring-2 ring-primary/20 hover:ring-primary/40">
                <CircleUser className="h-5 w-5" />
                <span className="sr-only">Toggle user menu</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuLabel className="font-normal text-xs text-muted-foreground">
                Signed in as <strong className="text-foreground block truncate">{userEmail}</strong>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => handleLinkClick("profile")} className="text-xs cursor-pointer">
                Profile & Risk Settings
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => router.push("/sub-accounts")} className="text-xs cursor-pointer">
                Manage Sub-Accounts ({subAccounts.length}/3)
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => router.push("/orders")} className="text-xs cursor-pointer">
                Trade Orders
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={handleSignOut} className="text-xs text-destructive focus:text-destructive cursor-pointer flex items-center gap-1.5">
                <LogOut className="h-3.5 w-3.5" /> Sign Out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </header>

        <main className="flex flex-1 flex-col gap-4 p-4 lg:gap-6 lg:p-6">
          <div className="w-full">
            {renderContent()}
          </div>
        </main>
      </div>
    </div>
  );
}
