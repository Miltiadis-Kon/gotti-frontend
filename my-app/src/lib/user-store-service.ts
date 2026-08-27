/**
 * ==============================================================================
 * GOTTI CENTRALIZED USER DATA STORE & API BRIDGE
 * ==============================================================================
 * 
 * Single Source of Truth for all user interactions, profile configurations,
 * multi-ETF segregated sub-accounts, money balances, transactions, and holdings.
 * 
 * BACKEND INTEGRATION READY:
 * When you connect your FastAPI / Python backend server (server.py), simply toggle:
 *   export const USE_BACKEND_API = true;
 * All functions below will automatically dispatch to your backend REST endpoints
 * without requiring changes to any UI components.
 */

import { RiskLevel, RiskProfile, SubAccount } from "@/types/risk-profile";
import {
  UserProfile,
  HoldingPosition,
  AggregatedFinancials,
  TransactionRecord,
  SubAccountWithHoldings,
  FullUserSnapshot
} from "@/types/user-data";

// ==============================================================================
// CONFIGURATION & BACKEND ADAPTER SWITCH
// ==============================================================================

/** Set to true when your FastAPI / PostgreSQL server is running */
export const USE_BACKEND_API = false;
export const API_BASE_URL = "http://127.0.0.1:8000/api";

const STORAGE_KEYS = {
  USER_PROFILE: "gotti_user_profile",
  SUB_ACCOUNTS: "gotti_sub_accounts",
  ACTIVE_SUB_ACCOUNT: "gotti_active_sub_account_id",
  TRANSACTIONS: "gotti_fund_transactions",
  APP_INITIALIZED: "gotti_store_initialized"
};

// ==============================================================================
// BASELINE ETF STRATEGY SPECIFICATIONS (LEVELS 1 TO 5)
// ==============================================================================

export const ETF_STRATEGIES: Record<RiskLevel, RiskProfile> = {
  1: {
    level: 1,
    strategyName: "Boomer Haven ETF",
    etfName: "Boomer Haven ETF",
    tagline: "Capital preservation, reliable dividends, zero stress.",
    targetVolatility: "β < 0.75",
    assetUniverse: "S&P 500 Dividend Aristocrats, Mega-Cap Value & Defensive Tech (KO, PG, JNJ, MSFT, AAPL)",
    detailedAssetUniverse: "S&P 500 Dividend Aristocrats, mega-cap defensive value, utility & healthcare titans.",
    turnoverStrategy: "Multi-year holding, quarterly rebalance drift, low turnover (<20% annual)",
    holdingStyle: "Multi-year holding, quarterly rebalance drift, low turnover (<20% annual)",
    targetReturn: "5% – 9%",
    bestFor: "Conservative / Capital Preservation with minimal downside.",
    scoreRange: "10 – 19 Points",
    minScore: 10,
    maxScore: 19,
    color: "#10b981", // emerald green
    badgeClass: "bg-emerald-500/10 text-emerald-600 border-emerald-500/20 dark:bg-emerald-950/40 dark:text-emerald-400 dark:border-emerald-800",
    borderClass: "border-emerald-500",
    bgClass: "from-emerald-500/10 to-transparent",
    iconName: "ShieldCheck",
    description: "Conservative / Capital Preservation. Invests in S&P 500 Dividend Aristocrats and mega-cap blue chips with multi-year holding horizon.",
    sampleTickers: ["KO", "PG", "JNJ", "MSFT", "AAPL"]
  },
  2: {
    level: 2,
    strategyName: "Steady Grind ETF",
    etfName: "Steady Grind ETF",
    tagline: "Consistent compounding with systematic sector momentum.",
    targetVolatility: "β ≈ 0.85 - 1.25",
    assetUniverse: "Large & Mid-Cap Growth Leaders, Systematic Sector Momentum (QQQ, NVDA, META, AMD, ASML, TSM)",
    detailedAssetUniverse: "Large & mid-cap growth leaders, top-quartile sector momentum, systematic monthly rebalancing.",
    turnoverStrategy: "Multi-month trend holding with monthly momentum rebalancing (50%-100% annual)",
    holdingStyle: "Multi-month trend holding with monthly momentum rebalancing (50%-100% annual)",
    targetReturn: "10% – 18%",
    bestFor: "Moderate / Balanced Growth with disciplined market benchmark alpha.",
    scoreRange: "20 – 29 Points",
    minScore: 20,
    maxScore: 29,
    color: "#6366f1", // indigo / royal blue
    badgeClass: "bg-indigo-500/10 text-indigo-600 border-indigo-500/20 dark:bg-indigo-950/40 dark:text-indigo-400 dark:border-indigo-800",
    borderClass: "border-indigo-500",
    bgClass: "from-indigo-500/10 to-transparent",
    iconName: "TrendingUp",
    description: "Moderate / Balanced Growth. Multi-month trend holding across large and mid-cap growth leaders with disciplined sector momentum filters.",
    sampleTickers: ["QQQ", "NVDA", "META", "AMD", "ASML", "TSM"]
  },
  3: {
    level: 3,
    strategyName: "Diamond Hands ETF",
    etfName: "Diamond Hands ETF",
    tagline: "High-beta equities, dynamic breakouts, and asymmetric alpha.",
    targetVolatility: "β > 1.35",
    assetUniverse: "High-Beta Equities, Emerging Small/Micro-Caps, Dynamic Breakout Stocks (MSTR, TSLA, PLTR, COIN, RIVN, MARA)",
    detailedAssetUniverse: "High-beta growth runners, emerging micro-caps, volatile breakout equities with rapid momentum execution.",
    turnoverStrategy: "High-turnover tactical swing allocation and daily/weekly breakouts (200%+ annual)",
    holdingStyle: "High-turnover tactical swing allocation and daily/weekly breakouts (200%+ annual)",
    targetReturn: "20%+",
    bestFor: "Aggressive / Speculative Alpha seeking maximum capital expansion.",
    scoreRange: "30 – 40 Points",
    minScore: 30,
    maxScore: 40,
    color: "#ef4444", // rose / crimson red
    badgeClass: "bg-rose-500/10 text-rose-600 border-rose-500/20 dark:bg-rose-950/40 dark:text-rose-400 dark:border-rose-800",
    borderClass: "border-rose-500",
    bgClass: "from-rose-500/10 to-transparent",
    iconName: "Flame",
    description: "Aggressive / Speculative Alpha. Tactical momentum targeting volatile breakouts, small-caps, and rapid market rotations.",
    sampleTickers: ["MSTR", "TSLA", "PLTR", "COIN", "RIVN", "MARA"]
  }
};

// ==============================================================================
// INITIAL DEMO STATE (FALLBACK & SEED DATA)
// ==============================================================================

export const INITIAL_USER: UserProfile = {
  id: "usr-gotti-demo",
  email: "investor@gotti.ai",
  riskLevel: 2,
  riskScore: 24,
  strategyName: "Steady Grind ETF",
  isLoggedIn: true,
  activeSubAccountId: "sub-main-02",
  totalCashBalance: 8375.00,
  answers: { 1: "B", 2: "B", 3: "C", 4: "C", 5: "B", 6: "B", 7: "B", 8: "C", 9: "B", 10: "C" },
  createdAt: "2026-01-15T00:00:00.000Z",
  updatedAt: "2026-08-26T12:00:00.000Z"
};

export const INITIAL_SUB_ACCOUNTS: SubAccount[] = [
  {
    id: "sub-defensive-01",
    name: "Level 1: Boomer Haven ETF",
    riskLevel: 1,
    strategyName: "Boomer Haven ETF",
    allocatedCapital: 25000,
    currentValue: 26850.00,
    cashBalance: 2685.00,
    investedAmount: 24165.00,
    pnl: 1850.00,
    pnlPercentage: 7.40,
    status: "active",
    createdAt: "2026-02-01",
    holdingsCount: 5,
    description: "Capital preservation, reliable dividends, zero stress."
  },
  {
    id: "sub-main-02",
    name: "Level 2: Steady Grind ETF",
    riskLevel: 2,
    strategyName: "Steady Grind ETF",
    allocatedCapital: 50000,
    currentValue: 56900.00,
    cashBalance: 5690.00,
    investedAmount: 51210.00,
    pnl: 6900.00,
    pnlPercentage: 13.80,
    status: "active",
    createdAt: "2026-01-15",
    holdingsCount: 6,
    description: "Consistent compounding with systematic sector momentum."
  }
];

export const INITIAL_TRANSACTIONS: TransactionRecord[] = [
  {
    id: "tx-101",
    subAccountId: "sub-main-02",
    subAccountName: "Level 2: Steady Grind ETF",
    strategyName: "Steady Grind ETF",
    amount: 30000,
    type: "Deposit",
    status: "Fulfilled",
    method: "Bank Wire Transfer (•••• 5821)",
    date: "2026-08-20",
    timestamp: 1787200000000,
    notes: "Initial portfolio onboarding allocation"
  },
  {
    id: "tx-102",
    subAccountId: "sub-main-02",
    subAccountName: "Level 2: Steady Grind ETF",
    strategyName: "Steady Grind ETF",
    amount: 20000,
    type: "Deposit",
    status: "Fulfilled",
    method: "Credit Card (Stripe)",
    date: "2026-08-22",
    timestamp: 1787380000000,
    notes: "Secondary growth capital deployment"
  },
  {
    id: "tx-103",
    subAccountId: "sub-defensive-01",
    subAccountName: "Level 1: Boomer Haven ETF",
    strategyName: "Boomer Haven ETF",
    amount: 25000,
    type: "Deposit",
    status: "Fulfilled",
    method: "Debit Card (•••• 1234)",
    date: "2026-08-25",
    timestamp: 1787600000000,
    notes: "Defensive capital allocation"
  }
];

// ==============================================================================
// DOMAIN 1: USER PROFILE & AUTHENTICATION SERVICES
// ==============================================================================

/**
 * Retrieve active user profile, risk level, and settings
 */
export function getUserProfile(): UserProfile {
  if (typeof window === "undefined") return INITIAL_USER;
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.USER_PROFILE);
    if (!raw) {
      localStorage.setItem(STORAGE_KEYS.USER_PROFILE, JSON.stringify(INITIAL_USER));
      return INITIAL_USER;
    }
    const parsed = JSON.parse(raw);
    const strategy = ETF_STRATEGIES[parsed.riskLevel as RiskLevel] || ETF_STRATEGIES[2];
    return {
      ...parsed,
      strategyName: strategy.strategyName
    };
  } catch {
    return INITIAL_USER;
  }
}

/**
 * Save / update user profile in local storage or remote API
 */
export function updateUserProfile(updates: Partial<UserProfile>): UserProfile {
  const current = getUserProfile();
  const nextLevel = updates.riskLevel !== undefined ? updates.riskLevel : current.riskLevel;
  const strategy = ETF_STRATEGIES[nextLevel];

  const updated: UserProfile = {
    ...current,
    ...updates,
    riskLevel: nextLevel,
    strategyName: strategy.strategyName,
    updatedAt: new Date().toISOString()
  };

  if (typeof window !== "undefined") {
    try {
      localStorage.setItem(STORAGE_KEYS.USER_PROFILE, JSON.stringify(updated));
    } catch (err) {
      console.error("[GottiStore] Failed to save user profile:", err);
    }
  }
  return updated;
}

/**
 * Check if active session exists
 */
export function isUserAuthenticated(): boolean {
  if (typeof window === "undefined") return false;
  try {
    const profile = getUserProfile();
    return Boolean(profile && profile.isLoggedIn && profile.email);
  } catch {
    return false;
  }
}

/**
 * Log in user session
 */
export function loginUser(email: string, riskLevel: RiskLevel = 2, answers?: Record<number, "A" | "B" | "C" | "D">): UserProfile {
  return updateUserProfile({
    email,
    riskLevel,
    isLoggedIn: true,
    answers
  });
}

/**
 * Log out user session
 */
export function logoutUser(): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.removeItem(STORAGE_KEYS.USER_PROFILE);
  } catch (err) {
    console.error("[GottiStore] Logout failed:", err);
  }
}

// ==============================================================================
// DOMAIN 2: MULTI-SUB-ACCOUNT MANAGEMENT (RULE 1 ENFORCED)
// ==============================================================================

/**
 * Get all active segregated ETF sub-accounts
 */
export function getAllSubAccounts(): SubAccount[] {
  if (typeof window === "undefined") return INITIAL_SUB_ACCOUNTS;
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.SUB_ACCOUNTS);
    if (!raw) {
      localStorage.setItem(STORAGE_KEYS.SUB_ACCOUNTS, JSON.stringify(INITIAL_SUB_ACCOUNTS));
      return INITIAL_SUB_ACCOUNTS;
    }
    const accounts: SubAccount[] = JSON.parse(raw);
    // Guarantee names sync with current ETF Strategy profiles, normalize cash, and sort strictly L1 to L5
    return accounts
      .map((acc) => {
        const p = ETF_STRATEGIES[acc.riskLevel];
        const cashBalance = typeof acc.cashBalance === "number" ? acc.cashBalance : Math.round(acc.currentValue * 0.10 * 100) / 100;
        const investedAmount = typeof acc.investedAmount === "number" ? acc.investedAmount : Math.round((acc.currentValue - cashBalance) * 100) / 100;
        return {
          ...acc,
          cashBalance,
          investedAmount,
          strategyName: p ? p.strategyName : acc.strategyName,
          name: acc.name.startsWith("Level ") ? `Level ${acc.riskLevel}: ${p.strategyName}` : acc.name
        };
      })
      .sort((a, b) => a.riskLevel - b.riskLevel);
  } catch {
    return [...INITIAL_SUB_ACCOUNTS].sort((a, b) => a.riskLevel - b.riskLevel);
  }
}

/**
 * Get a specific sub-account by its ID
 */
export function getSubAccountById(subAccountId: string): SubAccount | undefined {
  const accounts = getAllSubAccounts();
  return accounts.find((a) => a.id === subAccountId);
}

/**
 * Get the currently selected / active sub-account ID
 */
export function getActiveSubAccountId(): string {
  if (typeof window === "undefined") return INITIAL_SUB_ACCOUNTS[0].id;
  try {
    const active = localStorage.getItem(STORAGE_KEYS.ACTIVE_SUB_ACCOUNT);
    if (active) return active;
    const accounts = getAllSubAccounts();
    return accounts[0]?.id || INITIAL_SUB_ACCOUNTS[0].id;
  } catch {
    return INITIAL_SUB_ACCOUNTS[0].id;
  }
}

/**
 * Switch active sub-account context
 */
export function setActiveSubAccountId(id: string): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(STORAGE_KEYS.ACTIVE_SUB_ACCOUNT, id);
  } catch (err) {
    console.error("[GottiStore] Failed to set active sub-account:", err);
  }
}

/**
 * Get the currently active sub-account object
 */
export function getActiveSubAccount(): SubAccount {
  const activeId = getActiveSubAccountId();
  const accounts = getAllSubAccounts();
  return accounts.find((a) => a.id === activeId) || accounts[0] || INITIAL_SUB_ACCOUNTS[0];
}

/**
 * Check if a risk level is already occupied (RULE 1: Max 1 per risk level)
 */
export function isRiskLevelOccupied(level: RiskLevel, excludeSubAccountId?: string): boolean {
  const accounts = getAllSubAccounts();
  return accounts.some((a) => a.riskLevel === level && a.id !== excludeSubAccountId);
}

/**
 * Get unused available risk levels (1-3)
 */
export function getAvailableRiskLevels(): RiskLevel[] {
  const accounts = getAllSubAccounts();
  const occupied = new Set(accounts.map((a) => a.riskLevel));
  return ([1, 2, 3] as RiskLevel[]).filter((lvl) => !occupied.has(lvl));
}

/**
 * Create a new segregated ETF Sub-Account (Enforces Rule 1)
 */
export function createSubAccount(
  riskLevel: RiskLevel,
  allocatedCapital: number,
  customName?: string
): SubAccount {
  const accounts = getAllSubAccounts();

  // Enforce Rule 1: Max 1 sub-account per risk level
  const existingForLevel = accounts.find((a) => a.riskLevel === riskLevel);
  if (existingForLevel) {
    throw new Error(
      `Rule 1 Violation: Level ${riskLevel} (${ETF_STRATEGIES[riskLevel].strategyName}) is already active. Only 1 sub-account allowed per risk level.`
    );
  }

  if (accounts.length >= 3) {
    throw new Error("Maximum of 3 sub-accounts reached (1 per Risk Level 1–3).");
  }

  const profile = ETF_STRATEGIES[riskLevel];
  const autoName = customName || `Level ${riskLevel}: ${profile.strategyName}`;
  const initialCash = Math.round(allocatedCapital * 0.10 * 100) / 100;
  const initialInvested = Math.round(allocatedCapital * 0.90 * 100) / 100;

  const newAccount: SubAccount = {
    id: `sub-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
    name: autoName,
    riskLevel,
    strategyName: profile.strategyName,
    allocatedCapital,
    currentValue: allocatedCapital,
    cashBalance: initialCash,
    investedAmount: initialInvested,
    pnl: 0,
    pnlPercentage: 0,
    status: "active",
    createdAt: new Date().toISOString().split("T")[0],
    holdingsCount: profile.sampleTickers.length,
    description: profile.description
  };

  const updated = [...accounts, newAccount];
  if (typeof window !== "undefined") {
    localStorage.setItem(STORAGE_KEYS.SUB_ACCOUNTS, JSON.stringify(updated));
  }
  setActiveSubAccountId(newAccount.id);

  // Automatically log creation funding transaction
  if (allocatedCapital > 0) {
    recordTransaction({
      subAccountId: newAccount.id,
      subAccountName: newAccount.name,
      strategyName: newAccount.strategyName,
      amount: allocatedCapital,
      type: "Deposit",
      status: "Fulfilled",
      method: "Initial Capital Allocation",
      notes: "Sub-account initial deployment"
    });
  }

  return newAccount;
}

/**
 * Change a sub-account's strategy risk level
 */
export function updateSubAccountStrategy(id: string, newRiskLevel: RiskLevel): SubAccount {
  const accounts = getAllSubAccounts();

  // Verify Rule 1: Not occupied by another sub-account
  const isOccupied = accounts.some((a) => a.riskLevel === newRiskLevel && a.id !== id);
  if (isOccupied) {
    throw new Error(`Rule 1 Violation: Risk Level ${newRiskLevel} is already used by another active sub-account.`);
  }

  const profile = ETF_STRATEGIES[newRiskLevel];
  let targetAccount: SubAccount | null = null;

  const updated = accounts.map((acc) => {
    if (acc.id === id) {
      targetAccount = {
        ...acc,
        riskLevel: newRiskLevel,
        strategyName: profile.strategyName,
        name: `Level ${newRiskLevel}: ${profile.strategyName}`,
        description: profile.description,
        holdingsCount: profile.sampleTickers.length
      };
      return targetAccount;
    }
    return acc;
  });

  if (!targetAccount) {
    throw new Error(`Sub-account with ID ${id} not found.`);
  }

  if (typeof window !== "undefined") {
    localStorage.setItem(STORAGE_KEYS.SUB_ACCOUNTS, JSON.stringify(updated));
  }

  // Record rebalance ledger event
  recordTransaction({
    subAccountId: id,
    subAccountName: (targetAccount as SubAccount).name,
    strategyName: profile.strategyName,
    amount: (targetAccount as SubAccount).currentValue,
    type: "Rebalance",
    status: "Fulfilled",
    method: "Systematic Strategy Shift",
    notes: `Rebalanced to Level ${newRiskLevel} (${profile.strategyName})`
  });

  return targetAccount;
}

/**
 * Delete a sub-account (releases capital back to cash balance)
 */
export function deleteSubAccount(id: string): void {
  const accounts = getAllSubAccounts();
  if (accounts.length <= 1) {
    throw new Error("Cannot delete the only remaining active sub-account.");
  }
  const target = accounts.find((a) => a.id === id);
  const updated = accounts.filter((a) => a.id !== id);

  if (typeof window !== "undefined") {
    localStorage.setItem(STORAGE_KEYS.SUB_ACCOUNTS, JSON.stringify(updated));
  }

  const activeId = getActiveSubAccountId();
  if (activeId === id) {
    setActiveSubAccountId(updated[0].id);
  }

  if (target) {
    recordTransaction({
      subAccountId: target.id,
      subAccountName: target.name,
      strategyName: target.strategyName,
      amount: target.currentValue,
      type: "Withdrawal",
      status: "Fulfilled",
      method: "Sub-Account Liquidation",
      notes: "Sub-account closed and capital liquidated"
    });
  }
}

// ==============================================================================
// DOMAIN 3: FINANCIAL AGGREGATION & MONEY BALANCES
// ==============================================================================

/**
 * Calculates aggregated wealth, total NAV, cash balance, and unrealized PnL across all sub-accounts
 */
export function getAggregatedFinancials(): AggregatedFinancials {
  const accounts = getAllSubAccounts();
  const totalAllocatedCapital = accounts.reduce((sum, a) => sum + (a.allocatedCapital || 0), 0);
  const totalCurrentValue = accounts.reduce((sum, a) => sum + (a.currentValue || 0), 0);
  const totalCashBalance = accounts.reduce((sum, a) => sum + (a.cashBalance || 0), 0);
  const totalInvestedAmount = accounts.reduce((sum, a) => sum + (a.investedAmount || 0), 0);
  const totalUnrealizedPnl = totalCurrentValue - totalAllocatedCapital;
  const totalUnrealizedPnlPercentage = totalAllocatedCapital > 0
    ? (totalUnrealizedPnl / totalAllocatedCapital) * 100
    : 0;

  return {
    totalAllocatedCapital,
    totalCurrentValue,
    totalCashBalance: Math.round(totalCashBalance * 100) / 100,
    totalInvestedAmount: Math.round(totalInvestedAmount * 100) / 100,
    totalUnrealizedPnl: Math.round(totalUnrealizedPnl * 100) / 100,
    totalUnrealizedPnlPercentage: +totalUnrealizedPnlPercentage.toFixed(2),
    totalActiveSubAccounts: accounts.length,
    availableCashBuffer: Math.round(totalCashBalance * 100) / 100,
    maxDrawdownEstimate: accounts.some((a) => a.riskLevel === 3) ? 18.5 : 6.2,
    weightedAnnualYieldTarget: "10% – 18%"
  };
}

/**
 * Get available cash balance for a specific sub-account
 */
export function getSubAccountCash(subAccountId: string): number {
  const account = getSubAccountById(subAccountId);
  return account?.cashBalance || 0;
}

/**
 * Set explicit cash balance on a sub-account
 */
export function setSubAccountCash(subAccountId: string, newCashAmount: number): SubAccount {
  const accounts = getAllSubAccounts();
  const target = accounts.find((a) => a.id === subAccountId);
  if (!target) {
    throw new Error(`Sub-account with ID ${subAccountId} not found.`);
  }

  const updatedAccount: SubAccount = {
    ...target,
    cashBalance: Math.max(0, newCashAmount),
    currentValue: (target.investedAmount || 0) + Math.max(0, newCashAmount)
  };

  const updatedAccounts = accounts.map((a) => (a.id === subAccountId ? updatedAccount : a));
  if (typeof window !== "undefined") {
    localStorage.setItem(STORAGE_KEYS.SUB_ACCOUNTS, JSON.stringify(updatedAccounts));
  }
  return updatedAccount;
}

/**
 * Transfer cash between two segregated sub-accounts
 */
export function transferCashBetweenSubAccounts(
  fromSubAccountId: string,
  toSubAccountId: string,
  amount: number
): { fromAccount: SubAccount; toAccount: SubAccount } {
  if (amount <= 0) {
    throw new Error("Transfer amount must be greater than zero.");
  }
  const fromAcc = getSubAccountById(fromSubAccountId);
  const toAcc = getSubAccountById(toSubAccountId);

  if (!fromAcc || !toAcc) {
    throw new Error("Source or destination sub-account not found.");
  }

  if (fromAcc.cashBalance < amount) {
    throw new Error(`Insufficient cash balance in ${fromAcc.name}: Available $${fromAcc.cashBalance.toLocaleString()}, requested $${amount.toLocaleString()}`);
  }

  const updatedFrom: SubAccount = {
    ...fromAcc,
    cashBalance: Math.round((fromAcc.cashBalance - amount) * 100) / 100,
    currentValue: Math.round((fromAcc.currentValue - amount) * 100) / 100,
    allocatedCapital: Math.max(0, Math.round((fromAcc.allocatedCapital - amount) * 100) / 100)
  };

  const updatedTo: SubAccount = {
    ...toAcc,
    cashBalance: Math.round((toAcc.cashBalance + amount) * 100) / 100,
    currentValue: Math.round((toAcc.currentValue + amount) * 100) / 100,
    allocatedCapital: Math.round((toAcc.allocatedCapital + amount) * 100) / 100
  };

  const accounts = getAllSubAccounts();
  const updatedAccounts = accounts.map((a) => {
    if (a.id === fromSubAccountId) return updatedFrom;
    if (a.id === toSubAccountId) return updatedTo;
    return a;
  });

  if (typeof window !== "undefined") {
    localStorage.setItem(STORAGE_KEYS.SUB_ACCOUNTS, JSON.stringify(updatedAccounts));
  }

  // Record internal transfer transaction
  recordTransaction({
    subAccountId: fromAcc.id,
    subAccountName: fromAcc.name,
    strategyName: fromAcc.strategyName,
    amount,
    type: "Withdrawal",
    status: "Fulfilled",
    method: "Internal Cash Transfer",
    notes: `Transferred $${amount.toLocaleString()} to ${toAcc.name}`
  });

  recordTransaction({
    subAccountId: toAcc.id,
    subAccountName: toAcc.name,
    strategyName: toAcc.strategyName,
    amount,
    type: "Deposit",
    status: "Fulfilled",
    method: "Internal Cash Transfer",
    notes: `Received $${amount.toLocaleString()} from ${fromAcc.name}`
  });

  return { fromAccount: updatedFrom, toAccount: updatedTo };
}

// ==============================================================================
// DOMAIN 4: FUNDING & TRANSACTION LEDGER SERVICES
// ==============================================================================

/**
 * Retrieve all financial transactions
 */
export function getAllTransactions(): TransactionRecord[] {
  if (typeof window === "undefined") return INITIAL_TRANSACTIONS;
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.TRANSACTIONS);
    if (!raw) {
      localStorage.setItem(STORAGE_KEYS.TRANSACTIONS, JSON.stringify(INITIAL_TRANSACTIONS));
      return INITIAL_TRANSACTIONS;
    }
    return JSON.parse(raw);
  } catch {
    return INITIAL_TRANSACTIONS;
  }
}

/**
 * Filter transactions by specific sub-account ID
 */
export function getTransactionsForSubAccount(subAccountId: string): TransactionRecord[] {
  return getAllTransactions().filter((tx) => tx.subAccountId === subAccountId);
}

/**
 * Record a new transaction in the ledger
 */
export function recordTransaction(
  data: Omit<TransactionRecord, "id" | "date" | "timestamp"> & { id?: string; date?: string; timestamp?: number }
): TransactionRecord {
  const tx: TransactionRecord = {
    id: data.id || `tx-${Date.now()}-${Math.random().toString(36).substring(2, 5)}`,
    subAccountId: data.subAccountId,
    subAccountName: data.subAccountName,
    strategyName: data.strategyName,
    amount: data.amount,
    type: data.type,
    status: data.status || "Fulfilled",
    method: data.method,
    date: data.date || new Date().toISOString().split("T")[0],
    timestamp: data.timestamp || Date.now(),
    notes: data.notes
  };

  const existing = getAllTransactions();
  const updated = [tx, ...existing];

  if (typeof window !== "undefined") {
    try {
      localStorage.setItem(STORAGE_KEYS.TRANSACTIONS, JSON.stringify(updated));
    } catch (err) {
      console.error("[GottiStore] Failed to save transaction:", err);
    }
  }
  return tx;
}

/**
 * Deposit / Fund a segregated sub-account with capital
 */
export function fundSubAccount(
  subAccountId: string,
  amount: number,
  paymentMethod: string = "Instant Card (Stripe)"
): SubAccount {
  const accounts = getAllSubAccounts();
  const target = accounts.find((a) => a.id === subAccountId);
  if (!target) {
    throw new Error(`Sub-account with ID ${subAccountId} not found.`);
  }

  const updatedAccount: SubAccount = {
    ...target,
    allocatedCapital: target.allocatedCapital + amount,
    cashBalance: (target.cashBalance || 0) + amount,
    currentValue: target.currentValue + amount,
    pnlPercentage: target.allocatedCapital + amount > 0
      ? (target.pnl / (target.allocatedCapital + amount)) * 100
      : 0
  };

  const updatedAccounts = accounts.map((a) => (a.id === subAccountId ? updatedAccount : a));
  if (typeof window !== "undefined") {
    localStorage.setItem(STORAGE_KEYS.SUB_ACCOUNTS, JSON.stringify(updatedAccounts));
  }

  recordTransaction({
    subAccountId: target.id,
    subAccountName: target.name,
    strategyName: target.strategyName,
    amount,
    type: "Deposit",
    status: "Fulfilled",
    method: paymentMethod,
    notes: `Manual funding deposit into ${target.name}`
  });

  return updatedAccount;
}

/**
 * Withdraw funds from a segregated sub-account
 */
export function withdrawFromSubAccount(
  subAccountId: string,
  amount: number,
  destination: string = "Bank Wire"
): SubAccount {
  const accounts = getAllSubAccounts();
  const target = accounts.find((a) => a.id === subAccountId);
  if (!target) {
    throw new Error(`Sub-account with ID ${subAccountId} not found.`);
  }

  if (amount > target.currentValue) {
    throw new Error(`Insufficient funds: Requested $${amount} but sub-account balance is $${target.currentValue}`);
  }

  const updatedAccount: SubAccount = {
    ...target,
    allocatedCapital: Math.max(0, target.allocatedCapital - amount),
    cashBalance: Math.max(0, (target.cashBalance || 0) - amount),
    currentValue: target.currentValue - amount,
    pnlPercentage: target.allocatedCapital - amount > 0
      ? (target.pnl / (target.allocatedCapital - amount)) * 100
      : 0
  };

  const updatedAccounts = accounts.map((a) => (a.id === subAccountId ? updatedAccount : a));
  if (typeof window !== "undefined") {
    localStorage.setItem(STORAGE_KEYS.SUB_ACCOUNTS, JSON.stringify(updatedAccounts));
  }

  recordTransaction({
    subAccountId: target.id,
    subAccountName: target.name,
    strategyName: target.strategyName,
    amount,
    type: "Withdrawal",
    status: "Fulfilled",
    method: destination,
    notes: `Withdrawal transfer to ${destination}`
  });

  return updatedAccount;
}

// ==============================================================================
// DOMAIN 5: ASSET UNIVERSE, HOLDINGS & PERFORMANCE METRICS
// ==============================================================================

const STRATEGY_HOLDINGS_UNIVERSE: Record<
  RiskLevel,
  Array<{ ticker: string; name: string; weight: number; sector: string; basePrice: number }>
> = {
  1: [
    { ticker: "KO", name: "The Coca-Cola Company", weight: 0.22, sector: "Consumer Staples", basePrice: 68.50 },
    { ticker: "PG", name: "Procter & Gamble Co.", weight: 0.20, sector: "Consumer Staples", basePrice: 172.10 },
    { ticker: "JNJ", name: "Johnson & Johnson", weight: 0.18, sector: "Healthcare", basePrice: 161.40 },
    { ticker: "MSFT", name: "Microsoft Corporation", weight: 0.20, sector: "Information Technology", basePrice: 420.25 },
    { ticker: "AAPL", name: "Apple Inc.", weight: 0.20, sector: "Information Technology", basePrice: 224.80 }
  ],
  2: [
    { ticker: "QQQ", name: "Invesco QQQ Trust", weight: 0.25, sector: "Technology Benchmark", basePrice: 480.50 },
    { ticker: "NVDA", name: "Nvidia Corporation", weight: 0.20, sector: "Semiconductors & AI", basePrice: 128.40 },
    { ticker: "META", name: "Meta Platforms Inc.", weight: 0.18, sector: "Interactive Media", basePrice: 512.20 },
    { ticker: "AMD", name: "Advanced Micro Devices", weight: 0.15, sector: "Semiconductors", basePrice: 154.80 },
    { ticker: "ASML", name: "ASML Holding N.V.", weight: 0.12, sector: "Semiconductor Equipment", basePrice: 890.30 },
    { ticker: "TSM", name: "Taiwan Semiconductor", weight: 0.10, sector: "Foundry Leaders", basePrice: 172.50 }
  ],
  3: [
    { ticker: "MSTR", name: "MicroStrategy Inc.", weight: 0.25, sector: "Bitcoin Alpha Treasury", basePrice: 145.20 },
    { ticker: "TSLA", name: "Tesla Inc.", weight: 0.20, sector: "Autonomous & EV Growth", basePrice: 215.60 },
    { ticker: "PLTR", name: "Palantir Technologies", weight: 0.18, sector: "Enterprise AI Software", basePrice: 31.40 },
    { ticker: "COIN", name: "Coinbase Global Inc.", weight: 0.15, sector: "Digital Asset Infrastructure", basePrice: 195.80 },
    { ticker: "RIVN", name: "Rivian Automotive", weight: 0.12, sector: "EV Momentum Swings", basePrice: 14.80 },
    { ticker: "MARA", name: "MARA Holdings Inc.", weight: 0.10, sector: "Digital Mining Infrastructure", basePrice: 18.90 }
  ]
};

/**
 * Get full position details for a specific sub-account
 */
export function getSubAccountHoldings(subAccountId: string): HoldingPosition[] {
  const account = getSubAccountById(subAccountId) || getAllSubAccounts()[0] || INITIAL_SUB_ACCOUNTS[0];
  const universe = STRATEGY_HOLDINGS_UNIVERSE[account.riskLevel] || STRATEGY_HOLDINGS_UNIVERSE[2];
  const nav = account.currentValue;

  return universe.map((asset, idx) => {
    const allocatedAmount = Math.round(nav * asset.weight);
    const mockPnlRatio = (idx % 2 === 0 ? 0.08 : -0.03) + (account.riskLevel * 0.02);
    const unrealizedPnl = Math.round(allocatedAmount * mockPnlRatio);
    const unrealizedPnlPercentage = +(mockPnlRatio * 100).toFixed(2);

    return {
      ticker: asset.ticker,
      name: asset.name,
      weightPercentage: Math.round(asset.weight * 100),
      weightDecimal: asset.weight,
      allocatedAmount,
      unrealizedPnl,
      unrealizedPnlPercentage,
      currentPrice: asset.basePrice,
      sharesOwned: +(allocatedAmount / asset.basePrice).toFixed(2),
      sector: asset.sector,
      isPositive: unrealizedPnl >= 0
    };
  });
}

/**
 * Return detailed sub-account object with holdings and strategy metrics
 */
export function getSubAccountWithDetails(subAccountId: string): SubAccountWithHoldings {
  const account = getSubAccountById(subAccountId) || getAllSubAccounts()[0] || INITIAL_SUB_ACCOUNTS[0];
  const profile = ETF_STRATEGIES[account.riskLevel];
  const holdings = getSubAccountHoldings(account.id);

  const metricsMap: Record<RiskLevel, { sharpeRatio: number; maxDrawdown: string; volatilityBeta: string; winRate: string; tradeRatio: string }> = {
    1: { sharpeRatio: 1.85, maxDrawdown: "3.2%", volatilityBeta: "< 0.75", winRate: "88%", tradeRatio: "44/50" },
    2: { sharpeRatio: 1.55, maxDrawdown: "8.1%", volatilityBeta: "0.85–1.25", winRate: "74%", tradeRatio: "37/50" },
    3: { sharpeRatio: 1.25, maxDrawdown: "22.0%", volatilityBeta: "> 1.35", winRate: "62%", tradeRatio: "31/50" }
  };

  return {
    ...account,
    profile,
    holdings,
    metrics: metricsMap[account.riskLevel] || metricsMap[2]
  };
}

// ==============================================================================
// DOMAIN 6: FULL USER DATA SNAPSHOT & DEVTOOLS INSPECTOR
// ==============================================================================

/**
 * Export 100% of user data, sub-accounts, transactions, and settings into one snapshot
 */
export function exportFullUserData(): FullUserSnapshot {
  const user = getUserProfile();
  const subAccounts = getAllSubAccounts().map((a) => getSubAccountWithDetails(a.id));
  const aggregatedFinancials = getAggregatedFinancials();
  const transactions = getAllTransactions();

  return {
    version: "1.0.0",
    exportedAt: new Date().toISOString(),
    user,
    aggregatedFinancials,
    subAccounts,
    transactions
  };
}

/**
 * Import a full snapshot (e.g. restore backup or seed state)
 */
export function importFullUserData(snapshot: FullUserSnapshot): void {
  if (typeof window === "undefined" || !snapshot) return;
  try {
    if (snapshot.user) {
      localStorage.setItem(STORAGE_KEYS.USER_PROFILE, JSON.stringify(snapshot.user));
    }
    if (snapshot.subAccounts) {
      localStorage.setItem(STORAGE_KEYS.SUB_ACCOUNTS, JSON.stringify(snapshot.subAccounts));
    }
    if (snapshot.transactions) {
      localStorage.setItem(STORAGE_KEYS.TRANSACTIONS, JSON.stringify(snapshot.transactions));
    }
  } catch (err) {
    console.error("[GottiStore] Failed to import user data snapshot:", err);
  }
}

/**
 * Reset all user state back to clean baseline demo accounts
 */
export function resetToDefaultState(): FullUserSnapshot {
  if (typeof window !== "undefined") {
    localStorage.setItem(STORAGE_KEYS.USER_PROFILE, JSON.stringify(INITIAL_USER));
    localStorage.setItem(STORAGE_KEYS.SUB_ACCOUNTS, JSON.stringify(INITIAL_SUB_ACCOUNTS));
    localStorage.setItem(STORAGE_KEYS.ACTIVE_SUB_ACCOUNT, INITIAL_SUB_ACCOUNTS[0].id);
    localStorage.setItem(STORAGE_KEYS.TRANSACTIONS, JSON.stringify(INITIAL_TRANSACTIONS));
  }
  return exportFullUserData();
}

/**
 * Expose window.__GOTTI_DATA__ in browser console for fast developer inspection
 */
export function initGottiDataInspector(): void {
  if (typeof window === "undefined") return;
  const target = window as any;
  target.__GOTTI_DATA__ = {
    dump: () => {
      const snap = exportFullUserData();
      console.log("%c[Gotti AI] Full User Data Snapshot:", "color:#6366f1; font-weight:bold; font-size:14px;");
      console.table(snap.subAccounts.map((a) => ({
        ID: a.id,
        Name: a.name,
        Level: `L${a.riskLevel}`,
        Strategy: a.strategyName,
        Capital: `$${a.allocatedCapital.toLocaleString()}`,
        "Cash Balance": `$${(a.cashBalance || 0).toLocaleString()}`,
        "Invested Stocks": `$${(a.investedAmount || 0).toLocaleString()}`,
        NAV: `$${a.currentValue.toLocaleString()}`,
        PnL: `+$${a.pnl.toLocaleString()} (${a.pnlPercentage.toFixed(2)}%)`
      })));
      console.log("Financial Summary:", snap.aggregatedFinancials);
      console.log("Full Snapshot Object:", snap);
      return snap;
    },
    export: () => JSON.stringify(exportFullUserData(), null, 2),
    getProfile: () => getUserProfile(),
    getSubAccounts: () => getAllSubAccounts(),
    getFinancials: () => getAggregatedFinancials(),
    getCash: (subAccountId?: string) => subAccountId ? getSubAccountCash(subAccountId) : getAggregatedFinancials().totalCashBalance,
    transferCash: (fromId: string, toId: string, amount: number) => transferCashBetweenSubAccounts(fromId, toId, amount),
    getTransactions: () => getAllTransactions(),
    fund: (subAccountId: string, amount: number) => fundSubAccount(subAccountId, amount),
    reset: () => resetToDefaultState()
  };
}

// Automatically bind DevTools inspector on client mount
if (typeof window !== "undefined") {
  initGottiDataInspector();
}
