import type { BhcDcaRecord } from "./types";

export type BinanceDcaSyncSummary = {
  connectedExchanges: number;
  verifiedDcaOrders: number;
  currentStreak: number;
  verifiedAmount: string;
  bhcPoints: number;
  currentLevel: string;
};

export type BinanceDcaSyncState = {
  connected: boolean;
  exchange: "binance";
  records: BhcDcaRecord[];
  summary: BinanceDcaSyncSummary;
  lastSyncTime: string;
  updatedAt: string;
};

export type BinanceDcaAssetSummary = {
  asset: string;
  records: BhcDcaRecord[];
  verifiedRecords: number;
  totalAmount: number;
  quoteCurrency: string;
  latestExecutionTime: string | null;
  usualAmount: string | null;
  frequency: BhcDcaRecord["frequency"] | "unknown";
  estimatedNextCheckTime: string | null;
  frequencyDetectable: boolean;
};

export const BINANCE_DCA_SYNC_STORAGE_KEY = "baby-hippo-binance-dca-sync-v1";

const EMPTY_SUMMARY: BinanceDcaSyncSummary = {
  connectedExchanges: 0,
  verifiedDcaOrders: 0,
  currentStreak: 0,
  verifiedAmount: "0.00",
  bhcPoints: 0,
  currentLevel: "L0",
};

export function isBhcDcaRecord(value: unknown): value is BhcDcaRecord {
  if (!value || typeof value !== "object") return false;
  const record = value as Record<string, unknown>;
  return (
    record.exchange === "binance" &&
    typeof record.id === "string" &&
    typeof record.asset === "string" &&
    typeof record.amount === "string" &&
    typeof record.quoteCurrency === "string" &&
    typeof record.executedAt === "string"
  );
}

export function createBinanceDcaSummary(records: BhcDcaRecord[]): BinanceDcaSyncSummary {
  const verifiedRecords = records.filter((record) => record.verificationState === "verified_candidate" || record.verificationState === "verified");
  const verifiedAmount = verifiedRecords.reduce((sum, record) => {
    if (record.quoteCurrency !== "USDT") return sum;
    const amount = Number(record.amount);
    return sum + (Number.isFinite(amount) ? amount : 0);
  }, 0);
  const count = verifiedRecords.length;
  return {
    connectedExchanges: records.length ? 1 : 0,
    verifiedDcaOrders: count,
    currentStreak: records.some((record) => record.frequency === "weekly") && count >= 4 ? 1 : 0,
    verifiedAmount: verifiedAmount.toFixed(2),
    bhcPoints: count * 10,
    currentLevel: count >= 26 ? "L4" : count >= 12 ? "L3" : count >= 4 ? "L2" : count >= 1 ? "L1" : "L0",
  };
}

export function saveBinanceDcaSyncState(input: {
  records: BhcDcaRecord[];
  summary?: BinanceDcaSyncSummary | null;
  lastSyncTime?: string;
}) {
  if (typeof window === "undefined") return;
  const records = input.records.filter(isBhcDcaRecord);
  const state: BinanceDcaSyncState = {
    connected: true,
    exchange: "binance",
    records,
    summary: input.summary || createBinanceDcaSummary(records),
    lastSyncTime: input.lastSyncTime || new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
  window.localStorage.setItem(BINANCE_DCA_SYNC_STORAGE_KEY, JSON.stringify(state));
  window.dispatchEvent(new CustomEvent("baby-hippo-binance-dca-sync", { detail: state }));
}

export function loadBinanceDcaSyncState(): BinanceDcaSyncState | null {
  if (typeof window === "undefined") return null;
  try {
    const saved = window.localStorage.getItem(BINANCE_DCA_SYNC_STORAGE_KEY);
    if (!saved) return null;
    const parsed = JSON.parse(saved) as Partial<BinanceDcaSyncState>;
    const records = Array.isArray(parsed.records) ? parsed.records.filter(isBhcDcaRecord) : [];
    return {
      connected: Boolean(parsed.connected),
      exchange: "binance",
      records,
      summary: parsed.summary || createBinanceDcaSummary(records),
      lastSyncTime: typeof parsed.lastSyncTime === "string" ? parsed.lastSyncTime : "",
      updatedAt: typeof parsed.updatedAt === "string" ? parsed.updatedAt : "",
    };
  } catch {
    return null;
  }
}

export function groupBinanceDcaRecordsByAsset(records: BhcDcaRecord[]): BinanceDcaAssetSummary[] {
  const groups = new Map<string, BhcDcaRecord[]>();
  for (const record of records) {
    if (record.exchange !== "binance") continue;
    const asset = record.asset.toUpperCase();
    groups.set(asset, [...(groups.get(asset) || []), record]);
  }

  return Array.from(groups.entries())
    .map(([asset, assetRecords]) => {
      const sorted = [...assetRecords].sort((a, b) => new Date(b.executedAt).getTime() - new Date(a.executedAt).getTime());
      const latest = sorted[0];
      const verifiedRecords = sorted.filter((record) => record.verificationState === "verified_candidate" || record.verificationState === "verified").length;
      const totalAmount = sorted.reduce((sum, record) => {
        if (record.quoteCurrency !== "USDT") return sum;
        const amount = Number(record.amount);
        return sum + (Number.isFinite(amount) ? amount : 0);
      }, 0);
      const frequency = detectFrequency(sorted);
      return {
        asset,
        records: sorted,
        verifiedRecords,
        totalAmount,
        quoteCurrency: latest?.quoteCurrency || "USDT",
        latestExecutionTime: latest?.executedAt || null,
        usualAmount: latest?.amount || null,
        frequency,
        estimatedNextCheckTime: estimateNextCheckTime(latest?.executedAt, frequency),
        frequencyDetectable: frequency !== "unknown",
      };
    })
    .sort((a, b) => a.asset.localeCompare(b.asset));
}

function detectFrequency(records: BhcDcaRecord[]): BhcDcaRecord["frequency"] | "unknown" {
  const explicit = records.find((record) => record.frequency && record.frequency !== "unknown")?.frequency;
  if (explicit) return explicit;
  if (records.length < 2) return "unknown";
  const times = records
    .map((record) => new Date(record.executedAt).getTime())
    .filter((time) => Number.isFinite(time))
    .sort((a, b) => b - a);
  if (times.length < 2) return "unknown";
  const gapDays = Math.round((times[0] - times[1]) / 86_400_000);
  if (gapDays >= 5 && gapDays <= 9) return "weekly";
  if (gapDays >= 12 && gapDays <= 17) return "biweekly";
  if (gapDays >= 26 && gapDays <= 35) return "monthly";
  if (gapDays >= 1 && gapDays <= 2) return "daily";
  return "unknown";
}

function estimateNextCheckTime(executedAt: string | undefined, frequency: BhcDcaRecord["frequency"] | "unknown") {
  if (!executedAt || frequency === "unknown") return null;
  const next = new Date(executedAt);
  if (Number.isNaN(next.getTime())) return null;
  if (frequency === "daily") next.setDate(next.getDate() + 1);
  if (frequency === "weekly") next.setDate(next.getDate() + 7);
  if (frequency === "biweekly") next.setDate(next.getDate() + 14);
  if (frequency === "monthly") next.setMonth(next.getMonth() + 1);
  next.setDate(next.getDate() - 1);
  return next.toISOString();
}
