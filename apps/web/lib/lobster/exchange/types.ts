import type { BhcDcaRecord, ExchangeId, ExchangeSupportStatus } from "../types";

export type ExchangeConnectorProfile = {
  id: ExchangeId;
  name: string;
  supportStatus: ExchangeSupportStatus;
  supportedRecordTypes: Array<"spot_order_history" | "recurring_buy_history" | "auto_invest_history">;
  requiredPermissions: Array<"read_order_history" | "read_recurring_buy_history">;
  forbiddenPermissions: Array<"trading" | "withdrawal" | "transfer" | "futures" | "margin" | "account_management">;
};

export type ExchangeAdapterContext = {
  exchange: ExchangeId;
  connectionId?: string;
};

export type ExchangeAdapterResult = {
  exchange: ExchangeId;
  records: BhcDcaRecord[];
  warnings: string[];
};

export type ExchangeCredentials = {
  apiKey: string;
  apiSecret: string;
};

export type ExchangeConnectionTestResult = {
  connected: boolean;
  exchange: ExchangeId;
  permissionsDetected?: string[];
  error?: string;
};

export interface ExchangeAdapter {
  profile: ExchangeConnectorProfile;
  normalizeDcaRecords(context: ExchangeAdapterContext): Promise<ExchangeAdapterResult>;
  testConnection?(credentials: ExchangeCredentials): Promise<ExchangeConnectionTestResult>;
  fetchDcaRecords?(credentials: ExchangeCredentials): Promise<ExchangeAdapterResult>;
  normalizeToBhcDcaRecord?(raw: unknown): BhcDcaRecord | null;
}
