# Baby Hippo Product Funnel V1 — User Journey Audit

Date: 2026-06-23

## Implementation Outcome

Baby Hippo now guides users through this sequence:

1. Learn
2. Choose Exchange
3. Start DCA
4. Build Habit
5. Passive Income Layer
6. Crypto Payment Layer
7. Advanced DeFi Layer

The funnel is educational and user-directed. Baby Hippo does not hold funds, connect wallets, execute trades, make deposits, process withdrawals, or interact with smart contracts.

## Main Product Changes

### Homepage Funnel

The homepage now contains a visible seven-step product journey.

The primary CTA is:

- Start My Baby Hippo Journey

The funnel explains that users:

- Learn before acting
- Buy assets directly through an exchange
- Keep responsibility for their own funds
- Build a DCA habit before studying passive income
- Learn payment use cases before advanced borrowing

### My Investment Plan

The public product name was changed from **DCA Planner** to:

- 我的投資計畫
- My Investment Plan

The route remains `/dca-planner` to preserve existing links and functionality.

The planner still supports:

- Bear Market
- Transition
- Early Bull
- Late Bull

Each cycle now includes a plain-language action message and a simple educational allocation example.

Bear Market example:

- BTC 40%
- ETH 30%
- SOL 15%
- LINK 10%
- Cash 5%

The example is clearly labeled as educational and separate from the calculator's personalized output.

A user must actively press **Complete My First DCA Plan** to receive the related BHP achievement. Opening the page alone does not award it.

### Exchange Starting Point

The funnel includes **Where Do I Start?**

It clearly states:

> Baby Hippo never holds user funds.

Educational exchange choices:

- Binance
  - Large global exchange
  - Suitable for beginner BTC and ETH DCA
- OKX
  - Alternative exchange
  - Suitable as another or secondary DCA platform

The buttons use the provided partner/referral URLs.

The page discloses that:

- These are partner/referral links
- Regional restrictions may apply
- Users must check platform rules and risks
- Baby Hippo never touches user funds

### Passive Income Layer

The funnel avoids introducing DeFi jargon first.

Passive income is explained as similar to collecting rent from an asset, while clearly warning:

- Yield is not guaranteed
- Principal can be lost
- Smart-contract risk exists
- Protocol risk exists

Ether.fi is shown as the first passive-income learning path for long-term ETH holders.

### Crypto Payment Layer

The educational payment section introduces Ether.fi Card topics:

- Daily spending
- Travel spending
- Reward programs

It includes no card connection, payment action, reward promise, or financial recommendation.

### Advanced DeFi Layer

Aave is presented as the advanced layer.

It remains locked in the product funnel until these milestones are completed:

- Bitcoin lesson
- DCA lesson
- Passive Income lesson

Beginner Mode no longer displays the complete Aave lesson directly. It sends the learner back to the core journey.

When unlocked, opening Aave learning switches the site to Growth Mode so the existing intermediate explanation becomes available.

## Points Integration

The funnel uses the existing local-only Baby Hippo Points system.

| Milestone | Points |
| --- | ---: |
| Learn Bitcoin | +10 BHP |
| Create First DCA Plan | +20 BHP |
| Choose Exchange | +10 BHP |
| Learn Passive Income | +15 BHP |
| Learn Aave | +20 BHP |
| Complete Core Journey | +50 BHP |

New achievements appear on the Points page and participate in:

- Total BHP
- Category progress
- Level calculation
- Homepage progress
- LocalStorage restoration

The current complete Points catalog totals 315 BHP.

BHP remains a local educational progress marker. It is not a token, investment, security, payment asset, or guaranteed reward.

## CTA Review

The funnel uses specific action language:

- Start My Baby Hippo Journey
- Read Bitcoin Guide
- Choose My Exchange
- Create My First DCA Plan
- Learn Passive Income
- Learn Ether.fi
- Learn Aave
- View My On-Chain Boss Progress

Generic labels such as Learn More, Explore, or Discover are not used for the primary funnel decisions.

## Final Usability Questions

### 1. Can a truck driver with zero crypto knowledge understand the homepage?

**Result: Yes.**

The homepage begins with real-life positioning, uses Beginner Mode by default, explains the order of actions, and repeatedly states that Baby Hippo does not hold funds or promise easy money.

The funnel uses familiar concepts:

- Bitcoin as digital gold
- DCA as a monthly saving plan
- Passive income as collecting rent
- Aave as collateral lending
- Health Factor as a loan safety score

### 2. Can a stock investor understand why Bitcoin DCA exists?

**Result: Yes.**

DCA is compared with buying a small amount of TSMC stock every month rather than trying to guess the lowest price.

The investment-plan page also explains:

- Emergency cash comes first
- DCA reduces timing pressure
- Market cycles change contribution intensity
- Projections are estimates, not promises

### 3. Can a beginner reach Binance or OKX in fewer than three clicks?

**Result: Yes.**

From the homepage:

1. Select **Start My Baby Hippo Journey**
2. Select **Start with Binance** or **Start with OKX**

The exchange links are directly visible in the funnel and do not require account creation inside Baby Hippo.

### 4. Can a user understand Passive Income without understanding DeFi?

**Result: Yes.**

The funnel introduces the everyday analogy first and only then names Ether.fi.

It explains both the potential benefit and the risks before presenting the external learning link.

### 5. Are Aave and advanced concepts hidden until appropriate?

**Result: Yes within the designed beginner funnel.**

- The homepage Aave layer displays prerequisites and remains locked.
- Beginner Mode hides the full Aave lesson.
- The beginner lending CTA returns users to the core journey.
- Growth Mode retains the existing Aave content.
- Unlocking Aave requires Bitcoin, DCA, and Passive Income milestones.

## Mobile Audit

Verified at a 390 × 844 mobile viewport:

- Homepage: no horizontal overflow
- Learn: no horizontal overflow
- My Investment Plan: no horizontal overflow
- Earn: no horizontal overflow
- Story: no horizontal overflow
- Community: no horizontal overflow
- Points: no horizontal overflow

Additional checks:

- Funnel cards stack vertically
- Exchange buttons remain readable
- Progress steps scroll horizontally inside their own contained row
- Journey and BHP progress remain visible
- Aave lock requirements remain readable

## Technical Verification

- Production compilation: Passed
- Type validation: Passed
- Static generation: 11 of 11 pages
- Browser console errors: None detected
- Learning Mode persistence: Passed
- Traditional Chinese default: Passed
- English switching: Passed
- My Investment Plan route: Passed
- DCA calculation and cycle behavior: Preserved
- Points synchronization: Passed
- Aave beginner gating: Passed
- Lobster Watch logic: Unchanged
- Aave monitor logic: Unchanged
- Market-price API logic: Unchanged

## Custody and Safety Confirmation

Product Funnel V1 adds no:

- Wallet connection
- Smart-contract interaction
- Trading execution
- Deposit
- Withdrawal
- Backend service
- Tokenomics
- Automatic investment action

Users always remain responsible for their own accounts, platforms, assets, and custody decisions.
