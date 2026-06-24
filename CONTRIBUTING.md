# Contributing

## Working Agreements

- Keep v0.1 testnet-first and non-custodial.
- Add acceptance criteria before implementing a feature.
- Put shared financial calculations in tested, deterministic modules.
- Include data source and freshness metadata in every market-data feature.
- Do not let AI output bypass validation or become executable transaction data.
- Document new contracts, permissions, protocols, and external dependencies.

## Suggested Branch Areas

- `product/` for specifications and UX
- `web/` for the dashboard
- `api/` for application services
- `contracts/` for testnet smart contracts
- `risk/` for Lobster Watch
- `data/` for protocol and market adapters

## Pull Request Checklist

- Scope matches the v0.1 roadmap.
- Tests cover critical calculations and failure modes.
- Loading, empty, stale, and error states are handled.
- No secrets or sensitive wallet data are logged.
- Security and accessibility impacts are considered.
- User-facing terms are explained in plain language.

