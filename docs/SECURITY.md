# Security and Risk Baseline

## Non-Negotiable Rules

- Never request, store, transmit, or log seed phrases or private keys.
- Default to read-only interactions in v0.1.
- Show chain, contract, asset amounts, approvals, and destination before any transaction.
- Use explicit protocol and token allowlists.
- Treat external price, RPC, and protocol data as untrusted.
- Mark stale data and stop calculations when freshness requirements fail.
- Keep AI outside the authorization path for financial transactions.

## Initial Threat Model

| Threat | v0.1 Control |
|---|---|
| Malicious token or protocol | Curated allowlists and verified addresses |
| Phishing or wallet impersonation | Domain guidance and clear wallet prompts |
| Infinite token approval | Avoid approvals in v0.1; warn if later introduced |
| Bad or stale price data | Multiple checks, timestamps, and fail-closed behavior |
| Prompt injection through external data | Structured inputs and content isolation |
| AI hallucination | Grounded findings, constrained output, source display |
| Faucet abuse | Rate limits, quotas, and monitoring |
| Admin key compromise | Multisig plan, least privilege, documented pause path |
| Dependency compromise | Lockfiles, automated scanning, reviewed upgrades |

## Before Mainnet

Mainnet requires a separate release decision, professional contract review, incident response plan, jurisdiction-specific legal review, privacy review, and meaningful user testing. Passing a testnet release does not imply mainnet readiness.

## User-Facing Language

Avoid claims such as “safe yield,” “guaranteed,” or “AI-protected.” Use precise language: identified risks, data limitations, possible outcomes, and actions the user may independently consider.

