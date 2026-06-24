# DCA Real Scenario Chart Fix

## Scope

Only the `/dca-planner` scenario simulation presentation was changed.

No backend, wallet, Aave monitoring, or Lobster Watch logic was modified.

## Charts implemented

The three scenario cards now contain responsive SVG curve charts:

- 弱勢走勢 — red/pink
- 平均走勢 — yellow/orange
- 強勢走勢 — green/teal

Every chart includes:

- Dashed line for cumulative contributed principal
- Solid colored line for scenario asset valuation
- Auto-scaled TWD Y-axis
- 0Y, 1Y, 3Y, 5Y, and 10Y X-axis labels
- Milestone dots on the scenario curve
- Annualized assumption range
- Short educational explanation
- Compact 1Y, 3Y, 5Y, and 10Y result rows

## Dynamic calculation

Charts use the live monthly investable amount from the existing calculator.

Verification changed the inputs until the calculator produced NT$9,750 per month. The strong-scenario chart updated from:

- Y-axis maximum: approximately NT$1.5M
- 10-year range: NT$521,931–NT$1,504,525

to:

- Y-axis maximum: approximately NT$15M
- 10-year range: NT$5,088,828–NT$14,669,118

The summary also updated to NT$9,750 per month. No hardcoded NT$3,000 value is used by the scenario charts.

## Safety language

A prominent warning now appears above the charts:

> 這不是預測，也不是保證。這只是根據歷史情境與使用者輸入金額做的教育模擬。

The existing detailed risk disclaimer remains below the charts.

## Historical section

The BTC and ETH historical-cycle cards remain available but use smaller padding, typography, and visual weight so the scenario charts remain the main focus.

## Verification

- Three SVG charts render.
- All principal and scenario paths are visible.
- Scenario colors render correctly.
- X-axis labels are 0Y, 1Y, 3Y, 5Y, and 10Y.
- Y-axis automatically changes with the calculated amount.
- Result values update immediately when income and emergency-fund inputs change.
- Desktop displays three cards in one clean row.
- Mobile stacks all three charts vertically.
- No horizontal overflow at 375 × 812.
- Production build passes.
- Browser console reports no errors.

