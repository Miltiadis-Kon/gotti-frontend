"use client";

import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { BarChart3 } from "lucide-react";
import { QuarterlyReportData } from "@/lib/stock-evaluation-service";

interface QuarterlyFinancialsMatrixProps {
  quarters: QuarterlyReportData[];
  ticker: string;
}

export function QuarterlyFinancialsMatrix({ quarters, ticker }: QuarterlyFinancialsMatrixProps) {
  if (!quarters || quarters.length === 0) {
    return null;
  }

  return (
    <Card className="border-border/60 bg-card/60 backdrop-blur-md shadow-sm">
      <CardHeader className="pb-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-primary/10 text-primary">
              <BarChart3 className="h-6 w-6" />
            </div>
            <div>
              <CardTitle className="text-xl font-bold tracking-tight">
                Past 3 Quarters Financial Matrix &amp; Earnings History
              </CardTitle>
              <CardDescription className="text-xs sm:text-sm">
                Quarterly revenue trajectory, operating margins, cash conversion, and consensus surprise performance for {ticker}
              </CardDescription>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Badge variant="outline" className="text-xs bg-muted/40 font-medium">
              3-Quarter Horizon
            </Badge>
            <Badge variant="secondary" className="text-xs font-semibold">
              Refinitiv / SEC EDGAR Audited
            </Badge>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* 3 Quarter Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {quarters.map((q, idx) => {
            const isBeat = q.surpriseGrade.includes("BEAT");
            const isMiss = q.surpriseGrade.includes("MISS");
            const isPass = q.verdictBadge === "PASS";

            return (
              <div
                key={idx}
                className="p-4 rounded-xl border border-border/70 bg-muted/20 hover:bg-muted/30 transition-all space-y-3"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <span className="font-bold text-sm text-foreground">{q.quarterLabel}</span>
                    <p className="text-[10px] text-muted-foreground">Ended {q.periodEndDate}</p>
                  </div>
                  <Badge
                    variant="outline"
                    className={`text-[11px] font-bold ${
                      isPass
                        ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/30"
                        : q.verdictBadge === "FLAG"
                        ? "bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/30"
                        : "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/30"
                    }`}
                  >
                    {q.evaluationVerdict}
                  </Badge>
                </div>

                <div className="grid grid-cols-2 gap-2 pt-1 border-t border-border/40 text-xs">
                  <div>
                    <span className="text-[10px] text-muted-foreground block">Revenue</span>
                    <span className="font-semibold text-foreground text-sm">{q.revenueFormatted}</span>
                    {q.yoyRevGrowth !== undefined && (
                      <span
                        className={`text-[10px] font-medium block ${
                          q.yoyRevGrowth >= 0 ? "text-emerald-500" : "text-rose-500"
                        }`}
                      >
                        {q.yoyRevGrowth >= 0 ? `+${q.yoyRevGrowth.toFixed(1)}% YoY` : `${q.yoyRevGrowth.toFixed(1)}% YoY`}
                      </span>
                    )}
                  </div>

                  <div>
                    <span className="text-[10px] text-muted-foreground block">EPS vs Consensus</span>
                    <span className="font-semibold text-foreground text-sm">
                      {q.epsActual !== undefined ? `$${q.epsActual.toFixed(2)}` : "N/A"}
                    </span>
                    <Badge
                      variant="secondary"
                      className={`text-[10px] px-1.5 py-0 font-bold block w-fit mt-0.5 ${
                        isBeat
                          ? "bg-emerald-500/15 text-emerald-600 dark:text-emerald-400"
                          : isMiss
                          ? "bg-rose-500/15 text-rose-600 dark:text-rose-400"
                          : "bg-muted text-muted-foreground"
                      }`}
                    >
                      {q.surpriseGrade}
                    </Badge>
                  </div>
                </div>

                <div className="pt-2 border-t border-border/40 space-y-1 text-[11px]">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Operating Margin:</span>
                    <span className="font-medium text-foreground">{q.operatingMargin.toFixed(1)}%</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Free Cash Flow:</span>
                    <span className="font-medium text-foreground">
                      ${(q.fcf / 1e9).toFixed(2)}B ({q.fcfMargin.toFixed(1)}%)
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Margin Delta:</span>
                    <span
                      className={`font-medium ${
                        q.marginDeltaBps && q.marginDeltaBps >= 0 ? "text-emerald-500" : "text-rose-500"
                      }`}
                    >
                      {q.marginTrajectory}
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Detailed Metrics Comparison Table */}
        <div className="rounded-xl border border-border/70 overflow-hidden bg-card/40">
          <Table>
            <TableHeader className="bg-muted/40">
              <TableRow>
                <TableHead className="w-[240px] font-semibold text-foreground">Financial Matrix Metric</TableHead>
                {quarters.map((q, idx) => (
                  <TableHead key={idx} className="text-right font-semibold text-foreground">
                    {q.quarterLabel}
                  </TableHead>
                ))}
              </TableRow>
            </TableHeader>

            <TableBody className="text-xs">
              <TableRow className="hover:bg-muted/20">
                <TableCell className="font-medium text-foreground">Total Revenue</TableCell>
                {quarters.map((q, idx) => (
                  <TableCell key={idx} className="text-right font-semibold">
                    {q.revenueFormatted}
                  </TableCell>
                ))}
              </TableRow>

              <TableRow className="hover:bg-muted/20">
                <TableCell className="text-muted-foreground">YoY Top-Line Growth</TableCell>
                {quarters.map((q, idx) => (
                  <TableCell
                    key={idx}
                    className={`text-right font-medium ${
                      q.yoyRevGrowth !== undefined && q.yoyRevGrowth >= 0 ? "text-emerald-500" : "text-rose-500"
                    }`}
                  >
                    {q.yoyRevGrowth !== undefined ? `${q.yoyRevGrowth >= 0 ? "+" : ""}${q.yoyRevGrowth.toFixed(1)}%` : "N/A"}
                  </TableCell>
                ))}
              </TableRow>

              <TableRow className="hover:bg-muted/20">
                <TableCell className="text-muted-foreground">QoQ Revenue Growth</TableCell>
                {quarters.map((q, idx) => (
                  <TableCell
                    key={idx}
                    className={`text-right font-medium ${
                      q.qoqRevGrowth !== undefined && q.qoqRevGrowth >= 0 ? "text-emerald-500" : "text-rose-500"
                    }`}
                  >
                    {q.qoqRevGrowth !== undefined ? `${q.qoqRevGrowth >= 0 ? "+" : ""}${q.qoqRevGrowth.toFixed(1)}%` : "N/A"}
                  </TableCell>
                ))}
              </TableRow>

              <TableRow className="hover:bg-muted/20">
                <TableCell className="font-medium text-foreground">Gross Profit Margin</TableCell>
                {quarters.map((q, idx) => (
                  <TableCell key={idx} className="text-right font-medium">
                    {q.grossMargin.toFixed(1)}%
                  </TableCell>
                ))}
              </TableRow>

              <TableRow className="hover:bg-muted/20">
                <TableCell className="font-medium text-foreground">Operating Margin (EBIT)</TableCell>
                {quarters.map((q, idx) => (
                  <TableCell key={idx} className="text-right font-semibold text-primary">
                    {q.operatingMargin.toFixed(1)}%
                  </TableCell>
                ))}
              </TableRow>

              <TableRow className="hover:bg-muted/20">
                <TableCell className="text-muted-foreground">Net Profit Margin</TableCell>
                {quarters.map((q, idx) => (
                  <TableCell key={idx} className="text-right font-medium">
                    {q.netMargin.toFixed(1)}%
                  </TableCell>
                ))}
              </TableRow>

              <TableRow className="hover:bg-muted/20">
                <TableCell className="font-medium text-foreground">Free Cash Flow (FCF)</TableCell>
                {quarters.map((q, idx) => (
                  <TableCell key={idx} className="text-right font-semibold text-emerald-600 dark:text-emerald-400">
                    ${(q.fcf / 1e9).toFixed(2)}B
                  </TableCell>
                ))}
              </TableRow>

              <TableRow className="hover:bg-muted/20">
                <TableCell className="text-muted-foreground">FCF Margin %</TableCell>
                {quarters.map((q, idx) => (
                  <TableCell key={idx} className="text-right font-medium">
                    {q.fcfMargin.toFixed(1)}%
                  </TableCell>
                ))}
              </TableRow>

              <TableRow className="hover:bg-muted/20">
                <TableCell className="text-muted-foreground">Cash Conversion Quality</TableCell>
                {quarters.map((q, idx) => (
                  <TableCell key={idx} className="text-right text-[11px] font-medium text-muted-foreground">
                    {q.cashQualityVerdict}
                  </TableCell>
                ))}
              </TableRow>

              <TableRow className="hover:bg-muted/20">
                <TableCell className="font-medium text-foreground">Consensus EPS Beat/Miss</TableCell>
                {quarters.map((q, idx) => (
                  <TableCell key={idx} className="text-right">
                    <Badge
                      variant="outline"
                      className={`text-[10px] font-bold ${
                        q.surpriseGrade.includes("BEAT")
                          ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/30"
                          : q.surpriseGrade.includes("MISS")
                          ? "bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/30"
                          : "bg-muted text-muted-foreground"
                      }`}
                    >
                      {q.surpriseGrade}
                    </Badge>
                  </TableCell>
                ))}
              </TableRow>
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
}
