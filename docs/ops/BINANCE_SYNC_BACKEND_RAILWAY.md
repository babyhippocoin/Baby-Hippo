# Binance Sync Backend on Railway

Status: BH-OPS-011

## Why Vercel Failed

The Baby Hippo frontend and modal work correctly on production.

The failure happens when the server-side Binance request runs from Vercel. Production diagnostics showed:

- Runtime: Vercel
- Region: `iad1`
- Binance endpoint: `/api/v3/account`
- HTTP status: `451`
- Binance message: restricted location according to Binance eligibility terms
- Request reached Binance: yes
- HMAC signature built: yes

This means the problem is the production backend execution region/IP, not the user's iPhone, iPad, or mobile network.

## Railway Service Architecture

New service path:

```text
apps/binance-sync-service/
```

Runtime:

```text
Node.js 20+
```

No Express/Fastify dependency is required. The service uses Node's built-in HTTP server to keep deployment simple and cheap.

## Endpoints

### GET /health

Returns:

- service status
- runtime information
- Railway environment fields when available
- Binance base URL
- recvWindow

### POST /binance/test

Accepts:

```json
{
  "apiKey": "...",
  "secretKey": "..."
}
```

Also accepts `apiSecret` for compatibility with existing Next.js routes.

Calls:

```text
GET https://api.binance.com/api/v3/account
```

Returns only safe data:

- connected
- exchange
- permissionsDetected
- error
- errorCategory
- diagnostics

### POST /binance/sync

Accepts:

```json
{
  "apiKey": "...",
  "secretKey": "..."
}
```

Calls:

- Binance Auto-Invest history
- Binance Auto-Invest plan list
- Binance spot order history fallback

Supported spot fallback symbols:

- BTCUSDT
- ETHUSDT
- SOLUSDT
- BNBUSDT
- LINKUSDT
- HYPUSDT

Returns:

- normalized `BhcDcaRecord[]`
- summary
- warnings
- safe diagnostics

It does not return raw Binance account responses.

## Security Model

The service:

- never stores Binance API keys
- never stores Binance secrets
- never logs Binance secrets
- never returns Binance secrets
- never returns signed URLs
- never supports trading
- never supports withdrawals
- never supports transfers
- never supports futures
- never supports margin
- uses read-only signed requests only

Frontend credentials are sent to the backend for the current request only.

## CORS

Allowed origins:

- `https://babieshippo.com`
- `https://www.babieshippo.com`
- `http://localhost:<port>`
- `http://127.0.0.1:<port>`

## Environment Variables

Railway service:

```text
BINANCE_API_BASE_URL=https://api.binance.com
BINANCE_RECV_WINDOW=5000
PORT=8080
```

Vercel frontend:

Preferred server-side env:

```text
BINANCE_SYNC_API_BASE_URL=https://<your-railway-service>.up.railway.app
```

Compatibility env:

```text
NEXT_PUBLIC_BINANCE_SYNC_API_BASE_URL=https://<your-railway-service>.up.railway.app
```

The existing Next.js routes remain:

- `/api/lobster/binance/test`
- `/api/lobster/binance/sync`

If the Railway URL is set, these routes proxy to Railway.

If the Railway URL is not set, they fall back to the existing Vercel Binance adapter.

## Deployment Steps

Railway CLI is not currently available on this machine.

Manual Railway deployment:

1. Open Railway.
2. Create a new project.
3. Choose Deploy from GitHub repo.
4. Select:

```text
babyhippocoin/Baby-Hippo
```

5. Set service root directory:

```text
apps/binance-sync-service
```

6. Set variables:

```text
BINANCE_API_BASE_URL=https://api.binance.com
BINANCE_RECV_WINDOW=5000
```

7. Deploy.
8. Open:

```text
https://<railway-url>/health
```

9. Copy the Railway public URL.
10. Add to Vercel project environment variables:

```text
BINANCE_SYNC_API_BASE_URL=https://<railway-url>
```

11. Redeploy Vercel production.
12. Test Binance from:

```text
https://babieshippo.com/points
```

## Validation

Test:

```text
GET /health
```

Then test with a read-only Binance API key:

```text
POST /binance/test
POST /binance/sync
```

If Railway returns `restricted_region`, the next fallback is a small VPS in a Binance-compatible region with stable IP.

## Next Fallback Options

If Railway is blocked:

1. Small VPS
2. Fly.io with selected region
3. Render with selected region
4. Cloudflare Worker only if Binance accepts the egress IP

Recommended fallback:

Small VPS with stable IP because it can also support future Telegram, WhatsApp, email jobs, and exchange IP allowlisting.
