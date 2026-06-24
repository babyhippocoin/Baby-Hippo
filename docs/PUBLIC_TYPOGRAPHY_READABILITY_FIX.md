# Baby Hippo Public Typography Readability Fix

## Scope

This readability pass covers the public education pages:

- `/on-ramp`
- `/learn`
- `/earn`
- `/dca-planner`
- `/story`
- `/community`
- `/points`

No Aave monitoring, wallet, backend, referral-link, or DCA calculation logic was changed.

## Improvements completed

### Typography

- Mobile body text is now at least 16px.
- Desktop teaching text is generally 17px.
- Helper and disclosure text is at least 14px.
- Card descriptions are at least 15–16px.
- Table content is at least 15px.
- Buttons and action links are at least 15px.
- Teaching paragraphs use a line height of approximately 1.7.
- Important explanations use brighter, higher-contrast colors on the dark background.

### Spacing and touch targets

- Increased space between sections, paragraphs, cards, headings, table rows, and CTA blocks.
- Increased card padding to separate teaching content more clearly.
- Mobile action buttons use larger touch targets, generally 48–52px high.
- Dense DCA, Earn, and Points layouts collapse into simpler mobile columns.

### Taiwan on-ramp page

The following content received specific readability improvements:

- Page introduction
- BitoPro beginner section
- Five-platform comparison
- Fee education
- BitoPro step-by-step guide
- Referral disclosures
- Risk warnings

On mobile, the five-column comparison table becomes vertically stacked platform cards. Each value includes a visible field label, so users do not need to scroll sideways or remember the desktop column order.

## Verification results

### Desktop

- All seven routes loaded successfully.
- Main teaching text measured at 17px on the education pages.
- Helper and disclosure text measured at 14px or above.
- Buttons measured at 15px or above.
- No page-level horizontal overflow was detected.

### Mobile

Tested at a 375 × 812 viewport:

- Body text measured at 16px or above.
- Helper text measured at 14px or above.
- Buttons measured at 15px or above.
- The on-ramp table changed to stacked cards.
- No page-level horizontal overflow was detected on any reviewed route.

### Language and stability

- Traditional Chinese content rendered correctly.
- English mode rendered correctly without layout overflow.
- Production build passed.
- Browser console reported no errors.

## Result

The public education experience is now more comfortable to read on desktop and mobile while preserving the existing Baby Hippo visual design and all existing product logic.
