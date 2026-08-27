"use client";

import React, { useState, useMemo } from "react";
import { RiskLevel, RiskProfile } from "@/types/risk-profile";
import { RISK_PROFILES, RISK_QUESTIONS, calculateRiskProfile } from "@/lib/risk-assessment-data";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  ShieldCheck,
  TrendingUp,
  Scale,
  Zap,
  Flame,
  ArrowLeft,
  ArrowRight,
  CheckCircle,
  HelpCircle,
  SlidersHorizontal,
  Sparkles,
  Layers
} from "lucide-react";

interface RiskAssessmentProps {
  onComplete: (result: {
    riskLevel: RiskLevel;
    score?: number;
    assignedProfile: RiskProfile;
    answers?: Record<number, "A" | "B" | "C" | "D">;
  }) => void;
  onBack: () => void;
  initialRiskLevel?: RiskLevel;
}

export function RiskAssessment({ onComplete, onBack, initialRiskLevel = 2 }: RiskAssessmentProps) {
  const [mode, setMode] = useState<"questionnaire" | "direct">("questionnaire");
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<number, "A" | "B" | "C" | "D">>({
    1: "B",
    2: "B",
    3: "C",
    4: "C",
    5: "B",
    6: "B",
    7: "B",
    8: "C",
    9: "B",
    10: "C"
  });
  const [selectedDirectLevel, setSelectedDirectLevel] = useState<RiskLevel>(initialRiskLevel);

  // Internal score calculation (A=1, B=2, C=3, D=4) -> Maps to Risk Level 1 to 3
  const totalScore = useMemo(() => {
    return Object.entries(answers).reduce((sum, [qIdStr, optId]) => {
      const qId = Number(qIdStr);
      const question = RISK_QUESTIONS.find((q) => q.id === qId);
      const option = question?.options.find((o) => o.id === optId);
      return sum + (option?.points || 1);
    }, 0);
  }, [answers]);

  const recommendedProfile = useMemo(() => {
    return calculateRiskProfile(totalScore);
  }, [totalScore]);

  const handleSelectOption = (questionId: number, optionId: "A" | "B" | "C" | "D") => {
    setAnswers((prev) => ({
      ...prev,
      [questionId]: optionId
    }));
  };

  const progressPercentage = Math.round(((currentQuestionIndex + 1) / RISK_QUESTIONS.length) * 100);
  const currentQuestion = RISK_QUESTIONS[currentQuestionIndex];

  const getProfileIcon = (level: RiskLevel, className = "h-5 w-5") => {
    switch (level) {
      case 1:
        return <ShieldCheck className={className} />;
      case 2:
        return <TrendingUp className={className} />;
      case 3:
        return <Flame className={className} />;
    }
  };

  const handleFinalSubmit = () => {
    if (mode === "questionnaire") {
      onComplete({
        riskLevel: recommendedProfile.level,
        score: totalScore,
        assignedProfile: recommendedProfile,
        answers
      });
    } else {
      onComplete({
        riskLevel: selectedDirectLevel,
        assignedProfile: RISK_PROFILES[selectedDirectLevel]
      });
    }
  };

  return (
    <div className="w-full max-w-4xl space-y-6">
      {/* Header section */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b pb-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">Risk Assessment & Strategy Assignment</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Determine your risk profile to assign your automated ETF portfolio allocation.
          </p>
        </div>
        <Tabs value={mode} onValueChange={(val) => setMode(val as any)} className="w-full sm:w-auto">
          <TabsList className="grid grid-cols-2 w-full sm:w-80">
            <TabsTrigger value="questionnaire" className="text-xs sm:text-sm gap-1.5">
              <HelpCircle className="h-3.5 w-3.5" /> 10-Q Survey
            </TabsTrigger>
            <TabsTrigger value="direct" className="text-xs sm:text-sm gap-1.5">
              <SlidersHorizontal className="h-3.5 w-3.5" /> Direct Select
            </TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      {/* Mode 1: 10-Questionnaire */}
      {mode === "questionnaire" && (
        <div className="grid gap-6 lg:grid-cols-12">
          {/* Main Question Card */}
          <div className="lg:col-span-8 space-y-4">
            <Card className="border-border/60 shadow-lg">
              <CardHeader className="pb-4">
                <div className="flex items-center justify-between gap-2 mb-2">
                  <Badge variant="outline" className="text-xs font-semibold px-2.5 py-0.5">
                    Question {currentQuestionIndex + 1} of {RISK_QUESTIONS.length}
                  </Badge>
                  <span className="text-xs text-muted-foreground font-medium">
                    Category: <strong className="text-foreground">{currentQuestion.category}</strong>
                  </span>
                </div>
                <Progress value={progressPercentage} className="h-2 mb-2" />
                <CardTitle className="text-lg sm:text-xl font-semibold leading-snug">
                  {currentQuestion.title}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 pt-0">
                <div className="grid gap-2.5">
                  {currentQuestion.options.map((option) => {
                    const isSelected = answers[currentQuestion.id] === option.id;
                    return (
                      <button
                        key={option.id}
                        type="button"
                        onClick={() => handleSelectOption(currentQuestion.id, option.id)}
                        className={`flex items-start text-left gap-3.5 p-3.5 rounded-xl border transition-all ${
                          isSelected
                            ? "border-primary bg-primary/10 ring-1 ring-primary shadow-sm"
                            : "border-border/60 bg-card hover:bg-accent/50 hover:border-border"
                        }`}
                      >
                        <div
                          className={`mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-xs font-bold transition-colors ${
                            isSelected
                              ? "bg-primary text-primary-foreground"
                              : "bg-muted text-muted-foreground border"
                          }`}
                        >
                          {option.id}
                        </div>
                        <div className="space-y-1 flex-1">
                          <p className="text-sm font-medium leading-none text-foreground">
                            {option.text}
                          </p>
                          {option.description && (
                            <p className="text-xs text-muted-foreground leading-relaxed pt-0.5">
                              {option.description}
                            </p>
                          )}
                        </div>
                      </button>
                    );
                  })}
                </div>
              </CardContent>
              <CardFooter className="flex items-center justify-between border-t pt-4 bg-muted/20">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentQuestionIndex((prev) => Math.max(0, prev - 1))}
                  disabled={currentQuestionIndex === 0}
                  className="gap-1 text-xs"
                >
                  <ArrowLeft className="h-3.5 w-3.5" /> Previous
                </Button>

                <div className="flex gap-1">
                  {RISK_QUESTIONS.map((q, idx) => (
                    <button
                      key={q.id}
                      onClick={() => setCurrentQuestionIndex(idx)}
                      className={`h-2 rounded-full transition-all ${
                        idx === currentQuestionIndex
                          ? "w-6 bg-primary"
                          : answers[q.id]
                          ? "w-2 bg-primary/50"
                          : "w-2 bg-muted"
                      }`}
                      title={`Go to Question ${idx + 1}`}
                    />
                  ))}
                </div>

                {currentQuestionIndex < RISK_QUESTIONS.length - 1 ? (
                  <Button
                    size="sm"
                    onClick={() => setCurrentQuestionIndex((prev) => Math.min(RISK_QUESTIONS.length - 1, prev + 1))}
                    className="gap-1 text-xs"
                  >
                    Next <ArrowRight className="h-3.5 w-3.5" />
                  </Button>
                ) : (
                  <Button size="sm" onClick={handleFinalSubmit} className="gap-1 text-xs bg-primary">
                    Confirm Profile <CheckCircle className="h-3.5 w-3.5" />
                  </Button>
                )}
              </CardFooter>
            </Card>
          </div>

          {/* Real-time Dynamic Recommended Strategy Panel */}
          <div className="lg:col-span-4 space-y-4">
            <Card className={`border-2 ${recommendedProfile.borderClass} shadow-md overflow-hidden bg-card`}>
              <div className={`h-2 bg-gradient-to-r ${recommendedProfile.bgClass}`} style={{ backgroundColor: recommendedProfile.color }} />
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                    Calculated Recommendation
                  </span>
                  <Badge className={recommendedProfile.badgeClass}>
                    Assigned Level {recommendedProfile.level}
                  </Badge>
                </div>
                <CardTitle className="text-xl flex items-center gap-2 pt-1 font-bold">
                  {getProfileIcon(recommendedProfile.level, "h-5 w-5 text-primary")}
                  {recommendedProfile.strategyName}
                </CardTitle>
                <CardDescription className="text-xs">
                  {recommendedProfile.description}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-3 text-xs pt-0">
                <div className="rounded-lg bg-muted/50 p-3 space-y-2 border">
                  <div>
                    <span className="text-muted-foreground block text-[11px]">Target 1-Year Return Profile:</span>
                    <strong className="text-foreground text-sm font-semibold">{recommendedProfile.targetReturn}</strong>
                  </div>
                  <div className="border-t pt-1.5">
                    <span className="text-muted-foreground block text-[11px]">Turnover & Holding:</span>
                    <span className="text-foreground">{recommendedProfile.turnoverStrategy}</span>
                  </div>
                  <div className="border-t pt-1.5">
                    <span className="text-muted-foreground block text-[11px]">Asset Universe:</span>
                    <span className="text-foreground">{recommendedProfile.assetUniverse}</span>
                  </div>
                </div>

                <div>
                  <span className="text-muted-foreground block text-[11px] mb-1.5">Sample Holdings:</span>
                  <div className="flex flex-wrap gap-1.5">
                    {recommendedProfile.sampleTickers.map((ticker) => (
                      <span key={ticker} className="px-2 py-0.5 rounded bg-muted font-mono font-medium text-[11px] border">
                        {ticker}
                      </span>
                    ))}
                  </div>
                </div>
              </CardContent>
              <CardFooter className="border-t pt-3 flex flex-col gap-2 bg-muted/10">
                <Button onClick={handleFinalSubmit} className="w-full gap-2 text-xs font-medium">
                  Confirm & Activate Strategy <Sparkles className="h-3.5 w-3.5" />
                </Button>
                <Button variant="ghost" size="sm" onClick={onBack} className="w-full text-xs text-muted-foreground">
                  Back to Disclosures
                </Button>
              </CardFooter>
            </Card>

            {/* ETF Strategy Profiles Overview Reference */}
            <Card className="border-border/50 text-xs">
              <CardHeader className="py-2.5 px-3">
                <CardTitle className="text-xs font-medium flex items-center gap-1.5 text-muted-foreground">
                  <Layers className="h-3.5 w-3.5" /> Strategy Profiles Overview
                </CardTitle>
              </CardHeader>
              <CardContent className="px-3 pb-3 pt-0">
                <div className="space-y-1">
                  {([1, 2, 3] as RiskLevel[]).map((lvl) => {
                    const p = RISK_PROFILES[lvl];
                    const isCurrent = recommendedProfile.level === lvl;
                    return (
                      <div
                        key={lvl}
                        className={`flex items-center justify-between px-2 py-1 rounded text-[11px] ${
                          isCurrent ? "bg-primary/10 font-bold text-foreground" : "text-muted-foreground"
                        }`}
                      >
                        <span>Level {lvl}: {p.strategyName}</span>
                        <span className="font-semibold text-foreground">{p.targetReturn}</span>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      )}

      {/* Mode 2: Direct Strategy Selection */}
      {mode === "direct" && (
        <div className="space-y-6">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {([1, 2, 3] as RiskLevel[]).map((level) => {
              const profile = RISK_PROFILES[level];
              const isSelected = selectedDirectLevel === level;
              return (
                <Card
                  key={level}
                  onClick={() => setSelectedDirectLevel(level)}
                  className={`cursor-pointer transition-all border-2 relative flex flex-col justify-between ${
                    isSelected
                      ? `${profile.borderClass} shadow-lg ring-2 ring-primary/30 bg-card`
                      : "border-border/60 hover:border-primary/50 bg-card/60"
                  }`}
                >
                  <div className={`h-1.5 w-full`} style={{ backgroundColor: profile.color }} />
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between gap-2">
                      <Badge className={profile.badgeClass}>
                        Level {level}
                      </Badge>
                      <span className="text-xs font-medium text-foreground">
                        {profile.targetReturn}
                      </span>
                    </div>
                    <CardTitle className="text-lg font-bold flex items-center gap-2 pt-2">
                      {getProfileIcon(level, "h-5 w-5")}
                      {profile.strategyName}
                    </CardTitle>
                    <CardDescription className="text-xs">
                      {profile.description}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-3 text-xs pt-0 flex-1">
                    <div className="rounded-lg bg-muted/40 p-2.5 space-y-1.5 border text-xs">
                      <div>
                        <span className="text-muted-foreground block text-[11px]">1-Year Target Return:</span>
                        <strong className="text-foreground font-semibold">{profile.targetReturn}</strong>
                      </div>
                      <div className="border-t pt-1">
                        <span className="text-muted-foreground block text-[11px]">Turnover & Holding:</span>
                        <span className="text-foreground leading-tight block">{profile.turnoverStrategy}</span>
                      </div>
                      <div className="border-t pt-1">
                        <span className="text-muted-foreground block text-[11px]">Asset Universe:</span>
                        <span className="text-foreground leading-tight block">{profile.assetUniverse}</span>
                      </div>
                    </div>
                    <div>
                      <span className="text-muted-foreground block text-[11px] mb-1">Sample Holdings:</span>
                      <div className="flex flex-wrap gap-1">
                        {profile.sampleTickers.map((t) => (
                          <span key={t} className="px-1.5 py-0.5 rounded bg-muted text-[10px] font-mono border">
                            {t}
                          </span>
                        ))}
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter className="pt-2 border-t bg-muted/10">
                    <Button
                      variant={isSelected ? "default" : "outline"}
                      size="sm"
                      className="w-full text-xs"
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedDirectLevel(level);
                      }}
                    >
                      {isSelected ? "Selected Profile" : "Select Level " + level}
                    </Button>
                  </CardFooter>
                </Card>
              );
            })}
          </div>

          <div className="flex items-center justify-between border-t pt-4">
            <Button variant="outline" onClick={onBack} className="gap-1 text-xs">
              <ArrowLeft className="h-3.5 w-3.5" /> Back to Disclosures
            </Button>
            <Button onClick={handleFinalSubmit} className="gap-2 text-sm font-medium">
              Activate Level {selectedDirectLevel}: {RISK_PROFILES[selectedDirectLevel].strategyName}
              <ArrowRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
