"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { SignupForm } from "@/components/auth/signup-form";
import { PlatformDisclosure } from "@/components/auth/platform-disclosure";
import { RiskAssessment } from "@/components/auth/risk-assessment";
import { ProfileSummary } from "@/components/auth/profile-summary";
import { RiskLevel, RiskProfile } from "@/types/risk-profile";
import {
  RISK_PROFILES,
  storeUser,
  getStoredUser,
  logoutUser
} from "@/lib/risk-assessment-data";
import {
  Check,
  ShieldCheck,
  UserPlus,
  Gauge,
  FileText,
  UserCheck,
  ArrowRight,
  LogOut,
  Layers,
  ArrowLeft
} from "lucide-react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export default function SignupPage() {
  const router = useRouter();
  const [isAlreadyLoggedIn, setIsAlreadyLoggedIn] = useState(false);
  const [existingEmail, setExistingEmail] = useState("");
  const [step, setStep] = useState<1 | 2 | 3 | 4>(1);

  const [userData, setUserData] = useState<{
    email: string;
    password?: string;
    riskLevel: RiskLevel;
    score?: number;
    assignedProfile: RiskProfile;
    answers?: Record<number, "A" | "B" | "C" | "D">;
  }>({
    email: "",
    riskLevel: 2,
    assignedProfile: RISK_PROFILES[2]
  });

  useEffect(() => {
    const stored = getStoredUser();
    if (stored && stored.email) {
      setIsAlreadyLoggedIn(true);
      setExistingEmail(stored.email);
    }
  }, []);

  const handleSignOutAndNew = () => {
    logoutUser();
    setIsAlreadyLoggedIn(false);
    setExistingEmail("");
    setStep(1);
  };

  const handleSignupSuccess = (data: { email: string; password: string }) => {
    setUserData((prev) => ({
      ...prev,
      email: data.email,
      password: data.password
    }));
    setStep(2);
  };

  const handleDisclosureAccepted = () => {
    setStep(3);
  };

  const handleRiskComplete = (result: {
    riskLevel: RiskLevel;
    score?: number;
    assignedProfile: RiskProfile;
    answers?: Record<number, "A" | "B" | "C" | "D">;
  }) => {
    setUserData((prev) => ({
      ...prev,
      riskLevel: result.riskLevel,
      score: result.score,
      assignedProfile: result.assignedProfile,
      answers: result.answers
    }));

    // Store in localStorage for application-wide persistence
    storeUser({
      email: userData.email,
      riskLevel: result.riskLevel,
      riskScore: result.score,
      answers: result.answers
    });

    setStep(4);
  };

  const getProgressWidth = () => {
    switch (step) {
      case 1: return "0%";
      case 2: return "33.3%";
      case 3: return "66.6%";
      case 4: return "100%";
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-background via-muted/30 to-background flex flex-col justify-between">
      {/* Top Navbar */}
      <header className="border-b bg-card/60 backdrop-blur-md sticky top-0 z-40">
        <div className="container max-w-6xl mx-auto flex h-16 items-center justify-between px-4">
          <Link href="/" className="flex items-center gap-2 font-bold text-lg">
            <Image src="/icons/face.ico" alt="Gotti Logo" width={28} height={28} />
            <span className="tracking-tight font-extrabold text-foreground">Gotti<span className="text-primary">.ai</span></span>
          </Link>
          <div className="flex items-center gap-4 text-xs sm:text-sm font-medium">
            <Link href="/" className="text-muted-foreground hover:text-foreground">
              Dashboard
            </Link>
            <Link href="/sub-accounts" className="text-muted-foreground hover:text-foreground">
              Sub-Accounts Hub
            </Link>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="container max-w-5xl mx-auto px-4 py-8 sm:py-12 flex-1 flex flex-col items-center justify-center">
        {/* Rule 2 Enforcement: If already logged in, prevent signing up again */}
        {isAlreadyLoggedIn ? (
          <Card className="w-full max-w-lg border-2 shadow-xl bg-card">
            <CardHeader className="text-center pb-4 pt-6 space-y-2">
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10 text-primary border shadow-inner">
                <UserCheck className="h-7 w-7" />
              </div>
              <Badge className="bg-primary/10 text-primary border-primary/20 mx-auto">
                Active Session Detected
              </Badge>
              <CardTitle className="text-2xl font-bold tracking-tight">
                You Are Already Logged In
              </CardTitle>
              <CardDescription className="text-xs sm:text-sm">
                You are currently signed in as <strong className="text-foreground">{existingEmail}</strong>. You cannot sign up again with an active account.
              </CardDescription>
            </CardHeader>

            <CardContent className="space-y-3 pt-2 text-xs">
              <div className="rounded-xl border bg-muted/40 p-4 space-y-2">
                <div className="flex items-center justify-between text-foreground font-semibold">
                  <span>Your Multi-ETF Portfolio is Active</span>
                  <span className="text-emerald-600 dark:text-emerald-400 font-bold">● Running</span>
                </div>
                <p className="text-muted-foreground leading-relaxed text-[11px]">
                  Under <strong>Rule 1</strong>, you can manage up to 3 segregated sub-accounts (1 per Risk Level 1–3) directly from the Sub-Accounts Hub without creating a new login.
                </p>
              </div>
            </CardContent>

            <CardFooter className="flex flex-col gap-2.5 border-t bg-muted/20 pt-4">
              <Button onClick={() => router.push("/")} className="w-full gap-2 text-xs font-semibold">
                Go to Gotti Dashboard <ArrowRight className="h-4 w-4" />
              </Button>
              <div className="flex items-center justify-between w-full gap-2 pt-1">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => router.push("/sub-accounts")}
                  className="flex-1 text-xs gap-1.5"
                >
                  <Layers className="h-3.5 w-3.5" /> Sub-Accounts Hub
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleSignOutAndNew}
                  className="flex-1 text-xs text-muted-foreground hover:text-destructive gap-1.5"
                >
                  <LogOut className="h-3.5 w-3.5" /> Sign Out & Register
                </Button>
              </div>
            </CardFooter>
          </Card>
        ) : (
          <>
            {/* 4-Step Indicator */}
            <div className="w-full max-w-2xl mb-8 sm:mb-12">
              <div className="flex items-center justify-between relative">
                <div className="absolute left-0 top-1/2 -translate-y-1/2 h-0.5 w-full bg-muted -z-0" />
                <div
                  className="absolute left-0 top-1/2 -translate-y-1/2 h-0.5 bg-primary transition-all duration-500 -z-0"
                  style={{ width: getProgressWidth() }}
                />

                {/* Step 1: Account */}
                <div className="flex flex-col items-center relative z-10 bg-background px-2">
                  <div
                    className={`flex h-9 w-9 items-center justify-center rounded-full border-2 text-xs font-bold transition-all ${
                      step > 1
                        ? "border-primary bg-primary text-primary-foreground"
                        : step === 1
                        ? "border-primary bg-background text-primary ring-4 ring-primary/20"
                        : "border-muted text-muted-foreground bg-muted"
                    }`}
                  >
                    {step > 1 ? <Check className="h-4 w-4" /> : <UserPlus className="h-4 w-4" />}
                  </div>
                  <span className="text-[11px] font-medium mt-1.5 text-foreground hidden sm:block">1. Account</span>
                </div>

                {/* Step 2: Architecture & Disclosures */}
                <div className="flex flex-col items-center relative z-10 bg-background px-2">
                  <div
                    className={`flex h-9 w-9 items-center justify-center rounded-full border-2 text-xs font-bold transition-all ${
                      step > 2
                        ? "border-primary bg-primary text-primary-foreground"
                        : step === 2
                        ? "border-primary bg-background text-primary ring-4 ring-primary/20"
                        : "border-muted text-muted-foreground bg-muted"
                    }`}
                  >
                    {step > 2 ? <Check className="h-4 w-4" /> : <FileText className="h-4 w-4" />}
                  </div>
                  <span className="text-[11px] font-medium mt-1.5 text-foreground hidden sm:block">2. Disclosures</span>
                </div>

                {/* Step 3: Risk Assessment */}
                <div className="flex flex-col items-center relative z-10 bg-background px-2">
                  <div
                    className={`flex h-9 w-9 items-center justify-center rounded-full border-2 text-xs font-bold transition-all ${
                      step > 3
                        ? "border-primary bg-primary text-primary-foreground"
                        : step === 3
                        ? "border-primary bg-background text-primary ring-4 ring-primary/20"
                        : "border-muted text-muted-foreground bg-muted"
                    }`}
                  >
                    {step > 3 ? <Check className="h-4 w-4" /> : <Gauge className="h-4 w-4" />}
                  </div>
                  <span className="text-[11px] font-medium mt-1.5 text-foreground hidden sm:block">3. Risk Survey</span>
                </div>

                {/* Step 4: Strategy Active */}
                <div className="flex flex-col items-center relative z-10 bg-background px-2">
                  <div
                    className={`flex h-9 w-9 items-center justify-center rounded-full border-2 text-xs font-bold transition-all ${
                      step === 4
                        ? "border-primary bg-primary text-primary-foreground ring-4 ring-primary/20"
                        : "border-muted text-muted-foreground bg-muted"
                    }`}
                  >
                    <ShieldCheck className="h-4 w-4" />
                  </div>
                  <span className="text-[11px] font-medium mt-1.5 text-foreground hidden sm:block">4. Strategy Active</span>
                </div>
              </div>
            </div>

            {/* Dynamic Step Views */}
            <div className="w-full flex justify-center">
              {step === 1 && (
                <SignupForm
                  onSuccess={handleSignupSuccess}
                  initialEmail={userData.email}
                />
              )}

              {step === 2 && (
                <PlatformDisclosure
                  onAccept={handleDisclosureAccepted}
                  onBack={() => setStep(1)}
                />
              )}

              {step === 3 && (
                <RiskAssessment
                  onComplete={handleRiskComplete}
                  onBack={() => setStep(2)}
                  initialRiskLevel={userData.riskLevel}
                />
              )}

              {step === 4 && (
                <ProfileSummary
                  email={userData.email}
                  assignedProfile={userData.assignedProfile}
                  score={userData.score}
                  onRetake={() => setStep(3)}
                />
              )}
            </div>
          </>
        )}
      </main>

      {/* Footer */}
      <footer className="border-t py-6 text-center text-xs text-muted-foreground bg-card/40">
        <div className="container max-w-6xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-2">
          <p>© 2026 Gotti.ai — Intelligent Investment Portfolio Management</p>
          <div className="flex items-center gap-4">
            <Link href="/" className="hover:underline">Dashboard</Link>
            <Link href="/sub-accounts" className="hover:underline">Sub-Accounts Hub</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
