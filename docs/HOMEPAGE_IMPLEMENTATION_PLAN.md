# Baby Hippo Public Homepage Implementation Plan

> **Status:** Planning only  
> **Primary audience:** Ordinary people and first-time Web3 learners  
> **Primary goal:** Explain Baby Hippo within 30 seconds and give visitors a safe first step  
> **Core slogan:** From Worker To On-Chain Boss  
> **Core subtitle:** 為每一位努力生活的人打造的鏈上成長社群。

## 1. Executive Summary

The Baby Hippo public homepage should introduce a founder-led on-chain growth community—not a trading platform, token campaign, or generic crypto product.

The visitor should quickly understand:

1. Baby Hippo is built for ordinary people who work hard.
2. The project comes from real experience in rural Miaoli, freight transportation, and music education.
3. Education, risk management, DCA discipline, and long-term growth come before speculation.
4. Lobster Watch is the flagship product.
5. Joining or learning does not require buying BHC or connecting a wallet.

The homepage should be implemented as a separate public experience. It must not replace, redesign, or interfere with the existing Lobster Watch dashboard.

### Recommended Phase 1 conversion goal

Move a first-time visitor toward one of two safe actions:

- **Join Community**
- **Start Learning**

Product exploration, stories, and values are supporting paths rather than competing primary actions.

---

## 2. Analysis of `HOMEPAGE.md`

### What is already clearly defined

The existing specification provides:

- A strong 30-second visitor journey
- Seven required homepage sections
- A founder story grounded in lived experience
- Six clearly identified community audiences
- Four prioritized v0.1 products
- A people-first Hippo Stories concept
- Manifesto and Constitution visibility
- Bilingual intent
- Accessibility and performance principles
- Strong financial-language guardrails

### Main implementation decisions still required

Before development begins, the founder must confirm:

1. The actual destination for **Join Community**
2. The first public Hippo Academy lesson for **Start Learning**
3. Whether Phase 1 launches in English, Traditional Chinese, or both
4. Whether genuine founder photography is available
5. Whether real Hippo Stories have approved consent and media
6. Which public routes are available at launch versus marked “Coming soon”
7. Whether Lobster Watch remains a separate application route or opens in another subdomain

### Recommended interpretation

The homepage should behave like a welcoming community front door:

- Human story before technical detail
- Community identity before product features
- Learning before wallet connection
- Risk awareness before financial opportunity
- Values before token information

### Content issue to resolve before launch

Some existing documents contain corrupted Traditional Chinese characters. All public Traditional Chinese copy must be manually reviewed and corrected by a fluent Traditional Chinese editor before publication. Do not publish garbled text or rely on unreviewed machine translation.

---

## 3. Sitemap

### Phase 1 public sitemap

```text
/
├── /story
├── /products
│   ├── /products/lobster-watch
│   ├── /products/hippo-bank
│   ├── /academy
│   └── /bhc
├── /stories
├── /manifesto
├── /constitution
├── /community
├── /safety
├── /privacy
└── /terms
```

### Route purposes

| Route | Purpose | Phase 1 expectation |
|---|---|---|
| `/` | Explain Baby Hippo and guide the first action | Complete |
| `/story` | Expanded founder story and project origin | Simple editorial page |
| `/products` | Product overview and status | Complete or concise |
| `/products/lobster-watch` | Explain and launch the flagship product | Link to working dashboard |
| `/products/hippo-bank` | Explain planned DCA and lending education | Honest preview |
| `/academy` | Beginner learning entry point | At least one real lesson |
| `/bhc` | Explain testnet learning rewards | Educational page |
| `/stories` | Community story index | Real stories or honest empty state |
| `/manifesto` | Public Manifesto | Complete |
| `/constitution` | Public Constitution | Complete |
| `/community` | Community channels, rules, and onboarding | Complete |
| `/safety` | Scam policy and official-link verification | Complete |
| `/privacy` | Privacy and data-use explanation | Required |
| `/terms` | Website terms and financial limitations | Required |

### Future routes

```text
/academy/[lesson]
/stories/[story]
/events
/events/[event]
/updates
/updates/[post]
/resources
/press
```

### Navigation structure

**Desktop navigation**

- Our Story
- Who We Build For
- Products
- Hippo Stories
- Values
- Language
- Join Community

**Mobile navigation**

- Logo
- Language
- Menu
- Persistent Join Community action

Wallet connection must not appear in the public homepage header.

---

## 4. Homepage Sections

## Section 1 — Hero

### Purpose

Answer “What is Baby Hippo, and is it for me?” within five seconds.

### Content

- Eyebrow: An On-Chain Growth Community for Ordinary People
- Headline: From Worker To On-Chain Boss
- Traditional Chinese slogan: 從上班族，成為鏈上老闆
- Subtitle: 為每一位努力生活的人打造的鏈上成長社群。
- One plain-language supporting sentence
- Primary CTA: Join Community
- Secondary CTA: Start Learning
- Trust note: Education first. Risk management first. No promises of easy money.
- Baby Hippo hero illustration

### Success condition

A visitor understands that this is a people-first learning and risk community, not a token sales page.

## Section 2 — Our Story

### Purpose

Establish authenticity and explain why the founder is building the project.

### Content

- Rural Miaoli origin
- Freight and logistics work
- Violin teaching and grassroots arts education
- Difficulty ordinary people face when learning Web3
- Short founder quote
- Link: Read Our Manifesto

### Content limit

Use three short paragraphs on the homepage. Move the full story to `/story`.

## Section 3 — Who We Build For

### Purpose

Allow visitors to recognize themselves.

### Audience groups

- Truck Drivers
- Labor and Logistics Workers
- Music Teachers
- Small Business Owners
- Rural Communities
- Ordinary People Building a Better Future

### Card rule

Each card should describe a real need or learning situation. Do not use portfolio values, income promises, or stereotypes.

## Section 4 — Core Products

### Purpose

Explain how Baby Hippo helps people.

### Product order

1. Lobster Watch
2. Hippo Bank
3. Hippo Academy
4. BHC Learning Rewards

### Product presentation

Each card includes:

- Problem it addresses
- Simple benefit
- Current status
- One CTA
- One limitation or trust note

Lobster Watch receives the strongest visual emphasis. Hippo Farm is excluded.

## Section 5 — Hippo Stories

### Purpose

Make real people more visible than products or tokens.

### Phase 1 states

- Show up to three approved stories, or
- Show an honest story-gathering empty state

Never invent testimonials, member numbers, quotes, or financial outcomes.

### Primary statement

> People are the community. The community is more important than the token.

## Section 6 — Our Values

### Purpose

Make the ethical boundaries of the project visible.

### Values

- Honest growth, not scams
- Long-term progress, not overnight gambling
- Education before speculation
- Risk management before leverage
- Tools for ordinary people
- Community over token

### Document cards

- Manifesto
- Constitution

These links should be prominent cards, not small footer links.

## Section 7 — Join Baby Hippo

### Purpose

Offer a warm final invitation without urgency.

### Content

- “You do not have to know everything to begin.”
- Join Community
- Start Learning
- Optional: Share Your Story
- Founder closing statement
- Testnet-first and no-guaranteed-outcomes note

## Footer

### Groups

- Project
- Products
- Community
- Values and documents
- Safety and legal
- Language
- Official social links

Include a visible scam warning explaining that Baby Hippo will never request a seed phrase or private key.

---

## 5. Mobile-First Layout Plan

### Base design target

Design first for a 360–430 px viewport and slower mobile connections.

### Mobile content order

1. Compact header
2. Hero copy
3. Two full-width CTAs
4. Trust note
5. Hero image
6. Founder story
7. Audience cards
8. Product cards
9. Hippo Stories
10. Values and documents
11. Final CTA
12. Footer

### Mobile layout rules

- Use a single content column.
- Keep body text at least 16 px.
- Use a minimum 44 px touch target.
- Keep primary actions full-width where practical.
- Limit paragraphs to comfortable reading width.
- Avoid horizontal scrolling for core content.
- Audience cards may use a compact stacked list.
- Product cards should remain in priority order.
- Keep the hero message visible before the illustration.
- Do not load video automatically.
- Avoid sticky elements that cover content.

### Tablet plan

- Two-column audience and product grids
- Hero may become a 55/45 text-to-image split
- Stories appear in two columns
- Footer becomes two or three columns

### Desktop plan

- Maximum content width around 1200–1280 px
- Hero uses balanced two-column composition
- Audience cards use three columns
- Product section uses a featured Lobster Watch card plus three supporting cards
- Stories use up to three editorial cards
- Values use two large document panels

### Responsive priority

Content hierarchy must remain the same at every breakpoint. Desktop should add space and composition, not additional promises or essential information hidden from mobile.

---

## 6. Component List

### Global components

- PublicHeader
- DesktopNavigation
- MobileMenu
- LanguageSelector
- PublicFooter
- AnnouncementBanner
- SectionContainer
- SectionHeading
- CTAButton
- TextLink
- TrustNote
- SafetyDisclaimer

### Hero components

- HeroSection
- BilingualHeadline
- HeroCTAGroup
- HeroIllustration
- HeroTrustStrip

### Story components

- FounderStorySection
- FounderPortrait
- FounderQuote
- EditorialTextBlock
- DocumentLink

### Audience components

- AudienceGrid
- AudienceCard
- AudienceIcon

### Product components

- ProductSection
- FeaturedProductCard
- ProductCard
- ProductStatusBadge
- ProductTrustNote
- ProductJourneyFlow

### Community-story components

- HippoStoriesSection
- StoryCard
- StoryPortrait
- StoryQuote
- StoryEmptyState
- ShareStoryCTA

### Values components

- ValuesList
- ValueItem
- DocumentCard
- ManifestoCard
- ConstitutionCard

### Final conversion components

- JoinSection
- FounderClosingStatement
- FinalCTAGroup
- TestnetNotice

### Supporting content components

- DefinitionTooltip
- AccessibleAccordion
- ConsentNotice
- OfficialLinkBadge
- ComingSoonState
- ErrorState

### Component principles

- Every component must work without wallet or blockchain data.
- Copy should come from structured content, allowing bilingual versions.
- CTAs need explicit destinations and analytics names.
- Product status must be honest: Live, Prototype, Learning Preview, or Coming Soon.
- Reusable components must not inherit trading-dashboard visual language.

---

## 7. Image Asset List

## Priority A — Required for Phase 1

| Asset | Format | Recommended use |
|---|---|---|
| Primary Baby Hippo logo | SVG | Header and footer |
| Compact mascot mark | SVG | Mobile header and favicon |
| Homepage hero illustration | WebP/AVIF | Hero |
| Founder or Miaoli story image | WebP/AVIF | Our Story |
| Six audience icons | SVG | Who We Build For |
| Four product icons | SVG | Product cards |
| Manifesto illustration/icon | SVG/WebP | Values section |
| Constitution illustration/icon | SVG/WebP | Values section |
| Community horizon illustration | WebP/AVIF | Final CTA |
| Social sharing image | PNG/JPEG | Open Graph |
| Favicon and app icons | SVG/PNG | Browser and mobile |

## Priority B — Needed when stories launch

- Driver Story portrait or illustration
- Teacher Story portrait or illustration
- Rural Entrepreneur portrait or illustration
- First-Time Web3 Learner portrait or illustration
- Story placeholder frame
- Consent-approved workplace details

## Priority C — Future enrichment

- Mascot learning pose
- Mascot risk-alert pose
- Mascot community pose
- Lobster Watch product illustration
- Hippo Bank planning illustration
- Hippo Academy classroom illustration
- BHC learning badge artwork
- Road-to-blockchain section divider
- Piano-key and violin-curve decorative motifs

### Asset production rules

- Use real photos only with written permission.
- Record creator, source, consent, license, and alt text.
- Never display wallet seed phrases, private keys, or sensitive screens.
- Keep the truck parked if the mascot handles a hardware wallet.
- Produce mobile-safe crops for every wide image.
- Compress raster images and define explicit dimensions.
- Do not use luxury, casino, price-pump, or meme-coin imagery.

---

## 8. CTA Strategy

### Primary CTA

**Join Community**

This should lead to one trustworthy onboarding page explaining:

- Available community channel
- Who the community is for
- Community rules
- Scam and impersonation warning
- What information is and is not required
- How a beginner can participate without buying anything

### Secondary CTA

**Start Learning**

This should open a real beginner lesson without requiring:

- Wallet connection
- Token purchase
- Email signup before reading
- Financial disclosure

### Supporting CTAs

| CTA | Destination | Role |
|---|---|---|
| Explore Lobster Watch | Product page or dashboard | Product discovery |
| Try the DCA Planner | Hippo Bank preview | Educational planning |
| Start Your First Lesson | Academy lesson | Learning |
| Learn About BHC | BHC information | Transparency |
| Read Their Story | Story detail | Community trust |
| Share Your Story | Consent-aware form | Contribution |
| Read the Manifesto | Manifesto page | Mission |
| Read the Constitution | Constitution page | Principles |

### CTA placement

- Header: Join Community
- Hero: Join Community + Start Learning
- Product section: Product-specific actions
- Story section: Read or Share a Story
- Values section: Document links
- Final section: Join Community + Start Learning

### CTA rules

- No countdowns or fake urgency.
- No “Buy BHC” CTA.
- No wallet connection above the fold.
- No vague “Get Started” when a more specific label is possible.
- Every unavailable destination must show an honest coming-soon state.

### Measurement

Track:

- CTA location
- CTA destination
- Language
- Device class
- Successful destination load

Do not track wallet holdings, infer financial status, or combine public-homepage behavior with sensitive wallet profiles.

---

## 9. Community Growth Strategy

### Growth principle

Community growth should be based on trust, learning usefulness, and member contribution—not token price or speculative attention.

### Growth loop

```text
Founder story
    ↓
Visitor recognizes themselves
    ↓
Completes a beginner lesson
    ↓
Joins a safe community channel
    ↓
Builds one useful habit
    ↓
Shares a question, lesson, or story
    ↓
Helps the next beginner
```

### Phase 1 community programs

- Weekly beginner lesson
- Founder Road Note
- Monthly scam-awareness post
- Lobster Watch risk education example
- Story nomination form
- Community welcome session
- Driver- and teacher-friendly session times

### Audience-specific outreach

**Drivers and logistics workers**

- Short audio-friendly lessons
- Mobile-first content
- Content suitable for breaks, never while driving

**Music and arts teachers**

- Learning-through-practice themes
- Workshops connecting discipline, teaching, and digital safety

**Small businesses**

- Wallet-safety and scam-recognition education
- Plain-language digital asset basics

**Rural communities**

- Bilingual and low-bandwidth materials
- Local workshops and trusted community partners

### Hippo Stories growth engine

Stories should document:

- Background
- Challenge
- Learning journey
- Safer habits
- Future dream

Do not rank stories by portfolio value, returns, followers, or token activity.

### Trust-building mechanisms

- Public Constitution
- Official-link verification page
- Transparent product status
- Public correction log when mistakes occur
- Clear moderation rules
- Consent-based storytelling
- No seed phrase requests
- No guaranteed-return language

### Healthy community metrics

- Lessons completed
- Returning learners
- Useful questions answered
- Scam reports resolved
- Story submissions with consent
- Event attendance
- Product feedback completed
- Members who help another beginner

Avoid using token price, trading volume, or wallet value as primary community-health metrics.

---

## 10. Launch Checklist

## Founder and content

- [ ] Founder approves all English copy
- [ ] Fluent editor approves all Traditional Chinese copy
- [ ] Founder story is accurate and comfortable to publish
- [ ] All product statuses are honest
- [ ] BHC is clearly testnet-only with no promised monetary value
- [ ] Hippo Farm is excluded from core homepage products
- [ ] Manifesto and Constitution are ready for public reading
- [ ] No invented testimonials or member counts

## CTA destinations

- [ ] Join Community destination is active
- [ ] Start Learning destination contains a real lesson
- [ ] Lobster Watch link opens correctly
- [ ] Every coming-soon product is clearly labeled
- [ ] Share Your Story form includes consent information
- [ ] External community links are verified

## Visual assets

- [ ] Logo files are complete
- [ ] Hero art has desktop and mobile crops
- [ ] Founder image permission is recorded
- [ ] Story image consent is recorded
- [ ] Every image has meaningful alt text
- [ ] Social sharing image is available
- [ ] No unsafe driving or sensitive-wallet imagery

## Safety and legal

- [ ] Financial limitations are visible
- [ ] Seed phrase and impersonation warning is visible
- [ ] Privacy policy is published
- [ ] Terms are published
- [ ] Community rules are published
- [ ] Analytics collect only necessary information
- [ ] No guaranteed returns or misleading safety claims

## Accessibility

- [ ] Keyboard navigation works
- [ ] Visible focus states exist
- [ ] Color contrast meets WCAG AA
- [ ] Risk is not communicated by color alone
- [ ] Text remains readable at 200% zoom
- [ ] Reduced-motion preferences are respected
- [ ] Screen-reader heading order is logical
- [ ] Language selector is accessible

## Performance

- [ ] Hero copy renders without API calls
- [ ] Images use modern compressed formats
- [ ] Mobile image sizes are appropriate
- [ ] No autoplay video
- [ ] Fonts do not block meaningful content
- [ ] Homepage remains useful if external services fail
- [ ] Core Web Vitals are tested on mobile

## SEO and sharing

- [ ] Unique page title and description
- [ ] Open Graph title, description, and image
- [ ] Canonical URL
- [ ] Sitemap file
- [ ] Robots configuration
- [ ] Organization and website structured data
- [ ] Social links use official accounts only

## Quality assurance

- [ ] Test on iPhone-sized viewport
- [ ] Test on Android-sized viewport
- [ ] Test tablet and desktop layouts
- [ ] Test slow network conditions
- [ ] Test Traditional Chinese wrapping
- [ ] Test every CTA
- [ ] Test empty Hippo Stories state
- [ ] Test unavailable-product states
- [ ] Ask real non-technical visitors the six homepage-success questions

---

## 11. Phased Roadmap

## Phase 1 — Trusted Public Foundation

### Goal

Launch a clear, fast, credible public homepage with real destinations.

### Scope

- Public header and footer
- Hero
- Founder story
- Who We Build For
- Core products
- Hippo Stories empty state or first approved story
- Values
- Final community CTA
- Manifesto and Constitution routes
- Community onboarding page
- First Academy lesson
- Lobster Watch link
- English and reviewed Traditional Chinese copy
- Basic privacy-safe analytics
- Accessibility and mobile QA

### Phase 1 exclusions

- Member accounts
- Token-gated content
- Mainnet token promotion
- Complex animations
- Personalized homepage content
- Live market data
- Wallet connection
- Event-management system

### Completion criteria

- A visitor can explain Baby Hippo after 30 seconds.
- A visitor can join or learn without buying anything.
- All public claims are accurate.
- Mobile performance and accessibility pass launch review.

## Phase 2 — Community Proof and Learning Depth

### Goal

Turn the homepage from a project explanation into a living community publication.

### Scope

- Full Hippo Stories index and detail pages
- Consent-aware story submission workflow
- Expanded Academy learning paths
- Founder Road Notes or updates
- Event listing and workshop pages
- Better product detail pages
- Community progress reporting using truthful metrics
- Search and content filtering
- Shareable educational resources
- More mascot and editorial illustration assets

### Completion criteria

- At least three approved community stories
- At least one complete beginner learning path
- Repeat community events or learning sessions
- Published process for corrections and story consent

## Phase 3 — Community Platform and Local Expansion

### Goal

Support sustained learning, participation, and grassroots partnerships.

### Scope

- Member learning profiles
- Optional lesson progress
- Testnet BHC learning recognition
- Community contribution badges
- Local workshop toolkits
- Rural and arts-education partnerships
- Driver-friendly audio lessons
- Volunteer mentor or peer-support program
- Community impact dashboard
- Additional language support where justified
- Deeper integration between Academy, Stories, and Lobster Watch

### Boundaries

- Participation must not require token purchase.
- Rewards must not encourage risky financial behavior.
- Sensitive wallet data must not become a community-status signal.
- Community recognition should prioritize learning and helpful participation.

### Completion criteria

- Members can move from visitor to learner to contributor.
- Community programs operate beyond the founder alone.
- Growth remains consistent with the Constitution.

---

## 12. Implementation Handoff Requirements

Before code begins, prepare:

1. Approved bilingual copy document
2. Final route and URL map
3. CTA destination matrix
4. Low-fidelity mobile wireframes
5. Desktop composition wireframes
6. Component inventory
7. Image asset tracker
8. Story consent template
9. Analytics event list
10. Accessibility acceptance criteria
11. Content-owner list
12. Launch and rollback owner list

## Final Founder Approval Questions

- Does the homepage represent the complete Baby Hippo story, not only trucking?
- Do ordinary people appear before products and tokens?
- Can a beginner understand the project without knowing Web3 terms?
- Is Lobster Watch clearly the first product?
- Can someone begin without connecting a wallet?
- Are the Manifesto and Constitution easy to find?
- Are all Traditional Chinese sentences correct and natural?
- Are all CTA destinations real and safe?
- Does every story have clear consent?
- Would the founder confidently show this homepage to a driver, worker, teacher, student, small business owner, or family in Miaoli?

If the answer to any of these questions is no, the homepage is not ready to launch.
