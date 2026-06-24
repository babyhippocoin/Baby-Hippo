# Future Founder Mode Architecture

Status: architecture notes only. No backend, trading execution, exchange connection, or new wallet connection is included in V2.

## Purpose

Founder Mode would give the Baby Hippo founder a private operating view of learning progress, product health, and verified user habits without turning Baby Hippo into an exchange or investment advisor.

## Future capabilities

### Exchange API verification

- Use read-only exchange permissions.
- Never request withdrawal or trading permissions.
- Verify only agreed habit signals, such as whether a recurring spot purchase exists.
- Store the minimum possible verification result instead of full account history.
- Require clear user consent, revocation, and data-deletion controls.

### Wallet verification

- Begin with a pasted public address or signature-based ownership proof.
- Never request a seed phrase or private key.
- Separate “address observed” from “address ownership verified.”
- Keep asset tracking read-only.

### Aave founder dashboard

- Aggregate anonymous product-health signals such as monitor usage and warning delivery.
- Do not expose individual balances by default.
- Keep Aave position reading separate from any future transaction feature.
- Preserve the existing manual-refresh and rate-limit protections.

### Lobster asset tracking

- Treat Lobster Watch as the user-facing asset-growth dashboard.
- Combine learning milestones, DCA habit records, public wallet observations, and DeFi education progress.
- Clearly label self-reported, externally verified, and on-chain-observed data.
- Never present tracked growth as guaranteed performance.

## Suggested system boundaries

1. Public learning application
2. Consent and identity layer
3. Read-only verification adapters
4. Minimal achievement ledger
5. Founder analytics dashboard
6. Audit log and deletion controls

## Security principles

- Read-only by default
- Least-privilege API permissions
- No custody
- No trading execution
- No seed phrases or private keys
- Explicit consent and revocation
- Minimal data retention
- Clear distinction between self-reported and verified progress

## Delivery phases

### Architecture validation

Define consent, privacy, data retention, and verification standards.

### Isolated prototype

Test one read-only verification provider with test accounts and no public release.

### Limited founder beta

Add audit logs, deletion controls, monitoring, and incident procedures before real user data.

### Optional user release

Release only after security review and clear user-facing explanations.

