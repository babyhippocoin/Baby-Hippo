# Baby Hippo 啟動檢查清單

每次電腦重新開機後，依照以下順序恢復網站。

## 1. 開啟專案資料夾

從 Baby Hippo 專案根目錄開始，網站專案位置：

```text
outputs/Baby-Hippo/apps/web
```

在終端機切換到此資料夾。

## 2. 啟動本機網站

```powershell
npm run dev
```

如果電腦使用本專案指定的 pnpm，也可以執行：

```powershell
pnpm dev
```

保持這個終端機開啟。看到 `Ready` 代表網站已啟動。

## 3. 確認 localhost:3000

用瀏覽器開啟：

```text
http://localhost:3000
```

確認 Baby Hippo 首頁正常顯示，而且沒有錯誤畫面。

也可以在 PowerShell 檢查：

```powershell
(Invoke-WebRequest http://localhost:3000 -UseBasicParsing).StatusCode
```

結果應為 `200`。

## 4. 啟動 Cloudflare Tunnel

回到專案根目錄，執行：

```powershell
.\work\cloudflared.exe tunnel --url http://localhost:3000 --no-autoupdate
```

保持這個終端機開啟。Cloudflare 會顯示新的：

```text
https://xxxxx.trycloudflare.com
```

每次重新啟動 Quick Tunnel，網址通常都會改變。

## 5. 驗證公開網址

用手機行動網路或家中網路以外的裝置開啟新網址，確認：

- 首頁可以顯示
- HTTPS 正常
- 導航可以使用
- 手機版沒有異常

## 6. 分享公開網址

只分享這次啟動後新產生、並且已經測試成功的網址。

舊的 `trycloudflare.com` 網址在 Tunnel 停止後通常會失效。
