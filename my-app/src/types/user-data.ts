import { RiskLevel, RiskProfile, SubAccount } from "./risk-profile";

/**
 * Detailed position/holding model inside an ETF strategy
 */
export interface HoldingPosition {
  ticker: string;
  name: string;
  weightPercentage: number;
  weightDecimal: number;
  allocatedAmount: number;
  unrealizedPnl: number;
  unrealizedPnlPercentage: number;
  currentPrice: number;
  sharesOwned: number;
  sector: string;
  isPositive: boolean;
}

/**
 * Aggregated user wealth & portfolio financial summary
 */
export interface AggregatedFinancials {
  totalAllocatedCapital: number;
  totalCurrentValue: number;
  totalCashBalance: number;
  totalInvestedAmount: number;
  totalUnrealizedPnl: number;
  totalUnrealizedPnlPercentage: number;
  totalActiveSubAccounts: number;
  availableCashBuffer: number;
  maxDrawdownEstimate: number;
  weightedAnnualYieldTarget: string;
}

/**
 * Financial ledger transaction record (Deposits, Withdrawals, Rebalances)
 */
export interface TransactionRecord {
  id: string;
  subAccountId: string;
  subAccountName: string;
  strategyName: string;
  amount: number;
  type: "Deposit" | "Withdrawal" | "Rebalance" | "Dividend";
  status: "Fulfilled" | "Pending" | "Processing" | "Failed";
  method: string;
  date: string;
  timestamp: number;
  notes?: string;
}

/**
 * User profile identity and configuration
 */
export interface UserProfile {
  id: string;
  email: string;
  riskLevel: RiskLevel;
  riskScore?: number;
  strategyName: string;
  isLoggedIn: boolean;
  activeSubAccountId: string;
  totalCashBalance?: number;
  answers?: Record<number, "A" | "B" | "C" | "D">;
  createdAt: string;
  updatedAt: string;
}

/**
 * Complete sub-account view including live calculated holdings
 */
export interface SubAccountWithHoldings extends SubAccount {
  profile: RiskProfile;
  holdings: HoldingPosition[];
  metrics: {
    sharpeRatio: number;
    maxDrawdown: string;
    volatilityBeta: string;
    winRate: string;
    tradeRatio: string;
  };
}

/**
 * Comprehensive single-object snapshot of all user interactions & data
 */
export interface FullUserSnapshot {
  version: string;
  exportedAt: string;
  user: UserProfile;
  aggregatedFinancials: AggregatedFinancials;
  subAccounts: SubAccountWithHoldings[];
  transactions: TransactionRecord[];
}
