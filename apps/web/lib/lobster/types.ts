export type ExchangeId =
  | "binance"
  | "okx"
  | "bitopro"
  | "bitunix"
  | "bybit"
  | "bitget"
  | "hyperliquid";

export type ExchangeSupportStatus = "current" | "future";

export type DcaExecutionStatus = "completed" | "pending" | "failed" | "cancelled" | "unknown";

export type VerificationState =
  | "unverified"
  | "pending"
  | "api_synced"
  | "verified_candidate"
  | "verified"
  | "rejected"
  | "duplicate"
  | "abnormal"
  | "unknown";

export type DcaFrequency = "daily" | "weekly" | "biweekly" | "monthly" | "unknown";

export type BhcDcaRecord = {
  id: string;
  exchange: ExchangeId;
  asset: string;
  amount: string;
  quoteCurrency: string;
  frequency: DcaFrequency;
  executedAt: string;
  status: DcaExecutionStatus;
  source: "exchange_read_only" | "recurring_buy" | "auto_invest" | "spot_order_history" | "lobster_derived" | "future_ai";
  verificationState: VerificationState;
  rawRecordId?: string;
  metadata?: Record<string, string | number | boolean | null>;
};

export type VerificationResult = {
  recordId: string;
  state: VerificationState;
  reasons: string[];
  confidence: number;
};

export type PassportSnapshot = {
  connectedExchanges: ExchangeId[];
  verifiedOrderCount: number;
  currentStreakWeeks: number;
  verifiedAmount: string;
  quoteCurrency: string;
  currentLevel: string;
  currentScore: number;
};

export type ScoreSnapshot = {
  verificationCount: number;
  consistencyScore: number;
  disciplineScore: number;
  bhcPoints: number;
  level: string;
  futureBadges: string[];
};
