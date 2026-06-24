# DCA Scenario and Real Fee Education Report

## Scope

Updated:

- `/dca-planner`
- `/on-ramp`
- Related public education styling

Not changed:

- Backend
- Wallet connections
- Exchange APIs
- Trading execution
- Aave monitoring
- Lobster Watch core logic

## DCA scenario simulation

The previous fixed-return projection presentation was replaced by three scenario cards:

- 弱勢走勢：年化假設 -5% ～ +3%
- 平均走勢：年化假設 8% ～ 15%
- 強勢走勢：年化假設 25% ～ 40%

Each scenario shows:

- 1-year principal and scenario range
- 3-year principal and scenario range
- 5-year principal and scenario range
- 10-year principal and scenario range

All values use the calculator’s live monthly investable amount.

Browser verification changed the inputs to produce NT$9,750 per month. The simulator immediately displayed:

- Monthly: NT$9,750
- Annual: NT$117,000
- 3 years: NT$351,000
- 5 years: NT$585,000
- 10 years: NT$1,170,000

The weak, average, and strong scenario ranges all recalculated from the same NT$9,750 monthly amount.

## Historical-cycle education

Added educational cards for:

- BTC 2015–2017
- BTC 2018–2021
- BTC 2022–2024
- ETH 2016–2021

The section states that historical outcomes do not guarantee future results. Baby Hippo’s educational emphasis remains:

- DCA
- Time
- Risk management
- Never using essential living money

## Real fee education

Added a hypothetical NT$10,000 BTC purchase comparison:

| Platform | Assumed fee rate | Assumed cost | Difference from lowest |
|---|---:|---:|---:|
| BitoPro | 1.0%–1.2% | NT$100–NT$120 | +NT$80–NT$110 |
| Binance | 0.1%–0.2% | NT$10–NT$20 | Baseline |
| OKX | 0.1%–0.2% | NT$10–NT$20 | +NT$0–NT$10 |

The page clearly identifies these as teaching assumptions and directs users to official platform announcements for current fees.

## Additional education

Added:

- Fee difference versus a hypothetical 10% BTC price movement
- Twelve-month fee impact for a NT$3,000 monthly DCA plan
- Stage-based guidance for BitoPro versus Binance/OKX
- Balanced reminder that fees matter but are not the only selection standard

## Verification

- Dynamic DCA inputs update all scenario values immediately.
- All three scenarios render at 1, 3, 5, and 10 years.
- Fee comparison displays the requested numeric examples.
- Fee disclaimer is visible.
- Traditional Chinese works.
- English scenario mode renders without layout breakage.
- Desktop and 375 × 812 mobile layouts have no horizontal overflow.
- Production build passes.
- Browser console reports no errors.

