export type ConnectorStatus = "connected" | "missing_env" | "error";

export type AssetBalance = {
  asset: string;
  displayAsset: string;
  free: string;
  locked: string;
  total: string;
  freeValueUsdt: string;
  lockedValueUsdt: string;
  totalValueUsdt: string;
  estimatedValueUsdt: string;
  portfolioPercentage: string;
  dailyPnlUsdt: string;
};

export type BinancePortfolioSummary = {
  totalEstimatedValueUsdt: string;
  nonZeroAssetCount: number;
  usdtAvailable: string;
  usdtLocked: string;
};

export type BinanceDcaPlan = {
  id: string;
  name: string;
  status: "running" | "paused" | "ended" | "unknown";
  investmentAmount: string;
  investmentAsset: string;
  frequency: string;
  nextExecutionTime: string | null;
  startDate: string | null;
  targetAllocations: Array<{
    asset: string;
    percentage: number | null;
  }>;
  totalInvestedUsdt: string | null;
  currentHoldingUsdt: string | null;
  averageCostUsdt: string | null;
  triggerCount: number | null;
  dcaCompletedThisCycle: true | false | "unknown";
  pointsEligible: true | false | "unknown";
};

export type BinanceAutoInvestDiagnostic = {
  path: string;
  httpStatus?: number;
  binanceCode?: number;
  binanceMessage?: string;
  topLevelKeys: string[];
  containsArray: boolean;
  arrayLength?: number;
  firstItemKeys?: string[];
};

export type LobsterDcaProfile = {
  lobsterPlanId: string;
  displayName: string;
  targetAssets: string[];
  sourceAsset: string;
  latestInvestmentAmount: string;
  frequency: string;
  firstSeenDate: string | null;
  lastExecutionDate: string | null;
  estimatedNextExecutionDate: string | null;
  estimatedNextExecutionSource: "lobster_estimated" | null;
  executionCount: number;
  totalInvestedUsdt: string | null;
  estimatedCurrentValueUsdt: string | null;
  averageCostUsdt: string | null;
  latestExecutionStatus: string;
  failedLatestExecution: boolean;
  thisWeekCompleted: true | false | "unknown";
  pointsEligible: true | false | "unknown";
  dataSource: "binance_auto_invest_history";
};

export type BinanceDcaPlanState = {
  status: "loaded" | "unavailable" | "error";
  autoInvestStatus: "connected" | "unavailable" | "error";
  autoInvestErrorMessage?: string;
  autoInvestHttpStatus?: number;
  autoInvestBinanceCode?: number;
  autoInvestBinanceMessage?: string;
  autoInvestDiagnostics?: BinanceAutoInvestDiagnostic[];
  plans: BinanceDcaPlan[];
  lobsterProfiles: LobsterDcaProfile[];
  dcaCompletedThisCycle: boolean | "unknown";
  pointsEligible: boolean | "unknown";
  error?: string;
};

export type ConnectorBalanceResponse = {
  connector: "binance";
  status: ConnectorStatus;
  accountType: "spot";
  summary: BinancePortfolioSummary;
  balances: AssetBalance[];
  dcaPlans: BinanceDcaPlanState;
  updatedAt: string;
  error?: string;
};
