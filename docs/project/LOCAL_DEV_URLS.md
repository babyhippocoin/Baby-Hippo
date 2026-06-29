# Local Development URLs

This document keeps Baby Hippo local development URLs stable and easy to restart.

## Founder dashboard on this computer

Open:

http://localhost:3003/founder

## Same Wi-Fi device URL

From another device on the same Wi-Fi network, use this format:

http://<computer-ip>:3003/founder

Example:

http://192.168.1.105:3003/founder

The exact computer IP may change depending on your Wi-Fi network.

## Important note about public URLs

The public website requires deployment or a tunnel.

If only the local development server is running, public domains such as `babieshippo.com` or `app.babieshippo.com` will not work automatically.

## If you see ERR_CONNECTION_REFUSED

This usually means the local development server is not running.

Restart the dev server from:

C:\Users\田志穎\Documents\Codex\2026-06-21\create-a-new-project-called-baby\outputs\Baby-Hippo\apps\web

Recommended command using system Node:

```powershell
& 'C:\Program Files\nodejs\node.exe' 'node_modules/next/dist/bin/next' dev -H 0.0.0.0 -p 3003
```

Alternative npm script:

```powershell
npm run dev:local
```

Founder shortcut:

```powershell
npm run dev:founder
```

Both scripts run the same stable local server on port `3003`.
