import { NextResponse } from "next/server";
import { BinanceAdapter } from "../../../../../lib/lobster/exchange/adapters/binance-adapter";

export const runtime = "nodejs";
export const preferredRegion = "hnd1";

function readBackendBaseUrl() {
  return (process.env.BINANCE_SYNC_API_BASE_URL || process.env.NEXT_PUBLIC_BINANCE_SYNC_API_BASE_URL || "")
    .trim()
    .replace(/\/$/, "");
}

function readCredentials(body: unknown) {
  if (!body || typeof body !== "object") return null;
  const value = body as Record<string, unknown>;
  const apiKey = typeof value.apiKey === "string" ? value.apiKey.trim() : "";
  const apiSecret = typeof value.apiSecret === "string" ? value.apiSecret.trim() : "";
  if (!apiKey || !apiSecret) return null;
  return { apiKey, apiSecret };
}

async function proxyToBinanceSyncService(credentials: { apiKey: string; apiSecret: string }) {
  const baseUrl = readBackendBaseUrl();
  if (!baseUrl) return null;

  try {
    const response = await fetch(`${baseUrl}/binance/test`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        apiKey: credentials.apiKey,
        secretKey: credentials.apiSecret,
      }),
      cache: "no-store",
    });
    const payload = await response.json().catch(() => ({
      connected: false,
      exchange: "binance",
      error: "Binance sync backend returned an unreadable response.",
    }));
    return NextResponse.json(payload, { status: response.ok ? 200 : response.status });
  } catch {
    return NextResponse.json({
      connected: false,
      exchange: "binance",
      error: "Binance sync backend is unavailable.",
      errorCategory: "network",
    }, { status: 502 });
  }
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

    const proxied = await proxyToBinanceSyncService(credentials);
    if (proxied) return proxied;

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
