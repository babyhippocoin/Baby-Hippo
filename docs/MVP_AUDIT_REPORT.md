# Baby Hippo MVP 稽核報告

稽核日期：2026 年 6 月 22 日  
稽核範圍：Baby Hippo 公開網站、Points 與 Lobster Watch Dashboard  
結論：沒有發現會阻止網站啟動或使用的重大錯誤，因此未修改任何現有程式碼。

## Launch Readiness Score

**92 / 100 — 適合進入公開測試階段**

目前 MVP 的主要頁面、互動工具、手機版、雙語切換及本機資料保存皆可正常使用。正式公開前，建議處理 Points 導覽入口、Dashboard 日期，以及建置指令標準化三項小問題。

## 稽核摘要

| 項目 | 結果 | 說明 |
|---|---|---|
| 8 個指定路由 | 通過 | 全部可正常載入 |
| 公開網站導覽 | 通過 | 連結、手機選單及目前頁面標示正常 |
| 手機版面 | 通過 | 390 × 844 測試無水平溢出 |
| 繁中／英文切換 | 通過 | 7 個公開頁面可即時切換 |
| 語言保存 | 通過 | 重新整理及跨頁後仍保留選擇 |
| DCA Planner | 通過 | 計算、圖表、風險配置及保存正常 |
| Earn 篩選器 | 通過 | 7 種篩選狀態均正確 |
| Points | 通過 | 積分、等級、完成狀態及保存正常 |
| Dashboard | 通過 | 頁面與手機選單正常；市場資料成功載入 |
| 瀏覽器主控台 | 通過 | 全新分頁沒有 error 或 warning |
| 正式建置 | 通過 | Next.js production build 成功，9 個應用路由完成靜態產生 |

## 路由檢查

| 路由 | 載入 | 桌機溢出 | 手機溢出 | 主控台 |
|---|---|---|---|---|
| `/` | 通過 | 無 | 無 | 無錯誤 |
| `/story` | 通過 | 無 | 無 | 無錯誤 |
| `/learn` | 通過 | 無 | 無 | 無錯誤 |
| `/dca-planner` | 通過 | 無 | 無 | 無錯誤 |
| `/earn` | 通過 | 無 | 無 | 無錯誤 |
| `/community` | 通過 | 無 | 無 | 無錯誤 |
| `/points` | 通過 | 無 | 無 | 無錯誤 |
| `/dashboard` | 通過 | 無 | 無 | 無錯誤 |

## Passed Checks

### 導覽與連結

- 公開頁面使用相同的主要導覽：Home、Story、Learn、DCA Planner、Earn、Community。
- 桌機與手機導覽都能標示目前所在頁面。
- 手機選單可以開啟，並成功從 Community 前往 Learn。
- 所有公開頁面的站內路由均存在。
- 沒有空白 `href` 或失效的頁內錨點。
- Points 使用的 Learn 錨點全部存在：
  - Bitcoin
  - Ethereum
  - DCA
  - Aave
  - Ether.fi
  - Risk Management
  - Seed Phrase
- Points 使用的 Community `join` 與 `values` 錨點均存在。
- Dashboard 保持獨立導覽，沒有混入公開網站導覽。

### 語言切換

- `/`、`/story`、`/learn`、`/dca-planner`、`/earn`、`/community`、`/points` 均可在繁中與英文間即時切換。
- 預設狀態為繁體中文。
- 選擇英文後，重新整理及前往其他公開頁面仍維持英文。
- 切回繁體中文後，全站公開頁面恢復繁中。
- Dashboard 不在公開網站語言切換範圍內，維持原本設計。

### localStorage

- 語言選擇可保存並在重新整理後還原。
- DCA Planner 輸入資料可保存並在重新整理後還原。
- Points 完成項目、總積分與等級可保存並在重新整理後還原。
- 稽核完成後已將 DCA Planner 恢復預設輸入，Points 恢復為 0 BHP，語言恢復繁體中文。

### DCA Planner 計算

測試輸入：

- 月收入：$6,000
- 每月固定支出：$2,000
- 每月彈性支出：$1,000
- 緊急預備金目標：$12,000
- 風險：Balanced

正確結果：

- 支出後餘額：$3,000
- 每月緊急預備金：$1,000
- 每月可投入金額：$2,000
- BTC：40%，$800
- ETH：30%，$600
- SOL：10%，$200
- LINK：8%，$160
- Yield：12%，$240
- 每月兩次投入：各 $1,000
- 每週等值：約 $462

教育型投影結果：

| 期間 | 累計投入 | 教育型投影 |
|---|---:|---:|
| 1 年 | $24,000 | $24,558 |
| 3 年 | $72,000 | $77,507 |
| 5 年 | $120,000 | $136,012 |
| 10 年 | $240,000 | $310,565 |

投影符合頁面標示的 Balanced 5% 年化教育假設與每月複利公式。頁面同時清楚標示這不是財務建議或獲利承諾。

### Earn 篩選器

| 篩選器 | 顯示數量 | 結果 |
|---|---:|---|
| All | 4 | 正確 |
| Beginner friendly | 1 | 正確 |
| ETH ecosystem | 2 | 正確 |
| Solana ecosystem | 1 | 正確 |
| Lending | 3 | 正確 |
| Liquid staking | 1 | 正確 |
| Higher risk | 3 | 正確 |

卡片數量與比較表列數同步更新。

### Points

- 初始狀態：0 BHP、Level 1、0 / 18。
- 測試完成 Bitcoin lesson（10 BHP）及 First DCA plan（20 BHP）。
- 畫面立即更新為 30 BHP、2 個完成項目。
- 重新整理後仍保留 30 BHP 與兩個完成項目。
- 重設功能需要二次確認並可正確歸零。
- 稽核後已恢復 0 BHP。
- 非代幣、非投資、非金融產品聲明正常顯示。

### Dashboard

- Dashboard 桌機與手機版均可載入。
- 手機側邊選單可顯示 Dashboard、Alerts、Aave、DCA、Settings。
- CoinGecko BTC 與 ETH 價格可在載入後顯示。
- 未連接錢包時，Aave 顯示唯讀且未連接狀態。
- 沒有自動交易、存款或借款行為。

### 正式建置

Next.js production build 成功：

- TypeScript 與頁面資料檢查通過。
- 11 個靜態頁面完成產生。
- 所有 8 個指定路由均出現在正式建置結果中。

稽核環境沒有提供全域 `npm` 執行檔，因此使用專案相同的 `next build` production target 直接驗證。建置本身完整通過。

## Issues Found

### 1. Points 沒有出現在公開網站主要導覽

嚴重度：中低

`/points` 可以直接開啟，Points 內的相關頁面連結也正常，但目前公開 Header 與手機選單沒有 Points 入口。新訪客不容易發現這個核心使用者旅程。

這不是壞連結，也不會阻止 MVP 運作，因此本次沒有修改。

### 2. Dashboard 顯示固定的舊日期

嚴重度：低

2026 年 6 月 22 日稽核時，Dashboard 仍顯示：

- `Sunday · June 21`
- DCA 提醒日期 `JUN 21`

市場資料是即時的，但日期文字看起來是固定的展示資料，可能讓使用者誤以為資料過期。

### 3. 建置指令需要統一

嚴重度：低

- 專案使用 `pnpm-lock.yaml`。
- 稽核環境沒有全域 `npm`。
- 稽核環境的 pnpm 安全政策會在自動依賴檢查時阻擋被忽略的 `sharp` build script。
- 直接執行專案的 Next.js production build 可成功完成。

這是開發與 CI 環境的一致性問題，不是應用程式錯誤。

## Recommended Fixes

以下建議不屬於本次「只修重大錯誤」範圍，因此尚未執行：

1. 在公開 Header、手機選單或首頁加入清楚的 Points 入口。
2. 將 Dashboard 日期改為依使用者所在地動態產生，或清楚標示為 mock reminder。
3. 正式決定使用 npm 或 pnpm，並在 README 與 CI 使用同一套建置指令。
4. 若採用 pnpm，確認部署環境允許必要的 `sharp` 安裝腳本，或移除不需要的依賴。
5. 上線前在正式部署網域再做一次 CoinGecko、Telegram、X 與外部 protocol 文件連結測試。

## Launch Recommendation

Baby Hippo MVP 已具備公開測試所需的基本穩定度，可先提供給小規模社群與早期使用者試用。

正式對外宣傳前，優先完成：

1. Points 導覽入口
2. Dashboard 日期修正
3. 建置與部署指令標準化

目前沒有需要緊急修復的啟動阻斷問題。
