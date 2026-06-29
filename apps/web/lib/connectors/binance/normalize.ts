import type { AssetBalance, LobsterDcaProfile } from "../types";
import type { BinanceAccountResponse, BinanceAutoInvestRawPlan, BinancePriceResponse } from "./types";

const LD_ASSET_MAP: Record<string, string> = {
  LDBTC: "BTC",
  LDETH: "ETH",
  LDSOL: "SOL",
  LDBNB: "BNB",
  LDLINK: "LINK",
  LDTAO: "TAO",
  LDIO: "IO",
  LDDOGE: "DOGE",
  LDAIGENSYN: "AIGENSYN",
  LDGENIUS: "GENIUS",
};

const formatBalance = (value: number) => {
  if (!Number.isFinite(value)) return "0";
  return value.toLocaleString("en-US", {
    maximumFractionDigits: 8,
  });
};

const formatUsdt = (value: number) => {
  if (!Number.isFinite(value)) return "0.00";
  return value.toLocaleString("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
};

const parseNumber = (value: string) => {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : 0;
};

const taipeiOffsetMs = 8 * 60 * 60 * 1000;
const dayMs = 24 * 60 * 60 * 1000;

const getTaipeiWeekBounds = (now = Date.now()) => {
  const taipeiNow = new Date(now + taipeiOffsetMs);
  const day = taipeiNow.getUTCDay();
  const mondayOffset = (day + 6) % 7;
  const startTaipei = Date.UTC(
    taipeiNow.getUTCFullYear(),
    taipeiNow.getUTCMonth(),
    taipeiNow.getUTCDate() - mondayOffset,
    0,
    0,
    0,
    0,
  );

  return {
    start: startTaipei - taipeiOffsetMs,
    end: startTaipei - taipeiOffsetMs + 7 * dayMs,
  };
};

const isSuccessStatus = (value: string) => {
  const normalized = value.toLowerCase();
  return ["success", "successful", "completed"].some((status) => normalized.includes(status));
};

const isFailedStatus = (value: string) => {
  const normalized = value.toLowerCase();
  return ["fail", "failed", "rejected", "cancelled", "canceled"].some((status) => normalized.includes(status));
};

const inferNextExecutionDate = (lastExecutionDate: string | null, frequency: string) => {
  if (!lastExecutionDate) return null;
  const latestTime = Number(lastExecutionDate);
  if (!Number.isFinite(latestTime) || latestTime <= 0) return null;

  const normalized = frequency.toUpperCase();
  if (normalized.includes("DAILY")) return String(latestTime + dayMs);
  if (normalized.includes("WEEKLY")) return String(latestTime + 7 * dayMs);
  if (normalized.includes("BI_WEEKLY") || normalized.includes("BIWEEKLY") || normalized.includes("TWO_WEEK")) {
    return String(latestTime + 14 * dayMs);
  }
  if (normalized.includes("MONTHLY")) {
    const date = new Date(latestTime);
    date.setUTCMonth(date.getUTCMonth() + 1);
    return String(date.getTime());
  }

  return null;
};

export const normalizeAssetSymbol = (asset: string) => LD_ASSET_MAP[asset] || asset;

export function normalizePriceMap(prices: BinancePriceResponse[]) {
  const priceMap = new Map<string, number>();

  for (const item of prices) {
    if (item.symbol.endsWith("USDT")) {
      const asset = item.symbol.replace(/USDT$/, "");
      const price = parseNumber(item.price);
      if (price > 0) priceMap.set(asset, price);
    }
  }

  priceMap.set("USDT", 1);
  return priceMap;
}

export function normalizeBinanceSpotBalances(
  account: BinanceAccountResponse,
  priceMap: Map<string, number>,
): AssetBalance[] {
  const grouped = new Map<string, { asset: string; free: number; locked: number; total: number }>();

  for (const balance of account.balances) {
    const displayAsset = normalizeAssetSymbol(balance.asset);
    const current = grouped.get(displayAsset) || { asset: displayAsset, free: 0, locked: 0, total: 0 };
    const free = parseNumber(balance.free);
    const locked = parseNumber(balance.locked);

    current.free += free;
    current.locked += locked;
    current.total += free + locked;
    grouped.set(displayAsset, current);
  }

  const withValues = Array.from(grouped.values())
    .map((balance) => {
      const price = priceMap.get(balance.asset) || 0;
      const freeValue = balance.asset === "USDT" ? balance.free : balance.free * price;
      const lockedValue = balance.asset === "USDT" ? balance.locked : balance.locked * price;
      const estimatedValue = freeValue + lockedValue;

      return {
        ...balance,
        freeValue,
        lockedValue,
        estimatedValue,
      };
    })
    .filter((balance) => balance.total > 0);

  const portfolioTotal = withValues.reduce((sum, balance) => sum + balance.estimatedValue, 0);

  return withValues
    .map((balance) => {
      return {
        asset: balance.asset,
        displayAsset: balance.asset,
        free: formatBalance(balance.free),
        locked: formatBalance(balance.locked),
        total: formatBalance(balance.total),
        freeValueUsdt: formatUsdt(balance.freeValue),
        lockedValueUsdt: formatUsdt(balance.lockedValue),
        totalValueUsdt: formatUsdt(balance.estimatedValue),
        estimatedValueUsdt: formatUsdt(balance.estimatedValue),
        portfolioPercentage: portfolioTotal > 0
          ? `${((balance.estimatedValue / portfolioTotal) * 100).toFixed(2)}%`
          : "0%",
        dailyPnlUsdt: "--",
        rawValue: balance.estimatedValue,
      };
    })
    .sort((a, b) => b.rawValue - a.rawValue)
    .map(({ rawValue: _rawValue, ...balance }) => balance);
}

const readString = (plan: BinanceAutoInvestRawPlan, keys: string[]) => {
  for (const key of keys) {
    const value = plan[key];
    if (typeof value === "string" || typeof value === "number" || typeof value === "boolean") {
      return String(value);
    }
  }

  return "";
};

const readNullableString = (plan: BinanceAutoInvestRawPlan, keys: string[]) => readString(plan, keys) || null;

const readNumber = (plan: BinanceAutoInvestRawPlan, keys: string[]) => {
  const value = readString(plan, keys);
  if (!value) return null;
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : null;
};

const normalizePlanStatus = (value: string): "running" | "paused" | "ended" | "unknown" => {
  const normalized = value.toLowerCase();
  if (["running", "active", "ongoing", "subscribed", "enabled"].includes(normalized)) return "running";
  if (["paused", "pause", "disabled", "inactive"].includes(normalized)) return "paused";
  if (["ended", "closed", "finished", "completed", "cancelled", "canceled"].includes(normalized)) return "ended";
  return "unknown";
};

const readTargetAllocations = (plan: BinanceAutoInvestRawPlan) => {
  const possibleValues = [
    plan.targetAsset,
    plan.targetAssets,
    plan.targetAssetAllocation,
    plan.targetAllocations,
    plan.asset,
    plan.assets,
    plan.details,
    plan.planDetails,
  ];
  const value = possibleValues.find((item) => item !== undefined);

  if (Array.isArray(value)) {
    return value
      .map((item) => {
        if (item && typeof item === "object") {
          const record = item as Record<string, unknown>;
          const asset = String(record.asset || record.targetAsset || record.target || "").trim();
          const percentageValue = record.percentage ?? record.ratio ?? record.allocation ?? record.targetAllocation;
          const percentage = typeof percentageValue === "number"
            ? percentageValue
            : typeof percentageValue === "string" && percentageValue.trim()
              ? Number(percentageValue)
              : null;

          return {
            asset,
            percentage: Number.isFinite(percentage) ? Number(percentage) : null,
          };
        }

        return {
          asset: String(item),
          percentage: null,
        };
      })
      .filter((item) => item.asset);
  }

  if (typeof value === "string" || typeof value === "number") {
    return [{
      asset: String(value),
      percentage: null,
    }];
  }

  return [];
};

export function normalizeAutoInvestPlans(raw: unknown) {
  const root = raw as Record<string, unknown>;
  const candidates = [
    raw,
    root?.list,
    root?.plans,
    root?.rows,
    root?.data,
    root?.data && typeof root.data === "object" ? (root.data as Record<string, unknown>).list : undefined,
    root?.data && typeof root.data === "object" ? (root.data as Record<string, unknown>).plans : undefined,
    root?.data && typeof root.data === "object" ? (root.data as Record<string, unknown>).rows : undefined,
  ];
  const plans = candidates.find(Array.isArray) as BinanceAutoInvestRawPlan[] | undefined;

  if (!plans) return [];

  return plans.map((plan, index) => {
    const targetAllocations = readTargetAllocations(plan);
    const firstTarget = targetAllocations[0]?.asset || readString(plan, ["targetAsset", "asset"]);

    return {
      id: readString(plan, ["planId", "id", "strategyId"]) || `plan-${index}`,
      name: readString(plan, ["planName", "name"]) || firstTarget || `DCA Plan ${index + 1}`,
      status: normalizePlanStatus(readString(plan, ["status", "planStatus"])),
      investmentAmount: readString(plan, ["investmentAmount", "amount", "subscriptionAmount", "sourceAmount"]),
      investmentAsset: readString(plan, ["investmentAsset", "sourceAsset", "quoteAsset"]) || "USDT",
      frequency: readString(plan, ["frequency", "cycle", "period", "recurringCycle"]),
      nextExecutionTime: readNullableString(plan, ["nextExecutionTime", "nextTime", "nextDate"]),
      startDate: readNullableString(plan, ["startDate", "startTime", "createTime"]),
      targetAllocations,
      totalInvestedUsdt: readNullableString(plan, ["totalInvestedUsdt", "totalInvestedValue", "totalInvested", "totalAmount"]),
      currentHoldingUsdt: readNullableString(plan, ["currentHoldingUsdt", "currentHoldingValue", "currentValue", "holdingValue"]),
      averageCostUsdt: readNullableString(plan, ["averageCostUsdt", "averageCost", "avgCost", "avgPrice"]),
      triggerCount: readNumber(plan, ["triggerCount", "executionCount", "successCount", "totalExecutionCount"]),
      dcaCompletedThisCycle: "unknown" as const,
      pointsEligible: "unknown" as const,
    };
  });
}

export function normalizeAutoInvestHistoryPlans(raw: unknown) {
  const root = raw as Record<string, unknown>;
  const history = [
    root?.list,
    root?.rows,
    root?.data,
    root?.data && typeof root.data === "object" ? (root.data as Record<string, unknown>).list : undefined,
    root?.data && typeof root.data === "object" ? (root.data as Record<string, unknown>).rows : undefined,
  ].find(Array.isArray) as BinanceAutoInvestRawPlan[] | undefined;

  if (!history?.length) return [];

  const grouped = new Map<string, BinanceAutoInvestRawPlan[]>();
  for (const item of history) {
    const planId = readString(item, ["planId", "id"]) || `history-${grouped.size + 1}`;
    const current = grouped.get(planId) || [];
    current.push(item);
    grouped.set(planId, current);
  }

  return Array.from(grouped.entries()).map(([planId, items], index) => {
    const latest = items[0] || {};
    const targetAssets = Array.from(new Set(items
      .map((item) => readString(item, ["targetAsset", "asset"]))
      .filter(Boolean)));
    const sourceAssets = Array.from(new Set(items
      .map((item) => readString(item, ["sourceAsset", "investmentAsset"]))
      .filter(Boolean)));
    const sourceAsset = sourceAssets.length === 1 ? sourceAssets[0] : readString(latest, ["sourceAsset", "investmentAsset"]) || "USDT";
    const sourceAmounts = items
      .map((item) => readString(item, ["sourceAssetAmount", "investmentAmount", "amount"]))
      .map(Number)
      .filter(Number.isFinite);
    const totalInvested = sourceAmounts.reduce((sum, value) => sum + value, 0);
    const dates = items
      .map((item) => readString(item, ["transactionDateTime", "transactionTime", "time", "createTime"]))
      .map((value) => Number(value))
      .filter((value) => Number.isFinite(value) && value > 0)
      .sort((a, b) => a - b);
    const latestDate = dates[dates.length - 1];
    const oneWeekMs = 7 * 24 * 60 * 60 * 1000;
    const latestStatus = readString(latest, ["transactionStatus", "status"]).toLowerCase();
    const completedRecently = Boolean(
      latestDate
      && Date.now() - latestDate <= oneWeekMs
      && (!latestStatus || ["success", "successful", "completed"].some((status) => latestStatus.includes(status)))
    );

    return {
      id: planId || `history-plan-${index}`,
      name: readString(latest, ["planName", "name"]) || targetAssets.join(", ") || `DCA Plan ${index + 1}`,
      status: "unknown" as const,
      investmentAmount: readString(latest, ["sourceAssetAmount", "investmentAmount", "amount"]),
      investmentAsset: sourceAsset,
      frequency: readString(latest, ["subscriptionCycle", "frequency", "cycle", "period", "recurringCycle"]),
      nextExecutionTime: null,
      startDate: dates[0] ? String(dates[0]) : null,
      targetAllocations: targetAssets.map((asset) => ({
        asset,
        percentage: null,
      })),
      totalInvestedUsdt: sourceAsset === "USDT" && totalInvested > 0 ? formatUsdt(totalInvested) : null,
      currentHoldingUsdt: null,
      averageCostUsdt: null,
      triggerCount: items.length,
      dcaCompletedThisCycle: completedRecently,
      pointsEligible: "unknown" as const,
    };
  });
}

export function normalizeLobsterDcaProfilesFromAutoInvestHistory(raw: unknown): LobsterDcaProfile[] {
  const root = raw as Record<string, unknown>;
  const history = [
    root?.list,
    root?.rows,
    root?.data,
    root?.data && typeof root.data === "object" ? (root.data as Record<string, unknown>).list : undefined,
    root?.data && typeof root.data === "object" ? (root.data as Record<string, unknown>).rows : undefined,
  ].find(Array.isArray) as BinanceAutoInvestRawPlan[] | undefined;

  if (!history?.length) return [];

  const grouped = new Map<string, BinanceAutoInvestRawPlan[]>();
  for (const item of history) {
    const planId = readString(item, ["planId", "id"]) || `history-${grouped.size + 1}`;
    const current = grouped.get(planId) || [];
    current.push(item);
    grouped.set(planId, current);
  }

  return Array.from(grouped.entries()).map(([planId, items], index) => {
    const sorted = [...items].sort((a, b) => {
      const aTime = Number(readString(a, ["transactionDateTime", "transactionTime", "time", "createTime"]));
      const bTime = Number(readString(b, ["transactionDateTime", "transactionTime", "time", "createTime"]));
      return (Number.isFinite(aTime) ? aTime : 0) - (Number.isFinite(bTime) ? bTime : 0);
    });
    const first = sorted[0] || {};
    const latest = sorted[sorted.length - 1] || first;
    const targetAssets = Array.from(new Set(items
      .map((item) => readString(item, ["targetAsset", "asset"]))
      .filter(Boolean)));
    const sourceAssets = Array.from(new Set(items
      .map((item) => readString(item, ["sourceAsset", "investmentAsset"]))
      .filter(Boolean)));
    const sourceAsset = sourceAssets.length === 1 ? sourceAssets[0] : readString(latest, ["sourceAsset", "investmentAsset"]) || "USDT";
    const sourceAmounts = items
      .map((item) => readString(item, ["sourceAssetAmount", "investmentAmount", "amount"]))
      .map(Number)
      .filter(Number.isFinite);
    const totalInvested = sourceAmounts.reduce((sum, value) => sum + value, 0);
    const firstSeenDate = readString(first, ["transactionDateTime", "transactionTime", "time", "createTime"]) || null;
    const lastExecutionDate = readString(latest, ["transactionDateTime", "transactionTime", "time", "createTime"]) || null;
    const latestTime = lastExecutionDate ? Number(lastExecutionDate) : 0;
    const latestExecutionStatus = readString(latest, ["transactionStatus", "status"]) || "unknown";
    const failedLatestExecution = isFailedStatus(latestExecutionStatus);
    const statusKnown = isSuccessStatus(latestExecutionStatus) || failedLatestExecution;
    const week = getTaipeiWeekBounds();
    const thisWeekCompleted = !statusKnown
      ? "unknown"
      : failedLatestExecution
        ? false
        : Boolean(latestTime && latestTime >= week.start && latestTime < week.end);
    const frequency = readString(latest, ["subscriptionCycle", "frequency", "cycle", "period", "recurringCycle"]);
    const estimatedNextExecutionDate = inferNextExecutionDate(lastExecutionDate, frequency);

    return {
      lobsterPlanId: `lobster-binance-${planId || index}`,
      displayName: readString(latest, ["planName", "name"]) || targetAssets.join(", ") || `DCA Plan ${index + 1}`,
      targetAssets,
      sourceAsset,
      latestInvestmentAmount: readString(latest, ["sourceAssetAmount", "investmentAmount", "amount"]),
      frequency,
      firstSeenDate,
      lastExecutionDate,
      estimatedNextExecutionDate,
      estimatedNextExecutionSource: estimatedNextExecutionDate ? "lobster_estimated" as const : null,
      executionCount: items.length,
      totalInvestedUsdt: sourceAsset === "USDT" && totalInvested > 0 ? formatUsdt(totalInvested) : null,
      estimatedCurrentValueUsdt: null,
      averageCostUsdt: null,
      latestExecutionStatus,
      failedLatestExecution,
      thisWeekCompleted,
      pointsEligible: thisWeekCompleted === true ? true : thisWeekCompleted === false ? false : "unknown",
      dataSource: "binance_auto_invest_history",
    };
  });
}
