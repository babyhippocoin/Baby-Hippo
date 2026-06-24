# Baby Hippo v0.1 Roadmap

## Strategic Direction

Version 0.1 proves that Baby Hippo can help an ordinary person understand on-chain risk, learn essential concepts, and begin building steady habits without hype or pressure.

The core journey is:

> Join the community → connect a wallet → understand risk → learn why it matters → build a DCA plan → earn a testnet learning reward.

The first release uses testnet assets and read-only protocol data wherever possible. It does not include Hippo Farm, automated execution, leverage, governance, or real-value BHC trading.

## Priority Order

1. **Lobster Watch** — make risk understandable.
2. **Hippo Bank** — teach DCA and lending fundamentals.
3. **Hippo Academy** — build practical knowledge and community learning.
4. **Baby Hippo Coin** — reward testnet learning and participation.
5. **Hippo Farm** — future exploration after the v0.1 mission is proven.

## Suggested Timeline

An eight-week build is a reasonable starting target for a small team. Quality and user understanding matter more than forcing an artificial launch date.

| Phase | Weeks | Outcome |
|---|---:|---|
| 0. Community and Safety Foundation | 1 | Audience, language, supported chain, risk model, threat model |
| 1. Lobster Watch Core | 2–3 | Wallet overview, risk engine, evidence-based alerts |
| 2. Hippo Bank | 4–5 | DCA planner and read-only lending education |
| 3. Hippo Academy | 6 | Short lessons, progress, scam-awareness education |
| 4. BHC and Testnet Community Launch | 7–8 | Learning rewards, onboarding, QA, public test |

## Phase 0 — Community and Safety Foundation

### Deliverables

- Document the founder story and target community.
- Interview or test concepts with drivers, workers, teachers, rural users, and Web3 beginners.
- Select one EVM-compatible testnet and no more than two read-only protocol data sources.
- Define supported wallets, assets, and market-data sources.
- Map the welcome, risk, learning, DCA, and reward journeys.
- Define the risk methodology and visible limitations.
- Establish analytics, feedback collection, and error monitoring.
- Complete an initial security threat model.

### Exit Criteria

- Product language is understandable to non-technical users.
- At least five target users have reviewed the core journey.
- Risk scores have defined inputs and formulas.
- External dependencies and data sources are documented.
- No private key or seed phrase is ever collected.
- The team agrees that Hippo Farm is outside v0.1.

## Phase 1 — Lobster Watch Core

### User Stories

- As a beginner, I can connect my wallet and understand what I hold.
- I can see the most important risks before being shown possible opportunities.
- I can understand why a warning appeared and what I can learn next.

### Initial Risk Signals

- Portfolio concentration
- Stablecoin depeg exposure
- Protocol concentration
- Smart-contract or protocol allowlist status
- Lending health factor
- High utilization or rapidly changing rates
- Stale price or market data

### Deliverables

- Wallet connection and network validation.
- Token balances and portfolio allocation.
- Deterministic risk score from 0 to 100.
- Low, medium, high, and critical risk bands.
- Alert inbox with severity, cause, evidence, and educational next step.
- Plain-language AI explanations grounded in calculated findings.
- User feedback controls for unclear or incorrect explanations.

### Exit Criteria

- Every alert links to the evidence that triggered it.
- Known-risk test cases produce the expected alerts.
- AI cannot alter scores, invent protocol facts, or submit transactions.
- Stale or unavailable data is clearly marked and handled safely.
- Target users can explain at least one warning in their own words.

## Phase 2 — Hippo Bank

### User Stories

- I can create a recurring investment plan without sending real funds.
- I can compare scenarios without being told that profit is guaranteed.
- I can understand the basic difference between supplying and borrowing.
- I can see how collateral and liquidation risk work.

### Deliverables

- DCA plan builder with amount, asset, frequency, and duration.
- Historical or scenario-based DCA simulation.
- Saved plans and plain-language educational notes.
- Read-only lending market comparison.
- Supply APY, borrow APY, liquidity, collateral factor, and utilization.
- Simple health-factor simulator.
- Source and last-updated time for every market rate.

### Exit Criteria

- Financial calculations have automated tests.
- Users see assumptions and limitations beside simulations.
- Unsupported networks and missing data fail safely.
- Users see risk education before any external action link.
- No product language implies a guaranteed return.

## Phase 3 — Hippo Academy

### Deliverables

- Short beginner lessons designed for completion during a work break.
- Learning paths for wallet safety, DCA, lending, scams, risk, and compounding.
- A lesson connected to each major Lobster Watch alert type.
- Progress tracking and simple knowledge checks.
- Founder welcome message and community values orientation.
- Feedback prompts that invite questions without making beginners feel judged.

### Exit Criteria

- Lessons avoid unexplained jargon.
- Knowledge checks reward understanding rather than trading behavior.
- Scam, fake-promise, exploit, and pump-and-dump warnings are explicit.
- Users can move directly from a risk alert to a relevant lesson.
- Content has been reviewed by target non-technical users.

## Phase 4 — BHC and Testnet Community Launch

### Deliverables

- Deploy testnet BHC with capped supply and documented admin controls.
- Reward lessons, knowledge checks, responsible testing, and useful feedback.
- Add a rate-limited faucet or controlled reward distributor.
- Complete accessibility, mobile, integration, and end-to-end testing.
- Publish the manifesto, founder story, security assumptions, and product limitations.
- Open a clear community feedback process.

### Release Criteria

- No unresolved critical or high-severity security findings.
- Core flows work with supported mobile and desktop wallets.
- Monitoring covers data failures, stale prices, alert errors, and reward abuse.
- Contracts are verified on the selected testnet explorer.
- A pause or rollback procedure is documented and tested.
- BHC is clearly presented as a testnet learning and participation reward.

## Priority Backlog

### Must Have

- Founder-led community welcome
- Wallet connection and portfolio overview
- Deterministic Lobster Watch risk score
- Evidence-based, explainable alerts
- DCA planner and simulation
- Lending education and read-only market comparison
- Hippo Academy foundation lessons
- Testnet BHC learning rewards
- Analytics, feedback, monitoring, and disclaimers

### Should Have

- Saved alert watchlist
- Email or push alert opt-in
- Community learning quests
- Portfolio history chart
- Additional Academy learning paths
- CSV export

### Future Exploration

- Hippo Farm
- Mainnet transactions
- Automated DCA execution
- Cross-chain aggregation
- Borrowing or leverage execution
- BHC governance
- Staking or revenue-sharing models
- Autonomous AI agents

## Definition of Done

A feature is done only when it has:

- Clear user value and acceptance criteria.
- Warm, plain-language product copy.
- Loading, empty, stale-data, and error states.
- Tests for critical calculations and failure modes.
- Security and privacy review.
- Analytics and user-feedback signals.
- Mobile and accessibility checks.
- Supporting education where the concept may be unfamiliar.

