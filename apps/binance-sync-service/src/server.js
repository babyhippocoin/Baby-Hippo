import { createHmac } from "node:crypto";
import http from "node:http";

const PORT = Number(process.env.PORT || 8080);
const BINANCE_BASE_URL = (process.env.BINANCE_API_BASE_URL || "https://api.binance.com").replace(/\/$/, "");
const RECV_WINDOW = process.env.BINANCE_RECV_WINDOW || "5000";
const SPOT_SYMBOLS = ["BTCUSDT", "ETHUSDT", "SOLUSDT", "BNBUSDT", "LINKUSDT", "HYPUSDT"];
const ALLOWED_ORIGINS = new Set([
  "https://babieshippo.com",
  "https://www.babieshippo.com",
]);

function isAllowedOrigin(origin) {
  if (!origin) return false;
  if (ALLOWED_ORIGINS.has(origin)) return true;
  return /^http:\/\/(localhost|127\.0\.0\.1):\d+$/.test(origin);
}

function corsHeaders(origin) {
  const headers = {
    "Access-Control-Allow-Methods": "GET,POST,OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type",
    "Vary": "Origin",
  };
  if (isAllowedOrigin(origin)) {
    headers["Access-Control-Allow-Origin"] = origin;
  }
  return headers;
}

function json(response, status, payload, origin) {
  response.writeHead(status, {
    "Content-Type": "application/json; charset=utf-8",
    ...corsHeaders(origin),
  });
  response.end(JSON.stringify(payload));
}

async function readJson(request) {
  const chunks = [];
  for await (const chunk of request) chunks.push(chunk);
  if (!chunks.length) return {};
  return JSON.parse(Buffer.concat(chunks).toString("utf8"));
}

function readCredentials(body) {
  const apiKey = typeof body?.apiKey === "string" ? body.apiKey.trim() : "";
  const secretKey = typeof body?.secretKey === "string"
    ? body.secretKey.trim()
    : typeof body?.apiSecret === "string"
      ? body.apiSecret.trim()
      : "";
  if (!apiKey || !secretKey) return null;
  return { apiKey, secretKey };
}

function createSignedRequest(path, secretKey, extraParams = {}) {
  const timestamp = Date.now().toString();
  const params = new URLSearchParams({
    ...extraParams,
    timestamp,
    recvWindow: RECV_WINDOW,
  });
  const signature = createHmac("sha256", secretKey).update(params.toString()).digest("hex");
  params.append("signature", signature);
  return {
    url: `${BINANCE_BASE_URL}${path}?${params.toString()}`,
    timestamp,
    signatureBuilt: Boolean(signature),
  };
}

async function signedFetch(path, credentials, extraParams = {}) {
  const request = createSignedRequest(path, credentials.secretKey, extraParams);
  try {
    const response = await fetch(request.url, {
      method: "GET",
      headers: {
        "X-MBX-APIKEY": credentials.apiKey,
      },
      cache: "no-store",
    });
    return { response, request, reached: true };
  } catch (error) {
    return { error, request, reached: false };
  }
}

async function readSafeBinanceError(response) {
  try {
    const body = await response.json();
    return {
      code: typeof body?.code === "number" ? body.code : undefined,
      msg: typeof body?.msg === "string" ? body.msg : undefined,
    };
  } catch {
    return {};
  }
}

function runtimeInfo() {
  return {
    service: "baby-hippo-binance-sync-service",
    runtime: "node",
    nodeVersion: process.version,
    platform: process.platform,
    railwayEnvironment: process.env.RAILWAY_ENVIRONMENT_NAME,
    railwayService: process.env.RAILWAY_SERVICE_NAME,
    railwayRegion: process.env.RAILWAY_REGION || process.env.RAILWAY_DEPLOYMENT_REGION,
  };
}

function safeDiagnostics(path, request, reached, response, binanceError) {
  return {
    httpStatus: response?.status,
    binanceCode: binanceError?.code,
    binanceMessage: binanceError?.msg,
    endpoint: path,
    backendRuntime: runtimeInfo(),
    requestReachedBinance: reached,
    hmacSignatureBuilt: request?.signatureBuilt === true,
    recvWindow: RECV_WINDOW,
    timestamp: request?.timestamp,
  };
}

function classifyBinanceError(error, response) {
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

function userSafeError(category, fallback) {
  if (category === "restricted_region") return "目前後端節點所在區域無法連接 Binance API，請切換後端節點。";
  if (category === "ip_whitelist") return "這組 API Key 可能限制了允許 IP，請先關閉 IP 限制或加入指定伺服器 IP。";
  if (category === "invalid_key") return "API Key 或 Secret 可能不正確。";
  if (category === "permission") return "請確認 API 權限包含唯讀查詢訂單紀錄。";
  if (category === "timestamp") return "Binance API 時間驗證失敗，請稍後再試。";
  if (category === "signature") return "API Secret 簽章驗證失敗，請確認 Secret 是否正確。";
  if (category === "network") return "Binance API 暫時無法連線，請稍後再試。";
  return fallback || "Binance read-only connection failed.";
}

function firstArray(value) {
  if (Array.isArray(value)) return value;
  if (!value || typeof value !== "object") return [];
  for (const item of Object.values(value)) {
    if (Array.isArray(item)) return item;
    const nested = firstArray(item);
    if (nested.length) return nested;
  }
  return [];
}

function valueOf(record, keys) {
  for (const key of keys) {
    const value = record?.[key];
    if (typeof value === "string" && value.trim()) return value;
    if (typeof value === "number" && Number.isFinite(value)) return String(value);
  }
  return "";
}

function dateOf(record, keys) {
  const raw = valueOf(record, keys);
  if (!raw) return new Date().toISOString();
  const numeric = Number(raw);
  const date = Number.isFinite(numeric) ? new Date(numeric) : new Date(raw);
  return Number.isNaN(date.getTime()) ? new Date().toISOString() : date.toISOString();
}

function frequencyOf(value) {
  const normalized = value.toLowerCase();
  if (normalized.includes("day")) return "daily";
  if (normalized.includes("week")) return "weekly";
  if (normalized.includes("bi")) return "biweekly";
  if (normalized.includes("month")) return "monthly";
  return "unknown";
}

function statusOf(value) {
  const normalized = value.toLowerCase();
  if (["success", "succeeded", "complete", "completed", "filled"].some((item) => normalized.includes(item))) return "completed";
  if (["fail", "failed", "reject", "rejected", "expired"].some((item) => normalized.includes(item))) return "failed";
  if (["cancel", "cancelled", "canceled"].some((item) => normalized.includes(item))) return "cancelled";
  if (["pending", "processing"].some((item) => normalized.includes(item))) return "pending";
  return "unknown";
}

function assetFromSymbol(symbol) {
  return symbol.endsWith("USDT") ? symbol.replace("USDT", "") : symbol;
}

function normalizeAutoInvestRecord(raw, source) {
  if (!raw || typeof raw !== "object" || Array.isArray(raw)) return null;
  const asset = valueOf(raw, ["targetAsset", "asset", "coin", "targetCoin", "purchasedAsset", "cryptoCurrency"]);
  const amount = valueOf(raw, ["transactionAmount", "amount", "sourceAssetAmount", "subscriptionAmount", "investAmount", "totalInvestedInUSD"]);
  const quoteCurrency = valueOf(raw, ["sourceAsset", "quoteCurrency", "fiatCurrency", "stableAsset"]) || "USDT";
  const rawId = valueOf(raw, ["transactionId", "id", "planId", "orderId", "subscriptionId"]) || `${source}-${asset}-${dateOf(raw, ["transactionDateTime", "time", "createTime"])}`;
  if (!asset || !amount) return null;
  return {
    rawId,
    asset,
    amount,
    quoteCurrency,
    frequency: frequencyOf(valueOf(raw, ["subscriptionCycle", "cycle", "frequency", "period"])),
    executedAt: dateOf(raw, ["transactionDateTime", "time", "createTime", "successTime", "updateTime"]),
    status: statusOf(valueOf(raw, ["transactionStatus", "status", "state"]) || "completed"),
    source,
  };
}

function normalizeSpotOrder(raw, symbol) {
  if (!raw || typeof raw !== "object" || Array.isArray(raw)) return null;
  if (valueOf(raw, ["side"]).toUpperCase() !== "BUY") return null;
  const status = statusOf(valueOf(raw, ["status"]));
  if (status !== "completed") return null;
  const executedQty = valueOf(raw, ["executedQty"]);
  if (!executedQty || Number(executedQty) <= 0) return null;
  return {
    rawId: valueOf(raw, ["orderId", "clientOrderId"]) || `${symbol}-${dateOf(raw, ["time"])}`,
    asset: assetFromSymbol(symbol),
    amount: valueOf(raw, ["cummulativeQuoteQty"]) || executedQty,
    quoteCurrency: "USDT",
    frequency: "unknown",
    executedAt: dateOf(raw, ["time", "updateTime", "workingTime"]),
    status,
    source: "spot_order_history",
  };
}

function toBhcDcaRecord(raw) {
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

async function testConnection(credentials) {
  const result = await signedFetch("/api/v3/account", credentials);
  if (!result.response) {
    return {
      connected: false,
      exchange: "binance",
      error: userSafeError("network"),
      errorCategory: "network",
      diagnostics: safeDiagnostics("/api/v3/account", result.request, false),
    };
  }
  if (!result.response.ok) {
    const binanceError = await readSafeBinanceError(result.response);
    const errorCategory = classifyBinanceError(binanceError, result.response);
    return {
      connected: false,
      exchange: "binance",
      error: userSafeError(errorCategory, binanceError.msg || `Binance returned HTTP ${result.response.status}.`),
      errorCategory,
      diagnostics: safeDiagnostics("/api/v3/account", result.request, true, result.response, binanceError),
    };
  }
  const body = await result.response.json();
  return {
    connected: true,
    exchange: "binance",
    permissionsDetected: Array.isArray(body?.permissions) ? body.permissions.filter((item) => typeof item === "string") : [],
    diagnostics: safeDiagnostics("/api/v3/account", result.request, true, result.response),
  };
}

async function fetchAutoInvestRecords(credentials, diagnostics) {
  const attempts = [
    { path: "/sapi/v1/lending/auto-invest/history/list", source: "auto_invest", params: { current: "1", size: "100" } },
    { path: "/sapi/v1/lending/auto-invest/plan/list", source: "recurring_buy", params: {} },
    { path: "/sapi/v1/lending/auto-invest/plan/list", source: "recurring_buy", params: { planType: "SINGLE" } },
    { path: "/sapi/v1/lending/auto-invest/plan/list", source: "recurring_buy", params: { planType: "PORTFOLIO" } },
  ];
  const records = [];
  for (const attempt of attempts) {
    const result = await signedFetch(attempt.path, credentials, attempt.params);
    if (!result.response) {
      diagnostics.push(safeDiagnostics(attempt.path, result.request, false));
      continue;
    }
    if (!result.response.ok) {
      const binanceError = await readSafeBinanceError(result.response);
      diagnostics.push(safeDiagnostics(attempt.path, result.request, true, result.response, binanceError));
      continue;
    }
    diagnostics.push(safeDiagnostics(attempt.path, result.request, true, result.response));
    const raw = await result.response.json();
    for (const item of firstArray(raw)) {
      const normalized = normalizeAutoInvestRecord(item, attempt.source);
      if (normalized) records.push(toBhcDcaRecord(normalized));
    }
  }
  return records;
}

async function fetchSpotOrderRecords(credentials, diagnostics) {
  const records = [];
  for (const symbol of SPOT_SYMBOLS) {
    const result = await signedFetch("/api/v3/allOrders", credentials, { symbol, limit: "100" });
    if (!result.response) {
      diagnostics.push(safeDiagnostics("/api/v3/allOrders", result.request, false));
      continue;
    }
    if (!result.response.ok) {
      const binanceError = await readSafeBinanceError(result.response);
      diagnostics.push(safeDiagnostics("/api/v3/allOrders", result.request, true, result.response, binanceError));
      continue;
    }
    diagnostics.push(safeDiagnostics("/api/v3/allOrders", result.request, true, result.response));
    const raw = await result.response.json();
    if (!Array.isArray(raw)) continue;
    for (const item of raw) {
      const normalized = normalizeSpotOrder(item, symbol);
      if (normalized) records.push(toBhcDcaRecord(normalized));
    }
  }
  return records;
}

function dedupeRecords(records) {
  return Array.from(new Map(records.map((record) => [record.id, record])).values())
    .sort((a, b) => new Date(b.executedAt).getTime() - new Date(a.executedAt).getTime());
}

function calculateLevel(recordCount) {
  if (recordCount >= 26) return "L4";
  if (recordCount >= 12) return "L3";
  if (recordCount >= 4) return "L2";
  if (recordCount >= 1) return "L1";
  return "L0";
}

function calculateStreakCandidate(records) {
  const byAsset = new Map();
  for (const record of records) byAsset.set(record.asset, (byAsset.get(record.asset) || 0) + 1);
  return Array.from(byAsset.values()).some((count) => count >= 4);
}

function calculateVerifiedAmount(records) {
  return records.reduce((sum, record) => {
    if (record.quoteCurrency !== "USDT") return sum;
    const value = Number(record.amount);
    return sum + (Number.isFinite(value) ? value : 0);
  }, 0);
}

async function syncDcaRecords(credentials) {
  const connection = await testConnection(credentials);
  if (!connection.connected) {
    return {
      ...connection,
      records: [],
    };
  }
  const diagnostics = [];
  const records = dedupeRecords([
    ...await fetchAutoInvestRecords(credentials, diagnostics),
    ...await fetchSpotOrderRecords(credentials, diagnostics),
  ]);
  const verifiedCandidateCount = records.filter((record) => record.verificationState === "verified_candidate").length;
  return {
    connected: true,
    exchange: "binance",
    records,
    summary: {
      connectedExchanges: 1,
      verifiedDcaOrders: verifiedCandidateCount,
      currentStreak: calculateStreakCandidate(records) ? 1 : 0,
      verifiedAmount: calculateVerifiedAmount(records).toFixed(2),
      bhcPoints: verifiedCandidateCount * 10,
      currentLevel: calculateLevel(verifiedCandidateCount),
    },
    diagnostics,
    warnings: records.length ? [] : ["Connected, but no DCA records found yet."],
    message: records.length ? undefined : "Connected, but no DCA records found yet.",
  };
}

async function handlePostBinanceTest(request, response, origin) {
  const credentials = readCredentials(await readJson(request));
  if (!credentials) {
    json(response, 400, { connected: false, exchange: "binance", error: "Missing Binance API key or secret." }, origin);
    return;
  }
  json(response, 200, await testConnection(credentials), origin);
}

async function handlePostBinanceSync(request, response, origin) {
  const credentials = readCredentials(await readJson(request));
  if (!credentials) {
    json(response, 400, { connected: false, exchange: "binance", records: [], error: "Missing Binance API key or secret." }, origin);
    return;
  }
  json(response, 200, await syncDcaRecords(credentials), origin);
}

const server = http.createServer(async (request, response) => {
  const origin = request.headers.origin;
  if (request.method === "OPTIONS") {
    response.writeHead(204, corsHeaders(origin));
    response.end();
    return;
  }

  try {
    const url = new URL(request.url || "/", `http://${request.headers.host || "localhost"}`);
    if (request.method === "GET" && url.pathname === "/health") {
      json(response, 200, {
        ok: true,
        status: "healthy",
        timestamp: new Date().toISOString(),
        binanceBaseUrl: BINANCE_BASE_URL,
        recvWindow: RECV_WINDOW,
        ...runtimeInfo(),
      }, origin);
      return;
    }
    if (request.method === "POST" && url.pathname === "/binance/test") {
      await handlePostBinanceTest(request, response, origin);
      return;
    }
    if (request.method === "POST" && url.pathname === "/binance/sync") {
      await handlePostBinanceSync(request, response, origin);
      return;
    }
    json(response, 404, { ok: false, error: "Not found." }, origin);
  } catch {
    json(response, 500, { ok: false, error: "Service error." }, origin);
  }
});

server.listen(PORT, () => {
  console.log(`Baby Hippo Binance sync service listening on ${PORT}`);
});
