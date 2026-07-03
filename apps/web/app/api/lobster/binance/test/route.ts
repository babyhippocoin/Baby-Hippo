import { NextResponse } from "next/server";
import { BinanceAdapter } from "../../../../../lib/lobster/exchange/adapters/binance-adapter";

export const runtime = "nodejs";
export const preferredRegion = "hnd1";

function readCredentials(body: unknown) {
  if (!body || typeof body !== "object") return null;
  const value = body as Record<string, unknown>;
  const apiKey = typeof value.apiKey === "string" ? value.apiKey.trim() : "";
  const apiSecret = typeof value.apiSecret === "string" ? value.apiSecret.trim() : "";
  if (!apiKey || !apiSecret) return null;
  return { apiKey, apiSecret };
}

export async function POST(request: Request) {
  try {
    const credentials = readCredentials(await request.json());
    if (!credentials) {
      return NextResponse.json({
        connected: false,
        exchange: "binance",
        error: "Missing Binance API key or secret.",
      }, { status: 400 });
    }

    const result = await BinanceAdapter.testConnection?.(credentials);

    return NextResponse.json({
      connected: Boolean(result?.connected),
      exchange: "binance",
      permissionsDetected: result?.permissionsDetected || [],
      error: result?.connected ? undefined : result?.error || "Connection failed.",
      errorCategory: result?.errorCategory,
      diagnostics: result?.diagnostics,
    });
  } catch {
    return NextResponse.json({
      connected: false,
      exchange: "binance",
      error: "Unable to test Binance connection.",
    }, { status: 500 });
  }
}
