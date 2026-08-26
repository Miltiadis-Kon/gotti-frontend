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
    title: "What is the initial capital amount you are dedicating to this automated portfolio?",
    category: "Capital Allocation",
    options: [
      { id: "A", text: "Less than €2,500", points: 1 },
      { id: "B", text: "€2,500 – €15,000", points: 2 },
      { id: "C", text: "€15,000 – €50,000", points: 3 },
      { id: "D", text: "€50,000+", points: 4 }
    ]
  },
  {
    id: 2,
    title: "What is your expected annualized return over the course of a 12-month period?",
    category: "Return Target",
    options: [
      { id: "A", text: "4% – 7%", description: "Priority is beating inflation and bank savings with minimal capital risk (Boomer Haven)", points: 1 },
      { id: "B", text: "8% – 12%", description: "Matching broad equity market benchmark averages (Sleep-Tight)", points: 2 },
      { id: "C", text: "13% – 20%", description: "Outperforming the market while accepting moderate periodic drawdowns (Steady Grind)", points: 3 },
      { id: "D", text: "20% – 30%+", description: "Maximum capital multiplication, fully accepting high volatility swings (Apex Hunter / Diamond Hands)", points: 4 }
    ]
  },
  {
    id: 3,
    title: "How long do you intend to leave your funds invested without requiring withdrawals?",
    category: "Investment Horizon",
    options: [
      { id: "A", text: "Less than 1 year (Liquidity focus)", points: 1 },
      { id: "B", text: "1 to 3 years (Medium-term compounder)", points: 2 },
      { id: "C", text: "3 to 5 years (Full market cycle)", points: 3 },
      { id: "D", text: "5+ years (Multi-year wealth generation)", points: 4 }
    ]
  },
  {
    id: 4,
    title: "How would you psychologically react if your portfolio suffered an unrealized -15% drawdown in a single month?",
    category: "Drawdown Tolerance",
    options: [
      { id: "A", text: "Panic and liquidate immediately to protect remaining cash balance", points: 1 },
      { id: "B", text: "Feel severe anxiety and consider switching to a safer cash allocation", points: 2 },
      { id: "C", text: "Stay calm and let the quantitative algorithmic model rebalance automatically", points: 3 },
      { id: "D", text: "Excited to deposit and deploy additional capital at temporary market discounts", points: 4 }
    ]
  },
  {
    id: 5,
    title: "What is your primary investment goal with the Gotti Automated Trading Platform?",
    category: "Primary Objective",
    options: [
      { id: "A", text: "Capital preservation and stable dividend yields (Boomer Haven)", points: 1 },
      { id: "B", text: "Steady, index-tracking long-term wealth growth (Sleep-Tight)", points: 2 },
      { id: "C", text: "Balanced alpha and active systematic trend rebalancing (Steady Grind)", points: 3 },
      { id: "D", text: "Aggressive capital multiplication via breakout equities & high-beta runners (Apex Hunter / Diamond Hands)", points: 4 }
    ]
  },
  {
    id: 6,
    title: "Which best describes your past experience with stock markets, algorithmic trading, and ETFs?",
    category: "Experience Level",
    options: [
      { id: "A", text: "Beginner: Little to no prior investing or trading experience", points: 1 },
      { id: "B", text: "Intermediate: Familiar with passive index funds and blue-chip equities", points: 2 },
      { id: "C", text: "Advanced: Active stock investor accustomed to quarterly earnings and volatility", points: 3 },
      { id: "D", text: "Expert: Experienced algorithmic, derivative, or high-beta momentum trader", points: 4 }
    ]
  },
  {
    id: 7,
    title: "What is the maximum portfolio drawdown from peak Net Asset Value you are willing to tolerate in a severe bear market?",
    category: "Max Acceptable Loss",
    options: [
      { id: "A", text: "Less than 5% maximum drawdown", points: 1 },
      { id: "B", text: "6% to 15% temporary drawdown", points: 2 },
      { id: "C", text: "16% to 25% cyclical drawdown", points: 3 },
      { id: "D", text: "25%+ deep drawdown in exchange for explosive recovery potential", points: 4 }
    ]
  },
  {
    id: 8,
    title: "How stable and reliable is your personal regular income / employment cash flow?",
    category: "Financial Stability",
    options: [
      { id: "A", text: "Unpredictable or near retirement; heavily relying on existing savings", points: 1 },
      { id: "B", text: "Relatively stable, but with limited discretionary surplus each month", points: 2 },
      { id: "C", text: "Very stable income with consistent monthly savings available", points: 3 },
      { id: "D", text: "High and secure cash flow with substantial emergency reserves outside Gotti", points: 4 }
    ]
  },
  {
    id: 9,
    title: "What is your preference regarding trading turnover and portfolio holding periods?",
    category: "Turnover Style",
    options: [
      { id: "A", text: "Buy-and-hold forever: ultra-low turnover and minimal rebalancing (Boomer Haven)", points: 1 },
      { id: "B", text: "Semi-annual rebalancing: multi-year holdings with slow drift correction (Sleep-Tight)", points: 2 },
      { id: "C", text: "Monthly systematic trend rotation: tactical sector rebalancing (Steady Grind)", points: 3 },
      { id: "D", text: "Dynamic swing momentum: rapid execution capturing market rotations (Apex Hunter / Diamond Hands)", points: 4 }
    ]
  },
  {
    id: 10,
    title: "If you had to choose between a guaranteed +6% annual return and a 50/50 chance of +35% or -15%, which would you choose?",
    category: "Asymmetric Risk Choice",
    options: [
      { id: "A", text: "Definitely the guaranteed +6% annual return", points: 1 },
      { id: "B", text: "Lean towards guaranteed return with a small speculative tilt", points: 2 },
      { id: "C", text: "Lean towards the 50/50 upside opportunity", points: 3 },
      { id: "D", text: "Definitely the 50/50 chance for +35% explosive upside", points: 4 }
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

  if (totalScore <= 15) return RISK_PROFILES[1];
  if (totalScore <= 22) return RISK_PROFILES[2];
  if (totalScore <= 29) return RISK_PROFILES[3];
  if (totalScore <= 35) return RISK_PROFILES[4];
  return RISK_PROFILES[5];
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
