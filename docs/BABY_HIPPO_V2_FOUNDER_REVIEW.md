# Baby Hippo V2 Founder Review

## Product position

Baby Hippo is presented as a learning and habit-building platform. It does not hold funds, execute trades, act as an exchange, or provide personalized investment advice.

## Changes completed

- Re-centered Lobster Watch as the asset-growth dashboard.
- Added the journey: TWD On-Ramp → DCA → Lobster Watch → Passive Income Layer → Crypto Payment Layer → Advanced DeFi.
- Added the journey and Lobster explanation to the homepage, on-ramp, investment plan, DCA completion flow, and Earn page.
- Added two real-life fee education examples and a founder opinion card.
- Added an illustrative crypto-card reward comparison with a clear assumptions warning.
- Rebuilt the Taiwan platform table around purpose rather than rankings.
- Added official and founder email placeholders plus future X and Telegram placeholders.
- Added persistent public breadcrumbs while preserving clickable Baby Hippo logos and Home navigation.
- Expanded the Traditional Chinese translation map for dashboard and settings labels.
- Changed DCA proof points to:
  - Create Plan: +5 BHP
  - Read DCA Guide: +10 BHP
  - Choose Exchange: +5 BHP
  - Submit DCA Commitment: +20 BHP
  - Verified Habit Milestone: +50 BHP, reserved for a future verification system
- Removed exchange-link click rewards. Opening Binance or OKX no longer awards BHP.
- Added a clear self-report disclosure.
- Added future Founder Mode architecture notes without implementing a backend or verification connection.

## Product guardrails preserved

- No new wallet connection
- No backend
- No deposits or withdrawals
- No trading execution
- No Aave monitor logic changes
- No exchange API connection
- No guaranteed-return language

## Verification

- Production build passed with all public routes and the Lobster dashboard statically generated.
- Desktop and 375 × 812 mobile checks found no page-level horizontal overflow.
- Traditional Chinese persisted after refresh on the homepage, Points page, and Lobster Watch.
- English switching rendered the new journey and payment example correctly.
- Lobster Watch navigation, breadcrumb, dashboard, and Settings labels rendered in Traditional Chinese.
- Binance, OKX, and Ether.fi partner URLs still open in a new tab.
- Binance and OKX cards no longer grant points when opened.
- The DCA plan provides separate, explicit exchange-selection buttons for the +5 BHP task.
- Browser console audit returned no errors.
