# Binance Production Connectivity

Status: BH-OPS-010

## Problem

Binance read-only sync works in local development but can fail on production when the server runtime is located in a region Binance restricts.

Observed user-facing error:

> Service unavailable from a restricted location according to "b. Eligibility".

This indicates the request reached Binance, but Binance rejected the production server region/IP.

## Most Likely Root Cause

The production serverless function was previously observed running from Vercel `iad1` in the United States. Binance can block API access from restricted server locations even when the user device is in an allowed country.

This means the problem is likely the backend execution location, not the user's iPhone, iPad, or mobile network.

## Minimal Fix Attempted

The Binance API routes now request Asia execution regions:

- `hnd1` — Tokyo
- `sin1` — Singapore

Affected routes:

- `/api/lobster/binance/test`
- `/api/lobster/binance/sync`

The routes also return safe diagnostics:

- HTTP status
- Binance error code
- Binance message
- Target endpoint
- Runtime environment
- Vercel region
- Timestamp
- recvWindow
- Whether request reached Binance
- Whether HMAC signature was built

Secrets are never returned.

## Error Classification

The backend classifies common failures:

- `restricted_region`
- `ip_whitelist`
- `invalid_key`
- `permission`
- `timestamp`
- `signature`
- `network`
- `unknown`

## If Vercel Region Is Still Blocked

If Binance still rejects Vercel Asia regions, use a dedicated backend instead of rewriting the whole app.

Recommended smallest stable option:

### Railway Backend

Why:

- Low operational cost
- Simple Node.js deployment
- Supports server-side HMAC signing
- Keeps API secrets away from frontend
- Can later support OKX, Bitunix, Bybit, Bitget
- Can later run Telegram, WhatsApp, and email reminder jobs

Alternative:

### Small VPS

Why:

- Most control over IP and region
- Stable long-running jobs
- Easy to whitelist IP if needed

Tradeoff:

- More server maintenance

## Not Recommended as First Fix

### Cloudflare Worker Proxy

Cloudflare Workers are cheap and fast, but Binance may still restrict some Cloudflare egress IPs. HMAC signing is possible, but long-term scheduled jobs are less straightforward than a small Node backend.

## Next Implementation Task If Needed

BH-OPS-011 — Create Binance Sync Backend Service

Scope:

1. Create a small Node.js API service on Railway.
2. Move Binance signed requests to the service.
3. Keep frontend routes as a proxy or call the service server-side.
4. Never store user API secrets in browser localStorage.
5. Add structured error classification.
6. Add future job scheduler support for reminders.

## Security Rules

- Never expose Binance Secret to frontend.
- Never store Binance API Key or Secret in localStorage.
- Never log Secret.
- Never log signed URLs.
- Never request trading, withdrawal, transfer, futures, or margin permissions.
- Only use read-only access.
