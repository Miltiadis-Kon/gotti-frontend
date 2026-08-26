"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Eye, EyeOff, Lock, Mail, CheckCircle2, ShieldCheck, ArrowRight } from "lucide-react";

interface SignupFormProps {
  onSuccess: (data: { email: string; password: string }) => void;
  initialEmail?: string;
}

export function SignupForm({ onSuccess, initialEmail = "" }: SignupFormProps) {
  const [email, setEmail] = useState(initialEmail);
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // Simple password strength calculation
  const getPasswordStrength = () => {
    if (!password) return { score: 0, text: "", color: "" };
    let score = 0;
    if (password.length >= 6) score += 1;
    if (password.length >= 10) score += 1;
    if (/[A-Z]/.test(password)) score += 1;
    if (/[0-9]/.test(password)) score += 1;
    if (/[^A-Za-z0-9]/.test(password)) score += 1;

    if (score <= 2) return { score: 25, text: "Weak", color: "bg-red-500" };
    if (score <= 3) return { score: 60, text: "Medium", color: "bg-amber-500" };
    return { score: 100, text: "Strong", color: "bg-emerald-500" };
  };

  const strength = getPasswordStrength();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    // Basic validation
    if (!email || !email.includes("@") || !email.includes(".")) {
      setError("Please enter a valid email address.");
      return;
    }
    if (password.length < 6) {
      setError("Password must be at least 6 characters long.");
      return;
    }
    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      onSuccess({ email, password });
    }, 400);
  };

  return (
    <Card className="w-full max-w-md border-border/60 shadow-xl backdrop-blur-sm bg-card/95">
      <CardHeader className="space-y-1 text-center pb-6">
        <div className="mx-auto mb-2 flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary">
          <ShieldCheck className="h-6 w-6" />
        </div>
        <CardTitle className="text-2xl font-bold tracking-tight">Create your Gotti account</CardTitle>
        <CardDescription>
          Sign up with your email to unlock automated portfolio management & risk-tailored ETF strategies.
        </CardDescription>
      </CardHeader>
      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-4">
          {error && (
            <Alert variant="destructive" className="py-2.5">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <div className="space-y-2">
            <Label htmlFor="email">Email address</Label>
            <div className="relative">
              <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                id="email"
                type="email"
                placeholder="investor@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="pl-9"
                required
                autoFocus
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <div className="relative">
              <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                id="password"
                type={showPassword ? "text" : "password"}
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="pl-9 pr-9"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-3 text-muted-foreground hover:text-foreground"
                tabIndex={-1}
              >
                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
            {password && (
              <div className="space-y-1 pt-1">
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>Strength: {strength.text}</span>
                  <span>{strength.score}%</span>
                </div>
                <div className="h-1.5 w-full rounded-full bg-muted overflow-hidden">
                  <div className={`h-full ${strength.color} transition-all duration-300`} style={{ width: `${strength.score}%` }} />
                </div>
              </div>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="confirm-password">Confirm Password</Label>
            <div className="relative">
              <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                id="confirm-password"
                type={showPassword ? "text" : "password"}
                placeholder="••••••••"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="pl-9"
                required
              />
            </div>
          </div>

          <div className="rounded-lg bg-muted/40 p-3 text-xs text-muted-foreground space-y-1 border">
            <div className="flex items-center gap-1.5 font-medium text-foreground">
              <CheckCircle2 className="h-3.5 w-3.5 text-primary" /> Next step: Risk Level & ETF Selection
            </div>
            <p>You will complete a 10-question risk profile assessment or directly pick your preferred automated ETF strategy.</p>
          </div>
        </CardContent>

        <CardFooter className="flex flex-col gap-3 pt-2">
          <Button type="submit" className="w-full gap-2 text-sm font-medium" disabled={isLoading}>
            {isLoading ? "Creating Account..." : "Continue to Risk Assessment"}
            <ArrowRight className="h-4 w-4" />
          </Button>

          <p className="text-center text-xs text-muted-foreground">
            Already have an account?{" "}
            <Link href="/" className="font-semibold text-primary underline underline-offset-4 hover:opacity-80">
              Sign In
            </Link>
          </p>
        </CardFooter>
      </form>
    </Card>
  );
}
