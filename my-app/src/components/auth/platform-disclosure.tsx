"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import {
  Cpu,
  ShieldAlert,
  FileText,
  CheckCircle2,
  ArrowLeft,
  ArrowRight,
  AlertTriangle,
  Layers,
  BarChart3,
  Scale,
  Zap,
  Info
} from "lucide-react";

interface PlatformDisclosureProps {
  onAccept: () => void;
  onBack: () => void;
}

export function PlatformDisclosure({ onAccept, onBack }: PlatformDisclosureProps) {
  const [consentAutomated, setConsentAutomated] = useState(false);
  const [consentMultiEtf, setConsentMultiEtf] = useState(false);
  const [consentWaiver, setConsentWaiver] = useState(false);

  const allConsented = consentAutomated && consentMultiEtf && consentWaiver;

  const handleSelectAll = () => {
    const nextState = !allConsented;
    setConsentAutomated(nextState);
    setConsentMultiEtf(nextState);
    setConsentWaiver(nextState);
  };

  return (
    <Card className="w-full max-w-3xl border-border/60 shadow-xl backdrop-blur-sm bg-card/95">
      <CardHeader className="space-y-2 border-b pb-5">
        <div className="flex items-center justify-between">
          <Badge variant="outline" className="text-xs px-2.5 py-0.5 font-semibold text-primary border-primary/30 bg-primary/5">
            Step 2: Platform Architecture & Disclosures
          </Badge>
          <span className="text-xs text-muted-foreground font-medium">Mandatory Review</span>
        </div>
        <CardTitle className="text-2xl font-bold tracking-tight">
          How It Works, Risk Disclosure & System Disclaimers
        </CardTitle>
        <CardDescription className="text-sm">
          Please carefully review the platform architecture, risk disclosures, and terms before proceeding to the 10-question risk assessment.
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-6 pt-6 text-sm">
        {/* Section 1: How It Works & Platform Architecture */}
        <div className="space-y-3">
          <div className="flex items-center gap-2 text-foreground font-semibold text-base">
            <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-primary/10 text-primary">
              <Cpu className="h-4 w-4" />
            </div>
            <span>How It Works & Platform Architecture</span>
          </div>

          <div className="grid gap-2.5 rounded-xl border bg-muted/30 p-4 text-xs leading-relaxed text-muted-foreground">
            <div className="space-y-1">
              <strong className="text-foreground flex items-center gap-1.5 font-semibold">
                • Risk-Calibrated Portfolios:
              </strong>
              <p className="pl-3">
                Your selected risk level (Levels 1–5) dictates the mathematical asset universe, volatility boundaries, and target annualized return expectations of your strategy.
              </p>
            </div>

            <div className="space-y-1 border-t pt-2">
              <strong className="text-foreground flex items-center gap-1.5 font-semibold">
                • 100% Automated Execution:
              </strong>
              <p className="pl-3">
                All portfolio rebalancing, drift corrections, entry/exit executions, and risk management are handled algorithmically by systematic software. Manual order entry or custom trading overrides are strictly disabled.
              </p>
            </div>

            <div className="space-y-1 border-t pt-2">
              <strong className="text-foreground flex items-center gap-1.5 font-semibold">
                • Independent Multi-ETF Segregation:
              </strong>
              <p className="pl-3">
                You can run multiple strategy ETFs simultaneously (e.g., holding both a Level 1 Defensive ETF and a Level 4 Expansion ETF). Each ETF operates as a distinct, segregated sub-account requiring its own allocated capital and individual funding.
              </p>
            </div>

            <div className="space-y-1 border-t pt-2">
              <strong className="text-foreground flex items-center gap-1.5 font-semibold">
                • Real-Time Performance Dashboard:
              </strong>
              <p className="pl-3">
                You have continuous visibility into your portfolio’s Net Asset Value (NAV), current asset weightings, live unrealized/realized PnL, cash reserves, and historical yield metrics.
              </p>
            </div>

            <div className="space-y-1 border-t pt-2">
              <strong className="text-foreground flex items-center gap-1.5 font-semibold">
                • Systematic Capital Deployment:
              </strong>
              <p className="pl-3">
                When you deposit funds into an ETF, capital is systematically allocated across that strategy’s underlying basket based on real-time rebalancing rules.
              </p>
            </div>
          </div>
        </div>

        {/* Section 2: Risk Disclosure & Market Realities */}
        <div className="space-y-3">
          <div className="flex items-center gap-2 text-foreground font-semibold text-base">
            <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-amber-500/10 text-amber-600 dark:text-amber-400">
              <AlertTriangle className="h-4 w-4" />
            </div>
            <span>Risk Disclosure & Market Realities</span>
          </div>

          <div className="grid gap-2.5 rounded-xl border border-amber-500/20 bg-amber-500/5 p-4 text-xs leading-relaxed text-muted-foreground">
            <div className="space-y-1">
              <strong className="text-foreground font-semibold">
                • Capital at Risk:
              </strong>
              <p className="pl-3">
                Financial markets are inherently volatile. The value of your portfolio can fluctuate significantly, and you may lose some or all of your invested principal.
              </p>
            </div>

            <div className="space-y-1 border-t border-amber-500/20 pt-2">
              <strong className="text-foreground font-semibold">
                • No Performance Guarantees:
              </strong>
              <p className="pl-3">
                Target annual returns (e.g., 4% to 30%+) and historical backtest metrics are model projections designed for strategy calibration; they do not represent guaranteed outcomes or fixed yields.
              </p>
            </div>

            <div className="space-y-1.5 border-t border-amber-500/20 pt-2">
              <strong className="text-foreground font-semibold">
                • Strategy-Specific Volatility:
              </strong>
              <div className="pl-3 space-y-1.5">
                <div className="rounded-md bg-background/80 p-2 border border-border/60">
                  <span className="font-semibold text-emerald-600 dark:text-emerald-400">Levels 1–2:</span> Prioritize capital preservation and blue-chip stability but remain exposed to broad macroeconomic downturns.
                </div>
                <div className="rounded-md bg-background/80 p-2 border border-border/60">
                  <span className="font-semibold text-rose-600 dark:text-rose-400">Levels 4–5:</span> Allocate to high-beta equities, micro-caps, penny stocks, and momentum swings, carrying severe volatility and substantial maximum drawdown risks (potentially exceeding 20%–40% in adverse market cycles).
                </div>
              </div>
            </div>

            <div className="space-y-1 border-t border-amber-500/20 pt-2">
              <strong className="text-foreground font-semibold">
                • Execution & Liquidity Friction:
              </strong>
              <p className="pl-3">
                Portfolio performance may be impacted by market liquidity, bid-ask spreads, execution slippage, exchange connectivity, and unforeseen volatility spikes.
              </p>
            </div>
          </div>
        </div>

        {/* Section 3: Limitation of Liability & System Disclaimer */}
        <div className="space-y-3">
          <div className="flex items-center gap-2 text-foreground font-semibold text-base">
            <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-indigo-500/10 text-indigo-600 dark:text-indigo-400">
              <FileText className="h-4 w-4" />
            </div>
            <span>Limitation of Liability & System Disclaimer</span>
          </div>

          <div className="grid gap-2.5 rounded-xl border bg-muted/30 p-4 text-xs leading-relaxed text-muted-foreground">
            <div className="space-y-1">
              <strong className="text-foreground font-semibold">
                • Zero Financial Liability:
              </strong>
              <p className="pl-3">
                The automated bot, platform operators, and software developers accept <strong className="text-foreground">no liability or responsibility</strong> for financial losses, capital erosion, or missed market opportunities resulting from algorithm execution, market crashes, software interruptions, or model divergence.
              </p>
            </div>

            <div className="space-y-1 border-t pt-2">
              <strong className="text-foreground font-semibold">
                • Non-Advisory Status:
              </strong>
              <p className="pl-3">
                This platform is a technology execution tool providing automated model portfolios. It does not provide personalized investment, tax, legal, or fiduciary advice.
              </p>
            </div>

            <div className="space-y-1 border-t pt-2">
              <strong className="text-foreground font-semibold">
                • Sole User Responsibility:
              </strong>
              <p className="pl-3">
                You retain full, sole responsibility for selecting your risk tolerance profile, monitoring your accounts, and allocating only discretionary risk capital that you can afford to lose.
              </p>
            </div>
          </div>
        </div>

        {/* Section 4: Onboarding Consent Checkboxes */}
        <div className="space-y-3 pt-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-foreground font-semibold text-base">
              <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-primary/10 text-primary">
                <CheckCircle2 className="h-4 w-4" />
              </div>
              <span>Onboarding Consent Checkboxes</span>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleSelectAll}
              className="text-xs text-primary hover:text-primary/80"
            >
              {allConsented ? "Deselect All" : "Select All"}
            </Button>
          </div>

          <div className="space-y-3 rounded-xl border-2 border-primary/30 bg-card p-4 shadow-sm">
            {/* Checkbox 1 */}
            <div className="flex items-start space-x-3">
              <Checkbox
                id="consent-automated"
                checked={consentAutomated}
                onCheckedChange={(checked) => setConsentAutomated(Boolean(checked))}
                className="mt-0.5"
              />
              <label
                htmlFor="consent-automated"
                className="text-xs font-medium leading-relaxed text-foreground cursor-pointer"
              >
                <strong className="text-primary font-semibold">Automated Management:</strong> I understand that my portfolio will be executed 100% automatically by algorithmic models, and that manual trading is disabled.
              </label>
            </div>

            {/* Checkbox 2 */}
            <div className="flex items-start space-x-3 border-t pt-3">
              <Checkbox
                id="consent-multi-etf"
                checked={consentMultiEtf}
                onCheckedChange={(checked) => setConsentMultiEtf(Boolean(checked))}
                className="mt-0.5"
              />
              <label
                htmlFor="consent-multi-etf"
                className="text-xs font-medium leading-relaxed text-foreground cursor-pointer"
              >
                <strong className="text-primary font-semibold">Multi-ETF Funding:</strong> I understand that each strategy ETF operates independently and must be funded separately.
              </label>
            </div>

            {/* Checkbox 3 */}
            <div className="flex items-start space-x-3 border-t pt-3">
              <Checkbox
                id="consent-waiver"
                checked={consentWaiver}
                onCheckedChange={(checked) => setConsentWaiver(Boolean(checked))}
                className="mt-0.5"
              />
              <label
                htmlFor="consent-waiver"
                className="text-xs font-medium leading-relaxed text-foreground cursor-pointer"
              >
                <strong className="text-primary font-semibold">Risk & Liability Waiver:</strong> I acknowledge that trading involves substantial risk of loss, past performance does not guarantee future results, and the platform/bot is not liable for any portfolio losses incurred.
              </label>
            </div>
          </div>
        </div>
      </CardContent>

      <CardFooter className="flex flex-col sm:flex-row items-center justify-between gap-3 border-t bg-muted/20 pt-4">
        <Button variant="outline" size="sm" onClick={onBack} className="w-full sm:w-auto gap-1.5 text-xs">
          <ArrowLeft className="h-3.5 w-3.5" /> Back to Account Details
        </Button>

        <Button
          onClick={onAccept}
          disabled={!allConsented}
          className="w-full sm:w-auto gap-2 text-xs font-semibold"
        >
          {allConsented ? "I Consent & Continue to Risk Assessment" : "Check all 3 consent boxes to proceed"}
          <ArrowRight className="h-4 w-4" />
        </Button>
      </CardFooter>
    </Card>
  );
}
