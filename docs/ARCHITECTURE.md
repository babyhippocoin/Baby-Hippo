# Architecture

## System Shape

```text
Wallet + User
      |
      v
Web Dashboard
      |
      v
Application API
  |       |        |
  v       v        v
Chain   Market    User Data
Data    Data      and Plans
  \       |        /
   \      v       /
    Risk Engine
         |
         v
 Structured Findings
         |
         v
 AI Explanation Layer
         |
         v
 Alert Feed
```

## Modules

### Web Application

- Community welcome and founder story
- Wallet session and network state
- Portfolio, Lobster Watch, Hippo Bank, and Hippo Academy interfaces
- DCA simulator
- Academy lessons, progress, and educational quests
- Transaction previews and warnings

### Application API

- User preferences and saved plans
- Data normalization and caching
- Alert scheduling and delivery
- Academy lessons, progress, and knowledge checks
- Rate limiting and abuse controls
- AI prompt orchestration with structured inputs

### Data Connectors

- RPC or indexed blockchain data
- Protocol market data
- Token prices and metadata
- Freshness, fallback, and source attribution

All connector responses should use shared schemas and include source, chain, block or timestamp, and freshness state.

### Risk Engine

The risk engine is deterministic and versioned. Its inputs and output should be auditable.

Example output:

```json
{
  "score": 72,
  "band": "high",
  "modelVersion": "0.1.0",
  "findings": [
    {
      "code": "PORTFOLIO_CONCENTRATION",
      "severity": "high",
      "evidence": {
        "asset": "TOKEN",
        "portfolioShare": 0.81
      }
    }
  ]
}
```

### AI Assistant

The AI receives only structured findings, approved product knowledge, and user-selected context. It may explain terms, summarize evidence, and suggest educational next steps. It may not calculate the canonical risk score, promise returns, or create executable transactions in v0.1.

### Hippo Academy

Hippo Academy connects risk findings to short, plain-language lessons. Content is designed for beginners with limited time and should teach wallet safety, DCA, lending, scams, and risk management without encouraging trading activity.

Learning progress may qualify a user for testnet BHC participation rewards. Academy completion does not imply financial expertise or guarantee any future benefit.

### Smart Contracts

- Testnet BHC ERC-20
- Faucet or controlled reward distributor
- Optional non-transferable quest record, only if needed

Keep contracts minimal, upgrade assumptions explicit, and administrative permissions visible.

## Suggested Technology Direction

- TypeScript monorepo
- React-based web application
- Node-compatible API
- EVM wallet and contract libraries
- Relational database for plans, preferences, and alert state
- Background worker for periodic risk checks
- Shared runtime schemas at every service boundary

Specific frameworks and vendors should be selected during Phase 0 based on team experience, supported chain, and deployment constraints.
