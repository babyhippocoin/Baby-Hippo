# Taiwan Fiat On-Ramp Center V1 Report

## 完成結果

Baby Hippo 已新增公開頁面 `/on-ramp`，作為台灣新手進入加密資產學習旅程的第一站。

頁面先解釋如何從台幣開始，再逐步連接：

1. 台灣合規入金交易所
2. BTC、ETH 或 USDT
3. Binance／OKX 定期定額
4. Ether.fi 被動收入學習
5. Lobster Watch 鏈上成長追蹤

整個功能維持教育模式：

- 沒有錢包連接
- 沒有交易執行
- 沒有後端
- 沒有入金或提領功能
- 沒有修改 Aave Monitor

## 新頁面內容

`/on-ramp` 包含：

- 台灣新手入金旅程圖
- BitoPro 新手定位與優缺點
- BitoPro 七步驟入門指南
- BitoPro、Binance、OKX、Ether.fi、Aave 比較表
- 中立的手續費教育
- 第一次操作小額測試警告
- Binance、OKX、Ether.fi 合作連結
- DCA Planner 下一步 CTA
- 閱讀指南 `+10 BHP` 教育任務

## BitoPro

頁面清楚顯示：

- 定位：台灣新手第一站
- 推薦碼：`5931862212`
- 可複製推薦碼
- 不強迫使用推薦碼
- 使用者也可以自行前往官方網站註冊

推薦揭露：

> 此連結或推薦碼可能讓 Baby Hippo 獲得推薦獎勵，用於支持網站持續開發。這不代表投資建議。

## 平台比較

比較表使用相同欄位說明：

- 適合誰
- 優點
- 可能缺點
- Baby Hippo 建議用途

內容保持中立，不把任何平台描述為絕對最好，也不只用最低手續費做判斷。

## DCA 串接

DCA Planner 的執行區前已新增提示：

> 如果你人在台灣，還不知道如何入金，請先閱讀「台幣入金指南」。

連結前往 `/on-ramp`。

`/on-ramp` 頁面尾端提供：

> 下一步：建立我的 DCA 計畫

連結前往 `/dca-planner`。

## 公開導覽

所有使用共用 PublicHeader 的公開頁面都已加入：

- 繁中：台幣入金
- English：TWD On-Ramp

桌機與手機選單皆支援目前頁面標示。

## Points 整合

新增教育成就：

| 任務 | 積分 |
|---|---:|
| 閱讀台幣入金指南 | +10 BHP |

規則：

- 使用者主動按下完成閱讀後才記錄
- 防止重複加分
- 入金、買幣或轉帳不會取得積分
- 不要求上傳證明
- 不宣稱驗證任何金融行動

Points MVP 可取得總積分由 305 更新為 315。

## 合作連結驗證

| 平台 | 設定連結 | 實際開啟結果 |
|---|---|---|
| Binance | `https://www.binance.com/activity/referral-entry/CPA?ref=CPA_00SFPUZH40` | Binance 推薦活動頁 |
| OKX | `https://okx.com/join/81023154` | OKX 邀請碼頁面 |
| Ether.fi | `https://www.ether.fi/@14a14fc7` | Ether.fi referral 頁面 |

三個連結皆：

- 可點擊
- 使用新分頁
- 包含 `noopener noreferrer sponsored`
- 顯示合作連結標示
- 顯示推薦揭露

## 雙語

- 預設：繁體中文
- 支援 English
- 切換後立即更新
- 重新整理後保留選擇
- 兩種語言的主要內容、按鈕、比較表、警告與揭露皆正常

## 驗證結果

- `/on-ramp` 載入：通過
- 公開導覽連結：通過
- DCA Planner → `/on-ramp`：通過
- `/on-ramp` → DCA Planner：通過
- BitoPro 推薦碼：正確顯示 `5931862212`
- Binance 連結：通過
- OKX 連結：通過
- Ether.fi 連結：通過
- `+10 BHP` 閱讀任務：通過
- Points 同步：通過
- Traditional Chinese：通過
- English：通過
- 375px 手機版：通過
- 手機水平溢出：無
- 桌機水平溢出：無
- Browser console errors：0
- Next.js production build：通過

