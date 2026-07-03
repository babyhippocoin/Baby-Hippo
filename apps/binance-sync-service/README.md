# Baby Hippo Binance Sync Service

Minimal read-only backend for Binance DCA verification.

## Endpoints

- `GET /health`
- `POST /binance/test`
- `POST /binance/sync`

## Security

- Does not store API keys.
- Does not log API secrets.
- Does not return raw Binance account responses.
- Does not support trading, withdrawals, transfers, futures, or margin.
- Uses read-only signed requests only.

## Local Run

```bash
npm install
npm start
```

## Railway

Deploy this folder as the Railway project root:

```text
apps/binance-sync-service
```

Set environment variables:

```text
BINANCE_API_BASE_URL=https://api.binance.com
BINANCE_RECV_WINDOW=5000
```
