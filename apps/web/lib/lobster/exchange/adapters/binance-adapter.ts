import { createHmac } from "crypto";
import type { BhcDcaRecord, DcaExecutionStatus, DcaFrequency } from "../../types";
import { forbiddenExchangePermissions, readOnlyRequiredPermissions } from "../permissions";
import type { ExchangeAdapter, ExchangeAdapterResult, ExchangeConnectionTestResult, ExchangeCredentials } from "../types";

const BINANCE_BASE_URL = process.env.BINANCE_API_BASE_URL?.split(",")[0]?.trim().replace(/\/$/, "") || "https://api.binance.com";
const RECV_WINDOW = process.env.BINANCE_RECV_WINDOW || "5000";
const SPOT_SYMBOLS = ["BTCUSDT", "ETHUSDT", "SOLUSDT", "BNBUSDT", "LINKUSDT", "HYPUSDT"];

type RawRecordSource = "auto_invest" | "recurring_buy" | "spot_order_history";

type BinanceSafeError = {
  code?: number;
  msg?: string;
};
type BinanceErrorCategory = NonNullable<ExchangeConnectionTestResult["errorCategory"]>;
type BinanceSafeDiagnostics = NonNullable<ExchangeConnectionTestResult["diagnostics"]>;

type NormalizedRawRecord = {
  rawId: string;
  asset: string;
  amount: string;
  quoteCurrency: string;
  frequency: DcaFrequency;
  executedAt: string;
  status: DcaExecutionStatus;
  source: RawRecordSource;
};

function createSignedRequest(path: string, apiSecret: string, extraParams: Record<string, string> = {}) {
  const timestamp = Date.now().toString();
  const params = new URLSearchParams({
    ...extraParams,
    timestamp,
    recvWindow: RECV_WINDOW,
  });
  const signature = createHmac("sha256", apiSecret).update(params.toString()).digest("hex");
  params.append("signature", signature);
  return {
    url: `${BINANCE_BASE_URL}${path}?${params.toString()}`,
    timestamp,
    signatureBuilt: Boolean(signature),
  };
}

function signedUrl(path: string, apiSecret: string, extraParams: Record<string, string> = {}) {
  return createSignedRequest(path, apiSecret, extraParams).url;
}

async function signedFetch(path: string, credentials: ExchangeCredentials, extraParams: Record<string, string> = {}) {
  return fetch(signedUrl(path, credentials.apiSecret, extraParams), {
    method: "GET",
    headers: {
      "X-MBX-APIKEY": credentials.apiKey,
    },
    cache: "no-store",
  });
}

async function readSafeBinanceError(response: Response): Promise<BinanceSafeError> {
  try {
    const body = await response.json() as BinanceSafeError;
    return {
      code: typeof body.code === "number" ? body.code : undefined,
      msg: typeof body.msg === "string" ? body.msg : undefined,
    };
  } catch {
    return {};
  }
}

function runtimeEnvironment() {
  return process.env.VERCEL ? "vercel" : process.env.NODE_ENV || "node";
}

function safeDiagnostics(
  path: string,
  timestamp: string,
  signatureBuilt: boolean,
  reached: boolean,
  response?: Response,
  binanceError?: BinanceSafeError,
): BinanceSafeDiagnostics {
  return {
    httpStatus: response?.status,
    binanceCode: binanceError?.code,
    binanceMessage: binanceError?.msg,
    requestTargetEndpoint: path,
    runtimeEnvironment: runtimeEnvironment(),
    vercelRegion: process.env.VERCEL_REGION || process.env.VERCEL_FUNCTION_REGION,
    timestamp,
    recvWindow: RECV_WINDOW,
    requestReachedBinance: reached,
    hmacSignatureBuilt: signatureBuilt,
  };
}

function classifyBinanceError(error?: BinanceSafeError, response?: Response): BinanceErrorCategory {
  const message = (error?.msg || "").toLowerCase();
  if (response?.status === 451 || message.includes("restricted location") || message.includes("eligibility")) {
    return "restricted_region";
  }
  if (message.includes("ip") || message.includes("whitelist")) return "ip_whitelist";
  if (message.includes("invalid api-key") || message.includes("api-key format invalid")) return "invalid_key";
  if (message.includes("permission") || message.includes("permissions")) return "permission";
  if (error?.code === -1021 || message.includes("timestamp") || message.includes("recvwindow")) return "timestamp";
  if (error?.code === -1022 || message.includes("signature")) return "signature";
  return "unknown";
}

function userSafeError(category: BinanceErrorCategory, fallback?: string) {
  if (category === "restricted_region") return "目前正式伺服器所在區域無法連接 Binance API，我們正在切換後端節點。";
  if (category === "ip_whitelist") return "這組 API Key 可能限制了允許 IP，請先關閉 IP 限制或加入指定伺服器 IP。";
  if (category === "invalid_key") return "API Key 或 Secret 可能不正確。";
  if (category === "permission") return "請確認 API 權限包含唯讀查詢訂單紀錄。";
  if (category === "timestamp") return "Binance API 時間驗證失敗，請稍後再試。";
  if (category === "signature") return "API Secret 簽章驗證失敗，請確認 Secret 是否正確。";
  if (category === "network") return "Binance API 暫時無法連線，請稍後再試。";
  return fallback || "Binance read-only connection failed.";
}

function safeMessage(error: unknown) {
  if (error instanceof Error && error.message) return error.message;
  return "Binance request failed.";
}

function firstArray(value: unknown): unknown[] {
  if (Array.isArray(value)) return value;
  if (!value || typeof value !== "object") return [];

  for (const item of Object.values(value as Record<string, unknown>)) {
    if (Array.isArray(item)) return item;
    const nested = firstArray(item);
    if (nested.length) return nested;
  }

  return [];
}

function valueOf(record: Record<string, unknown>, keys: string[]) {
  for (const key of keys) {
    const value = record[key];
    if (typeof value === "string" && value.trim()) return value;
    if (typeof value === "number" && Number.isFinite(value)) return String(value);
  }
  return "";
}

function dateOf(record: Record<string, unknown>, keys: string[]) {
  const raw = valueOf(record, keys);
  if (!raw) return new Date().toISOString();
  const numeric = Number(raw);
  const date = Number.isFinite(numeric) ? new Date(numeric) : new Date(raw);
  return Number.isNaN(date.getTime()) ? new Date().toISOString() : date.toISOString();
}

function frequencyOf(value: string): DcaFrequency {
  const normalized = value.toLowerCase();
  if (normalized.includes("day")) return "daily";
  if (normalized.includes("week")) return "weekly";
  if (normalized.includes("bi")) return "biweekly";
  if (normalized.includes("month")) return "monthly";
  return "unknown";
}

function statusOf(value: string): DcaExecutionStatus {
  const normalized = value.toLowerCase();
  if (["success", "succeeded", "complete", "completed", "filled"].some((item) => normalized.includes(item))) return "completed";
  if (["fail", "failed", "reject", "rejected", "expired"].some((item) => normalized.includes(item))) return "failed";
  if (["cancel", "cancelled", "canceled"].some((item) => normalized.includes(item))) return "cancelled";
  if (["pending", "processing"].some((item) => normalized.includes(item))) return "pending";
  return "unknown";
}

function assetFromSymbol(symbol: string) {
  return symbol.endsWith("USDT") ? symbol.replace("USDT", "") : symbol;
}

function normalizeAutoInvestRecord(raw: unknown, source: RawRecordSource): NormalizedRawRecord | null {
  if (!raw || typeof raw !== "object" || Array.isArray(raw)) return null;
  const record = raw as Record<string, unknown>;
  const asset = valueOf(record, ["targetAsset", "asset", "coin", "targetCoin", "purchasedAsset", "cryptoCurrency"]);
  const amount = valueOf(record, ["transactionAmount", "amount", "sourceAssetAmount", "subscriptionAmount", "investAmount", "totalInvestedInUSD"]);
  const quoteCurrency = valueOf(record, ["sourceAsset", "quoteCurrency", "fiatCurrency", "stableAsset"]) || "USDT";
  const rawId = valueOf(record, ["transactionId", "id", "planId", "orderId", "subscriptionId"]) || `${source}-${asset}-${dateOf(record, ["transactionDateTime", "time", "createTime"])}`;

  if (!asset || !amount) return null;

  return {
    rawId,
    asset,
    amount,
    quoteCurrency,
    frequency: frequencyOf(valueOf(record, ["subscriptionCycle", "cycle", "frequency", "period"])),
    executedAt: dateOf(record, ["transactionDateTime", "time", "createTime", "successTime", "updateTime"]),
    status: statusOf(valueOf(record, ["transactionStatus", "status", "state"]) || "completed"),
    source,
  };
}

function normalizeSpotOrder(raw: unknown, symbol: string): NormalizedRawRecord | null {
  if (!raw || typeof raw !== "object" || Array.isArray(raw)) return null;
  const record = raw as Record<string, unknown>;
  if (valueOf(record, ["side"]).toUpperCase() !== "BUY") return null;
  const status = statusOf(valueOf(record, ["status"]));
  if (status !== "completed") return null;
  const executedQty = valueOf(record, ["executedQty"]);
  if (!executedQty || Number(executedQty) <= 0) return null;

  return {
    rawId: valueOf(record, ["orderId", "clientOrderId"]) || `${symbol}-${dateOf(record, ["time"])}`,
    asset: assetFromSymbol(symbol),
    amount: valueOf(record, ["cummulativeQuoteQty"]) || executedQty,
    quoteCurrency: "USDT",
    frequency: "unknown",
    executedAt: dateOf(record, ["time", "updateTime", "workingTime"]),
    status,
    source: "spot_order_history",
  };
}

function toBhcDcaRecord(raw: NormalizedRawRecord): BhcDcaRecord {
  return {
    id: `binance-${raw.source}-${raw.rawId}`,
    exchange: "binance",
    asset: raw.asset,
    amount: raw.amount,
    quoteCurrency: raw.quoteCurrency,
    frequency: raw.frequency,
    executedAt: raw.executedAt,
    status: raw.status,
    source: raw.source,
    verificationState: raw.status === "completed" ? "verified_candidate" : "unknown",
    rawRecordId: raw.rawId,
  };
}

async function fetchAutoInvestRecords(credentials: ExchangeCredentials): Promise<BhcDcaRecord[]> {
  const attempts: Array<{ path: string; source: RawRecordSource; params: Record<string, string> }> = [
    { path: "/sapi/v1/lending/auto-invest/history/list", source: "auto_invest", params: { current: "1", size: "100" } },
    { path: "/sapi/v1/lending/auto-invest/plan/list", source: "recurring_buy", params: {} },
    { path: "/sapi/v1/lending/auto-invest/plan/list", source: "recurring_buy", params: { planType: "SINGLE" } },
    { path: "/sapi/v1/lending/auto-invest/plan/list", source: "recurring_buy", params: { planType: "PORTFOLIO" } },
  ];
  const records: BhcDcaRecord[] = [];

  for (const attempt of attempts) {
    try {
      const response = await signedFetch(attempt.path, credentials, attempt.params);
      if (!response.ok) continue;
      const raw = await response.json();
      const items = firstArray(raw);
      for (const item of items) {
        const normalized = normalizeAutoInvestRecord(item, attempt.source);
        if (normalized) records.push(toBhcDcaRecord(normalized));
      }
    } catch {
      continue;
    }
  }

  return records;
}

async function fetchSpotOrderRecords(credentials: ExchangeCredentials): Promise<BhcDcaRecord[]> {
  const records: BhcDcaRecord[] = [];

  for (const symbol of SPOT_SYMBOLS) {
    try {
      const response = await signedFetch("/api/v3/allOrders", credentials, { symbol, limit: "100" });
      if (!response.ok) continue;
      const raw = await response.json();
      if (!Array.isArray(raw)) continue;
      for (const item of raw) {
        const normalized = normalizeSpotOrder(item, symbol);
        if (normalized) records.push(toBhcDcaRecord(normalized));
      }
    } catch {
      continue;
    }
  }

  return records;
}

function dedupeRecords(records: BhcDcaRecord[]) {
  return Array.from(new Map(records.map((record) => [record.id, record])).values())
    .sort((a, b) => new Date(b.executedAt).getTime() - new Date(a.executedAt).getTime());
}

export const BinanceAdapter: ExchangeAdapter = {
  profile: {
    id: "binance",
    name: "Binance",
    supportStatus: "current",
    supportedRecordTypes: ["spot_order_history", "recurring_buy_history", "auto_invest_history"],
    requiredPermissions: readOnlyRequiredPermissions,
    forbiddenPermissions: forbiddenExchangePermissions,
  },
  async normalizeDcaRecords() {
    return {
      exchange: "binance",
      records: [],
      warnings: ["Use fetchDcaRecords(credentials) for Binance read-only sync. No credentials are stored by this adapter."],
    };
  },
  async testConnection(credentials: ExchangeCredentials): Promise<ExchangeConnectionTestResult> {
    const request = createSignedRequest("/api/v3/account", credentials.apiSecret);
    try {
      const response = await fetch(request.url, {
        method: "GET",
        headers: {
          "X-MBX-APIKEY": credentials.apiKey,
        },
        cache: "no-store",
      });
      if (!response.ok) {
        const error = await readSafeBinanceError(response);
        const errorCategory = classifyBinanceError(error, response);
        return {
          connected: false,
          exchange: "binance",
          error: userSafeError(errorCategory, error.msg || `Binance returned HTTP ${response.status}.`),
          errorCategory,
          diagnostics: safeDiagnostics("/api/v3/account", request.timestamp, request.signatureBuilt, true, response, error),
        };
      }

      const body = await response.json() as { permissions?: string[] };
      return {
        connected: true,
        exchange: "binance",
        permissionsDetected: Array.isArray(body.permissions) ? body.permissions.filter((item) => typeof item === "string") : undefined,
        diagnostics: safeDiagnostics("/api/v3/account", request.timestamp, request.signatureBuilt, true, response),
      };
    } catch (error) {
      return {
        connected: false,
        exchange: "binance",
        error: userSafeError("network", safeMessage(error)),
        errorCategory: "network",
        diagnostics: safeDiagnostics("/api/v3/account", request.timestamp, request.signatureBuilt, false),
      };
    }
  },
  async fetchDcaRecords(credentials: ExchangeCredentials): Promise<ExchangeAdapterResult> {
    const warnings: string[] = [];
    const autoInvestRecords = await fetchAutoInvestRecords(credentials);
    if (!autoInvestRecords.length) warnings.push("No Binance Auto-Invest / Recurring Buy records were returned.");

    const spotRecords = await fetchSpotOrderRecords(credentials);
    if (!spotRecords.length) warnings.push("No supported Binance spot order history records were returned.");

    return {
      exchange: "binance",
      records: dedupeRecords([...autoInvestRecords, ...spotRecords]),
      warnings,
    };
  },
  normalizeToBhcDcaRecord(raw: unknown) {
    const normalized = normalizeAutoInvestRecord(raw, "auto_invest");
    return normalized ? toBhcDcaRecord(normalized) : null;
  },
};
