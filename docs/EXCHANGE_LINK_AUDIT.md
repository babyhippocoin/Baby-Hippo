# Baby Hippo Exchange Link Audit

Date: 2026-06-23

## Audit Result

Passed.

The Binance, OKX, and Ether.fi cards are now complete clickable links instead of visual cards containing only a small clickable button.

The same behavior is also applied to the Supported Platforms cards inside My Investment Plan.

## Verified Destinations

| Card | Configured URL | Verified destination |
| --- | --- | --- |
| Binance | `https://www.binance.com/activity/referral-entry/CPA?ref=CPA_00SFPUZH40` | Binance official referral page |
| OKX | `https://okx.com/join/81023154` | OKX invitation page using code `81023154` |
| Ether.fi | `https://www.ether.fi/@14a14fc7` | Ether.fi referral page using code `14a14fc7` |

Redirects observed during verification:

- Binance resolved to the official Binance referral claim experience.
- OKX resolved to `https://www.okx.com/zh-hant/join/81023154`.
- Ether.fi resolved to `https://www.ether.fi/app/cash/referral?ref_code=14a14fc7`.

## Card Behavior

Each partner card now:

- Uses a real `<a>` link as the outer card element.
- Makes the complete card surface clickable.
- Opens in a new browser tab with `target="_blank"`.
- Uses `noopener noreferrer sponsored`.
- Displays an external-link icon.
- Displays a Partner Link / 合作連結 label.
- Has visible hover and keyboard-focus states.
- Remains readable and clickable on mobile.

## Locations Audited

### Homepage Product Funnel

Verified full-card links:

- Binance
- OKX
- Ether.fi

### My Investment Plan

Verified clickable Supported Platforms cards:

- Binance
- OKX
- Ether.fi

Aave remains an educational, non-partner placeholder and does not redirect.

## BHP Journey Integration

Clicking any of the three partner cards awards:

- Achievement: **Exchange Selected**
- Points: **+10 BHP**

Behavior:

- The achievement is saved in the existing local Points storage.
- It appears as completed on the Points page.
- It contributes to total BHP and funnel progress.
- Clicking another partner card does not award another 10 points.
- The achievement is idempotent: it can exist only once in the completed-task list.

## Mobile Verification

Tested at a 390 × 844 viewport.

Results:

- Binance full card width: clickable
- OKX full card width: clickable
- Ether.fi full card width: clickable
- Partner labels visible
- External-link icons visible
- No horizontal page overflow
- Cards stack vertically
- Touch targets remain substantially larger than the minimum button height

## Desktop Verification

Results:

- Binance and OKX cards display in a two-column layout.
- Ether.fi displays as a full clickable product card.
- Complete card surfaces are clickable.
- Hover and keyboard-focus styles are present.
- No horizontal page overflow.

## Runtime Verification

- Binance opened a new tab successfully.
- OKX opened a new tab successfully.
- Ether.fi opened a new tab successfully.
- Exchange Selected appeared once with `+10 BHP`.
- Browser console errors: none detected.
- Production build: passed.
- Static generation: 11 of 11 pages.

## Safety Notes

These links do not:

- Connect a wallet
- Execute a trade
- Deposit or withdraw funds
- Transfer custody to Baby Hippo
- Create a backend account

Users leave Baby Hippo and interact directly with the selected external platform.
