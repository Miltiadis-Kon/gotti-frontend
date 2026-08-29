"use client";

import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Users } from "lucide-react";
import { PeerBenchmarkData } from "@/lib/stock-evaluation-service";

interface PeerCompetitorsBenchmarkingProps {
  peers: PeerBenchmarkData[];
  targetTicker: string;
}

export function PeerCompetitorsBenchmarking({ peers, targetTicker }: PeerCompetitorsBenchmarkingProps) {
  if (!peers || peers.length === 0) {
    return null;
  }

  // Calculate peer median metrics (excluding target)
  const peerOnly = peers.filter((p) => p.ticker.toUpperCase() !== targetTicker.toUpperCase());
  const peList = peerOnly.map((p) => p.peRatio).filter((v): v is number => v !== undefined && v !== null && v > 0);
  const evList = peerOnly.map((p) => p.evEbitda).filter((v): v is number => v !== undefined && v !== null && v > 0);
  const roicList = peerOnly.map((p) => p.roic).filter((v): v is number => v !== undefined && v !== null);

  const medianPE = peList.length > 0 ? peList.sort((a, b) => a - b)[Math.floor(peList.length / 2)] : null;
  const medianEV = evList.length > 0 ? evList.sort((a, b) => a - b)[Math.floor(evList.length / 2)] : null;
  const medianROIC = roicList.length > 0 ? roicList.sort((a, b) => a - b)[Math.floor(roicList.length / 2)] : null;

  return (
    <Card className="border-border/60 bg-card/60 backdrop-blur-md shadow-sm">
      <CardHeader className="pb-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-primary/10 text-primary">
              <Users className="h-6 w-6" />
            </div>
            <div>
              <CardTitle className="text-xl font-bold tracking-tight">
                Direct Sector Competitors Benchmarking
              </CardTitle>
              <CardDescription className="text-xs sm:text-sm">
                TRBC / Refinitiv sector peer multiple comparisons, capital efficiency, and growth rankings
              </CardDescription>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Badge variant="outline" className="text-xs bg-muted/40 font-medium">
              {peers.length} Direct Competitors
            </Badge>
            <Badge variant="secondary" className="text-xs font-semibold">
              TRBC Sector Taxonomy
            </Badge>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Table of Peers */}
        <div className="rounded-xl border border-border/70 overflow-hidden bg-card/40">
          <Table>
            <TableHeader className="bg-muted/40">
              <TableRow>
                <TableHead className="w-[180px] font-semibold text-foreground">Ticker &amp; Company</TableHead>
                <TableHead className="text-right font-semibold text-foreground">Market Cap</TableHead>
                <TableHead className="text-right font-semibold text-foreground">Forward P/E</TableHead>
                <TableHead className="text-right font-semibold text-foreground">EV / EBITDA</TableHead>
                <TableHead className="text-right font-semibold text-foreground">ROIC %</TableHead>
                <TableHead className="text-right font-semibold text-foreground">YoY Rev Growth</TableHead>
                <TableHead className="text-right font-semibold text-foreground">Relative Valuation</TableHead>
              </TableRow>
            </TableHeader>

            <TableBody className="text-xs">
              {peers.map((peer) => {
                const isTarget = peer.ticker.toUpperCase() === targetTicker.toUpperCase() || peer.isTargetStock;

                return (
                  <TableRow
                    key={peer.ticker}
                    className={`transition-colors ${
                      isTarget
                        ? "bg-primary/10 hover:bg-primary/15 font-semibold text-foreground border-y-2 border-primary/40"
                        : "hover:bg-muted/20 text-muted-foreground"
                    }`}
                  >
                    <TableCell className="font-semibold text-foreground">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-sm tracking-tight">{peer.ticker}</span>
                        {isTarget ? (
                          <Badge className="bg-primary text-primary-foreground text-[10px] px-1.5 py-0 font-bold">
                            TARGET
                          </Badge>
                        ) : (
                          <span className="text-[11px] text-muted-foreground truncate max-w-[120px]">
                            {peer.name}
                          </span>
                        )}
                      </div>
                    </TableCell>

                    <TableCell className="text-right font-medium text-foreground">
                      {peer.marketCapFormatted}
                    </TableCell>

                    <TableCell className="text-right font-medium text-foreground">
                      {peer.peRatio !== undefined && peer.peRatio !== null ? `${peer.peRatio.toFixed(1)}x` : "N/A"}
                    </TableCell>

                    <TableCell className="text-right font-medium text-foreground">
                      {peer.evEbitda !== undefined && peer.evEbitda !== null ? `${peer.evEbitda.toFixed(1)}x` : "N/A"}
                    </TableCell>

                    <TableCell
                      className={`text-right font-semibold ${
                        peer.roic != null && peer.roic >= 15
                          ? "text-emerald-600 dark:text-emerald-400"
                          : peer.roic != null && peer.roic < 9.5
                          ? "text-rose-600 dark:text-rose-400"
                          : "text-foreground"
                      }`}
                    >
                      {peer.roic != null ? `${peer.roic.toFixed(1)}%` : "N/A"}
                    </TableCell>

                    <TableCell
                      className={`text-right font-medium ${
                        peer.revenueGrowth != null && peer.revenueGrowth >= 0
                          ? "text-emerald-500"
                          : "text-rose-500"
                      }`}
                    >
                      {peer.revenueGrowth != null
                        ? `${peer.revenueGrowth >= 0 ? "+" : ""}${peer.revenueGrowth.toFixed(1)}%`
                        : "N/A"}
                    </TableCell>

                    <TableCell className="text-right">
                      {isTarget ? (
                        <Badge
                          variant="outline"
                          className="bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/30 text-[10px] font-bold"
                        >
                          EVALUATED
                        </Badge>
                      ) : peer.peRatio && medianPE && peer.peRatio < medianPE ? (
                        <Badge variant="outline" className="bg-sky-500/10 text-sky-600 dark:text-sky-400 border-sky-500/30 text-[10px]">
                          Discount
                        </Badge>
                      ) : (
                        <Badge variant="outline" className="bg-muted text-muted-foreground text-[10px]">
                          In-Line
                        </Badge>
                      )}
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </div>

        {/* Peer Benchmark Summary Bar */}
        {(medianPE || medianEV || medianROIC) && (
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
            {medianPE && (
              <div className="p-3 rounded-lg bg-muted/30 border border-border/50 flex items-center justify-between text-xs">
                <span className="text-muted-foreground">Sector Median Forward P/E:</span>
                <span className="font-bold text-foreground">{medianPE.toFixed(1)}x</span>
              </div>
            )}

            {medianEV && (
              <div className="p-3 rounded-lg bg-muted/30 border border-border/50 flex items-center justify-between text-xs">
                <span className="text-muted-foreground">Sector Median EV/EBITDA:</span>
                <span className="font-bold text-foreground">{medianEV.toFixed(1)}x</span>
              </div>
            )}

            {medianROIC && (
              <div className="p-3 rounded-lg bg-muted/30 border border-border/50 flex items-center justify-between text-xs">
                <span className="text-muted-foreground">Sector Median ROIC:</span>
                <span className="font-bold text-foreground">{medianROIC.toFixed(1)}%</span>
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
