export type RiskLevel = 1 | 2 | 3;

export interface RiskProfile {
  level: RiskLevel;
  strategyName: string;
  etfName: string;
  tagline: string;
  targetVolatility: string;
  assetUniverse: string;
  detailedAssetUniverse?: string;
  turnoverStrategy: string;
  holdingStyle?: string;
  targetReturn: string;
  scoreRange: string;
  minScore: number;
  maxScore: number;
  bestFor: string;
  color: string;
  badgeClass: string;
  borderClass: string;
  bgClass: string;
  iconName: string;
  description: string;
  sampleTickers: string[];
}

export interface QuestionOption {
  id: "A" | "B" | "C" | "D";
  text: string;
  description?: string;
  points: number;
}

export interface Question {
  id: number;
  title: string;
  category?: string;
  options: QuestionOption[];
}

export interface SubAccount {
  id: string;
  name: string;
  riskLevel: RiskLevel;
  strategyName: string;
  allocatedCapital: number;
  currentValue: number;
  cashBalance: number;
  investedAmount: number;
  pnl: number;
  pnlPercentage: number;
  status: "active" | "rebalancing" | "paused";
  createdAt: string;
  holdingsCount: number;
  description?: string;
}

export interface UserAccountProfile {
  email: string;
  riskLevel: RiskLevel;
  riskScore?: number;
  strategyName: string;
  assignedProfile: RiskProfile;
  subAccounts: SubAccount[];
  activeSubAccountId?: string;
  answers?: Record<number, "A" | "B" | "C" | "D">;
  createdAt: string;
}
