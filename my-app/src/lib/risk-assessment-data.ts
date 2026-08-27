import { Question, RiskLevel, RiskProfile, SubAccount } from "@/types/risk-profile";
import {
  ETF_STRATEGIES,
  INITIAL_SUB_ACCOUNTS,
  INITIAL_TRANSACTIONS,
  getUserProfile,
  updateUserProfile,
  isUserAuthenticated,
  logoutUser as serviceLogoutUser,
  getAllSubAccounts,
  getSubAccountById,
  getActiveSubAccountId as serviceGetActiveSubAccountId,
  setActiveSubAccountId as serviceSetActiveSubAccountId,
  getActiveSubAccount,
  isRiskLevelOccupied as serviceIsRiskLevelOccupied,
  getAvailableRiskLevels as serviceGetAvailableRiskLevels,
  createSubAccount as serviceCreateSubAccount,
  updateSubAccountStrategy as serviceUpdateSubAccountStrategy,
  deleteSubAccount as serviceDeleteSubAccount,
  getAggregatedFinancials,
  getAllTransactions,
  recordTransaction,
  fundSubAccount as serviceFundSubAccount,
  withdrawFromSubAccount as serviceWithdrawFromSubAccount,
  getSubAccountHoldings,
  getSubAccountWithDetails,
  exportFullUserData,
  importFullUserData,
  resetToDefaultState
} from "./user-store-service";

export const RISK_PROFILES: Record<RiskLevel, RiskProfile> = ETF_STRATEGIES;

export const RISK_QUESTIONS: Question[] = [
  {
    id: 1,
    title: "What initial capital amount are you dedicating to this automated portfolio?",
    category: "Capital Allocation",
    options: [
      { id: "A", text: "Less than €2,500", description: "Capital preservation is paramount", points: 1 },
      { id: "B", text: "€2,500 – €15,000", description: "A foundational capital base for steady growth", points: 2 },
      { id: "C", text: "€15,000 – €50,000", description: "Substantial capital capable of weathering cyclical market swings", points: 3 },
      { id: "D", text: "€50,000+", description: "Significant liquidity dedicated to aggressive wealth acceleration", points: 4 }
    ]
  },
  {
    id: 2,
    title: "What are your annualized return expectations over a 12-month horizon?",
    category: "Return Target",
    options: [
      { id: "A", text: "5% – 8%", description: "Beating inflation and savings rates with minimal capital downside (Boomer Haven)", points: 1 },
      { id: "B", text: "9% – 14%", description: "Matching or slightly beating broad equity market benchmarks", points: 2 },
      { id: "C", text: "15% – 22%", description: "Strong outperformance while accepting moderate periodic drawdowns (Steady Grind)", points: 3 },
      { id: "D", text: "25%+", description: "Maximum asymmetric capital expansion, fully accepting extreme volatility (Diamond Hands)", points: 4 }
    ]
  },
  {
    id: 3,
    title: "What is your expected investment timeframe before needing withdrawals?",
    category: "Investment Horizon",
    options: [
      { id: "A", text: "Less than 1 year (High liquidity focus)", points: 1 },
      { id: "B", text: "1 to 3 years (Medium-term growth)", points: 2 },
      { id: "C", text: "3 to 7 years (Full cyclical compounding)", points: 3 },
      { id: "D", text: "7+ years (Long-term wealth expansion)", points: 4 }
    ]
  },
  {
    id: 4,
    title: "If your portfolio drops 20% in a single month during a market pullback, what is your reaction?",
    category: "Drawdown Reaction",
    options: [
      { id: "A", text: "Liquidate immediately to stop any further drawdown", points: 1 },
      { id: "B", text: "Feel anxious and look to reduce portfolio risk exposure", points: 2 },
      { id: "C", text: "Stay calm and let the algorithmic model recover over the cycle", points: 3 },
      { id: "D", text: "View the crash as a high-value discount and allocate more capital", points: 4 }
    ]
  },
  {
    id: 5,
    title: "Which holding horizon and trading cadence aligns with your philosophy?",
    category: "Trading Cadence",
    options: [
      { id: "A", text: "Pure long-term buy-and-hold in household blue chips with zero trading noise", points: 1 },
      { id: "B", text: "Multi-month trend holding in established market leaders with disciplined rebalancing", points: 2 },
      { id: "C", text: "Dynamic tactical rotation exploiting mid-term sector momentum", points: 3 },
      { id: "D", text: "Fast-paced tactical momentum targeting volatile breakouts and rapid swings", points: 4 }
    ]
  },
  {
    id: 6,
    title: "What is your stance on allocating to high-beta, penny, or emerging small-cap equities?",
    category: "High-Beta Exposure",
    options: [
      { id: "A", text: "Completely avoid; strictly allocate to mega-cap titans (e.g., Apple, Microsoft, Coca-Cola)", points: 1 },
      { id: "B", text: "Modest exposure (<15%) only as an accessory to large-cap stability", points: 2 },
      { id: "C", text: "Comfortable with a 25%-40% allocation to generate excess alpha", points: 3 },
      { id: "D", text: "Heavy allocation; aggressively target high-momentum small-cap breakout runners", points: 4 }
    ]
  },
  {
    id: 7,
    title: "How would you rate your experience with financial markets and drawdowns?",
    category: "Market Experience",
    options: [
      { id: "A", text: "Beginner: I want a conservative, risk-managed automated vault", points: 1 },
      { id: "B", text: "Intermediate: I understand equity markets, ETFs, and normal corrections", points: 2 },
      { id: "C", text: "Advanced: I understand sector rotation, beta, volatility spikes, and drawdowns", points: 3 },
      { id: "D", text: "Experienced: I trade high-volatility momentum, small-caps, and liquidity swings", points: 4 }
    ]
  },
  {
    id: 8,
    title: "How reliant are you on this specific capital for emergency expenses?",
    category: "Emergency Liquidity",
    options: [
      { id: "A", text: "Highly reliant: This makes up a critical portion of my liquid savings", points: 1 },
      { id: "B", text: "Moderately reliant: I may require partial capital within 12–18 months", points: 2 },
      { id: "C", text: "Low reliance: I maintain a separate emergency fund of 6+ months of expenses", points: 3 },
      { id: "D", text: "Zero reliance: This is 100% dedicated discretionary risk capital", points: 4 }
    ]
  },
  {
    id: 9,
    title: "What is the primary mission of this account?",
    category: "Primary Mission",
    options: [
      { id: "A", text: "Capital preservation and consistent dividend accumulation (Boomer Haven)", points: 1 },
      { id: "B", text: "Balanced wealth growth with controlled, predictable drawdown limits (Steady Grind)", points: 2 },
      { id: "C", text: "Market outperformance through trend-following sector rotation", points: 3 },
      { id: "D", text: "Aggressive, high-upside capital multiplication (Diamond Hands)", points: 4 }
    ]
  },
  {
    id: 10,
    title: "How stable is your primary source of external income?",
    category: "Income Stability",
    options: [
      { id: "A", text: "Unpredictable / Variable", points: 1 },
      { id: "B", text: "Stable with modest recurring savings potential", points: 2 },
      { id: "C", text: "Highly secure with consistent monthly surplus available to invest", points: 3 },
      { id: "D", text: "High-earning income stream allowing aggressive recurring deposits", points: 4 }
    ]
  }
];

export function calculateRiskProfile(answersOrScore: Record<number, "A" | "B" | "C" | "D"> | number): RiskProfile {
  let totalScore = 0;
  
  if (typeof answersOrScore === "number") {
    totalScore = answersOrScore;
  } else if (answersOrScore && typeof answersOrScore === "object") {
    for (const question of RISK_QUESTIONS) {
      const chosenOptionId = answersOrScore[question.id];
      if (chosenOptionId) {
        const option = question.options.find(o => o.id === chosenOptionId);
        if (option) {
          totalScore += option.points;
        }
      }
    }
  }

  // 10-Question 3-Tier Scoring Brackets:
  // 10 – 19 Points -> Level 1: Boomer Haven ETF
  // 20 – 29 Points -> Level 2: Steady Grind ETF
  // 30 – 40 Points -> Level 3: Diamond Hands ETF
  if (totalScore <= 19) return RISK_PROFILES[1];
  if (totalScore <= 29) return RISK_PROFILES[2];
  return RISK_PROFILES[3];
}

export interface FundTransaction {
  id: string;
  subAccountId: string;
  subAccountName: string;
  strategyName: string;
  amount: number;
  type: "Deposit" | "Withdrawal";
  status: "Fulfilled" | "Pending" | "Processing";
  method: string;
  date: string;
}

export const DEFAULT_SUB_ACCOUNTS: SubAccount[] = INITIAL_SUB_ACCOUNTS;
export const DEFAULT_TRANSACTIONS: FundTransaction[] = INITIAL_TRANSACTIONS as any;

// ==============================================================================
// BACKWARD-COMPATIBLE SERVICE DELEGATIONS
// ==============================================================================

export function getStoredUser(): { email: string; riskLevel: RiskLevel; riskScore?: number; isLoggedIn?: boolean } | null {
  const profile = getUserProfile();
  return profile ? { email: profile.email, riskLevel: profile.riskLevel, riskScore: profile.riskScore, isLoggedIn: profile.isLoggedIn } : null;
}

export function isUserLoggedIn(): boolean {
  return isUserAuthenticated();
}

export function logoutUser(): void {
  serviceLogoutUser();
}

export function storeUser(user: { email: string; riskLevel: RiskLevel; riskScore?: number; answers?: Record<number, "A" | "B" | "C" | "D"> }): void {
  updateUserProfile({
    email: user.email,
    riskLevel: user.riskLevel,
    riskScore: user.riskScore,
    answers: user.answers,
    isLoggedIn: true
  });
}

export function getSubAccounts(): SubAccount[] {
  return getAllSubAccounts();
}

export function storeSubAccounts(accounts: SubAccount[]): void {
  if (typeof window !== "undefined") {
    localStorage.setItem("gotti_sub_accounts", JSON.stringify(accounts));
  }
}

export function getActiveSubAccountId(): string {
  return serviceGetActiveSubAccountId();
}

export function setActiveSubAccountId(id: string): void {
  serviceSetActiveSubAccountId(id);
}

export function isRiskLevelOccupied(level: RiskLevel, excludeSubAccountId?: string): boolean {
  return serviceIsRiskLevelOccupied(level, excludeSubAccountId);
}

export function getAvailableRiskLevels(): RiskLevel[] {
  return serviceGetAvailableRiskLevels();
}

export function createSubAccount(name: string, riskLevel: RiskLevel, allocatedCapital: number): SubAccount {
  return serviceCreateSubAccount(riskLevel, allocatedCapital, name);
}

export function updateSubAccountRiskLevel(id: string, newRiskLevel: RiskLevel): void {
  serviceUpdateSubAccountStrategy(id, newRiskLevel);
}

export function deleteSubAccount(id: string): void {
  serviceDeleteSubAccount(id);
}

export function getFundTransactions(): FundTransaction[] {
  return getAllTransactions() as any;
}

export function storeFundTransactions(txs: FundTransaction[]): void {
  if (typeof window !== "undefined") {
    localStorage.setItem("gotti_fund_transactions", JSON.stringify(txs));
  }
}

export function fundSubAccount(
  subAccountId: string,
  amount: number,
  paymentMethod: string = "Instant Card (Stripe)"
): SubAccount {
  return serviceFundSubAccount(subAccountId, amount, paymentMethod);
}

export function getSubAccountCash(subAccountId: string): number {
  const account = getSubAccountById(subAccountId);
  return account?.cashBalance || 0;
}

// Re-export all centralized store methods
export {
  getUserProfile,
  updateUserProfile,
  isUserAuthenticated,
  getAllSubAccounts,
  getSubAccountById,
  getActiveSubAccount,
  getAggregatedFinancials,
  getAllTransactions,
  recordTransaction,
  getSubAccountHoldings,
  getSubAccountWithDetails,
  exportFullUserData,
  importFullUserData,
  resetToDefaultState
};
