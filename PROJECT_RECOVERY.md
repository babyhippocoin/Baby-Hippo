# Baby Hippo 專案復原指南

本文件說明電腦重開機、網站停止或臨時公開網址失效時，如何恢復 Baby Hippo。

## 專案位置

工作區根目錄：

```text
C:\Users\田志穎\Documents\Codex\2026-06-21\create-a-new-project-called-baby
```

Baby Hippo 專案根目錄：

```text
outputs\Baby-Hippo
```

Next.js 網站：

```text
outputs\Baby-Hippo\apps\web
```

## 如何重新啟動網站

開啟 PowerShell，進入網站資料夾：

```powershell
cd "C:\Users\田志穎\Documents\Codex\2026-06-21\create-a-new-project-called-baby\outputs\Baby-Hippo\apps\web"
npm run dev
```

本專案使用 pnpm；若 npm 指令不可用，可改用：

```powershell
pnpm dev
```

看到 `Ready` 後開啟：

```text
http://localhost:3000
```

不要關閉執行開發伺服器的終端機。

## 如何確認網站健康

瀏覽器檢查：

```text
http://localhost:3000
```

HTTP 狀態檢查：

```powershell
(Invoke-WebRequest http://localhost:3000 -UseBasicParsing).StatusCode
```

預期結果：

```text
200
```

正式建置檢查：

```powershell
pnpm build
```

建置通過代表目前程式碼可以產生正式版本。

## 如何重新啟動 Cloudflare Tunnel

先確認本機網站已在 `localhost:3000` 運行，再從專案根目錄執行：

```powershell
cd "C:\Users\田志穎\Documents\Codex\2026-06-21\create-a-new-project-called-baby"
.\work\cloudflared.exe tunnel --url http://localhost:3000 --no-autoupdate
```

Cloudflare 會顯示新的臨時 HTTPS 網址，例如：

```text
https://xxxxx.trycloudflare.com
```

請保持 Tunnel 終端機開啟。關閉終端機、電腦休眠或重新開機，都可能讓網址失效。

## 電腦重新開機後的完整復原順序

1. 開啟專案資料夾。
2. 在網站資料夾執行 `npm run dev` 或 `pnpm dev`。
3. 確認 `http://localhost:3000` 回傳 HTTP 200。
4. 在另一個終端機啟動 Cloudflare Tunnel。
5. 複製本次新產生的 `trycloudflare.com` 網址。
6. 用外部網路測試公開網址。
7. 測試成功後再分享新網址。

## 常見故障

### localhost 無法開啟

- 確認開發伺服器終端機仍然開著。
- 確認目前位於 `outputs\Baby-Hippo\apps\web`。
- 重新執行 `npm run dev` 或 `pnpm dev`。
- 如果 3000 埠被占用，先確認是否已經有另一個網站服務在運行。

### 公開網址無法開啟，但 localhost 正常

這通常表示 Tunnel 已停止，不代表網站程式壞掉。

- 重新執行 Cloudflare Tunnel 指令。
- 使用新產生的網址，不要繼續使用舊網址。
- 確認防火牆或網路沒有阻擋 Cloudflare。

### Build 失敗

```powershell
pnpm install
pnpm build
```

如果仍失敗，保存完整錯誤訊息，再檢查最近修改。

## Git 安全與復原

查看目前狀態：

```powershell
git status
git log --oneline
```

保存完成的修改：

```powershell
git add .
git commit -m "描述本次修改"
```

查看最近版本：

```powershell
git log --oneline -10
```

建立遠端 GitHub 或其他 Git 託管後，應定期執行：

```powershell
git push
```

只有本機 commit 無法防止硬碟損壞；重要版本應同步到私人遠端儲存庫。

## 未來正式網域部署

`trycloudflare.com` 是臨時測試網址，沒有持續上線保證。準備公開發布時，建議：

1. 購買或準備正式網域。
2. 將程式碼推送到私人 GitHub 儲存庫。
3. 使用 Vercel、Cloudflare Pages 或其他 Next.js 相容平台部署。
4. 在部署平台設定正式網域與 HTTPS。
5. 將需要的環境變數存放在部署平台，不要提交到 Git。
6. 完成桌面、手機、繁中與英文模式驗收。

正式部署後，網站不需要依賴家中電腦持續開機，也不會因為 Quick Tunnel 停止而離線。

## 重要指令速查

```powershell
# 啟動網站
npm run dev

# pnpm 啟動方式
pnpm dev

# 正式建置檢查
pnpm build

# 檢查 localhost
(Invoke-WebRequest http://localhost:3000 -UseBasicParsing).StatusCode

# 啟動臨時公開網址
.\work\cloudflared.exe tunnel --url http://localhost:3000 --no-autoupdate

# Git 狀態與歷史
git status
git log --oneline
```
