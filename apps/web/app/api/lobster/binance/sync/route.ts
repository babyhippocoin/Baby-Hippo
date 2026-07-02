import { NextResponse } from "next/server";
import { BinanceAdapter } from "../../../../../lib/lobster/exchange/adapters/binance-adapter";
import type { BhcDcaRecord } from "../../../../../lib/lobster/types";

export const runtime = "nodejs";

function readCredentials(body: unknown) {
  if (!body || typeof body !== "object") return null;
  const value = body as Record<string, unknown>;
  const apiKey = typeof value.apiKey === "string" ? value.apiKey.trim() : "";
  const apiSecret = typeof value.apiSecret === "string" ? value.apiSecret.trim() : "";
  if (!apiKey || !apiSecret) return null;
  return { apiKey, apiSecret };
}

function calculateLevel(recordCount: number) {
  if (recordCount >= 26) return "L4";
  if (recordCount >= 12) return "L3";
  if (recordCount >= 4) return "L2";
  if (recordCount >= 1) return "L1";
  return "L0";
}

function calculateStreakCandidate(records: BhcDcaRecord[]) {
  const byAsset = new Map<string, number>();
  for (const record of records) {
    byAsset.set(record.asset, (byAsset.get(record.asset) || 0) + 1);
  }
  return Array.from(byAsset.values()).some((count) => count >= 4);
}

function calculateVerifiedAmount(records: BhcDcaRecord[]) {
  return records.reduce((sum, record) => {
    if (record.quoteCurrency !== "USDT") return sum;
    const value = Number(record.amount);
    return sum + (Number.isFinite(value) ? value : 0);
  }, 0);
}

export async function POST(request: Request) {
  try {
    const credentials = readCredentials(await request.json());
    if (!credentials) {
      return NextResponse.json({
        connected: false,
        exchange: "binance",
        records: [],
        error: "Missing Binance API key or secret.",
      }, { status: 400 });
    }

    const connection = await BinanceAdapter.testConnection?.(credentials);
    if (!connection?.connected) {
      return NextResponse.json({
        connected: false,
        exchange: "binance",
        records: [],
        error: connection?.error || "Binance read-only connection failed.",
      }, { status: 401 });
    }

    const result = await BinanceAdapter.fetchDcaRecords?.(credentials);
    const records = result?.records || [];
    const verifiedCandidateCount = records.filter((record) => record.verificationState === "verified_candidate").length;
    const bhcPoints = verifiedCandidateCount * 10;

    return NextResponse.json({
      connected: true,
      exchange: "binance",
      records,
      summary: {
        connectedExchanges: 1,
        verifiedDcaOrders: verifiedCandidateCount,
        currentStreak: calculateStreakCandidate(records) ? 1 : 0,
        verifiedAmount: calculateVerifiedAmount(records).toFixed(2),
        bhcPoints,
        currentLevel: calculateLevel(verifiedCandidateCount),
      },
      warnings: result?.warnings || [],
      message: records.length ? undefined : "Connected, but no DCA records found yet.",
    });
  } catch {
    return NextResponse.json({
      connected: false,
      exchange: "binance",
      records: [],
      error: "Unable to sync Binance DCA records.",
    }, { status: 500 });
  }
}
