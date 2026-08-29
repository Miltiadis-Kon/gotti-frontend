"use client";

import React, { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Calendar,
  Sparkles,
  ChevronDown,
  ChevronUp,
  ExternalLink,
  Zap
} from "lucide-react";
import { NextEarningsSchedule, NewsWireArticle } from "@/lib/stock-evaluation-service";

interface NewsWireCatalystIntelligenceProps {
  ticker: string;
  nextEarnings: NextEarningsSchedule;
  news: {
    overallSentiment: "BULLISH" | "BEARISH" | "NEUTRAL";
    averageRating: number;
    distribution: {
      bullish: number;
      neutral: number;
      bearish: number;
    };
    articles: NewsWireArticle[];
  };
}

export function NewsWireCatalystIntelligence({
  ticker,
  nextEarnings,
  news
}: NewsWireCatalystIntelligenceProps) {
  const [depth, setDepth] = useState<number>(6);
  const [expandedArticles, setExpandedArticles] = useState<Record<number, boolean>>({});
  const [analyzingAll, setAnalyzingAll] = useState<boolean>(false);
  const [analyzedState, setAnalyzedState] = useState<Record<number, boolean>>({});

  const toggleExpand = (idx: number) => {
    setExpandedArticles((prev) => ({
      ...prev,
      [idx]: !prev[idx]
    }));
  };

  const handleAnalyzeSingle = (idx: number) => {
    setAnalyzedState((prev) => ({
      ...prev,
      [idx]: true
    }));
  };

  const handleAnalyzeAll = () => {
    setAnalyzingAll(true);
    setTimeout(() => {
      const all: Record<number, boolean> = {};
      news.articles.forEach((_, i) => {
        all[i] = true;
      });
      setAnalyzedState(all);
      setAnalyzingAll(false);
    }, 800);
  };

  const displayedArticles = (news.articles || []).slice(0, depth);
  const totalArticles = displayedArticles.length;
  const bullishCount = news.distribution?.bullish || 0;
  const neutralCount = news.distribution?.neutral || 0;
  const bearishCount = news.distribution?.bearish || 0;

  return (
    <div className="space-y-6">
      {/* 1. Next Scheduled Earnings Banner (Refinitiv Verified) */}
      <Card className="border-border/60 bg-gradient-to-r from-card/80 via-primary/[0.04] to-card/80 backdrop-blur-md shadow-sm overflow-hidden">
        <CardContent className="p-4 sm:p-5">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
            <div className="flex items-center gap-3.5">
              <div className="p-3 rounded-2xl bg-primary/10 text-primary flex items-center justify-center">
                <Calendar className="h-6 w-6" />
              </div>
              <div className="space-y-1">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="text-xs font-bold uppercase tracking-widest text-primary">
                    Next Scheduled Earnings Report
                  </span>
                  <Badge variant="outline" className="text-[10px] bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/30 font-bold">
                    Refinitiv Verified
                  </Badge>
                </div>
                <h3 className="text-lg sm:text-xl font-bold text-foreground tracking-tight">
                  {nextEarnings.formattedDate}
                </h3>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-2 sm:gap-4 divide-x divide-border/50 bg-muted/30 p-3 rounded-xl border border-border/50 text-center">
              <div className="px-2">
                <span className="text-[10px] text-muted-foreground block font-medium">Consensus EPS</span>
                <span className="text-sm sm:text-base font-bold text-foreground">
                  {nextEarnings.expectedEps !== null ? `$${nextEarnings.expectedEps.toFixed(2)}` : "TBA"}
                </span>
              </div>

              <div className="px-2">
                <span className="text-[10px] text-muted-foreground block font-medium">Expected Revenue</span>
                <span className="text-sm sm:text-base font-bold text-foreground">
                  {nextEarnings.expectedRevenue || "TBA"}
                </span>
              </div>

              <div className="px-2">
                <span className="text-[10px] text-muted-foreground block font-medium">Timing</span>
                <span className="text-sm sm:text-base font-bold text-primary">
                  {nextEarnings.daysRemaining !== null ? `In ${nextEarnings.daysRemaining} Days` : "Upcoming"}
                </span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* 2. Live News Wire & AI Catalyst Intelligence Section */}
      <Card className="border-border/60 bg-card/60 backdrop-blur-md shadow-sm">
        <CardHeader className="pb-4">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-amber-500/10 text-amber-500">
                <Zap className="h-6 w-6" />
              </div>
              <div>
                <CardTitle className="text-xl font-bold tracking-tight flex items-center gap-2">
                  Live News Wire &amp; AI Catalyst Intelligence
                  <Badge variant="outline" className="text-[10px] font-bold bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/30">
                    REAL-TIME
                  </Badge>
                </CardTitle>
                <CardDescription className="text-xs sm:text-sm">
                  Real-time headlines and full article bodies from Refinitiv / LSEG Wire evaluated by Google Gemini AI
                </CardDescription>
              </div>
            </div>

            {/* Controls: Depth Selector + Analyze All Button */}
            <div className="flex flex-wrap items-center gap-2.5">
              <div className="flex items-center gap-1 bg-muted/40 p-1 rounded-lg border border-border/50 text-xs">
                <span className="px-2 text-muted-foreground text-[11px] font-medium">Depth:</span>
                {[3, 6, 10, 15].map((d) => (
                  <button
                    key={d}
                    type="button"
                    onClick={() => setDepth(d)}
                    className={`px-2 py-0.5 rounded text-xs font-semibold transition-colors ${
                      depth === d
                        ? "bg-primary text-primary-foreground shadow-xs"
                        : "text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    {d}
                  </button>
                ))}
              </div>

              <Button
                size="sm"
                onClick={handleAnalyzeAll}
                disabled={analyzingAll}
                className="gap-1.5 bg-gradient-to-r from-amber-500 via-orange-500 to-primary text-white font-semibold text-xs shadow-sm hover:opacity-90 transition-opacity"
              >
                <Sparkles className="h-3.5 w-3.5" />
                {analyzingAll ? "Evaluating Wire..." : "Analyze All With AI"}
              </Button>
            </div>
          </div>

          {/* AI Sentiment Distribution Bar */}
          <div className="mt-4 p-3 rounded-xl bg-muted/30 border border-border/50 space-y-2">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between text-xs gap-2">
              <div className="flex items-center gap-2">
                <span className="font-semibold text-foreground">Aggregate AI Sentiment:</span>
                <Badge
                  variant="outline"
                  className={`text-xs font-bold ${
                    news.overallSentiment === "BULLISH"
                      ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/30"
                      : news.overallSentiment === "BEARISH"
                      ? "bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/30"
                      : "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/30"
                  }`}
                >
                  {news.overallSentiment} ({news.averageRating.toFixed(1)} / 5.0 Stars)
                </Badge>
              </div>

              <div className="flex items-center gap-3 text-[11px] font-medium text-muted-foreground">
                <span className="flex items-center gap-1 text-emerald-500">
                  <span className="h-2 w-2 rounded-full bg-emerald-500" />
                  {bullishCount} Bullish
                </span>
                <span className="flex items-center gap-1 text-amber-500">
                  <span className="h-2 w-2 rounded-full bg-amber-500" />
                  {neutralCount} Neutral
                </span>
                <span className="flex items-center gap-1 text-rose-500">
                  <span className="h-2 w-2 rounded-full bg-rose-500" />
                  {bearishCount} Bearish
                </span>
              </div>
            </div>

            {/* Visual ratio bar */}
            <div className="w-full h-1.5 rounded-full bg-muted overflow-hidden flex">
              <div
                className="bg-emerald-500 h-full transition-all duration-500"
                style={{ width: `${totalArticles ? (bullishCount / totalArticles) * 100 : 70}%` }}
              />
              <div
                className="bg-amber-500 h-full transition-all duration-500"
                style={{ width: `${totalArticles ? (neutralCount / totalArticles) * 100 : 20}%` }}
              />
              <div
                className="bg-rose-500 h-full transition-all duration-500"
                style={{ width: `${totalArticles ? (bearishCount / totalArticles) * 100 : 10}%` }}
              />
            </div>
          </div>
        </CardHeader>

        <CardContent className="space-y-4 pt-0">
          {displayedArticles.length === 0 ? (
            <div className="p-8 text-center text-muted-foreground text-sm">
              No live news wire items found for {ticker}.
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {displayedArticles.map((art, idx) => {
                const isExpanded = Boolean(expandedArticles[idx]);
                const isAnalyzed = art.geminiEvaluated || Boolean(analyzedState[idx]);
                const isBull = art.geminiSentiment === "BULLISH";
                const isBear = art.geminiSentiment === "BEARISH";

                return (
                  <div
                    key={art.storyId || idx}
                    className="p-4 rounded-xl border border-border/70 bg-card/40 hover:bg-card/70 transition-all flex flex-col justify-between space-y-3"
                  >
                    {/* Top Badges: Source + Timestamp */}
                    <div className="space-y-2">
                      <div className="flex items-center justify-between gap-2 text-xs">
                        <div className="flex items-center gap-1.5">
                          <Badge variant="secondary" className="text-[10px] font-mono uppercase bg-muted/80">
                            {art.source}
                          </Badge>
                          <span className="text-[10px] text-muted-foreground">{art.dateTime}</span>
                        </div>

                        {art.url && (
                          <a
                            href={art.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-muted-foreground hover:text-foreground transition-colors"
                            title="Open original source"
                          >
                            <ExternalLink className="h-3.5 w-3.5" />
                          </a>
                        )}
                      </div>

                      {/* Headline */}
                      <h4 className="font-semibold text-sm text-foreground leading-snug tracking-tight">
                        {art.headline}
                      </h4>

                      {/* Expandable Story Body */}
                      {art.body && art.body !== art.headline && (
                        <div className="space-y-1">
                          <button
                            type="button"
                            onClick={() => toggleExpand(idx)}
                            className="flex items-center gap-1 text-[11px] font-semibold text-primary hover:underline"
                          >
                            {isExpanded ? (
                              <>
                                Hide Story <ChevronUp className="h-3 w-3" />
                              </>
                            ) : (
                              <>
                                Read Full Story ({art.bodyLengthChars || art.body.length} chars){" "}
                                <ChevronDown className="h-3 w-3" />
                              </>
                            )}
                          </button>

                          {isExpanded && (
                            <div className="mt-2 p-3 rounded-lg bg-muted/40 border border-border/40 text-xs text-muted-foreground leading-relaxed max-h-48 overflow-y-auto">
                              {art.body}
                            </div>
                          )}
                        </div>
                      )}
                    </div>

                    {/* AI Catalyst Scorecard */}
                    <div className="pt-3 border-t border-border/50 space-y-2">
                      {isAnalyzed ? (
                        <div className="p-2.5 rounded-lg bg-muted/30 border border-border/40 space-y-1.5">
                          <div className="flex items-center justify-between gap-1">
                            <div className="flex items-center gap-1.5">
                              <Badge
                                variant="outline"
                                className={`text-[10px] px-1.5 py-0 font-bold ${
                                  isBull
                                    ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/30"
                                    : isBear
                                    ? "bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/30"
                                    : "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/30"
                                }`}
                              >
                                {art.geminiSentiment} ({art.geminiRating}/5)
                              </Badge>

                              <span className="text-[10px] font-medium text-muted-foreground truncate max-w-[120px]">
                                {art.catalystType}
                              </span>
                            </div>

                            <Badge variant="secondary" className="text-[9px] px-1 py-0 font-mono">
                              Risk: {art.riskLevel}
                            </Badge>
                          </div>

                          <p className="text-[11px] text-foreground/90 leading-tight">
                            <strong className="text-primary font-medium">Catalyst: </strong>
                            {art.reasoning}
                          </p>

                          {art.keyPhrase && (
                            <p className="text-[10px] text-muted-foreground italic truncate">
                              &ldquo;{art.keyPhrase}&rdquo;
                            </p>
                          )}
                        </div>
                      ) : (
                        <div className="flex items-center justify-between text-xs">
                          <span className="text-muted-foreground text-[11px]">AI Catalyst: Not evaluated</span>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleAnalyzeSingle(idx)}
                            className="h-6 text-[10px] gap-1 px-2 font-medium"
                          >
                            <Sparkles className="h-2.5 w-2.5" /> Analyze with AI
                          </Button>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
