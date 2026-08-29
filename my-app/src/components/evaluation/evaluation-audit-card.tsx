"use client";

import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CheckCircle2, AlertTriangle, Info, TrendingUp, ShieldCheck, Scale } from "lucide-react";
import { InstitutionalAuditData } from "@/lib/stock-evaluation-service";

interface EvaluationAuditCardProps {
  audit: InstitutionalAuditData;
  ticker: string;
}

export function EvaluationAuditCard({ audit, ticker }: EvaluationAuditCardProps) {
  const { passCount, flagCount, totalCheckpoints, recommendation, finalScore, confidence, auditItems, scenarioMatrix } = audit;

  const isBuy = recommendation.includes("BUY");
  const isSell = recommendation.includes("SELL");
  const isDistress = recommendation.includes("VETO");

  return (
    <div className="space-y-6">
      {/* Header Summary Card */}
      <Card className="border-border/60 bg-card/60 backdrop-blur-md shadow-sm">
        <CardHeader className="pb-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-primary/10 text-primary">
                <ShieldCheck className="h-6 w-6" />
              </div>
              <div>
                <CardTitle className="text-xl font-bold tracking-tight flex items-center gap-2">
                  8-Point Institutional Due Diligence Audit
                </CardTitle>
                <CardDescription className="text-xs sm:text-sm">
                  Rigorous institutional fundamental scoring and forensic risk checks for {ticker}
                </CardDescription>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-2.5">
              <Badge
                variant="outline"
                className={`px-3 py-1 text-sm font-semibold tracking-wide border ${
                  isBuy
                    ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/30"
                    : isSell || isDistress
                    ? "bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/30"
                    : "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/30"
                }`}
              >
                {recommendation}
              </Badge>

              <Badge
                variant="secondary"
                className="px-2.5 py-1 text-xs font-medium bg-muted/80 text-foreground"
              >
                Score: {finalScore >= 0 ? `+${finalScore.toFixed(2)}` : finalScore.toFixed(2)}
              </Badge>

              <Badge
                variant="outline"
                className="px-2.5 py-1 text-xs font-medium border-border"
              >
                Confidence: {(confidence * 100).toFixed(0)}%
              </Badge>

              <Badge
                className={`px-2.5 py-1 text-xs font-semibold ${
                  passCount >= 6
                    ? "bg-emerald-600 hover:bg-emerald-700 text-white"
                    : passCount >= 4
                    ? "bg-amber-600 hover:bg-amber-700 text-white"
                    : "bg-rose-600 hover:bg-rose-700 text-white"
                }`}
              >
                {passCount} / {totalCheckpoints} Passed
              </Badge>
            </div>
          </div>
        </CardHeader>

        <CardContent className="pt-0">
          {/* Progress bar */}
          <div className="w-full bg-muted/50 rounded-full h-2.5 mb-6 overflow-hidden">
            <div
              className={`h-2.5 rounded-full transition-all duration-500 ${
                passCount >= 6 ? "bg-emerald-500" : passCount >= 4 ? "bg-amber-500" : "bg-rose-500"
              }`}
              style={{ width: `${(passCount / totalCheckpoints) * 100}%` }}
            />
          </div>

          {/* 8 Audit Checkpoints Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3.5">
            {auditItems.map((item) => {
              const isPass = item.status === "PASS";
              const isFlag = item.status === "FLAG";

              return (
                <div
                  key={item.id}
                  className={`p-3.5 rounded-xl border transition-all flex flex-col justify-between ${
                    isPass
                      ? "bg-emerald-500/[0.03] border-emerald-500/20 hover:border-emerald-500/40"
                      : isFlag
                      ? "bg-rose-500/[0.03] border-rose-500/20 hover:border-rose-500/40"
                      : "bg-muted/20 border-border/60 hover:border-border"
                  }`}
                >
                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between gap-1.5">
                      <span className="font-semibold text-xs text-foreground truncate">{item.checkpoint}</span>
                      <Badge
                        variant="outline"
                        className={`text-[10px] px-1.5 py-0 font-bold uppercase tracking-wider ${
                          isPass
                            ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/30"
                            : isFlag
                            ? "bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/30"
                            : "bg-sky-500/10 text-sky-600 dark:text-sky-400 border-sky-500/30"
                        }`}
                      >
                        {isPass ? (
                          <span className="flex items-center gap-0.5">
                            <CheckCircle2 className="h-2.5 w-2.5" /> PASS
                          </span>
                        ) : isFlag ? (
                          <span className="flex items-center gap-0.5">
                            <AlertTriangle className="h-2.5 w-2.5" /> FLAG
                          </span>
                        ) : (
                          <span className="flex items-center gap-0.5">
                            <Info className="h-2.5 w-2.5" /> NEUTRAL
                          </span>
                        )}
                      </Badge>
                    </div>

                    <p className="text-[11px] text-muted-foreground leading-relaxed line-clamp-2">
                      {item.criteria}
                    </p>
                  </div>

                  <div className="pt-2 mt-2 border-t border-border/40">
                    <p className="text-[11px] font-medium text-foreground/90 truncate" title={item.details}>
                      {item.details}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* 3-Scenario Probability-Weighted Valuation */}
      {scenarioMatrix && (
        <Card className="border-border/60 bg-card/60 backdrop-blur-md shadow-sm">
          <CardHeader className="pb-3">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-lg bg-blue-500/10 text-blue-500">
                  <Scale className="h-5 w-5" />
                </div>
                <div>
                  <CardTitle className="text-base font-semibold">
                    3-Scenario Probability-Weighted Valuation &amp; Reverse DCF
                  </CardTitle>
                  <CardDescription className="text-xs">
                    Current Price: <span className="font-semibold text-foreground">${scenarioMatrix.currentPrice.toFixed(2)}</span> • Expected Value: <span className="font-semibold text-emerald-500">${scenarioMatrix.expectedValue.toFixed(2)}</span> ({scenarioMatrix.expectedReturnPct >= 0 ? `+${scenarioMatrix.expectedReturnPct.toFixed(1)}%` : `${scenarioMatrix.expectedReturnPct.toFixed(1)}%`})
                  </CardDescription>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <Badge variant="outline" className="text-xs bg-muted/40 font-medium">
                  Win/Loss: {scenarioMatrix.winLossRatio.toFixed(2)} : 1
                </Badge>
                <Badge
                  className={`text-xs font-semibold ${
                    scenarioMatrix.asymmetryGrade.includes("Favorable")
                      ? "bg-emerald-600 text-white"
                      : "bg-amber-600 text-white"
                  }`}
                >
                  {scenarioMatrix.asymmetryGrade}
                </Badge>
              </div>
            </div>
          </CardHeader>

          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5">
              {/* Bull Case */}
              <div className="p-3.5 rounded-xl border border-emerald-500/20 bg-emerald-500/[0.04] space-y-1.5">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider">
                    Bull Scenario ({(scenarioMatrix.bull.prob * 100).toFixed(0)}% Prob)
                  </span>
                  <Badge variant="outline" className="text-[10px] text-emerald-600 dark:text-emerald-400 border-emerald-500/30">
                    +{scenarioMatrix.bull.gainPct.toFixed(1)}%
                  </Badge>
                </div>
                <div className="text-xl font-bold text-foreground">
                  ${scenarioMatrix.bull.target.toFixed(2)}
                </div>
                <p className="text-[11px] text-muted-foreground">
                  Sustained pricing power, high gross margins, and upside estimate revisions.
                </p>
              </div>

              {/* Base Case */}
              <div className="p-3.5 rounded-xl border border-sky-500/20 bg-sky-500/[0.04] space-y-1.5">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-sky-600 dark:text-sky-400 uppercase tracking-wider">
                    Base Scenario ({(scenarioMatrix.base.prob * 100).toFixed(0)}% Prob)
                  </span>
                  <Badge variant="outline" className="text-[10px] text-sky-600 dark:text-sky-400 border-sky-500/30">
                    +{scenarioMatrix.base.gainPct.toFixed(1)}%
                  </Badge>
                </div>
                <div className="text-xl font-bold text-foreground">
                  ${scenarioMatrix.base.target.toFixed(2)}
                </div>
                <p className="text-[11px] text-muted-foreground">
                  Consensus revenue trajectory meeting guided baseline targets.
                </p>
              </div>

              {/* Bear Case */}
              <div className="p-3.5 rounded-xl border border-rose-500/20 bg-rose-500/[0.04] space-y-1.5">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-rose-600 dark:text-rose-400 uppercase tracking-wider">
                    Bear Scenario ({(scenarioMatrix.bear.prob * 100).toFixed(0)}% Prob)
                  </span>
                  <Badge variant="outline" className="text-[10px] text-rose-600 dark:text-rose-400 border-rose-500/30">
                    {scenarioMatrix.bear.lossPct.toFixed(1)}%
                  </Badge>
                </div>
                <div className="text-xl font-bold text-foreground">
                  ${scenarioMatrix.bear.target.toFixed(2)}
                </div>
                <p className="text-[11px] text-muted-foreground">
                  Multiple compression, competitive pricing pressure, or macro deceleration.
                </p>
              </div>
            </div>

            {/* Reverse DCF Note */}
            {scenarioMatrix.reverseDcfImpliedGrowth !== undefined && (
              <div className="mt-3.5 p-2.5 rounded-lg bg-muted/40 border border-border/50 flex flex-col sm:flex-row items-start sm:items-center justify-between text-xs gap-2">
                <span className="text-muted-foreground">
                  <strong className="text-foreground">Reverse DCF Hurdle:</strong> Market implies{" "}
                  <span className="font-semibold text-primary">{scenarioMatrix.reverseDcfImpliedGrowth.toFixed(1)}%</span> 5-Year CAGR to justify current price.
                </span>
                {scenarioMatrix.expectationGapPct !== undefined && (
                  <Badge variant="secondary" className="text-[11px] font-medium">
                    Expectation Gap: {scenarioMatrix.expectationGapPct >= 0 ? `+${scenarioMatrix.expectationGapPct.toFixed(1)}%` : `${scenarioMatrix.expectationGapPct.toFixed(1)}%`}
                  </Badge>
                )}
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
}
