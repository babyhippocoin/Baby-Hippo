# Baby Hippo Engineering Backlog

**Version:** 1.0  
**Last Updated:** June 27, 2026  
**Engineering Director:** AI Engineering Director  
**Status:** Active Development Backlog  
**Current Sprint:** Sprint 001 (June 28 - July 11, 2026)

---

## Sprint 001: Trust Foundation (Weeks 1-2)

### Bundle B001: Character Encoding Foundation

#### BH-T001 - Fix Site Title Encoding Corruption
**Sprint:** 001  
**Bundle:** B001  
**Priority:** P0  
**Description:** Replace ?? characters in site title "Baby Hippo ??From Worker To On-Chain Boss" with proper UTF-8 encoding  
**User Value:** Site appears professional and trustworthy instead of broken/hacked  
**Estimated Time:** 45 minutes  
**Dependencies:** None  
**Status:** Ready  

#### BH-T002 - Repair Chinese Navigation Text
**Sprint:** 001  
**Bundle:** B001  
**Priority:** P0  
**Description:** Fix ??? characters in navigation menu to display proper Chinese text  
**User Value:** Chinese users can actually read and use navigation  
**Estimated Time:** 90 minutes  
**Dependencies:** BH-T001  
**Status:** Planned  

#### BH-T003 - Audit All Chinese Content for Encoding Issues
**Sprint:** 001  
**Bundle:** B001  
**Priority:** P0  
**Description:** Systematic review and fix of all Chinese text corruption throughout site  
**User Value:** Complete Chinese interface functionality restored  
**Estimated Time:** 120 minutes  
**Dependencies:** BH-T002  
**Status:** Planned  

### Bundle B002: Language System Reliability

#### BH-T004 - Fix Language Toggle Consistency
**Sprint:** 001  
**Bundle:** B002  
**Priority:** P0  
**Description:** Ensure language switcher works reliably across all pages and persists user choice  
**User Value:** Users can dependably access content in preferred language  
**Estimated Time:** 90 minutes  
**Dependencies:** BH-T003  
**Status:** Planned  

#### BH-T005 - Separate Mixed Language Content
**Sprint:** 001  
**Bundle:** B002  
**Priority:** P0  
**Description:** Remove mixed Chinese/English content from same sections to eliminate confusion  
**User Value:** Clear language experience without confusion about target audience  
**Estimated Time:** 75 minutes  
**Dependencies:** BH-T004  
**Status:** Planned  

### Bundle B003: Homepage Trust Building

#### BH-T006 - Rewrite Homepage Value Proposition
**Sprint:** 001  
**Bundle:** B003  
**Priority:** P0  
**Description:** Clarify hero section to explain what Baby Hippo does within 10 seconds  
**User Value:** Visitors understand purpose instead of bouncing confused  
**Estimated Time:** 90 minutes  
**Dependencies:** BH-T005  
**Status:** Planned  

#### BH-T007 - Simplify Primary CTA Strategy
**Sprint:** 001  
**Bundle:** B003  
**Priority:** P0  
**Description:** Reduce competing CTAs to one clear primary action per section  
**User Value:** Users know exactly what to do next instead of decision paralysis  
**Estimated Time:** 60 minutes  
**Dependencies:** BH-T006  
**Status:** Planned  

#### BH-T008 - Add Trust Indicators to Homepage
**Sprint:** 001  
**Bundle:** B003  
**Priority:** P0  
**Description:** Include founder story visibility, education-first messaging, explicit anti-scam promises  
**User Value:** Users trust Baby Hippo instead of assuming crypto scam  
**Estimated Time:** 75 minutes  
**Dependencies:** BH-T007  
**Status:** Planned  

---

## Sprint 002: User Experience Completion (Weeks 3-4)

### Bundle B004: Mobile Experience Repair

#### BH-T009 - Fix Mobile Navigation Collisions
**Sprint:** 002  
**Bundle:** B004  
**Priority:** P1  
**Description:** Resolve back link and page eyebrow text overlap on mobile devices  
**User Value:** Mobile users can navigate properly without UI conflicts  
**Estimated Time:** 75 minutes  
**Dependencies:** BH-T002  
**Status:** Planned  

#### BH-T010 - Optimize Mobile Touch Targets
**Sprint:** 002  
**Bundle:** B004  
**Priority:** P1  
**Description:** Ensure all buttons and links meet 44px minimum touch target size  
**User Value:** Mobile users can reliably interact with interface elements  
**Estimated Time:** 90 minutes  
**Dependencies:** BH-T009  
**Status:** Planned  

#### BH-T011 - Simplify Mobile Navigation Menu
**Sprint:** 002  
**Bundle:** B004  
**Priority:** P1  
**Description:** Reduce navigation items from 8+ to 4-5 core items for mobile usability  
**User Value:** Mobile navigation is manageable instead of overwhelming  
**Estimated Time:** 60 minutes  
**Dependencies:** BH-T010  
**Status:** Planned  

### Bundle B005: Product Clarity Enhancement

#### BH-T012 - Improve Lobster Watch Explanation
**Sprint:** 002  
**Bundle:** B005  
**Priority:** P1  
**Description:** Rewrite Lobster Watch description to be immediately understandable to beginners  
**User Value:** Users understand core product purpose and benefits  
**Estimated Time:** 90 minutes  
**Dependencies:** BH-T008  
**Status:** Planned  

#### BH-T013 - Clarify DCA Education Flow
**Sprint:** 002  
**Bundle:** B005  
**Priority:** P1  
**Description:** Create clear step-by-step progression through DCA learning with obvious next actions  
**User Value:** Users successfully complete educational journey instead of getting lost  
**Estimated Time:** 120 minutes  
**Dependencies:** BH-T012  
**Status:** Planned  

#### BH-T014 - Explain BHC Points System Clearly
**Sprint:** 002  
**Bundle:** B005  
**Priority:** P1  
**Description:** Clarify that BHC Points are educational achievements, not cryptocurrency or investment  
**User Value:** Users understand motivation system without speculation confusion  
**Estimated Time:** 45 minutes  
**Dependencies:** BH-T013  
**Status:** Planned  

### Bundle B006: Visual Professionalism

#### BH-T015 - Standardize Typography System
**Sprint:** 002  
**Bundle:** B006  
**Priority:** P1  
**Description:** Create consistent font sizes, weights, and spacing throughout all components  
**User Value:** Site appears professional and cohesive instead of amateur  
**Estimated Time:** 120 minutes  
**Dependencies:** BH-T011  
**Status:** Planned  

#### BH-T016 - Fix Component Visual Consistency
**Sprint:** 002  
**Bundle:** B006  
**Priority:** P1  
**Description:** Standardize card styling, button appearance, and layout patterns  
**User Value:** Professional design builds credibility and trust  
**Estimated Time:** 90 minutes  
**Dependencies:** BH-T015  
**Status:** Planned  

#### BH-T017 - Improve Chinese Font Loading
**Sprint:** 002  
**Bundle:** B006  
**Priority:** P1  
**Description:** Ensure proper Chinese font loading and rendering across all devices  
**User Value:** Consistent readable Chinese text regardless of user device  
**Estimated Time:** 60 minutes  
**Dependencies:** BH-T003  
**Status:** Planned  

---

## Sprint 003: Infrastructure Foundation (Weeks 5-6)

### Bundle B007: Error Handling Infrastructure

#### BH-T018 - Implement React Error Boundaries
**Sprint:** 003  
**Bundle:** B007  
**Priority:** P2  
**Description:** Add error boundaries to prevent JavaScript crashes from breaking entire app  
**User Value:** App remains functional when errors occur instead of white screen crash  
**Estimated Time:** 75 minutes  
**Dependencies:** BH-T008  
**Status:** Planned  

#### BH-T019 - Create User-Friendly Error Messages
**Sprint:** 003  
**Bundle:** B007  
**Priority:** P2  
**Description:** Replace technical error messages with helpful guidance for users  
**User Value:** Users get helpful guidance instead of confusing technical errors  
**Estimated Time:** 45 minutes  
**Dependencies:** BH-T018  
**Status:** Planned  

#### BH-T020 - Add Loading States for Async Operations
**Sprint:** 003  
**Bundle:** B007  
**Priority:** P2  
**Description:** Implement loading indicators for all data fetching and async operations  
**User Value:** Users understand app is working vs. broken during operations  
**Estimated Time:** 90 minutes  
**Dependencies:** BH-T019  
**Status:** Planned  

### Bundle B008: Educational Flow Optimization

#### BH-T021 - Streamline Learning Path Navigation
**Sprint:** 003  
**Bundle:** B008  
**Priority:** P2  
**Description:** Create clear progress indicators and next-step guidance through education modules  
**User Value:** Users complete educational journey with clear sense of progress  
**Estimated Time:** 105 minutes  
**Dependencies:** BH-T014  
**Status:** Planned  

#### BH-T022 - Implement Progress Tracking System
**Sprint:** 003  
**Bundle:** B008  
**Priority:** P2  
**Description:** Add user progress tracking through educational modules with local storage  
**User Value:** Users see advancement and can resume learning where they left off  
**Estimated Time:** 120 minutes  
**Dependencies:** BH-T021  
**Status:** Planned  

#### BH-T023 - Add Knowledge Comprehension Checkpoints
**Sprint:** 003  
**Bundle:** B008  
**Priority:** P2  
**Description:** Create simple knowledge checks to ensure understanding before progression  
**User Value:** Users gain confidence in learning and avoid advancing before ready  
**Estimated Time:** 90 minutes  
**Dependencies:** BH-T022  
**Status:** Planned  

### Bundle B009: Founder Dashboard Separation

#### BH-T024 - Implement Access Control for Founder Features
**Sprint:** 003  
**Bundle:** B009  
**Priority:** P2  
**Description:** Hide founder-specific dashboard features from regular user interface  
**User Value:** Users see clean, focused interface appropriate for their role  
**Estimated Time:** 45 minutes  
**Dependencies:** None  
**Status:** Planned  

#### BH-T025 - Create Proper Route Protection
**Sprint:** 003  
**Bundle:** B009  
**Priority:** P2  
**Description:** Ensure founder dashboard routes require proper authentication/authorization  
**User Value:** Clean separation between user and administrative interfaces  
**Estimated Time:** 60 minutes  
**Dependencies:** BH-T024  
**Status:** Planned  

---

## Sprint 004: Performance and Polish (Weeks 7-8)

### Bundle B010: Performance Foundation

#### BH-T026 - Implement Performance Monitoring
**Sprint:** 004  
**Bundle:** B010  
**Priority:** P2  
**Description:** Add basic performance monitoring and Core Web Vitals tracking  
**User Value:** Faster, more reliable site performance through data-driven optimization  
**Estimated Time:** 90 minutes  
**Dependencies:** BH-T020  
**Status:** Planned  

#### BH-T027 - Optimize Image Loading and Compression
**Sprint:** 004  
**Bundle:** B010  
**Priority:** P2  
**Description:** Implement Next.js image optimization and proper image compression  
**User Value:** Faster page loads especially on mobile and slower connections  
**Estimated Time:** 75 minutes  
**Dependencies:** BH-T026  
**Status:** Planned  

#### BH-T028 - Improve Bundle Size and Loading
**Sprint:** 004  
**Bundle:** B010  
**Priority:** P2  
**Description:** Analyze and optimize JavaScript bundle sizes for faster initial loading  
**User Value:** Quicker first-time site loading creates better first impression  
**Estimated Time:** 105 minutes  
**Dependencies:** BH-T027  
**Status:** Planned  

### Bundle B011: Security Hardening

#### BH-T029 - Add Security Headers Configuration
**Sprint:** 004  
**Bundle:** B011  
**Priority:** P3  
**Description:** Implement CSP, HSTS, and other security headers for basic protection  
**User Value:** Users protected from common web vulnerabilities and attacks  
**Estimated Time:** 60 minutes  
**Dependencies:** BH-T018  
**Status:** Planned  

#### BH-T030 - Implement Input Validation Framework
**Sprint:** 004  
**Bundle:** B011  
**Priority:** P3  
**Description:** Add comprehensive input validation and sanitization for user inputs  
**User Value:** Protection against malicious input and improved data quality  
**Estimated Time:** 90 minutes  
**Dependencies:** BH-T029  
**Status:** Planned  

#### BH-T031 - Add Rate Limiting Protection
**Sprint:** 004  
**Bundle:** B011  
**Priority:** P3  
**Description:** Implement basic rate limiting to prevent abuse and spam  
**User Value:** Site remains available and responsive under potential attack  
**Estimated Time:** 75 minutes  
**Dependencies:** BH-T030  
**Status:** Planned  

---

## Sprint 005: Feature Enhancement (Weeks 9-12)

### Bundle B012: Lobster Watch Enhancement

#### BH-T032 - Enhanced Habit Tracking Interface
**Sprint:** 005  
**Bundle:** B012  
**Priority:** P3  
**Description:** Improve Lobster Watch UI with better progress visualization and motivation  
**User Value:** More engaging and effective habit formation tools  
**Estimated Time:** 150 minutes  
**Dependencies:** BH-T023  
**Status:** Planned  

#### BH-T033 - Add Portfolio Risk Monitoring (Read-Only)
**Sprint:** 005  
**Bundle:** B012  
**Priority:** P3  
**Description:** Implement read-only portfolio monitoring with basic risk assessment  
**User Value:** Users gain insights into portfolio health without giving up custody  
**Estimated Time:** 180 minutes  
**Dependencies:** BH-T032  
**Status:** Planned  

#### BH-T034 - Implement DCA Reminder System
**Sprint:** 005  
**Bundle:** B012  
**Priority:** P3  
**Description:** Add intelligent DCA reminders with user schedule customization  
**User Value:** Consistent investment habits through gentle, respectful reminders  
**Estimated Time:** 120 minutes  
**Dependencies:** BH-T033  
**Status:** Planned  

#### BH-T035 - Create Community Sharing Features
**Sprint:** 005  
**Bundle:** B012  
**Priority:** P3  
**Description:** Allow users to share educational progress and achievements with community  
**User Value:** Motivation through community recognition and peer support  
**Estimated Time:** 105 minutes  
**Dependencies:** BH-T025  
**Status:** Planned  

---

## Founder Dashboard Summary

### Sprint 001 Progress
**Overall Status:** Not Started (Sprint begins June 28, 2026)  
**Critical Path:** B001 → B002 → B003 (Character encoding → Language system → Homepage trust)  
**Estimated Completion:** July 11, 2026 (2 weeks)  
**Success Criteria:** Site appears professional, Chinese users can navigate, visitors understand value proposition  

### Ready Tasks (Can Start Immediately)
- **BH-T001:** Fix Site Title Encoding Corruption (45 min, P0)
- **BH-T024:** Implement Access Control for Founder Features (45 min, P2)

### Blocked Tasks
**None Currently** - All task dependencies are internal and sequential

### Next Recommended Task
**BH-T001: Fix Site Title Encoding Corruption**

**Rationale:**
- **Highest visible impact** - Site title is first thing every user sees
- **Foundation for other fixes** - Establishes encoding solution pattern for all subsequent character fixes
- **Quick implementation** - Can be completed in 45 minutes with immediate visible results
- **Zero dependencies** - Can start immediately without waiting for other work
- **Critical trust impact** - Corrupted title makes site appear compromised/unprofessional

### Estimated Codex Cost
**Sprint 001 Bundle B001 (Tasks T001-T003):**
- **Total Implementation Time:** 255 minutes (4.25 hours)
- **Estimated AI Cost:** $85-120 (based on complexity and iteration requirements)
- **Review Time Required:** 2-3 hours (includes founder approval for encoding fixes)

**Single Task Recommendation (BH-T001):**
- **Implementation Time:** 45 minutes
- **Estimated AI Cost:** $15-25
- **Review Time:** 30 minutes
- **Risk:** Low (isolated change with clear success criteria)

### Estimated Review Time
**Per Task Average:** 30-45 minutes founder review  
**Bundle B001 Total:** 2 hours founder review (encoding pattern verification)  
**Critical Path Items:** All B001-B003 tasks require founder approval due to user-facing content changes

### Implementation Efficiency Recommendation
**Start with BH-T001** to establish encoding fix pattern, then bundle remaining B001 tasks (T002-T003) for efficient implementation in single Codex session. This approach minimizes AI cost while maximizing progress on critical trust-building foundation.

---

## Engineering Status Dashboard

### Current Sprint Velocity
**Planned:** 8 tasks in Sprint 001  
**Estimated Total Time:** 645 minutes (10.75 hours)  
**Average Task Size:** 80 minutes  
**Bundle Completion Rate:** 3 bundles planned for Sprint 001

### Risk Assessment
**Low Risk Tasks:** 5 (T001, T007, T008, T014, T024)  
**Medium Risk Tasks:** 3 (T002, T004, T006)  
**High Risk Tasks:** 0  
**Blocked Tasks:** 0  

### Resource Allocation
**Codex Implementation:** 80% of engineering time  
**Founder Review:** 15% of engineering time  
**Quality Assurance:** 5% of engineering time  

### Success Tracking
**P0 Tasks:** 8 (Must complete for basic user trust)  
**P1 Tasks:** 9 (Should complete for user experience quality)  
**P2 Tasks:** 8 (Nice to have for infrastructure foundation)  
**P3 Tasks:** 10 (Future enhancement when core experience is solid)

**Total Engineering Backlog:** 35 tasks across 5 sprints  
**Estimated Total Implementation:** 60-80 hours over 12 weeks