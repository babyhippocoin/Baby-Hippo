import { createHmac } from "crypto";
import type { BinanceAutoInvestDiagnostic, BinanceDcaPlanState, ConnectorBalanceResponse } from "../types";
import {
  normalizeAutoInvestHistoryPlans,
  normalizeAutoInvestPlans,
  normalizeBinanceSpotBalances,
  normalizeLobsterDcaProfilesFromAutoInvestHistory,
  normalizePriceMap,
} from "./normalize";
import type { BinanceAccountResponse, BinancePriceResponse } from "./types";

const DEFAULT_BINANCE_API_BASE_URL = "https://api.binance.com";
const DEFAULT_RECV_WINDOW = "5000";
const NETWORK_ERROR_MESSAGE = "Binance API 暫時無法連線，DCA Reminder 仍可正常使用。";
const PRICE_SYMBOLS = [
  "BTCUSDT",
  "ETHUSDT",
  "BNBUSDT",
  "SOLUSDT",
  "LINKUSDT",
  "TAOUSDT",
  "IOUSDT",
  "DOGEUSDT",
  "AIGENSYNUSDT",
  "GENIUSUSDT",
];

const emptySummary = {
  totalEstimatedValueUsdt: "0",
  nonZeroAssetCount: 0,
  usdtAvailable: "0",
  usdtLocked: "0",
};

const unavailableDcaPlans = (
  error?: string,
  diagnostics?: Pick<
    BinanceDcaPlanState,
    "autoInvestHttpStatus" | "autoInvestBinanceCode" | "autoInvestBinanceMessage" | "autoInvestDiagnostics"
  >,
): BinanceDcaPlanState => ({
  status: "unavailable",
  autoInvestStatus: "unavailable",
  autoInvestErrorMessage: error,
  ...diagnostics,
  plans: [],
  lobsterProfiles: [],
  dcaCompletedThisCycle: "unknown",
  pointsEligible: "unknown",
  error,
});

const parseBaseUrls = (value?: string) => {
  const urls = (value || DEFAULT_BINANCE_API_BASE_URL)
    .split(",")
    .map((url) => url.trim().replace(/\/$/, ""))
    .filter(Boolean);

  return urls.length ? urls : [DEFAULT_BINANCE_API_BASE_URL];
};

const createSignedParams = (apiSecret: string, recvWindow: string, extraParams?: Record<string, string>) => {
  const params = new URLSearchParams({
    ...(extraParams || {}),
    timestamp: Date.now().toString(),
    recvWindow,
  });
  const signature = createHmac("sha256", apiSecret).update(params.toString()).digest("hex");
  params.append("signature", signature);

  return params;
};

const readBinanceError = async (response: Response) => {
  try {
    const body = await response.json() as { code?: number; msg?: string };
    return {
      autoInvestBinanceCode: typeof body.code === "number" ? body.code : undefined,
      autoInvestBinanceMessage: typeof body.msg === "string" ? body.msg : undefined,
    };
  } catch {
    return {};
  }
};

const findFirstArray = (value: unknown): unknown[] | undefined => {
  if (Array.isArray(value)) return value;
  if (!value || typeof value !== "object") return undefined;

  for (const item of Object.values(value as Record<string, unknown>)) {
    if (Array.isArray(item)) return item;
    if (item && typeof item === "object") {
      const nested = findFirstArray(item);
      if (nested) return nested;
    }
  }

  return undefined;
};

const summarizeAutoInvestResponse = (
  path: string,
  httpStatus: number,
  raw: unknown,
  binanceError?: { autoInvestBinanceCode?: number; autoInvestBinanceMessage?: string },
): BinanceAutoInvestDiagnostic => {
  const root = raw && typeof raw === "object" && !Array.isArray(raw)
    ? raw as Record<string, unknown>
    : {};
  const array = findFirstArray(raw);
  const firstItem = array?.[0];

  return {
    path,
    httpStatus,
    binanceCode: binanceError?.autoInvestBinanceCode,
    binanceMessage: binanceError?.autoInvestBinanceMessage,
    topLevelKeys: Array.isArray(raw) ? ["<array>"] : Object.keys(root),
    containsArray: Boolean(array),
    arrayLength: array?.length,
    firstItemKeys: firstItem && typeof firstItem === "object" && !Array.isArray(firstItem)
      ? Object.keys(firstItem as Record<string, unknown>)
      : undefined,
  };
};

const describeAttempt = (attempt: { path: string; params: Record<string, string> }) => {
  const safeParams = Object.entries(attempt.params)
    .map(([key, value]) => `${key}=${value}`)
    .join("&");

  return safeParams ? `${attempt.path}?${safeParams}` : attempt.path;
};

const fetchPrices = async (baseUrl: string) => {
  const params = new URLSearchParams({
    symbols: JSON.stringify(PRICE_SYMBOLS),
  });
  const response = await fetch(`${baseUrl}/api/v3/ticker/price?${params.toString()}`, {
    method: "GET",
    cache: "no-store",
  });

  if (!response.ok) return new Map<string, number>([["USDT", 1]]);

  const prices = await response.json() as BinancePriceResponse[];
  return normalizePriceMap(prices);
};

const fetchAutoInvestPlans = async (
  baseUrl: string,
  apiKey: string,
  apiSecret: string,
  recvWindow: string,
): Promise<BinanceDcaPlanState> => {
  const attempts: Array<{ path: string; params: Record<string, string> }> = [
    { path: "/sapi/v1/lending/auto-invest/plan/list", params: {} },
    { path: "/sapi/v1/lending/auto-invest/plan/list", params: { planType: "SINGLE" } },
    { path: "/sapi/v1/lending/auto-invest/plan/list", params: { planType: "PORTFOLIO" } },
    { path: "/sapi/v1/lending/auto-invest/plan/list", params: { planType: "INDEX" } },
    { path: "/sapi/v1/lending/auto-invest/plan/list", params: { planType: "ALL" } },
    { path: "/sapi/v1/lending/auto-invest/history/list", params: { current: "1", size: "100" } },
    { path: "/sapi/v1/lending/auto-invest/index/info", params: {} },
    { path: "/sapi/v1/lending/auto-invest/target-asset/list", params: {} },
  ];
  let lastDiagnostics: Pick<
    BinanceDcaPlanState,
    "autoInvestHttpStatus" | "autoInvestBinanceCode" | "autoInvestBinanceMessage"
  > = {};
  const safeDiagnostics: BinanceAutoInvestDiagnostic[] = [];

  for (const attempt of attempts) {
    try {
      const attemptPath = describeAttempt(attempt);
      const params = createSignedParams(apiSecret, recvWindow, attempt.params);
      const response = await fetch(`${baseUrl}${attempt.path}?${params.toString()}`, {
        method: "GET",
        headers: {
          "X-MBX-APIKEY": apiKey,
        },
        cache: "no-store",
      });

      if (!response.ok) {
        const binanceError = await readBinanceError(response);
        safeDiagnostics.push(summarizeAutoInvestResponse(attemptPath, response.status, {}, binanceError));
        lastDiagnostics = {
          autoInvestHttpStatus: response.status,
          ...binanceError,
        };
        continue;
      }

      const raw = await response.json();
      const diagnostic = summarizeAutoInvestResponse(attemptPath, response.status, raw);
      safeDiagnostics.push(diagnostic);

      if (attempt.path.includes("/history/list")) {
        const historyPlans = normalizeAutoInvestHistoryPlans(raw);
        const lobsterProfiles = normalizeLobsterDcaProfilesFromAutoInvestHistory(raw);
        if (historyPlans.length || lobsterProfiles.length) {
          return {
            status: "loaded",
            autoInvestStatus: "connected",
            autoInvestDiagnostics: safeDiagnostics,
            plans: historyPlans,
            lobsterProfiles,
            dcaCompletedThisCycle: lobsterProfiles.some((plan) => plan.thisWeekCompleted === true),
            pointsEligible: "unknown",
          };
        }

        lastDiagnostics = {
          autoInvestHttpStatus: response.status,
        };
        continue;
      }

      if (!attempt.path.includes("/plan/list")) {
        lastDiagnostics = {
          autoInvestHttpStatus: response.status,
        };
        continue;
      }

      const plans = normalizeAutoInvestPlans(raw);

      if (!plans.length) {
        lastDiagnostics = {
          autoInvestHttpStatus: response.status,
        };
        continue;
      }

      return {
        status: "loaded",
        autoInvestStatus: "connected",
        autoInvestDiagnostics: safeDiagnostics,
        plans,
        lobsterProfiles: plans.map((plan) => ({
          lobsterPlanId: `lobster-binance-${plan.id}`,
          displayName: plan.name,
          targetAssets: plan.targetAllocations.map((item) => item.asset).filter(Boolean),
          sourceAsset: plan.investmentAsset,
          latestInvestmentAmount: plan.investmentAmount,
          frequency: plan.frequency,
          firstSeenDate: plan.startDate,
          lastExecutionDate: null,
          estimatedNextExecutionDate: plan.nextExecutionTime,
          estimatedNextExecutionSource: plan.nextExecutionTime ? "lobster_estimated" as const : null,
          executionCount: plan.triggerCount || 0,
          totalInvestedUsdt: plan.totalInvestedUsdt,
          estimatedCurrentValueUsdt: plan.currentHoldingUsdt,
          averageCostUsdt: plan.averageCostUsdt,
          latestExecutionStatus: plan.status,
          failedLatestExecution: false,
          thisWeekCompleted: plan.dcaCompletedThisCycle,
          pointsEligible: plan.pointsEligible,
          dataSource: "binance_auto_invest_history" as const,
        })),
        dcaCompletedThisCycle: plans.length ? "unknown" : false,
        pointsEligible: plans.length ? "unknown" : false,
      };
    } catch {
      safeDiagnostics.push({
        path: describeAttempt(attempt),
        topLevelKeys: [],
        containsArray: false,
      });
    }
  }

  return unavailableDcaPlans(
    "Binance Auto-Invest API did not return available plans, or this API permission is not enabled.",
    {
      ...lastDiagnostics,
      autoInvestDiagnostics: safeDiagnostics,
    },
  );
};

const calculateSummary = (balances: ReturnType<typeof normalizeBinanceSpotBalances>) => {
  const totalEstimated = balances.reduce((sum, balance) => {
    const value = Number(balance.estimatedValueUsdt.replace(/,/g, ""));
    return sum + (Number.isFinite(value) ? value : 0);
  }, 0);
  const usdt = balances.find((balance) => balance.displayAsset === "USDT");

  return {
    totalEstimatedValueUsdt: totalEstimated.toLocaleString("en-US", { maximumFractionDigits: 2 }),
    nonZeroAssetCount: balances.length,
    usdtAvailable: usdt?.free || "0",
    usdtLocked: usdt?.locked || "0",
  };
};

export async function getBinanceSpotBalances(): Promise<ConnectorBalanceResponse> {
  const apiKey = process.env.BINANCE_API_KEY;
  const apiSecret = process.env.BINANCE_API_SECRET;
  const baseUrls = parseBaseUrls(process.env.BINANCE_API_BASE_URL);
  const recvWindow = process.env.BINANCE_RECV_WINDOW || DEFAULT_RECV_WINDOW;
  const updatedAt = new Date().toISOString();

  if (!apiKey || !apiSecret) {
    return {
      connector: "binance",
      status: "missing_env",
      accountType: "spot",
      summary: emptySummary,
      balances: [],
      dcaPlans: unavailableDcaPlans("Missing Binance read-only API environment variables."),
      updatedAt,
      error: "Missing Binance read-only API environment variables.",
    };
  }

  for (const baseUrl of baseUrls) {
    try {
      const params = createSignedParams(apiSecret, recvWindow);
      const response = await fetch(`${baseUrl}/api/v3/account?${params.toString()}`, {
        method: "GET",
        headers: {
          "X-MBX-APIKEY": apiKey,
        },
        cache: "no-store",
      });

      if (!response.ok) {
        return {
          connector: "binance",
          status: "error",
          accountType: "spot",
          summary: emptySummary,
          balances: [],
          dcaPlans: unavailableDcaPlans("Spot account request failed."),
          updatedAt: new Date().toISOString(),
          error: `Binance returned HTTP ${response.status}.`,
        };
      }

      const account = await response.json() as BinanceAccountResponse;
      const priceMap = await fetchPrices(baseUrl);
      const balances = normalizeBinanceSpotBalances(account, priceMap);
      const dcaPlans = await fetchAutoInvestPlans(baseUrl, apiKey, apiSecret, recvWindow);

      return {
        connector: "binance",
        status: "connected",
        accountType: "spot",
        summary: calculateSummary(balances),
        balances,
        dcaPlans,
        updatedAt: new Date().toISOString(),
      };
    } catch {
      continue;
    }
  }

  return {
    connector: "binance",
    status: "error",
    accountType: "spot",
    summary: emptySummary,
    balances: [],
    dcaPlans: unavailableDcaPlans(NETWORK_ERROR_MESSAGE),
    updatedAt,
    error: NETWORK_ERROR_MESSAGE,
  };
}
