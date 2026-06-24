# Lobster Watch v1 Architecture

> **Target:** A read-only risk and reminder product that one founder can build within 30 days.

## 1. Product Boundary

Lobster Watch v1 connects to Rabby Wallet or MetaMask, reads public wallet and Aave data, monitors BTC and ETH price rules, and sends DCA reminders.

It does not:

- Trade or swap
- Borrow
- Repay
- Supply or withdraw
- Approve tokens
- Sign transactions
- Automatically execute financial actions
- Ask for a seed phrase or private key

Wallet connection is used only to obtain a public address and display read-only information.

## 2. Thirty-Day Scope Decisions

To keep the product buildable:

- Support **Ethereum Mainnet only** for wallet assets and Aave positions.
- Support **Aave V3 Ethereum only**.
- Display native ETH and ERC-20 balances.
- Monitor one connected wallet address per user.
- Support BTC and ETH threshold alerts in USD.
- Support weekly, every-two-weeks, and monthly DCA reminders.
- Send in-app and email notifications.
- Use one responsive web application and one backend.
- Use one primary provider for each external data category.

Additional chains, wallets, protocols, currencies, push channels, and transaction features are deferred.

---

# 3. User Flow

## First-Time Flow

```text
Open Lobster Watch
        |
        v
Create account with email magic link
        |
        v
Choose wallet
  |-------------|
  v             v
Rabby        MetaMask
  |             |
  +------v------+
         |
         v
Approve read-only account connection
         |
         v
Read public wallet address and chain
         |
         v
Load ETH + ERC-20 assets
         |
         v
Load Aave V3 Ethereum positions
         |
         v
Classify Health Factor status
         |
         v
Offer four actions
  | BTC alert
  | ETH alert
  | Aave monitoring
  ` DCA reminder
         |
         v
Dashboard + Alert Center
```

## Returning User Flow

```text
Email session restored
        |
        v
Backend loads saved public address and rules
        |
        v
Fresh wallet, Aave, and price data requested
        |
        v
Dashboard shows current or last-confirmed values
        |
        v
Background workers continue monitoring
```

The wallet extension does not need to remain connected for background alerts. Once the user saves the public address, the backend can monitor public on-chain data.

## Wallet Connection Flow

1. User explicitly selects **Connect Wallet**.
2. The application discovers injected providers.
3. The user chooses Rabby Wallet or MetaMask.
4. The selected provider receives `eth_requestAccounts`.
5. The application reads:
   - Public address
   - Chain ID
6. The application listens for:
   - `accountsChanged`
   - `chainChanged`
   - Disconnect state
7. The user confirms that the selected public address may be monitored.
8. The backend saves the normalized public address.

Do not auto-connect on page load. Do not request a message signature in v1.

## Wallet Change Flow

If the user changes account inside Rabby or MetaMask:

1. Update the temporary connected address in the interface.
2. Ask whether to replace the monitored address.
3. Do not silently overwrite the saved monitoring address.
4. If confirmed, refresh wallet assets and Aave positions.

---

# 4. Technical Architecture

## Recommended Shape

Use a TypeScript monolith with a separate background worker process.

```text
┌──────────────────────────────────────────────────────────┐
│ Browser                                                  │
│                                                          │
│ Next.js / React Web App                                  │
│ ├─ Rabby + MetaMask provider discovery                   │
│ ├─ Wallet connection state                               │
│ ├─ Dashboard and Alert Center                            │
│ ├─ Aave Health Factor page                               │
│ ├─ BTC / ETH alert forms                                 │
│ └─ DCA reminder forms                                    │
└───────────────────────┬──────────────────────────────────┘
                        │ HTTPS
                        v
┌──────────────────────────────────────────────────────────┐
│ Application Server                                      │
│                                                          │
│ Next.js server routes or small Node API                  │
│ ├─ Email authentication                                 │
│ ├─ User and monitored-address settings                  │
│ ├─ Wallet asset adapter                                  │
│ ├─ Aave adapter                                          │
│ ├─ Price-alert rules                                     │
│ ├─ DCA schedules                                         │
│ ├─ Notification inbox                                    │
│ └─ Read-only policy guard                                │
└───────┬──────────────────┬───────────────────┬───────────┘
        │                  │                   │
        v                  v                   v
┌──────────────┐  ┌────────────────┐  ┌──────────────────┐
│ PostgreSQL   │  │ Background     │  │ Email Provider   │
│              │  │ Worker / Cron  │  │                  │
│ users        │  │                │  │ Alert delivery   │
│ addresses    │  │ price checks   │  └──────────────────┘
│ rules        │  │ Aave checks    │
│ reminders    │  │ DCA schedules  │
│ events       │  │ deduplication  │
└──────────────┘  └───────┬────────┘
                          │
             ┌────────────┼──────────────┐
             v            v              v
        Ethereum RPC   Aave Data     Price API
        + Token API    Source        BTC / ETH
```

## Recommended Stack

| Layer | Recommendation | Reason |
|---|---|---|
| Web app | Next.js + TypeScript | One project for frontend and API |
| Wallet client | wagmi + viem, or a small EIP-6963 adapter | Supports standard EVM providers |
| Database and auth | Managed PostgreSQL with email magic links | Removes password and server-management work |
| Background work | Hosted cron plus idempotent worker endpoints | Sufficient for minute-level MVP checks |
| Email | Transactional email provider | Reliable alert delivery and logs |
| Hosting | Managed Node-compatible platform | Low operations burden |
| Monitoring | Error tracking plus structured logs | Solo-founder visibility |

Vendor choices are replaceable. Keep provider-specific code behind adapters.

## Why a Monolith

A solo founder does not need microservices.

Use:

- One repository
- One web deployment
- One database
- One scheduled-worker deployment or cron mechanism
- One email provider

Separate modules in code, not separate infrastructure.

---

# 5. Wallet Connection Architecture

## Provider Discovery

Use **EIP-6963** to discover multiple injected wallet providers. This prevents Rabby and MetaMask from competing for the single `window.ethereum` object.

Recommended behavior:

1. Listen for `eip6963:announceProvider`.
2. Dispatch `eip6963:requestProvider`.
3. Show discovered wallet names and icons.
4. Match known Rabby and MetaMask entries for display.
5. Fall back to `window.ethereum` only when EIP-6963 discovery finds nothing.

Rabby's own integration guidance notes that injected wallets use an Ethereum provider and recommends showing both Rabby and MetaMask connection choices. Modern EIP-6963 discovery is preferable when supported.

## Allowed Provider Methods

The browser wallet adapter may call only:

- `eth_requestAccounts`
- `eth_accounts`
- `eth_chainId`

It may listen for:

- `accountsChanged`
- `chainChanged`
- `disconnect`

## Forbidden Provider Methods

Do not implement:

- `eth_sendTransaction`
- `eth_signTransaction`
- `personal_sign`
- `eth_sign`
- Typed-data signing
- Token approval calls
- Contract write calls
- Network-add requests unless later approved as necessary

Add a code-level allowlist so accidental transaction methods cannot be called through the wallet adapter.

## Wallet Is Not Authentication

Use email magic-link authentication for the Lobster Watch account.

The connected wallet supplies a public address for monitoring. It does not prove ownership because v1 requests no signature. The UI should say:

> You are choosing a public address to monitor. Lobster Watch will not ask this wallet to sign or send anything.

---

# 6. Reading Wallet Assets

## Scope

Read on Ethereum Mainnet:

- Native ETH balance
- ERC-20 balances
- Token symbol, name, and decimals
- Optional token logo when available
- Optional USD reference value when the data provider supports it

Do not support NFTs, transaction history, DeFi positions outside Aave, or multiple chains in v1.

## Data Flow

```text
Saved public address
        |
        v
Server wallet-asset adapter
        |
        +--> Native ETH balance
        |
        +--> ERC-20 token balances
        |
        +--> Token metadata
        |
        v
Normalize and filter zero balances
        |
        v
Return assets + source + block/time
```

## Recommended Source

For a 30-day build, use one Ethereum RPC/data provider that exposes:

- Standard JSON-RPC
- Native balance queries
- ERC-20 token-balance API
- Token metadata API

Alchemy is one possible implementation because its Token API provides `alchemy_getTokenBalances` for ERC-20 balances. Keep an internal interface so another provider can replace it.

## Asset Response

```json
{
  "address": "0x...",
  "chainId": 1,
  "assets": [
    {
      "type": "native",
      "symbol": "ETH",
      "balance": "0.42",
      "contractAddress": null
    },
    {
      "type": "erc20",
      "symbol": "USDC",
      "balance": "125.50",
      "contractAddress": "0x..."
    }
  ],
  "source": "primary-ethereum-provider",
  "checkedAt": "ISO-8601",
  "blockNumber": "optional"
}
```

## Safety and Quality

- Treat token metadata as untrusted text.
- Escape names and symbols before rendering.
- Hide zero balances.
- Limit the number of returned assets.
- Mark spam or unknown tokens rather than presenting them as trusted.
- Show the data timestamp.
- Do not imply that reading a token means Baby Hippo endorses it.

---

# 7. Reading Aave Positions

## Scope

Read one address on:

- Ethereum Mainnet
- Aave V3 Ethereum

Display:

- Supplied assets
- Borrowed assets
- Current Health Factor
- Aave market
- Last checked time

## Recommended Data Path

Use an official Aave-supported data path through an `AaveAdapter`:

- Aave SDK / Aave Kit
- Aave GraphQL
- Official read-only contract calls if the selected SDK path cannot support server-side monitoring

The current Aave developer documentation provides user-supply and user-borrow data and a user-market-state query that includes `healthFactor`.

Do not mix multiple Aave calculation sources in v1.

## Data Flow

```text
Saved public address
        |
        v
AaveAdapter.getUserMarketState()
        |
        +--> supplied positions
        +--> borrowed positions
        +--> healthFactor
        +--> market metadata
        |
        v
Normalize decimal values
        |
        v
Classify Health Factor status
        |
        v
Store observation + compare previous band
```

## Health Factor Source of Truth

Do not independently recreate Aave's canonical Health Factor calculation for v1.

Use the Health Factor returned by the selected official Aave data path. Lobster Watch calculates only the **display and alert status** from that value.

Aave documentation states that Health Factor is available only when a user has an active borrow position; it may be null for no position or supply-only positions.

## Health Factor Status

```text
healthFactor == null
  -> NO_ACTIVE_BORROW

healthFactor <= 1.00
  -> CRITICAL

healthFactor < 1.20
  -> URGENT

healthFactor < 1.50
  -> WARNING

healthFactor < 2.00
  -> WATCH

otherwise
  -> HIGHER_RANGE
```

“Higher range” must not be labeled “safe.”

## Status Function

```ts
type HealthStatus =
  | 'NO_ACTIVE_BORROW'
  | 'CRITICAL'
  | 'URGENT'
  | 'WARNING'
  | 'WATCH'
  | 'HIGHER_RANGE'
  | 'DATA_DELAYED'
  | 'ERROR'

function classifyHealthFactor(value: number | null): HealthStatus {
  if (value === null) return 'NO_ACTIVE_BORROW'
  if (value <= 1.0) return 'CRITICAL'
  if (value < 1.2) return 'URGENT'
  if (value < 1.5) return 'WARNING'
  if (value < 2.0) return 'WATCH'
  return 'HIGHER_RANGE'
}
```

Use decimal-safe parsing. Do not silently convert an invalid value to zero.

## Aave Monitoring Rule

The worker:

1. Loads all active Aave monitors.
2. Fetches current market state.
3. Verifies freshness.
4. Classifies current status.
5. Compares it with the previous status.
6. Creates an event only when:
   - Status becomes more serious
   - Status recovers across a configured threshold
   - Data monitoring becomes delayed
7. Saves the new observation.
8. Sends notification events idempotently.

---

# 8. BTC and ETH Alert System

## Price Source

Use one external price API for:

- BTC/USD
- ETH/USD
- Last-updated timestamp

CoinGecko's Simple Price endpoint is one possible provider. Wrap it in a `PriceProvider` interface so it can be replaced.

## Price Polling

For the MVP:

- Poll every 1–5 minutes, based on provider limits.
- Fetch BTC and ETH together.
- Cache the result.
- Use one worker execution to evaluate all active rules.
- Do not make one external request per user.

## Alert Evaluation

```text
Fetch current BTC + ETH prices once
        |
        v
Validate response and freshness
        |
        v
Load all active price rules
        |
        v
For each rule:
  compare previous price and current price
        |
        v
Detect threshold crossing
        |
        v
Create unique notification event
        |
        v
Mark rule triggered
```

## Crossing Rules

Above:

```text
previousPrice < target
AND
currentPrice >= target
```

Below:

```text
previousPrice > target
AND
currentPrice <= target
```

Do not trigger merely because the application started while the current price was already beyond the threshold. On rule creation, store a baseline price and explain whether the rule is immediately eligible.

## Price Provider Interface

```ts
interface PriceSnapshot {
  asset: 'BTC' | 'ETH'
  currency: 'USD'
  price: string
  providerUpdatedAt: string | null
  fetchedAt: string
}

interface PriceProvider {
  getBtcAndEthUsd(): Promise<PriceSnapshot[]>
}
```

## Reliability

- Store previous reference prices.
- Use decimal-safe comparisons.
- Reject stale snapshots.
- Use a unique constraint such as `(rule_id, crossing_version)`.
- Never send repeated notifications while a rule remains triggered.
- Show provider timestamp in the notification.

---

# 9. DCA Reminder System

## Reminder Model

A DCA reminder contains:

- User ID
- Asset: BTC or ETH
- Frequency
- Local date and time
- IANA timezone
- Optional planning amount
- Next run time in UTC
- Status

## Scheduling Flow

```text
User saves local schedule + timezone
        |
        v
Server calculates nextRunAt in UTC
        |
        v
Cron loads reminders due now
        |
        v
Create idempotent reminder event
        |
        v
Send in-app + email notification
        |
        v
Calculate next occurrence
```

## Scheduling Rules

- Store the user's IANA timezone, such as `Asia/Taipei`.
- Store `nextRunAt` in UTC.
- Recalculate from the local schedule after every occurrence.
- Do not add a fixed number of hours or days for monthly reminders.
- Handle daylight-saving changes for users outside Taiwan.
- Support weekly, every two weeks, and monthly only.
- Allow reviewed, skipped, snoozed, paused, and deleted states.

## No Execution

The reminder does not:

- Buy BTC or ETH
- Connect to an exchange
- Verify a purchase
- Mark skipping as failure
- Use price movement to pressure the user

---

# 10. Application Modules

## Web Client

Responsibilities:

- Wallet discovery and selection
- Read-only wallet connection
- Dashboard and settings
- Forms and validation
- Current-session wallet events
- Display source and freshness

## API

Suggested endpoints:

```text
GET    /api/me
PUT    /api/me/settings

PUT    /api/monitor/address
DELETE /api/monitor/address

GET    /api/wallet/assets
GET    /api/aave/position

GET    /api/price-alerts
POST   /api/price-alerts
PATCH  /api/price-alerts/:id
DELETE /api/price-alerts/:id

GET    /api/dca-reminders
POST   /api/dca-reminders
PATCH  /api/dca-reminders/:id
DELETE /api/dca-reminders/:id

GET    /api/notifications
PATCH  /api/notifications/:id/read
POST   /api/notifications/read-all
```

Internal worker endpoints or jobs:

```text
check-prices
check-aave-health
send-dca-reminders
deliver-notifications
check-provider-health
```

Protect worker routes with platform authentication or a secret not exposed to browsers.

## Adapters

```text
WalletAssetProvider
AaveAdapter
PriceProvider
EmailProvider
Clock
```

Adapters reduce vendor lock-in and make tests deterministic.

## Read-Only Policy Guard

Create a small module and test that:

- No write ABI is imported into the v1 Aave adapter.
- No transaction method is exposed by the wallet service.
- No API route accepts calldata, transaction requests, approvals, or signatures.
- The frontend contains no borrow, repay, supply, withdraw, swap, or approve actions.

---

# 11. Database Model

## Core Tables

```text
users
  id
  email
  timezone
  language
  quiet_hours_start
  quiet_hours_end
  created_at

monitored_addresses
  id
  user_id
  chain_id
  address
  source_wallet
  is_active
  created_at

price_alerts
  id
  user_id
  asset
  direction
  target_price
  currency
  baseline_price
  status
  created_at
  triggered_at

aave_monitors
  id
  user_id
  monitored_address_id
  market
  warning_threshold
  urgent_threshold
  previous_health_factor
  previous_status
  last_checked_at
  status

aave_observations
  id
  monitor_id
  health_factor
  health_status
  source_time_or_block
  observed_at

dca_reminders
  id
  user_id
  asset
  frequency
  local_time
  timezone
  optional_amount
  next_run_at
  status
  last_response

notification_events
  id
  user_id
  source_type
  source_id
  event_key
  severity
  payload
  created_at
  read_at

notification_deliveries
  id
  event_id
  channel
  status
  attempts
  last_attempt_at
```

## Important Constraints

- One active monitored address per user.
- Maximum three active BTC alerts.
- Maximum three active ETH alerts.
- Maximum three active DCA reminders.
- Unique notification `event_key`.
- Lowercase or checksum-normalized addresses consistently.
- Cascade-disable rules when a monitored address is removed.

---

# 12. APIs Required

## Browser Wallet API

Required:

- EIP-6963 provider discovery
- EIP-1193 account and chain methods
- Rabby injected provider
- MetaMask injected provider or MetaMask Connect if mobile support is added

The 30-day minimum can support desktop browser extensions first. Mobile MetaMask connection is optional only if core reliability is already complete.

## Ethereum Data API

Required:

- Ethereum Mainnet RPC
- Native ETH balance
- ERC-20 token balances
- Token metadata
- Current block or response timestamp

## Aave API

Required:

- User supplies
- User borrows
- User market state
- Health Factor
- Market and chain identifiers
- Source timestamp or block where available

## Price API

Required:

- BTC/USD
- ETH/USD
- Provider update time
- Batch request for both assets

## Authentication API

Required:

- Email magic-link login
- Session cookies
- Logout
- Account deletion

## Notification API

Required:

- Transactional email
- Delivery status
- Retry-safe provider response

## Scheduling API

Required:

- Recurring cron
- Protected worker execution
- At-least-once execution with application-level idempotency

---

# 13. Data Sources

| Data | Primary direction | Fallback or behavior |
|---|---|---|
| Wallet provider | EIP-6963 injected Rabby / MetaMask | `window.ethereum` only as fallback |
| ETH and ERC-20 balances | Ethereum RPC and token API | Show delayed state; no fabricated balances |
| Token metadata | Token API | Display contract-shortened unknown token |
| Aave positions | Official Aave-supported SDK, GraphQL, or read path | Show last confirmed value as stale |
| Health Factor | Value returned by official Aave data path | Do not independently invent a value |
| BTC and ETH price | External batch price API | Pause triggering when stale |
| User time | Browser-proposed IANA timezone | User can correct in Settings |
| Email delivery | Transactional email provider | Retry and show delivery failure internally |

## Freshness

Define before launch:

- Price snapshot maximum age
- Wallet-asset cache duration
- Aave monitoring interval
- Aave stale threshold
- Notification delivery retry schedule

Every response shown to users includes `checkedAt` or `lastConfirmedAt`.

---

# 14. Failure and Degraded Modes

## Wallet Not Installed

Show Rabby and MetaMask installation links. Do not repeatedly prompt.

## Both Wallets Installed

Use the EIP-6963 picker so the user chooses explicitly.

## User Rejects Connection

Remain on the page and explain that no account was shared.

## Wrong Chain Selected

Because backend reads use the saved Ethereum address, the app can still monitor Ethereum Mainnet. Clearly state that v1 displays Ethereum Mainnet data only.

## Asset Provider Fails

Show last confirmed assets with a stale label, or an empty error state when no prior data exists.

## Aave Provider Fails

Do not calculate a new status. Show the last confirmed Health Factor and pause transition alerts until current data returns.

## Price Provider Fails

Do not evaluate BTC or ETH thresholds. Record a provider-health event.

## Worker Runs Twice

Use event keys and database uniqueness so notification delivery remains idempotent.

## Email Fails

Keep the in-app event. Retry delivery and record the failure for the founder.

---

# 15. Security and Privacy

- Never collect seed phrases, private keys, recovery words, or wallet PINs.
- Do not request wallet signatures in v1.
- Never expose provider API keys in browser code.
- Validate and normalize every address server-side.
- Rate-limit account, alert, and worker endpoints.
- Escape token metadata.
- Use secure, HTTP-only session cookies.
- Keep worker credentials separate from public application credentials.
- Store only public wallet addresses and required account settings.
- Allow users to remove the monitored address and delete the account.
- Redact full addresses from email.
- Log provider failures without logging full notification payloads.

## Threats to Test

- Malicious token symbols containing markup
- Duplicate wallet providers
- Wallet-provider impersonation metadata
- Replayed worker requests
- Duplicate email sends
- Stale price triggering
- Invalid Health Factor values
- Timezone and monthly-schedule errors
- Unauthorized access to another user's rules
- Accidental transaction-method import

---

# 16. MVP Implementation Order

## Days 1–3 — Architecture Freeze

- Choose Ethereum Mainnet and Aave V3 Ethereum.
- Choose managed database, auth, email, RPC/token, and price providers.
- Create the TypeScript project.
- Define adapter interfaces.
- Define database schema.
- Add the read-only policy guard.
- Freeze scope.

## Days 4–6 — Account and Wallet Connection

- Implement email magic-link authentication.
- Implement EIP-6963 discovery.
- Display Rabby and MetaMask choices.
- Call only account and chain methods.
- Handle rejection, account changes, and chain changes.
- Save one public address.

## Days 7–9 — Wallet Assets

- Implement native ETH balance.
- Implement ERC-20 balances and metadata.
- Normalize asset response.
- Add source and freshness.
- Handle spam metadata, empty balances, and provider failure.

## Days 10–13 — BTC and ETH Alerts

- Implement price provider adapter.
- Add BTC and ETH rule CRUD.
- Store baseline price.
- Implement crossing detection.
- Add idempotent events.
- Add in-app and email delivery.

## Days 14–18 — Aave Positions and Health Status

- Implement Aave adapter.
- Read supplies, borrows, and Health Factor.
- Add null/no-active-borrow handling.
- Implement status bands.
- Store observations.
- Implement worsening and recovery events.
- Compare results with the official Aave interface.

## Days 19–21 — DCA Reminders

- Implement local schedule and IANA timezone handling.
- Calculate UTC next run.
- Add due-reminder worker.
- Add snooze, reviewed, skipped, paused, and deleted states.
- Verify neutral notification language.

## Days 22–24 — Dashboard and Alert Center

- Combine wallet assets, Aave state, price rules, and DCA reminders.
- Add loading, empty, stale, and error states.
- Add notification inbox.
- Add settings and account deletion.

## Days 25–27 — Reliability and Security

- Test duplicate worker execution.
- Test stale provider data.
- Test wallet-provider collisions.
- Test authorization boundaries.
- Test no transaction or signature path exists.
- Add internal provider-health monitoring.

## Days 28–29 — Pilot

- Test with Rabby and MetaMask users.
- Test with an address that has an Aave borrow.
- Test with no-position and supply-only addresses.
- Test email delivery and timezone behavior.
- Fix only launch-blocking issues.

## Day 30 — Launch

- Verify all providers and secrets.
- Run acceptance checks.
- Publish limitations and data sources.
- Enable production schedules.
- Monitor the first alerts manually.

---

# 17. Solo-Founder Simplifications

Choose the simpler path when two designs are equally safe:

- One chain
- One Aave market
- One monitored address
- One price provider
- One email provider
- One database
- One web deployment
- One worker mechanism
- No wallet signature
- No microservices
- No mobile app
- No AI layer
- No custom indexer
- No on-chain contract deployment

Do not build a custom wallet connector if a maintained EIP-6963-compatible library already handles the required providers cleanly.

---

# 18. Launch Acceptance Criteria

The first working version is ready when:

- Rabby Wallet can connect read-only.
- MetaMask can connect read-only.
- Both wallets can coexist and be selected explicitly.
- Account and chain changes are handled.
- ETH and ERC-20 assets load for the saved Ethereum address.
- Aave V3 Ethereum supplies and borrows load.
- Health Factor null, valid, stale, and error states are handled.
- Health Factor status bands are deterministic.
- BTC above and below alerts trigger once.
- ETH above and below alerts trigger once.
- DCA reminders respect timezone and recurrence.
- In-app and email notifications are idempotent.
- All displayed external data includes freshness.
- Provider failures pause affected evaluations.
- No transaction, borrow, repay, supply, withdraw, approval, or signature path exists.
- A user can remove the monitored address and delete the account.
- The system can be operated by one founder.

## Final Scope Question

Before adding any feature, ask:

> Is this required to connect Rabby or MetaMask read-only, read Ethereum assets, read one Aave market, classify Health Factor, send BTC or ETH alerts, or deliver DCA reminders safely?

If not, defer it.

---

# Official Technical References

- [MetaMask: Manage user accounts](https://docs.metamask.io/metamask-connect/evm/guides/manage-user-accounts/)
- [MetaMask Connect overview](https://docs.metamask.io/metamask-connect/)
- [EIP-6963: Multi Injected Provider Discovery](https://eips.ethereum.org/EIPS/eip-6963)
- [Rabby Wallet integration guidance](https://github.com/RabbyHub/Rabby#guideline-for-integrating-rabby-wallet)
- [Aave: User positions and account health](https://aave.com/docs/aave-v3/markets/positions)
- [Alchemy: ERC-20 token balances](https://www.alchemy.com/docs/data/token-api/token-api-endpoints/alchemy-get-token-balances)
- [CoinGecko: Simple Price API](https://docs.coingecko.com/reference/simple-price)

Provider capabilities, limits, and SDK versions must be confirmed again when implementation begins.

