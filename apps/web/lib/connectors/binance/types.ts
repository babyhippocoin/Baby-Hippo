export type BinanceBalance = {
  asset: string;
  free: string;
  locked: string;
};

export type BinanceAccountResponse = {
  makerCommission?: number;
  takerCommission?: number;
  buyerCommission?: number;
  sellerCommission?: number;
  canTrade?: boolean;
  canWithdraw?: boolean;
  canDeposit?: boolean;
  updateTime?: number;
  accountType?: string;
  balances: BinanceBalance[];
  permissions?: string[];
};

export type BinancePriceResponse = {
  symbol: string;
  price: string;
};

export type BinanceAutoInvestRawPlan = Record<string, unknown>;
