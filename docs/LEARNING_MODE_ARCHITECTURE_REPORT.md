# Baby Hippo Learning Mode Architecture Report

Date: 2026-06-23

## Summary

Baby Hippo now has one shared learning-mode system across its public education experience.

The system adds a true Beginner Mode without replacing or making the existing content more technical. The previous site experience remains available as Growth Mode.

No wallet connection, backend, token feature, API integration, or transaction functionality was added.

The Dashboard, Aave monitor logic, and market-price logic were not modified.

## What Changed

### Global Learning Mode

A shared selector appears with the public navigation:

- 新手模式 / Beginner Mode
- 成長模式 / Growth Mode

Behavior:

- Beginner Mode is the default when no choice has been saved.
- The selected mode is stored in localStorage.
- Switching mode immediately updates supported educational content.
- The selected mode remains after refresh and across public routes.
- Traditional Chinese remains the default language.
- English switching continues to work with either learning mode.

### Learning Journey Question

The homepage and Learn page now ask:

> 你的投資旅程到哪一步了？

Available answers:

- 我還沒買過比特幣
- 我已經開始定期定額
- 我想增加被動收入
- 我想學習鏈上借貸

The answer is stored locally and recommends:

| Answer | Suggested mode | Next page |
| --- | --- | --- |
| Never bought Bitcoin | Beginner Mode | Bitcoin lesson |
| Already using DCA | Growth Mode | DCA Planner |
| Interested in passive income | Growth Mode | Ether.fi / Earn |
| Interested in on-chain lending | Growth Mode | Aave and risk lesson |

## Beginner Mode Examples

### Bitcoin

Bitcoin is described as digital gold: a scarce asset some people use to store value, while its price can still change sharply.

### Ethereum

Ethereum is described as a digital city where developers can build financial applications and other tools.

### DCA

DCA is compared with buying a small amount of TSMC stock every month instead of trying to guess the lowest price.

### Passive Income Layer

Yield is renamed **被動收入層 / Passive Income Layer** in Beginner Mode.

It is compared with putting a shop or truck to work. The asset may produce income, but losses remain possible.

### Ether.fi

Ether.fi is introduced as putting long-term ETH to work through staking for potential yield, with clear reminders that yield and principal safety are not guaranteed.

### Aave

Aave is explained as an online pawnshop or collateral lending market. Crypto can support a stablecoin loan, but falling collateral can cause liquidation.

### Health Factor

Health Factor is explained as a **借款安全分數 / borrowing safety score**.

The analogy is truck-load safety: a lower score means the position is closer to danger, so a comfortable buffer matters.

### Seed Phrase

A seed phrase is explained as the master key to the entire wallet. Anyone with the full phrase can usually control everything inside.

### Other Terms

The beginner glossary also explains:

- DeFi
- Yield
- APR
- Stablecoin
- Smart Contract
- Liquidation through the Aave explanation

Inline terms use small focusable or hoverable explanations.

## Page Behavior

### Homepage

- Displays the global learning-mode selector.
- Includes the learning-journey question before the existing Baby Hippo Journey.
- Uses clearer CTAs such as:
  - Read Bitcoin Guide
  - Create My DCA Plan
  - View My On-Chain Boss Progress
  - Join Community

### Learn

Beginner Mode adds life-problem categories before technical concepts:

- I want to start investing
- I want a regular DCA plan
- I want passive income
- I want to avoid scams
- I want to learn on-chain lending

Every lesson receives an everyday analogy.

A beginner glossary explains ten common terms.

Growth Mode hides these extra beginner layers and preserves the existing seven-lesson experience.

### Earn

Beginner Mode presents a simple progression:

1. Understand passive income.
2. Start with Ether.fi.
3. Study Aave next.
4. Leave Kamino and HyperLend until later.

Only the Ether.fi detail card is shown in Beginner Mode.

Growth Mode shows the full existing four-protocol comparison and filters.

### DCA Planner

Beginner Mode adds four explanations:

- Why emergency cash comes first
- Why DCA reduces timing pressure
- Why projections are not promises
- Why market cycles change DCA intensity

The `Yield` asset label becomes `被動收入層 / Passive Income Layer`.

An inline explanation states that Ether.fi and Aave may produce yield but still carry protocol, price, and smart-contract risk.

All existing calculations, projections, cycle logic, storage, Points integration, and Execute Layer behavior remain unchanged.

### Points

Beginner Mode explains BHP as a game-style progress system:

> Complete learning and planning tasks to collect BHP points. They are not tokens or investments—only a way to see your learning progress.

The existing achievement calculations and storage remain unchanged.

### Story

Beginner Mode emphasizes that the founder did not start as a crypto expert. It keeps the story grounded in freight work, violin teaching, DCA, and learning one lesson at a time.

### Community

Beginner Mode explicitly welcomes people who know nothing yet and states that joining does not require buying crypto, connecting a wallet, or investing money.

## Growth Mode Behavior

Growth Mode is the existing Baby Hippo style:

- It assumes some familiarity with BTC, ETH, or basic investing.
- It keeps DCA, Ether.fi, Aave, yield, and risk education.
- It does not become a technical Pro mode.
- It does not introduce unexplained raw lending parameters or protocol jargon.
- Existing content, calculators, filters, projections, Points, and navigation remain available.

## Storage

The architecture uses local-only storage:

- `baby-hippo-learning-mode`
- `baby-hippo-learning-journey`
- Existing `baby-hippo-language`

There is no account system or cross-device synchronization.

## Verification

Verified on mobile viewport:

- Homepage loads
- Learn loads
- Earn loads
- DCA Planner loads
- Story loads
- Community loads
- Points loads
- Beginner Mode updates content immediately
- Growth Mode restores the existing content style
- Mode persists after refresh
- Journey answer persists after refresh
- Journey answer recommends the correct mode and route
- Traditional Chinese content works
- English content works
- Earn shows one protocol in Beginner Mode
- Earn shows all four protocols in Growth Mode
- DCA uses the Passive Income Layer label in Beginner Mode
- No horizontal overflow on reviewed routes
- No browser console errors
- Production build passes
- All 11 static pages generate successfully

## Remaining Content Gaps

- Existing long-form Growth Mode lesson text still depends on the current translation dictionary and could receive a dedicated editorial pass later.
- Liquidation has a clear explanation inside Aave content but does not yet have its own standalone lesson.
- Stablecoin, APR, and Smart Contract currently live in the glossary rather than full lesson cards.
- The learning journey is local to one browser and does not sync across devices.
- Tooltips use native hover/focus help; a future accessible popover could offer richer mobile interactions.

## Suggested Next Improvements

These are future education improvements, not required for this implementation:

1. Add short standalone lessons for stablecoins, liquidation, APR, and smart contracts.
2. Add optional audio versions for drivers and people learning between shifts.
3. Add a “three minutes available” lesson filter.
4. Let users revisit and change their journey answer from the Learn page.
5. Run founder-led Traditional Chinese copy review sessions with real first-time users.

The current implementation intentionally remains focused, local-only, beginner-friendly, and non-transactional.
