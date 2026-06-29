# Baby Hippo 正式網域部署指南

目標網域：

- 公開首頁：`https://babieshippo.com`
- Founder Dashboard：`https://app.babieshippo.com`
- `https://www.babieshippo.com` 永久轉址至 `https://babieshippo.com`
- 本機開發：`http://localhost:3000`

## 部署架構

Baby Hippo 目前使用 Next.js 本機開發伺服器，透過 Cloudflare Named Tunnel 對外提供 HTTPS。

```text
babieshippo.com ───────────┐
app.babieshippo.com ───────┼─ Cloudflare Named Tunnel ─ localhost:3000
www.babieshippo.com ───────┘  308 redirect to babieshippo.com
```

這個階段不需要開放路由器連接埠，也不需要公開家中 IP。Cloudflare 會自動處理 HTTPS 憑證。

注意：只要電腦關機、本機網站停止或 Tunnel 停止，正式網域就會暫時離線。長期正式上線建議改用 Vercel 或 Cloudflare Pages。

## 專案與工具位置

Baby Hippo 專案：

```text
C:\Users\田志穎\Documents\Codex\2026-06-21\create-a-new-project-called-baby\outputs\Baby-Hippo
```

網站：

```text
C:\Users\田志穎\Documents\Codex\2026-06-21\create-a-new-project-called-baby\outputs\Baby-Hippo\apps\web
```

Cloudflared：

```text
C:\Users\田志穎\Documents\Codex\2026-06-21\create-a-new-project-called-baby\work\cloudflared.exe
```

## 第一次設定：登入 Cloudflare

在專案工作區執行：

```powershell
$env:USERPROFILE="C:\Users\田志穎\Documents\Codex\2026-06-21\create-a-new-project-called-baby\work\cloudflared-home"
$env:HOME=$env:USERPROFILE
& "C:\Users\田志穎\Documents\Codex\2026-06-21\create-a-new-project-called-baby\work\cloudflared.exe" tunnel login
```

瀏覽器開啟後：

1. 登入 Cloudflare。
2. 選擇 `babieshippo.com`。
3. 授權 Cloudflare Tunnel。
4. 確認 `cert.pem` 已建立於：

```text
work\cloudflared-home\.cloudflared\cert.pem
```

## 建立正式 Named Tunnel

以下範例使用 Tunnel 名稱 `baby-hippo-production`：

```powershell
$env:USERPROFILE="C:\Users\田志穎\Documents\Codex\2026-06-21\create-a-new-project-called-baby\work\cloudflared-home"
$env:HOME=$env:USERPROFILE
& "C:\Users\田志穎\Documents\Codex\2026-06-21\create-a-new-project-called-baby\work\cloudflared.exe" tunnel create baby-hippo-production
```

指令完成後會顯示 Tunnel UUID，並產生：

```text
work\cloudflared-home\.cloudflared\<TUNNEL-UUID>.json
```

## 建立 Tunnel 設定

在 `work\cloudflared-home\.cloudflared\config.yml` 使用：

```yaml
tunnel: <TUNNEL-UUID>
credentials-file: C:\Users\田志穎\Documents\Codex\2026-06-21\create-a-new-project-called-baby\work\cloudflared-home\.cloudflared\<TUNNEL-UUID>.json

ingress:
  - hostname: babieshippo.com
    service: http://localhost:3000
  - hostname: app.babieshippo.com
    service: http://localhost:3000
  - hostname: www.babieshippo.com
    service: http://localhost:3000
  - service: http_status:404
```

## 建立 Cloudflare DNS

執行：

```powershell
$env:USERPROFILE="C:\Users\田志穎\Documents\Codex\2026-06-21\create-a-new-project-called-baby\work\cloudflared-home"
$env:HOME=$env:USERPROFILE
$cloudflared="C:\Users\田志穎\Documents\Codex\2026-06-21\create-a-new-project-called-baby\work\cloudflared.exe"

& $cloudflared tunnel route dns baby-hippo-production babieshippo.com
& $cloudflared tunnel route dns baby-hippo-production app.babieshippo.com
& $cloudflared tunnel route dns baby-hippo-production www.babieshippo.com
```

Cloudflare DNS 應出現三筆 Proxied CNAME：

| 名稱 | 目標 |
|---|---|
| `@` | `<TUNNEL-UUID>.cfargotunnel.com` |
| `app` | `<TUNNEL-UUID>.cfargotunnel.com` |
| `www` | `<TUNNEL-UUID>.cfargotunnel.com` |

如果網域原本已有衝突的 `A`、`AAAA` 或 `CNAME` 紀錄，請先確認用途再移除，不要同時保留衝突紀錄。

## 設定 www 永久轉址

網站程式已包含：

```text
www.babieshippo.com → https://babieshippo.com
```

建議也在 Cloudflare Dashboard 建立 Redirect Rule：

1. 進入 `babieshippo.com`。
2. 選擇 Rules → Redirect Rules。
3. 建立 Single Redirect。
4. 條件：Hostname equals `www.babieshippo.com`。
5. 目標：`https://babieshippo.com${uri.path}`。
6. 狀態碼：`301`。
7. Preserve query string：開啟。

## 啟動網站

第一個 PowerShell 視窗：

```powershell
cd "C:\Users\田志穎\Documents\Codex\2026-06-21\create-a-new-project-called-baby\outputs\Baby-Hippo\apps\web"
pnpm dev
```

確認：

```powershell
(Invoke-WebRequest http://localhost:3000 -UseBasicParsing).StatusCode
```

預期結果為 `200`。

## 啟動正式 Tunnel

第二個 PowerShell 視窗：

```powershell
$env:USERPROFILE="C:\Users\田志穎\Documents\Codex\2026-06-21\create-a-new-project-called-baby\work\cloudflared-home"
$env:HOME=$env:USERPROFILE
& "C:\Users\田志穎\Documents\Codex\2026-06-21\create-a-new-project-called-baby\work\cloudflared.exe" tunnel --config "$env:USERPROFILE\.cloudflared\config.yml" run baby-hippo-production
```

保持兩個 PowerShell 視窗開啟。

## 網域路由行為

網站已加入主機名稱路由：

- `babieshippo.com/` 顯示公開 Baby Hippo 首頁。
- `app.babieshippo.com/` 內部顯示 `/founder`，網址維持 `app.babieshippo.com`。
- `www.babieshippo.com/*` 永久轉址到 `babieshippo.com/*`。
- `localhost:3000` 保持原有行為。
- `localhost:3000/founder` 仍可直接預覽 Founder Dashboard。

## HTTPS

三筆 DNS 紀錄必須保持 Cloudflare Proxy 開啟（橘色雲朵）。

Cloudflare Dashboard 建議設定：

1. SSL/TLS → Overview。
2. Encryption mode 使用 `Full`。
3. Edge Certificates → Always Use HTTPS：開啟。
4. Automatic HTTPS Rewrites：開啟。

Cloudflare Tunnel 與訪客之間會自動使用有效 HTTPS 憑證。

## 驗證清單

在電腦上確認：

```text
http://localhost:3000
http://localhost:3000/founder
```

使用手機行動網路確認：

```text
https://babieshippo.com
https://app.babieshippo.com
https://www.babieshippo.com
```

應符合：

- 首頁正常顯示。
- Founder Dashboard 正常顯示。
- `www` 自動跳轉到無 `www` 網址。
- 瀏覽器顯示有效 HTTPS。
- 沒有 404、502 或 Tunnel Error。

## 每次電腦重新開機後

1. 啟動 `pnpm dev`。
2. 驗證 `localhost:3000`。
3. 啟動 `baby-hippo-production` Tunnel。
4. 驗證兩個正式網域。

Named Tunnel 的正式網域不會像 `trycloudflare.com` 一樣每次改變。

## 未來不依賴家中電腦的部署

正式公開測試穩定後，建議將專案部署到 Vercel 或 Cloudflare Pages：

1. 將 Baby Hippo Git repository 推送到私人 GitHub。
2. 在 Vercel 或 Cloudflare Pages 匯入 repository。
3. Build command 使用 `pnpm build`。
4. 將 `babieshippo.com` 綁定公開網站。
5. 將 `app.babieshippo.com` 綁定同一個 Next.js 專案。
6. 保留目前 hostname routing。
7. DNS 改指向部署平台。

完成後，即使創辦人的電腦關機，網站仍然可以持續運作。
