# Baby Hippo Product Funnel Clarity Fix

## Objective

Improve beginner understanding and action clarity without adding products or changing backend, Lobster Watch, Aave monitoring, or reward rules.

## Changes completed

### 1. Platform cards

The investment-plan platform cards now explain purpose and next action:

- Binance — 推薦新手定投
- OKX — 備用交易所選擇
- Ether.fi — 被動收入與支付
- Aave — 進階 DeFi

Each card contains a short description and a direct CTA. Status wording such as「已選擇交易所」、「已完成」and「已解鎖」does not appear inside the cards.

The existing platform-selection progress action remains available in a separate progress-record area. Opening a platform link does not change reward progress.

### 2. Lobster Watch positioning

The main product journey is now:

1. 台幣入金
2. 長期定投
3. 被動收入
4. 加密支付
5. 進階 DeFi

Lobster Watch is shown separately as「你的資產成長儀表板」instead of a product stage.

It explains that Lobster Watch tracks:

- 定投進度
- 學習進度
- 被動收入成就
- DeFi 成就
- 未來資產成長紀錄

### 3. Realistic fee education

Added two Traditional Chinese educational scenarios:

- A first NT$10,000 BitoPro deposit with an assumed NT$120 cost
- Three days spent researching fees without buying, followed by an illustrative 15% BTC increase

The examples clearly state that the costs and market movement are assumptions, not current fees or price predictions.

### 4. Educational platform comparison

The comparison now covers only:

- BitoPro
- Binance
- OKX

It compares:

- 台幣入金便利性
- 新手友善度
- 交易成本
- 長期定投適合度
- 未來鏈上發展

The section explicitly states:

> 沒有最好的平台。只有適合自己的平台。

### 5. Final educational message

The fee section ends with:

> 手續費很重要。
>
> 但是否開始建立投資習慣，往往比幾十元的成本差距更重要。

## Guardrails preserved

- No new products
- No backend changes
- No Lobster Watch logic changes
- No Aave monitoring changes
- No reward-logic changes
- No wallet or transaction changes

## Verification

- Production build passed.
- Homepage, `/on-ramp`, and `/dca-planner` loaded successfully.
- Desktop and 375 × 812 mobile layouts showed no horizontal overflow.
- The comparison table becomes stacked cards on mobile.
- All four platform cards expose clear actions.
- Binance, OKX, and Ether.fi retain their existing links and open in a new tab.
- Aave links to its learning content.
- Browser console reported no errors.

