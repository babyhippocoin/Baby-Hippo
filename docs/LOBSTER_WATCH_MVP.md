# Lobster Watch MVP

> **Help ordinary people monitor risk without staring at charts all day.**

## Product Summary

Lobster Watch is the first working product of Baby Hippo.

It is a simple alert service for workers, truck drivers, teachers, busy people, and beginner DeFi users. A person chooses what matters, Lobster Watch checks it in the background, and the person receives a clear notification when attention may be needed.

Version 0.1 does not trade, move funds, predict prices, or promise outcomes. It watches, reminds, and explains.

## 30-Day Product Goal

Within 30 days, launch a mobile-friendly MVP that allows a user to:

1. Create BTC price alerts.
2. Create ETH price alerts.
3. Monitor one Aave position for Health Factor changes.
4. Schedule DCA reminders.
5. Receive clear in-app and email notifications.

The launch goal is not to build a complete portfolio platform. It is to prove that ordinary people find simple, timely alerts useful.

## Target Users

- Workers who cannot watch markets during a shift
- Truck drivers who need information delivered safely when they are not driving
- Teachers with lessons throughout the day
- Busy people balancing work and family
- Beginner DeFi users learning how lending risk works

## Core Product Promise

> Tell me when something I chose needs attention.  
> Show me why it matters.  
> Do not pressure me to trade.

## MVP Principles

- **Four features only:** BTC alerts, ETH alerts, Aave Health Factor alerts, and DCA reminders.
- **Read-only:** Lobster Watch never moves funds or signs transactions.
- **Plain language:** Every notification says what happened and why it matters.
- **User-controlled:** Users choose thresholds, schedules, and notification settings.
- **Quiet by default:** Avoid duplicate, noisy, or fear-based alerts.
- **Freshness visible:** Show when data was last checked.
- **Safety over urgency:** Notifications must not encourage use while driving.
- **No prediction:** Alerts report conditions; they do not forecast prices.

---

# MVP User Experience

## First-Time Setup

```text
Welcome
   |
   v
Create account with email
   |
   v
Choose what to watch
   |---- BTC price
   |---- ETH price
   |---- Aave Health Factor
   `---- DCA reminder
   |
   v
Confirm notification settings
   |
   v
See active alerts on one dashboard
```

## Main Dashboard

The dashboard contains four simple cards:

1. **BTC Price**
2. **ETH Price**
3. **Aave Health Factor**
4. **Next DCA Reminder**

Each card shows:

- Current or latest known status
- User's alert rule
- Last checked time
- Notification status
- Edit, pause, or delete action

Do not show trading charts on the default dashboard. A small price and recent timestamp are enough for v0.1.

---

# Feature 1 — BTC Price Alerts

## User Problem

A busy person may care when Bitcoin reaches a specific price but cannot safely or practically watch charts throughout the day.

They need a notification based on a rule they set—not a stream of market commentary.

## User Flow

1. User selects **Add BTC Alert**.
2. User chooses:
   - Price goes above a value, or
   - Price goes below a value.
3. User enters the target price.
4. User confirms display currency.
5. User selects notification channels.
6. Lobster Watch shows a plain-language preview.
7. User saves the alert.
8. Lobster Watch monitors the price.
9. When the condition is met, the user receives one notification.
10. The alert becomes **Triggered** and asks whether to reset, edit, or archive it.

## Inputs

- Asset: BTC, fixed by the feature
- Condition: above or below
- Target price
- Display currency: USD for launch; TWD may be added only if implementation remains within schedule
- Notification channel:
  - In-app
  - Email
- Optional quiet hours

## Outputs

- Current BTC reference price
- Target price
- Distance from target, shown as value and percentage
- Status:
  - Active
  - Triggered
  - Paused
  - Data delayed
- Last checked timestamp
- Price-data source label

## Notification

**Example**

> BTC price alert  
> BTC reached your “above USD 70,000” alert condition.  
> Reference price: USD 70,125 at 14:32.  
> This is an alert you created, not a recommendation to buy or sell.

## Notification Rules

- Send once when the price crosses the selected threshold.
- Do not send repeated messages while the price remains beyond the threshold.
- Require the user to reset or create a new alert after triggering.
- If data is stale or unavailable, do not claim the target was reached.
- Show the source price and timestamp.
- Support no more than three active BTC alerts per user in v0.1.

## Acceptance Criteria

- A user can create an above or below alert in less than one minute.
- A test price crossing produces one notification.
- Repeated checks do not produce duplicate notifications.
- Invalid, negative, or unrealistic input formats are rejected clearly.
- Paused alerts produce no notifications.

---

# Feature 2 — ETH Price Alerts

## User Problem

Ethereum users may want to know when ETH reaches a personally meaningful level without repeatedly opening exchanges or market apps.

Beginners need a simple threshold alert without trading signals or technical analysis.

## User Flow

1. User selects **Add ETH Alert**.
2. User chooses above or below.
3. User enters the target price.
4. User confirms display currency.
5. User selects notification channels.
6. Lobster Watch previews the rule.
7. User saves the alert.
8. Lobster Watch monitors the price.
9. The service sends one notification when the threshold is crossed.
10. The alert becomes **Triggered** until the user resets or archives it.

## Inputs

- Asset: ETH, fixed by the feature
- Condition: above or below
- Target price
- Display currency: USD for launch; TWD only if schedule permits
- Notification channel:
  - In-app
  - Email
- Optional quiet hours

## Outputs

- Current ETH reference price
- Target price
- Distance from target
- Alert status
- Last checked timestamp
- Price-data source label

## Notification

**Example**

> ETH price alert  
> ETH moved below your USD 3,000 alert condition.  
> Reference price: USD 2,986 at 09:15.  
> Check the latest information when it is safe and convenient. This is not a trading recommendation.

## Notification Rules

- Apply the same crossing, deduplication, freshness, and reset rules as BTC.
- Support no more than three active ETH alerts per user.
- Do not use words such as “buy now,” “sell now,” “opportunity,” or “crash.”

## Acceptance Criteria

- A user can create, edit, pause, reset, and delete an ETH alert.
- A threshold crossing produces one accurate notification.
- Data source and time are visible.
- Delayed price data creates a system-status message, not a false price alert.

---

# Feature 3 — Aave Health Factor Alerts

## User Problem

A beginner using Aave may not understand that a borrowing position can become vulnerable as collateral values and debt values change.

They may be working, driving, teaching, or sleeping when their Health Factor moves toward a dangerous level. They need an early warning in plain language, without having to keep Aave open all day.

## MVP Boundary

Version 0.1 monitors:

- One wallet address per user
- One explicitly selected Aave market and network
- Read-only position data
- Current Health Factor and threshold changes

The launch team must choose one supported Aave deployment before development begins. Additional networks, markets, and protocols are outside the 30-day scope.

Lobster Watch does not repay debt, add collateral, rebalance a position, or prepare transaction data.

## User Flow

1. User selects **Monitor Aave Position**.
2. User reads a short explanation of Health Factor.
3. User enters a public wallet address or connects a wallet read-only.
4. User selects the single supported Aave market.
5. Lobster Watch checks whether a borrowing position exists.
6. If a position exists, the user sees:
   - Current Health Factor
   - Last checked time
   - Simple risk label
   - Default alert thresholds
7. User accepts or adjusts the thresholds within supported limits.
8. User confirms notification channels.
9. Lobster Watch checks the position on a scheduled interval.
10. The user is notified when the Health Factor crosses into a more serious band or recovers.

## Inputs

- Public wallet address
- Supported Aave network and market
- Warning threshold
- Urgent threshold
- Notification channels
- Optional quiet hours, with critical alerts allowed to bypass quiet hours only through explicit user consent

## Default Alert Bands

These are Lobster Watch product defaults and must be configurable before launch review:

| Health Factor | Product label | Notification behavior |
|---:|---|---|
| Above 2.00 | Stable range | Dashboard only |
| 1.50–2.00 | Watch | Optional informational notification |
| 1.20–1.50 | Warning | Send warning |
| 1.00–1.20 | Urgent | Send urgent alert |
| At or below 1.00 | Critical condition | Send critical alert using current Aave data |

The interface must explain that Health Factor can change quickly and that the Aave interface and protocol documentation remain the source of truth. The label “stable range” does not mean risk-free.

## Outputs

- Monitored wallet address, shortened for display
- Supported Aave market and network
- Current Health Factor
- Risk label
- Alert thresholds
- Last checked time
- Data source and block or timestamp
- Monitoring state:
  - Active
  - No borrowing position
  - Unsupported market
  - Data delayed
  - Error

## Warning Notification

**Example**

> Aave Health Factor warning  
> The Health Factor for your monitored address moved from 1.58 to 1.43.  
> This crossed your warning level of 1.50. A lower Health Factor may mean greater liquidation risk. Review the position directly in Aave when it is safe to do so.

## Urgent Notification

**Example**

> Urgent Aave position alert  
> Your monitored Health Factor is 1.14.  
> It has crossed your urgent level of 1.20. Values can change quickly. Lobster Watch cannot move funds or protect the position automatically.

## Recovery Notification

**Example**

> Aave Health Factor update  
> Your monitored Health Factor moved back above 1.50 and is now 1.57.  
> Continue to review the position and underlying risks directly in Aave.

## Notification Rules

- Notify only when crossing from one band into a more serious band.
- Send a recovery notification when crossing back above a user threshold.
- Do not repeatedly notify on every scheduled check within the same band.
- Permit one reminder after a defined cooldown if the position remains urgent or critical.
- Store the previous band to support reliable crossing detection.
- If data is unavailable or stale, notify the user that monitoring is delayed; do not report a current Health Factor.
- Never include a transaction link presented as the only safe action.
- Notifications must say that Lobster Watch is read-only.

## Acceptance Criteria

- A valid address with a supported Aave borrowing position displays a Health Factor.
- An address without a borrowing position receives a clear neutral message.
- Threshold crossings produce the correct severity and no duplicate alerts.
- A recovery produces one recovery notification.
- Invalid addresses and unsupported networks are handled clearly.
- Stale or failed data never appears as current.
- No seed phrase, private key, or wallet signature is requested.

---

# Feature 4 — DCA Reminders

## User Problem

A person may want to build a regular DCA habit but forget because of work, family, irregular schedules, or daily responsibilities.

They need a calm reminder—not automated purchasing, pressure to buy, or a message claiming that the timing is profitable.

## User Flow

1. User selects **Create DCA Reminder**.
2. User chooses BTC or ETH.
3. User chooses frequency.
4. User selects date, time, and timezone.
5. User may enter a planning amount for personal reference.
6. User selects notification channels.
7. Lobster Watch previews the schedule.
8. User saves the reminder.
9. At the scheduled time, the user receives a reminder.
10. User can mark it:
    - Reviewed
    - Skipped
    - Snoozed
11. The next reminder is scheduled automatically.

## Inputs

- Asset: BTC or ETH
- Frequency:
  - Weekly
  - Every two weeks
  - Monthly
- Date and local time
- Timezone
- Optional planning amount
- In-app and email notification settings
- Optional quiet hours

## Outputs

- Asset
- Schedule
- Next reminder date and time
- Optional planning amount
- Status:
  - Active
  - Snoozed
  - Paused
- Last response:
  - Reviewed
  - Skipped
  - No response

The MVP does not track whether a purchase actually occurred.

## Notification

**Example**

> Your DCA reminder  
> You planned to review your BTC DCA decision today at 19:00.  
> Take a moment to check your budget and current situation. You can continue, skip, or adjust your plan. No action is required.

## Notification Rules

- Send at the user's selected local time.
- Allow one snooze for:
  - One hour
  - Tomorrow
- Do not imply that the user should purchase.
- Do not include live price movement as pressure.
- If a reminder is skipped, respond neutrally.
- Support no more than three active DCA reminders per user.
- Handle timezone and daylight-saving changes correctly.

## Acceptance Criteria

- A user can create a recurring reminder in less than two minutes.
- Reminder time respects the saved timezone.
- A user can pause, resume, edit, snooze, or delete a reminder.
- Skipping does not trigger guilt-based messaging.
- No transaction is initiated and no exchange account is required.

---

# Notification System

## MVP Channels

### Required

- In-app notification inbox
- Email

### Deferred

- Native mobile push
- SMS
- LINE
- Telegram
- Discord direct messages
- WhatsApp

Browser push may be included only if the core four features are complete and tested early. It must not delay launch.

## Notification Anatomy

Every alert should include:

1. What happened
2. The user's rule or threshold
3. Current reference value
4. Data timestamp
5. Plain-language meaning
6. Calm next step
7. Limitation or source note

## Severity

| Level | Use |
|---|---|
| Information | DCA reminders and recovery updates |
| Notice | BTC or ETH user-defined price threshold |
| Warning | Aave Health Factor warning band |
| Urgent | Aave urgent band |
| Critical | Aave critical condition based on current available data |

Price movement alone is not labeled urgent or critical in v0.1.

## Quiet Hours

- Quiet hours apply to price alerts and DCA reminders.
- Aave warning alerts follow user preferences.
- Urgent or critical Aave alerts may bypass quiet hours only if the user explicitly enables this.
- Driving users should be reminded to review alerts only when safely parked.

## Deduplication

Every notification event needs:

- Unique event ID
- Alert rule ID
- Triggered value
- Triggered time
- Previous state
- Current state
- Delivery status

The service must not send the same event twice because a worker restarted or a provider retried a request.

---

# MVP Screens

Only these screens are required:

1. Welcome and product explanation
2. Email sign-in
3. Notification consent and quiet-hours setup
4. Dashboard
5. Create or edit BTC alert
6. Create or edit ETH alert
7. Add Aave address and thresholds
8. Create or edit DCA reminder
9. Notification inbox
10. Settings and delete-account controls
11. Data delay or service-status state

Do not build a general portfolio dashboard for this MVP.

---

# Simple Data Model

## User

- User ID
- Email
- Timezone
- Language
- Quiet hours
- Email notification status
- Created time

## Price Alert

- Alert ID
- User ID
- Asset: BTC or ETH
- Condition: above or below
- Target price
- Currency
- Current state
- Previous reference price
- Last checked time
- Triggered time

## Aave Monitor

- Monitor ID
- User ID
- Public wallet address
- Supported network
- Supported market
- Warning threshold
- Urgent threshold
- Previous Health Factor
- Previous risk band
- Last checked block or time
- Current state

## DCA Reminder

- Reminder ID
- User ID
- Asset
- Frequency
- Local schedule
- Timezone
- Optional planning amount
- Next reminder time
- Status
- Last response

## Notification Event

- Event ID
- User ID
- Source rule ID
- Type
- Severity
- Message payload
- Data timestamp
- Created time
- Delivery attempts
- Delivery status
- Read time

---

# Data and Monitoring Requirements

## Price Data

- Use one primary BTC and ETH reference-price provider.
- Keep one fallback provider if practical.
- Record source and timestamp.
- Define a freshness limit before launch.
- Stop price-trigger evaluation when data is outside the freshness limit.

## Aave Data

- Use official contracts, subgraphs, APIs, or supported SDK paths selected during implementation.
- Verify the chosen market and network before launch.
- Record block number or timestamp.
- Compare displayed values with the official Aave interface during testing.
- Fail closed when the current Health Factor cannot be confirmed.

## Service Monitoring

Monitor:

- Last successful BTC price check
- Last successful ETH price check
- Last successful Aave check
- Number of delayed checks
- Notification delivery failures
- Duplicate-event prevention
- DCA scheduling delay
- Email bounce rate

The team needs an internal alert if core data checks or deliveries fail.

---

# Security and Privacy

- Never request a seed phrase, private key, wallet PIN, or hardware-wallet recovery words.
- Aave monitoring requires only a public address.
- Wallet connection, if offered, must be read-only and optional.
- Do not require a signature to monitor an address.
- Encrypt sensitive account information in storage and transit.
- Do not expose full wallet addresses in email notifications.
- Provide account deletion and monitoring removal.
- Avoid storing more price history or wallet information than the MVP requires.
- Apply rate limits to alert creation and account endpoints.
- Log system events without logging secrets or complete personal notification content.

## Safety Language

The product must state:

- Prices may differ across sources and venues.
- Notifications can be delayed.
- Health Factor can change quickly.
- Lobster Watch does not custody assets or take action for the user.
- Alerts are informational and are not financial advice.
- No financial result is guaranteed.

---

# Explicitly Out of Scope

The following must not enter the 30-day MVP:

- Trading or swap execution
- Automated DCA purchases
- Automated Aave repayment or collateral addition
- Portfolio performance tracking
- General 0–100 risk score
- AI chat or personalized AI recommendations
- Technical-analysis indicators
- News alerts
- Stablecoin depeg alerts
- Additional tokens beyond BTC and ETH
- Protocols other than one selected Aave market
- Multi-wallet monitoring
- Social feed
- BHC rewards
- Hippo Farm
- Native iOS or Android applications
- Paid subscription plans
- Referral system
- Community leaderboard

Ideas can be recorded in a future backlog, but they cannot delay v0.1.

---

# 30-Day Delivery Plan

## Days 1–3 — Decisions and Prototype

- Confirm one price-data provider.
- Confirm one Aave network and market.
- Confirm email service.
- Define freshness limits and alert thresholds.
- Draw the eleven required screens.
- Test wording with at least three target users.
- Freeze the MVP scope.

## Days 4–8 — Foundation

- Create email sign-in and user settings.
- Build the dashboard shell.
- Create alert and notification data models.
- Add timezone and quiet-hours handling.
- Establish background-job and delivery monitoring.

## Days 9–13 — BTC and ETH Alerts

- Integrate reference-price data.
- Build create, edit, pause, reset, and delete flows.
- Implement crossing detection.
- Implement deduplication.
- Deliver in-app and email alerts.
- Test stale-data behavior.

## Days 14–18 — Aave Health Factor

- Add public-address validation.
- Integrate the selected Aave market.
- Implement Health Factor bands and crossing detection.
- Add warning, urgent, critical, and recovery notifications.
- Test no-position, unsupported, delayed-data, and provider-failure states.

## Days 19–21 — DCA Reminders

- Build recurring schedules.
- Add timezone-safe delivery.
- Add reviewed, skipped, snoozed, paused, and deleted states.
- Verify neutral reminder language.

## Days 22–25 — End-to-End Quality

- Test every core user journey.
- Test notification delays and retries.
- Test duplicate prevention.
- Test mobile layouts and accessibility.
- Review privacy, security, and user-facing limitations.
- Compare Aave values with the official reference interface.

## Days 26–28 — User Pilot

- Invite 10–20 workers, drivers, teachers, busy users, and beginner DeFi users.
- Observe setup without coaching.
- Ask whether every alert is understandable.
- Fix critical confusion and delivery failures.
- Do not add new feature categories.

## Days 29–30 — Launch

- Resolve launch-blocking issues.
- Publish data-source and limitation notes.
- Confirm internal monitoring and incident contacts.
- Release the MVP.
- Begin collecting structured feedback.

---

# Team Recommendation

A practical minimum team:

- One founder or product owner
- One full-stack engineer
- One product designer working part-time or in focused sprints
- One reviewer for security and Aave integration
- A small target-user test group

If the team is smaller, reduce visual polish before reducing reliability, freshness handling, or notification correctness.

---

# MVP Success Metrics

## Activation

- 70% of signed-in users create at least one alert or reminder.
- 40% create more than one type.
- 80% complete setup without assistance.

## Reliability

- 99% of scheduled checks complete within the defined monitoring window.
- No known duplicate alert event is delivered more than once.
- Notification delivery failures are visible to the team.
- Stale data never triggers a false condition.

## Usefulness

- 80% of pilot users understand why an alert was sent.
- 70% say Lobster Watch reduces the need to check charts manually.
- At least 50% return within seven days.
- Fewer than 10% disable notifications because they are too noisy.

These are product-learning targets, not financial-performance targets.

---

# Launch Acceptance Checklist

Lobster Watch v0.1 is ready only when:

- BTC above and below alerts work.
- ETH above and below alerts work.
- One supported Aave market is monitored reliably.
- Aave band crossings and recovery alerts work without duplicates.
- DCA reminders respect timezone and quiet-hour settings.
- In-app and email notifications work.
- Every notification includes a timestamp and plain-language meaning.
- Data delays are visible and do not create false alerts.
- Users can pause, edit, and delete every rule.
- Users can delete their account.
- No transaction, custody, or wallet signature is required.
- Mobile and accessibility checks pass.
- At least 10 target users complete a pilot.
- No critical security or alert-reliability issue remains open.

## Final Scope Test

Before accepting any new request during the 30-day build, ask:

> Is this required for BTC alerts, ETH alerts, Aave Health Factor alerts, or DCA reminders to work safely and clearly?

If the answer is no, place it in the future backlog.

