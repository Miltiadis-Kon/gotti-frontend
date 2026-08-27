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
                Your assigned risk level (Levels 1–3) dictates which of the 3 automated ETFs your capital is allocated to: <strong>Boomer Haven</strong> (Level 1), <strong>Steady Grind</strong> (Level 2), or <strong>Diamond Hands</strong> (Level 3).
              </p>
            </div>

            <div className="space-y-1 border-t pt-2">
              <strong className="text-foreground flex items-center gap-1.5 font-semibold">
                • 100% Automated Execution:
              </strong>
              <p className="pl-3">
                Asset selection, rebalancing, stop-losses, and order execution are performed algorithmically. Manual trading and custom overrides are disabled.
              </p>
            </div>

            <div className="space-y-1 border-t pt-2">
              <strong className="text-foreground flex items-center gap-1.5 font-semibold">
                • Segregated Multi-ETF Vaults:
              </strong>
              <p className="pl-3">
                You can invest in multiple ETFs simultaneously, but each operates as an independent portfolio vault and must be funded separately.
              </p>
            </div>

            <div className="space-y-1 border-t pt-2">
              <strong className="text-foreground flex items-center gap-1.5 font-semibold">
                • Real-Time Transparency:
              </strong>
              <p className="pl-3">
                Track live Net Asset Value (NAV), profit/loss, asset weightings, and historical performance metrics on your dashboard.
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
            <span>Risk Disclosure & Platform Terms</span>
          </div>

          <div className="grid gap-2.5 rounded-xl border border-amber-500/20 bg-amber-500/5 p-4 text-xs leading-relaxed text-muted-foreground">
            <div className="space-y-1">
              <strong className="text-foreground font-semibold">
                • Capital at Risk:
              </strong>
              <p className="pl-3">
                Financial markets carry inherent risk of capital loss. Historical backtests and model targets do not guarantee future yields.
              </p>
            </div>

            <div className="space-y-1 border-t border-amber-500/20 pt-2">
              <strong className="text-foreground font-semibold">
                • Algorithmic & System Disclaimer:
              </strong>
              <p className="pl-3">
                The platform operates systematically based on mathematical models. Platform operators and software developers accept <strong>no liability or responsibility</strong> for portfolio losses, drawdowns, market slippage, or exchange interruptions.
              </p>
            </div>

            <div className="space-y-1.5 border-t border-amber-500/20 pt-2">
              <strong className="text-foreground font-semibold">
                • Strategy-Specific Risk Profiles:
              </strong>
              <div className="pl-3 space-y-1.5">
                <div className="rounded-md bg-background/80 p-2 border border-border/60">
                  <span className="font-semibold text-emerald-600 dark:text-emerald-400">Level 1 (Boomer Haven):</span> Conservative / Capital Preservation targeting 5%–9% annualized yield with low volatility sensitivity (&beta; &lt; 0.75).
                </div>
                <div className="rounded-md bg-background/80 p-2 border border-border/60">
                  <span className="font-semibold text-indigo-600 dark:text-indigo-400">Level 2 (Steady Grind):</span> Moderate / Balanced Growth targeting 10%–18% annualized yield matching market benchmark beta (&beta; &asymp; 0.85 - 1.25).
                </div>
                <div className="rounded-md bg-background/80 p-2 border border-border/60">
                  <span className="font-semibold text-rose-600 dark:text-rose-400">Level 3 (Diamond Hands):</span> Aggressive / Speculative Alpha targeting 20%+ return via high-beta equities and breakout momentum (&beta; &gt; 1.35).
                </div>
              </div>
            </div>

            <div className="space-y-1 border-t border-amber-500/20 pt-2">
              <strong className="text-foreground font-semibold">
                • Discretionary Risk Capital:
              </strong>
              <p className="pl-3">
                Users must only invest capital they can afford to lose.
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
                The automated platform, operators, and developers accept <strong className="text-foreground">no liability or responsibility</strong> for financial losses, capital erosion, or missed market opportunities resulting from algorithm execution, market crashes, or model divergence.
              </p>
            </div>

            <div className="space-y-1 border-t pt-2">
              <strong className="text-foreground font-semibold">
                • Non-Advisory Status:
              </strong>
              <p className="pl-3">
                This platform is a quantitative execution technology. It does not provide personalized investment, tax, legal, or fiduciary advice.
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
                <strong className="text-primary font-semibold">Automated Execution:</strong> I understand that execution is 100% automated across my selected ETF(s) and manual order entry is disabled.
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
                <strong className="text-primary font-semibold">Independent Vaults:</strong> I acknowledge that each of the 3 strategy ETFs is an independent vault requiring separate funding.
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
                <strong className="text-primary font-semibold">Risk & Liability Waiver:</strong> I accept that trading involves substantial risk of loss and confirm the platform bears zero liability for portfolio drawdowns.
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
