"use client";

import React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { RiskProfile } from "@/types/risk-profile";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  CheckCircle2,
  ShieldCheck,
  TrendingUp,
  Scale,
  Zap,
  Flame,
  ArrowRight,
  RotateCcw,
  Sparkles,
  PieChart,
  Target
} from "lucide-react";

interface ProfileSummaryProps {
  email: string;
  assignedProfile: RiskProfile;
  score?: number;
  onRetake: () => void;
}

export function ProfileSummary({ email, assignedProfile, score, onRetake }: ProfileSummaryProps) {
  const router = useRouter();

  const getProfileIcon = () => {
    switch (assignedProfile.level) {
      case 1:
        return <ShieldCheck className="h-7 w-7 text-emerald-500" />;
      case 2:
        return <TrendingUp className="h-7 w-7 text-sky-500" />;
      case 3:
        return <Scale className="h-7 w-7 text-indigo-500" />;
      case 4:
        return <Zap className="h-7 w-7 text-amber-500" />;
      case 5:
        return <Flame className="h-7 w-7 text-rose-500" />;
    }
  };

  return (
    <Card className="w-full max-w-2xl border-2 shadow-2xl overflow-hidden bg-card">
      <div
        className="h-3 w-full"
        style={{ backgroundColor: assignedProfile.color }}
      />
      <CardHeader className="text-center pb-4 pt-6 space-y-2">
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-muted/80 border shadow-inner">
          {getProfileIcon()}
        </div>
        <div className="space-y-1">
          <Badge className="bg-primary/10 text-primary border-primary/20 hover:bg-primary/20">
            <CheckCircle2 className="h-3.5 w-3.5 mr-1" /> Registration & Profile Complete
          </Badge>
          <CardTitle className="text-2xl sm:text-3xl font-bold tracking-tight">
            Welcome to Gotti.ai!
          </CardTitle>
          <CardDescription className="text-sm">
            Your account <strong className="text-foreground">{email}</strong> has been configured with an automated ETF strategy.
          </CardDescription>
        </div>
      </CardHeader>

      <CardContent className="space-y-6 pt-2">
        {/* Strategy Profile Spotlight */}
        <div className={`rounded-xl border-2 p-5 ${assignedProfile.borderClass} bg-card/70 space-y-4 shadow-sm`}>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b pb-3">
            <div>
              <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Assigned Strategy Profile
              </span>
              <h3 className="text-xl font-bold text-foreground flex items-center gap-2 mt-0.5">
                Level {assignedProfile.level}: {assignedProfile.strategyName}
              </h3>
            </div>
            <div className="flex items-center gap-2">
              <Badge className={assignedProfile.badgeClass}>
                Target: {assignedProfile.targetReturn}
              </Badge>
            </div>
          </div>

          <div className="grid gap-3 sm:grid-cols-2 text-xs">
            <div className="rounded-lg bg-muted/40 p-3 border">
              <span className="text-muted-foreground block text-[11px] font-medium mb-1">
                Underlying Asset Universe
              </span>
              <p className="font-medium text-foreground leading-relaxed">
                {assignedProfile.assetUniverse}
              </p>
            </div>
            <div className="rounded-lg bg-muted/40 p-3 border">
              <span className="text-muted-foreground block text-[11px] font-medium mb-1">
                Turnover & Holding Model
              </span>
              <p className="font-medium text-foreground leading-relaxed">
                {assignedProfile.turnoverStrategy}
              </p>
            </div>
          </div>

          <div>
            <span className="text-muted-foreground block text-xs font-medium mb-2">
              Sample Model Portfolio Holdings:
            </span>
            <div className="flex flex-wrap gap-2">
              {assignedProfile.sampleTickers.map((ticker) => (
                <div
                  key={ticker}
                  className="flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-muted font-mono text-xs font-semibold border"
                >
                  <Target className="h-3 w-3 text-muted-foreground" />
                  {ticker}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Feature summary */}
        <div className="grid gap-3 sm:grid-cols-3 text-xs text-center">
          <div className="rounded-lg border p-3 bg-muted/20">
            <Sparkles className="h-4 w-4 mx-auto mb-1 text-primary" />
            <strong className="block text-foreground">Deep RL Models</strong>
            <span className="text-muted-foreground text-[11px]">Dynamic rebalancing aligned to Level {assignedProfile.level}</span>
          </div>
          <div className="rounded-lg border p-3 bg-muted/20">
            <PieChart className="h-4 w-4 mx-auto mb-1 text-primary" />
            <strong className="block text-foreground">Automated Execution</strong>
            <span className="text-muted-foreground text-[11px]">Systematic order routing and risk hedging</span>
          </div>
          <div className="rounded-lg border p-3 bg-muted/20">
            <ShieldCheck className="h-4 w-4 mx-auto mb-1 text-primary" />
            <strong className="block text-foreground">Adaptive Risk Shield</strong>
            <span className="text-muted-foreground text-[11px]">Real-time drawdown limit monitoring</span>
          </div>
        </div>
      </CardContent>

      <CardFooter className="flex flex-col sm:flex-row gap-3 border-t bg-muted/20 pt-4">
        <Button variant="outline" onClick={onRetake} className="w-full sm:w-auto gap-1.5 text-xs">
          <RotateCcw className="h-3.5 w-3.5" /> Adjust Risk Level
        </Button>
        <Button
          onClick={() => router.push("/")}
          className="w-full sm:flex-1 gap-2 text-sm font-medium"
        >
          Enter Gotti Dashboard <ArrowRight className="h-4 w-4" />
        </Button>
      </CardFooter>
    </Card>
  );
}
