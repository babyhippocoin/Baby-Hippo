# Lobster Watch MVP UI Specification

> **Design goal:** Help ordinary people understand what needs attention without staring at charts all day.

## Product Interface Principles

The Lobster Watch MVP should feel calm, clear, and small.

It is not a trading terminal. It does not need complex charts, live order books, portfolio analytics, social feeds, or AI chat.

Every page should answer:

1. What is happening?
2. Does anything need my attention?
3. When was this information checked?
4. What simple action can I take inside Lobster Watch?

The only in-product actions are creating, editing, pausing, resetting, snoozing, or deleting alerts and reminders. Lobster Watch does not trade or move funds.

## Solo-Founder UI Rules

- Use one responsive web application.
- Use one navigation system.
- Use one card component with small variations.
- Use one form pattern.
- Use one status-badge pattern.
- Use one confirmation dialog.
- Keep charts out of v0.1.
- Show no more than one primary action per page.
- Hide advanced explanations behind short expandable help text.
- Reuse empty, loading, error, and delayed-data states.
- Prefer full-page forms over complicated modal workflows on mobile.

## Core Navigation

### Desktop

Use a narrow left sidebar:

1. Dashboard
2. Alerts
3. Aave
4. DCA
5. Settings

Place the Lobster Watch logo at the top and a small system-status indicator at the bottom.

### Mobile

Use a fixed bottom navigation:

1. Home
2. Alerts
3. Aave
4. DCA
5. Settings

Keep labels visible. Do not use icons without text.

## Shared Page Shell

### Desktop shell

```text
+------------------+-----------------------------------------------+
| Lobster Watch    | Page title                         [Action]   |
|                  | Short plain-language description             |
| Dashboard        +-----------------------------------------------+
| Alerts           |                                               |
| Aave             | Page content                                  |
| DCA              |                                               |
| Settings         |                                               |
|                  |                                               |
| Data: Current    |                                               |
+------------------+-----------------------------------------------+
```

### Mobile shell

```text
+----------------------------------+
| Lobster Watch       [Status dot] |
| Page title                       |
| Short description                |
+----------------------------------+
|                                  |
| Page content                     |
|                                  |
+----------------------------------+
| Home | Alerts | Aave | DCA | Set |
+----------------------------------+
```

## Shared Visual System

Use the Baby Hippo identity:

- Background: Field Cream or Piano Ivory
- Primary text: Deep Road Navy
- Primary action: Workwear Amber
- Information: blue
- Healthy or recovered: green with text and icon
- Warning: amber with text and icon
- Urgent: red with text and icon
- Critical: dark red with text and icon

Cards:

- 16 px corner radius
- Thin neutral border
- Little or no shadow
- 16–24 px internal spacing

Typography:

- Large, plain page titles
- Comfortable body copy
- Tabular numerals for prices and Health Factor
- No giant promotional percentage figures

## Shared Components

Build these once and reuse them:

1. Application shell
2. Status badge
3. Data freshness row
4. Alert or reminder card
5. Empty-state card
6. Data-delayed banner
7. Form field
8. Segmented choice: Above / Below
9. Toggle
10. Primary and secondary buttons
11. Confirmation dialog
12. Toast message
13. Expandable “What does this mean?” explanation
14. Notification preview

---

# 1. Dashboard

## Purpose

Give the user a ten-second overview of everything Lobster Watch is monitoring.

The dashboard should answer:

- Are BTC and ETH alerts active?
- Does the Aave position need attention?
- When is the next DCA reminder?
- Are any data sources delayed?

## User Flow

### First visit

1. User opens Dashboard.
2. User sees four empty setup cards.
3. User chooses one feature to configure.
4. User completes a short form.
5. User returns to Dashboard and sees the active rule.

### Returning visit

1. User opens Dashboard.
2. User scans status cards.
3. User selects a card that needs attention or editing.
4. User opens the related page or inline price-alert form.

## Layout

### Page header

- Title: **Good morning. Lobster Watch is checking four things for you.**
- Supporting text: **Review alerts only when it is safe and convenient.**
- Optional data-delay banner
- Primary action: **Add Price Alert**

Do not depend on the time-based greeting if localization adds complexity. “Your Watch Dashboard” is an acceptable launch title.

### Main content order

1. Needs Attention
2. Price Alerts
3. Aave Health Factor
4. Next DCA Reminder
5. Recent notifications

If nothing needs attention, show:

> Nothing needs immediate attention based on your current rules.

This must not say that the user's assets are safe.

## Components

### Needs Attention Card

Only appears when:

- A price alert triggered
- Aave crossed a warning band
- A DCA reminder is due
- Monitoring data is delayed

Shows:

- Severity icon and word
- One-sentence summary
- Timestamp
- Relevant page link

### BTC Price Card

Shows:

- BTC reference price
- Up to three user rules
- Active, triggered, paused, or delayed state
- Last checked time
- Add, edit, pause, reset, or delete

### ETH Price Card

Uses the same structure as BTC.

### Aave Summary Card

Shows:

- Current Health Factor
- Risk label
- Shortened address
- Network and market
- Last checked time
- **View Aave Details**

If not configured:

> Monitor one Aave borrowing position using a public wallet address.

### DCA Summary Card

Shows:

- Asset
- Next reminder
- Frequency
- Optional planning amount
- Last response
- **View DCA Plan**

### Recent Notifications

Show the latest three items only, with **View All Alerts**.

## Desktop Version

Use a two-column grid:

- Left, wider column: Needs Attention, Price Alerts
- Right, narrower column: Aave, DCA, Recent Notifications

### Desktop wireframe

```text
+---------------+----------------------------------------------------+
| Lobster Watch | Dashboard                         [+ Price Alert]  |
|               | Review when safe and convenient.                   |
| > Dashboard   |----------------------------------------------------|
|   Alerts      | [!] NEEDS ATTENTION                                |
|   Aave        | Aave Health Factor crossed 1.50        [Review]   |
|   DCA         |----------------------------------------------------|
|   Settings    | [ BTC PRICE ]                 | [ AAVE ]           |
|               | $70,125  Checked 2m ago       | HF 1.43 Warning    |
|               | > $70,000  Triggered          | 0x12...89AB        |
|               | < $65,000  Active             | [View details]     |
|               | [Add] [Manage]                |                    |
|               |-------------------------------+--------------------|
|               | [ ETH PRICE ]                 | [ NEXT DCA ]       |
|               | $2,986  Checked 2m ago        | BTC · Monthly      |
|               | < $3,000 Triggered            | Jul 1 · 19:00      |
|               | [Add] [Manage]                | [View plan]        |
|               |-------------------------------+--------------------|
| Data current  | [ RECENT ALERTS ]                                  |
|               | 3 latest notifications                 [View all] |
+---------------+----------------------------------------------------+
```

## Mobile Version

Use one column. Order information by urgency:

1. Needs Attention
2. Aave
3. BTC
4. ETH
5. DCA
6. Recent notifications

Use a small **+** action in the page header or a full-width **Add Price Alert** button after the price cards. Avoid floating buttons if they complicate accessibility.

### Mobile wireframe

```text
+----------------------------------+
| Lobster Watch          Data OK   |
| Dashboard                        |
| Review when safely parked.       |
+----------------------------------+
| [!] Needs attention              |
| Aave HF is 1.43                  |
| Warning level crossed  14:32     |
| [ Review Aave ]                  |
+----------------------------------+
| Aave Health Factor               |
| 1.43 · Warning                   |
| Checked 2 minutes ago            |
| [ View details ]                 |
+----------------------------------+
| BTC                              |
| $70,125                          |
| 2 active · 1 triggered           |
| [ Manage alerts ]                |
+----------------------------------+
| ETH                              |
| $2,986                           |
| 1 active · 1 triggered           |
| [ Manage alerts ]                |
+----------------------------------+
| Next DCA reminder                |
| BTC · Jul 1 · 19:00              |
| [ View plan ]                    |
+----------------------------------+
| [ + Add Price Alert ]            |
+----------------------------------+
| Home | Alerts | Aave | DCA | Set |
+----------------------------------+
```

## Dashboard States

### Empty

> Lobster Watch is ready. Choose one thing you want it to watch.

Show four simple setup options. Do not force setup of all four.

### Loading

Use card-shaped skeletons. Keep the last known timestamp visible if cached data exists.

### Data delayed

Show a page banner:

> Some monitoring data is delayed. Lobster Watch will not trigger new alerts from stale information.

### Error

Explain which service failed. Do not replace the whole page with a generic error if other cards still work.

---

# 2. Alert Center

## Purpose

Provide one clear history of price alerts, Aave warnings, DCA reminders, recovery messages, and monitoring delays.

The Alert Center is for reading and acknowledging events. Alert-rule editing stays on Dashboard, Aave, or DCA pages.

## User Flow

1. User opens Alerts.
2. Newest notifications appear first.
3. User filters by All, Price, Aave, or DCA.
4. User opens an item.
5. User reads what happened, source value, timestamp, meaning, and limitation.
6. User marks it read or follows the link to the related page.

## Layout

### Header

- Title: **Alert Center**
- Supporting text: **A record of what Lobster Watch noticed and reminded you about.**
- Action: **Mark All Read**

### Filter row

- All
- Price
- Aave
- DCA
- System

Use a horizontally scrollable pill row on mobile.

### Notification list

Group by:

- Today
- Yesterday
- Earlier

Each row shows:

- Unread dot
- Severity icon and text
- Title
- One-line summary
- Timestamp
- Related asset or feature

### Alert detail

Open as:

- Right-side panel on desktop
- Full page on mobile

Shows:

1. What happened
2. Rule or threshold
3. Reference value
4. Data timestamp
5. What it means
6. Calm next step
7. Source and limitation
8. Related page button

## Components

- Filter pills
- Notification row
- Severity badge
- Unread marker
- Detail panel
- Mark read button
- Empty state
- Data-source row

Avoid:

- Delete-everything workflows in v0.1
- Complex search
- Custom date range
- Bulk selection
- Notification analytics

## Desktop Version

Use a master-detail layout:

- Left 40%: notification list
- Right 60%: selected notification

### Desktop wireframe

```text
+---------------+----------------------------------------------------+
| Lobster Watch | Alert Center                    [Mark all read]    |
|               | [All] [Price] [Aave] [DCA] [System]               |
|   Dashboard   |----------------------------------------------------|
| > Alerts      | TODAY                    | Aave HF warning         |
|   Aave        | * Aave HF 1.43   14:32   |                        |
|   DCA         |   BTC > 70k      12:10   | What happened          |
|   Settings    |   DCA reminder   09:00   | HF moved 1.58 → 1.43   |
|               |--------------------------|                        |
|               | YESTERDAY                | Your threshold: 1.50   |
|               |   ETH < 3k       18:20   | Checked: 14:32         |
|               |   Data recovered 17:05   |                        |
|               |                          | What this means        |
|               |                          | Lower HF may mean...   |
|               |                          |                        |
| Data current  |                          | [View Aave page]       |
+---------------+----------------------------------------------------+
```

## Mobile Version

Display the list as one page. Selecting a row opens a dedicated detail screen with a back button.

### Mobile wireframe

```text
+----------------------------------+
| Alerts             [Mark read]   |
| What Lobster Watch noticed       |
| [All] [Price] [Aave] [DCA]  ->  |
+----------------------------------+
| TODAY                            |
| * WARNING · AAVE        14:32    |
| Health Factor is 1.43            |
| Crossed your 1.50 level          |
+----------------------------------+
|   NOTICE · BTC          12:10    |
| BTC moved above $70,000          |
+----------------------------------+
|   INFO · DCA            09:00    |
| Your BTC review is due           |
+----------------------------------+
| Home | Alerts | Aave | DCA | Set |
+----------------------------------+
```

## Alert Center States

### Empty

> No notifications yet. Lobster Watch will keep checking your active rules.

### All read

Do not celebrate “zero alerts” as financial safety. Use:

> You have reviewed all current notifications.

---

# 3. Aave Health Factor Page

## Purpose

Help a beginner monitor one Aave borrowing position and understand its current Health Factor without turning Lobster Watch into a transaction interface.

## User Flow

### Setup

1. User opens Aave page.
2. User reads a two-sentence explanation.
3. User enters a public wallet address.
4. User confirms the supported network and market.
5. Lobster Watch validates the address and checks for a borrowing position.
6. User reviews the current Health Factor.
7. User accepts or adjusts warning and urgent thresholds.
8. User chooses notification behavior.
9. User saves monitoring.

### Monitoring

1. User opens Aave page.
2. User sees current Health Factor and band.
3. User sees last check and thresholds.
4. User expands **What does this mean?**
5. User edits thresholds, pauses monitoring, or removes the address.

## Layout

### Header

- Title: **Aave Health Factor**
- Description: **Monitor one borrowing position using a public wallet address. Lobster Watch is read-only.**
- Status badge

### Main status card

Shows:

- Health Factor in large but not promotional type
- Risk label
- Shortened wallet address
- Network and market
- Last checked time
- Data source

### Risk band

Use a simple horizontal band with labels:

```text
Critical | Urgent | Warning | Watch | Higher range
 <=1.00   1–1.20   1.2–1.5   1.5–2    >2
```

Always include words and values. Do not use color alone.

### Threshold settings

- Warning threshold
- Urgent threshold
- Email toggle
- Quiet-hours bypass for urgent or critical alerts
- Notification preview

### Explanation

Short accordion:

> A lower Health Factor may mean greater liquidation risk. It can change when collateral or debt values change. “Higher range” does not mean risk-free.

### Actions

- Save Changes
- Pause Monitoring
- Remove Address
- Open Official Aave Interface

The external Aave button should be secondary and clearly labeled as leaving Lobster Watch.

## Components

- Public address input
- Read-only explanation
- Network label
- Health Factor status card
- Risk-band scale
- Threshold fields
- Notification toggles
- Notification preview
- Last-checked row
- Remove confirmation
- No-position state
- Delayed-data state

## Desktop Version

Use two columns:

- Left 60%: status, risk band, explanation
- Right 40%: thresholds and notifications

### Desktop wireframe

```text
+---------------+----------------------------------------------------+
| Lobster Watch | Aave Health Factor                    [Active]     |
|               | Read-only monitoring of one position               |
|   Dashboard   |----------------------------------------------------|
|   Alerts      | [ CURRENT STATUS ]       | [ ALERT SETTINGS ]      |
| > Aave        |                          | Warning level            |
|   DCA         |      1.43                | [ 1.50            ]      |
|   Settings    |      WARNING             | Urgent level             |
|               |                          | [ 1.20            ]      |
|               | 0x12...89AB              | [x] Email alerts         |
|               | Ethereum · Aave V3       | [ ] Bypass quiet hours   |
|               | Checked 14:32            |                          |
|               |                          | [ Save changes ]         |
|               | Critical--Urgent--Warn--Watch--Higher              |
|               |             ^ 1.43                                  |
|               |----------------------------------------------------|
| Data current  | [v] What does Health Factor mean?                  |
|               | [Pause monitoring] [Remove address] [Open Aave]   |
+---------------+----------------------------------------------------+
```

## Mobile Version

Place current status first, settings second, explanation third, destructive actions last.

### Mobile wireframe

```text
+----------------------------------+
| Aave Health Factor      Active   |
| Read-only monitoring             |
+----------------------------------+
| Current Health Factor            |
|                                  |
|              1.43                |
|            WARNING               |
|                                  |
| 0x12...89AB · Aave V3            |
| Checked 14:32                    |
+----------------------------------+
| Critical-Urgent-Warn-Watch-High  |
|                   ^ 1.43         |
+----------------------------------+
| Alert settings                   |
| Warning     [ 1.50 ]             |
| Urgent      [ 1.20 ]             |
| Email       [ on ]               |
| Bypass quiet hours [ off ]       |
| [ Save changes ]                 |
+----------------------------------+
| [v] What does this mean?         |
| [ Pause ]  [ Remove ]            |
+----------------------------------+
| Home | Alerts | Aave | DCA | Set |
+----------------------------------+
```

## Aave Page States

### Not configured

Show one address field and explanation. Do not display a fake sample Health Factor as if it belongs to the user.

### No borrowing position

> We found this address, but no supported Aave borrowing position is currently available to monitor.

### Data delayed

Keep the last known value visibly labeled:

> Last confirmed value: 1.43 at 14:32. Current monitoring is delayed.

Do not color the last known value as if it is current.

### Unsupported

Explain the one supported market. Do not offer a long disabled list of future networks.

---

# 4. DCA Planner Page

## Purpose

Help users create and manage calm recurring reminders to review a BTC or ETH DCA decision.

Despite the page name, the v0.1 planner schedules reminders only. It does not purchase assets, connect to an exchange, or track whether a purchase occurred.

## User Flow

### Create

1. User opens DCA.
2. User selects BTC or ETH.
3. User selects weekly, every two weeks, or monthly.
4. User selects local date and time.
5. User optionally enters a planning amount.
6. User previews the reminder language.
7. User saves the reminder.

### Respond to reminder

1. User opens a due reminder.
2. User chooses:
   - Reviewed
   - Skip This Time
   - Snooze One Hour
   - Snooze Until Tomorrow
3. Lobster Watch schedules the next recurring reminder.

### Manage

User can:

- Edit
- Pause
- Resume
- Delete

## Layout

### Header

- Title: **DCA Planner**
- Description: **Create reminders for your own review. Lobster Watch does not buy assets for you.**
- Primary action: **New Reminder**

### Next reminder card

Shows:

- Asset
- Next date and local time
- Frequency
- Optional planning amount
- Active or snoozed status

### Reminder list

Maximum three active reminders. Each row has:

- Asset
- Frequency
- Next time
- Status
- Edit menu

### Create or edit form

Fields:

- BTC / ETH
- Frequency
- Date
- Time
- Timezone, prefilled from Settings
- Optional planning amount
- Email toggle

Show a notification preview before save.

## Components

- Asset selector
- Frequency selector
- Date and time fields
- Timezone display
- Optional amount field
- Reminder preview
- Reminder card
- Due-reminder action sheet
- Pause and delete actions

## Desktop Version

Use two columns when creating or editing:

- Left: reminder list
- Right: create or edit form

When no form is open, the right column may show a short explanation of DCA reminders.

### Desktop wireframe

```text
+---------------+----------------------------------------------------+
| Lobster Watch | DCA Planner                      [+ New Reminder]  |
|               | Reminders only. No automatic purchase.            |
|   Dashboard   |----------------------------------------------------|
|   Alerts      | [ YOUR REMINDERS ]        | [ CREATE REMINDER ]   |
|   Aave        |                           | Asset                  |
| > DCA         | BTC · Monthly             | (o) BTC  ( ) ETH      |
|   Settings    | Jul 1 · 19:00             | Frequency              |
|               | USD 100 · Active          | [ Monthly       v ]   |
|               | [Edit] [Pause]            | Date [ Jul 1       ]   |
|               |---------------------------| Time [ 19:00       ]   |
|               | ETH · Every 2 weeks       | Timezone Asia/Taipei   |
|               | Jul 5 · 09:00             | Amount [ optional  ]   |
|               | [Edit] [Pause]            | [x] Email reminder     |
|               |                           |                        |
| Data current  |                           | Preview: You planned...|
|               |                           | [ Save reminder ]      |
+---------------+----------------------------------------------------+
```

## Mobile Version

The list is the main page. **New Reminder** opens a separate full-screen form.

### Mobile wireframe

```text
+----------------------------------+
| DCA Planner     [+ New Reminder] |
| Reminders only. No auto-buy.     |
+----------------------------------+
| NEXT                             |
| BTC                              |
| Jul 1 · 19:00                    |
| Monthly · USD 100                |
| [ Reviewed ] [ Skip ]            |
| [ Snooze ]                       |
+----------------------------------+
| ACTIVE REMINDERS                 |
| BTC · Monthly                    |
| Next Jul 1 · 19:00       [Edit]  |
+----------------------------------+
| ETH · Every 2 weeks              |
| Next Jul 5 · 09:00       [Edit]  |
+----------------------------------+
| Home | Alerts | Aave | DCA | Set |
+----------------------------------+
```

## DCA Page States

### Empty

> Create a calm reminder to review your plan. No purchase will happen automatically.

### Due

Make **Reviewed**, **Skip This Time**, and **Snooze** equally neutral. Do not style Reviewed as a financial success.

### Paused

Show the next schedule as unavailable until resumed.

### Limit reached

> You can keep up to three active reminders in this version. Pause or remove one before adding another.

---

# 5. Settings Page

## Purpose

Let the user control account basics, language, timezone, quiet hours, notification delivery, privacy, and account deletion.

Keep this page short. Do not create separate settings subpages unless necessary for mobile accessibility.

## User Flow

1. User opens Settings.
2. User changes one or more preferences.
3. User saves.
4. Lobster Watch confirms the updated setting.

For account deletion:

1. User selects **Delete Account**.
2. Lobster Watch explains what will be removed.
3. User confirms through email or re-authentication.
4. Monitoring rules are disabled and account deletion begins.

## Layout

Group settings into five sections:

1. Account
2. Language and Time
3. Notifications
4. Safety and Privacy
5. Delete Account

## Components

### Account

- Email address, read-only
- Sign out

### Language and Time

- Language: Traditional Chinese / English
- Timezone
- Time format: 12-hour / 24-hour, only if simple to support

### Notifications

- Email notifications on or off
- Quiet-hours start
- Quiet-hours end
- Allow urgent or critical Aave alerts during quiet hours
- Send test email

### Safety and Privacy

- Short reminder:
  - Lobster Watch never asks for a seed phrase or private key.
  - Monitoring is read-only.
- Privacy notice link
- Data sources and limitations link

### Delete Account

- Destructive action separated visually
- Clear explanation
- Confirmation

## Desktop Version

Use a centered, narrow settings column. Wide empty space is preferable to a complicated two-column form.

### Desktop wireframe

```text
+---------------+----------------------------------------------------+
| Lobster Watch | Settings                                           |
|               | Control notifications, time, and privacy.          |
|   Dashboard   |----------------------------------------------------|
|   Alerts      | [ ACCOUNT ]                                        |
|   Aave        | Email  founder@example.com            [Sign out]  |
|   DCA         |----------------------------------------------------|
| > Settings    | [ LANGUAGE & TIME ]                                |
|               | Language [ Traditional Chinese v ]                 |
|               | Timezone [ Asia/Taipei          v ]                |
|               |----------------------------------------------------|
|               | [ NOTIFICATIONS ]                                  |
|               | Email [on]     Quiet hours [22:00] to [07:00]     |
|               | Urgent Aave bypass [off]  [Send test email]       |
|               |----------------------------------------------------|
|               | [ SAFETY & PRIVACY ]                               |
|               | Read-only. Never share a seed phrase. [Details]   |
|               |----------------------------------------------------|
|               | [ Save settings ]                                  |
| Data current  | [ Delete account ]                                 |
+---------------+----------------------------------------------------+
```

## Mobile Version

Stack all sections. Keep Save Settings visible at the bottom of the form, not fixed over content.

### Mobile wireframe

```text
+----------------------------------+
| Settings                         |
| Control time and notifications   |
+----------------------------------+
| ACCOUNT                          |
| founder@example.com              |
| [ Sign out ]                     |
+----------------------------------+
| LANGUAGE & TIME                  |
| Language  [ 中文          v ]    |
| Timezone  [ Asia/Taipei   v ]    |
+----------------------------------+
| NOTIFICATIONS                    |
| Email                 [ on ]     |
| Quiet starts          [22:00]    |
| Quiet ends            [07:00]    |
| Urgent Aave bypass    [ off ]    |
| [ Send test email ]              |
+----------------------------------+
| SAFETY & PRIVACY                 |
| Read-only monitoring             |
| Never share a seed phrase        |
| [ View details ]                 |
+----------------------------------+
| [ Save settings ]                |
| [ Delete account ]               |
+----------------------------------+
| Home | Alerts | Aave | DCA | Set |
+----------------------------------+
```

## Settings Page States

### Saved

Use a small confirmation:

> Settings saved.

### Test email sent

> Test email sent. It may take a few minutes to arrive.

### Delivery failure

> We could not send the test email. Your settings were not changed.

### Delete account

Do not use manipulative retention language. State what happens and let the user decide.

---

# Price Alert Creation Pattern

BTC and ETH alert creation happens from the Dashboard to avoid adding two more top-level pages.

## Flow

1. Select **Add Price Alert**.
2. Choose BTC or ETH.
3. Choose Above or Below.
4. Enter target price.
5. Confirm currency.
6. Choose email notification.
7. Review preview.
8. Save.

## Desktop

Use a right-side panel or centered dialog.

```text
+--------------------------------------+
| Add Price Alert                 [x]  |
|                                      |
| Asset        (o) BTC   ( ) ETH       |
| Condition    [ Above ] [ Below ]     |
| Target       [ USD 70,000        ]   |
| Email        [ on ]                  |
|                                      |
| Preview                              |
| Notify me once when BTC moves above  |
| USD 70,000.                          |
|                                      |
| [ Cancel ]       [ Save Alert ]      |
+--------------------------------------+
```

## Mobile

Use a full-screen form rather than a small modal.

## Validation

- Show formatting while typing.
- Explain invalid values beside the field.
- Disable save until required fields are valid.
- Do not call the threshold an entry price, target profit, or recommendation.

---

# Global Empty, Error, and Delay States

## Empty State Formula

1. State what is not set up.
2. Explain the benefit in one sentence.
3. Offer one action.

Example:

> No BTC alert yet. Add a threshold and Lobster Watch will notify you once when it is crossed.

## Error State Formula

1. Say what failed.
2. Say what was not affected.
3. Offer retry if useful.

Example:

> Aave data could not be refreshed. Your BTC, ETH, and DCA monitoring are still working.

## Data Delay Formula

1. Label the value as last known.
2. Show the timestamp.
3. State that new triggers are paused.

Example:

> BTC price data is delayed. Last confirmed price: USD 70,125 at 14:32. New BTC alerts will wait for current data.

---

# Responsive Behavior

## Breakpoints

Keep implementation simple:

- Mobile: below 768 px
- Desktop: 768 px and above

A separate tablet design is unnecessary. Use the desktop shell at comfortable widths and collapse to mobile below the breakpoint.

## Mobile Priorities

- Urgent information before management tools
- One column
- Full-width primary actions
- Large touch targets
- No hover-dependent controls
- No tables requiring horizontal scrolling
- Shortened wallet addresses
- Local time shown clearly

## Desktop Priorities

- Keep navigation visible
- Use two columns only when it reduces scrolling
- Keep forms under 520 px wide
- Avoid filling wide screens with unnecessary data
- Use master-detail only in Alert Center

---

# Accessibility

- Minimum 44 × 44 px touch targets.
- Visible keyboard focus.
- Semantic headings and form labels.
- Error messages linked to fields.
- Status icons paired with text.
- Risk is never communicated by color alone.
- Avoid rapid animation and honor reduced-motion preferences.
- Keep body text readable at 16 px or larger.
- Use plain-language link names.
- Announce saved settings and new errors to assistive technology.
- Alert Center unread state must not depend only on a colored dot.

---

# Content Rules

## Use

- “Needs attention”
- “Warning level crossed”
- “Last checked”
- “Data delayed”
- “Read-only monitoring”
- “Review when it is safe and convenient”
- “No action is required”
- “This is not a recommendation to buy or sell”

## Avoid

- “Buy now”
- “Sell now”
- “Crash”
- “Moon”
- “Opportunity”
- “Guaranteed”
- “Safe position”
- “Profit target”
- “You missed your DCA”
- “Emergency” for ordinary price alerts

---

# Solo-Founder Component Inventory

The MVP should be achievable with approximately these interface components:

| Component | Variants |
|---|---|
| App shell | Desktop sidebar, mobile bottom nav |
| Page header | With or without one action |
| Card | Default, attention, empty, delayed |
| Status badge | Active, triggered, paused, delayed, risk bands |
| Notification row | Read, unread, five severity levels |
| Form field | Text, number, date, time, select |
| Choice control | Asset, above/below, frequency |
| Toggle | Email, quiet-hour bypass |
| Button | Primary, secondary, text, destructive |
| Banner | Data delayed, error, service recovered |
| Accordion | Plain-language explanation |
| Dialog | Confirm pause, remove, delete |
| Toast | Saved, sent, failed |

Do not create a custom component for every page if one of these can be reused.

---

# UI Build Order

## Step 1 — Foundation

- App shell
- Navigation
- Page header
- Card
- Buttons
- Form fields
- Status badges
- Loading and error states

## Step 2 — Dashboard and Price Alerts

- Four dashboard cards
- Add price-alert form
- Triggered and paused states
- Recent-notifications list

## Step 3 — Alert Center

- Notification list
- Filters
- Detail view

## Step 4 — Aave

- Address setup
- Health Factor card
- Risk band
- Threshold form
- No-position and delayed states

## Step 5 — DCA

- Reminder list
- Create and edit form
- Due-reminder actions

## Step 6 — Settings and Polish

- Timezone
- Quiet hours
- Test email
- Account deletion
- Mobile and accessibility review

---

# UI Acceptance Checklist

The interface is ready for MVP launch when:

- A first-time user can identify all four product features.
- A user can create a BTC or ETH alert in under one minute.
- A user can understand the current Aave band without relying on color.
- A user can create a DCA reminder in under two minutes.
- Every value shows a current or last-known timestamp.
- Delayed data cannot be mistaken for current data.
- Dashboard contains no trading chart.
- Price alerts do not use urgent financial language.
- Mobile navigation works with one hand.
- Every page works by keyboard.
- Every form has clear validation.
- Destructive actions require confirmation.
- The UI never requests a seed phrase, private key, or wallet signature.
- A solo founder can build the screens using the shared component inventory.

## Final Scope Test

Before adding a UI element, ask:

> Does this help the user create, understand, or manage BTC alerts, ETH alerts, one Aave Health Factor monitor, DCA reminders, or notification settings?

If not, leave it out of the MVP.

