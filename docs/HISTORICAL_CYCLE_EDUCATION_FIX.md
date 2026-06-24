# Historical Cycle Education Fix

Date: 2026-06-23

## Scope

Updated the DCA Planner historical cycle education section only.

No backend, Aave monitor logic, Lobster Watch logic, wallet connection, or DCA calculation logic was changed.

## What Changed

### 1. BTC Cycle 3 Updated

The outdated BTC Cycle 3 example was replaced.

Old educational example:

- 2022/11
- US$15,500
- US$73,000
- ≈ 4.7x

New educational example:

- 2022 → 2025 Cycle High
- US$15,500
- US$126,000
- ≈ 8.1x

Calculation:

126000 / 15500 ≈ 8.13, displayed as ≈ 8.1x.

### 2. Full BTC History Table Added

Added a beginner-friendly comparison table:

| Cycle | Period | Start Price | Peak Price | Approx. Multiple |
| --- | --- | --- | --- | --- |
| Cycle 1 | 2015 → 2017 | US$200 | US$19,800 | ≈ 99x |
| Cycle 2 | 2018 → 2021 | US$3,200 | US$69,000 | ≈ 22x |
| Cycle 3 | 2022 → 2025 | US$15,500 | US$126,000 | ≈ 8.1x |

### 3. Educational Insight Added

Added a prominent Baby Hippo observation card explaining:

- Each BTC cycle multiple has declined: 99x → 22x → 8x
- This suggests a maturing market
- BTC has still created higher price ranges historically
- Many investors choose long-term DCA because bottoms are difficult to predict

The section encourages:

- Long-term DCA
- Time-risk diversification
- Not trying to guess the exact bottom
- Not using essential living funds

### 4. ETH Card Reframed

The ETH card now states:

- ETH 早期成長階段
- 2016 → 2021
- US$10 → US$4,800
- ≈ 480x

Added note:

此階段屬於早期網路效應快速成長時期。歷史表現不代表未來報酬。

### 5. Visual Improvements

Historical cards now include:

- Cycle name
- Start price
- Peak price
- Multiple achieved
- Small trend graphic
- Short educational note

Mobile table layout stacks cleanly to avoid horizontal overflow.

### 6. Disclaimer Added

Added:

歷史資料僅供教育用途。過去表現不代表未來結果。投資有風險，請依自身情況評估。

## Validation

- No hardcoded `4.7x` remains in the DCA Planner code.
- BTC Cycle 3 now uses US$126,000.
- BTC Cycle 3 displays ≈ 8.1x.
- BTC Cycle 1 displays US$19,800 and ≈ 99x.
- ETH card includes early-growth context and future-return disclaimer.
- Mobile layout uses stacked table cards.
- Desktop layout keeps the historical cards readable.
- Production build passes.
- Browser check passes on `http://localhost:3000/dca-planner`.
- Desktop check: no console errors and no horizontal overflow.
- Mobile check at 375px width: no console errors and no horizontal overflow.

## Files Modified

- `apps/web/app/dca-planner/page.tsx`
- `apps/web/app/dca-planner/dca-planner.css`
