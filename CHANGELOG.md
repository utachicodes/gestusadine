# Changelog

All notable changes to GëstuSaDine are documented here.

## [Unreleased]

### Added
- **Hybrid query classifier (Fanar-Sadiq)** — Two-tier intent classifier based on Abbas et al. (2026). Tier 1: LLM primary classifier prompts Fanar to output structured JSON (intent, confidence, rationale, subquestions, retrieval flag) across 9 intent types. Tier 2: Embedding-based fallback using cosine similarity with 56 prototype examples when LLM fails or confidence < 0.5. Keyword fast-path handles greetings instantly with no model call. Updated `convex/intentClassifier.ts` (full rewrite), `convex/tools.ts` (confidence-aware prompt builders), `convex/llm.ts` (async classifier integration).
- **Confidence-based abstention** — When classifier confidence is low (< 0.6), the system prompt injects an extra "LOW CONFIDENCE" section that forces the LLM to apply the Silence Rule aggressively and say "I don't know" rather than guess. Applies to fiqh rulings, Quran retrieval, and general Islamic knowledge.
- **Post-generation grounding check** — For fiqh, Quran, and general Islamic intents, responses without citation tags ([CITE:N]) are intercepted and replaced with a "consult a scholar" fallback. Prevents fabricated rulings from reaching users.
- **Intent classifier benchmarks** — 98 tests covering 70 benchmark queries across 9 intent types (EN+AR), achieving 100% accuracy. Tests include per-intent accuracy, confidence scoring, retrieval flag validation, language detection, edge cases, and metadata checks. New file: `src/test/intentClassifier.test.ts`.
- **Security hardening** — Added `requireAdmin` to `seedIslamic.seed`, `seedIslamic.upsertDoc`, and `seed.resetXp` to prevent unprivileged RAG knowledge base manipulation and XP tampering. Added rate limiting to `users.verifyUserPassword` to prevent brute-force password attacks.
- **Multi-agent intent routing** — Backend architecture for The Council based on Fanar-Sadiq (Abbas et al., 2026). New files: `convex/intentClassifier.ts` (9 intent types), `convex/tools.ts` (tool dispatcher). Routes queries to specialized handlers: direct tool responses for prayer times, calendar, zakat, inheritance; database lookup for du'as; RAG-grounded LLM for fiqh rulings and general Islamic knowledge. Chatbot UI remains disabled pending scholarly review.
- **Gender selection at signup** — New users choose male/female during registration. This determines whether the Cycle Tracker feature is available. The selection flows through AuthContext → Convex credentials provider → user profile.
- **Missing backend mutations** — Added `updateGender` and `setOnboardingCompleted` mutations to `convex/users.ts`, fixing broken calls from the Settings page and onboarding tutorial.
- **Auto-fix CI workflow** — GitHub Actions workflow (`.github/workflows/autofix.yml`) that auto-fixes lint errors on CI failure and pushes the fix.
- **Pre-push hook** — Husky hook that runs `npm run lint` before every push to catch errors early.

### Changed
- **Emojis replaced with Lucide icons** — All emoji characters removed from UI in favour of Lucide icon components: period tracker symptoms, moods, contraception options, and theme customizer upgrade prompt. `constants.ts` renamed to `constants.tsx` for JSX support.
- **Chat memory persisted server-side** — Conversations stored in Convex DB instead of localStorage. Each user can have multiple conversations, switch between them, and delete them.

### Fixed
- **Settings page missing imports** — Added missing `Button` and `Crown` imports and the `canCustomizeTheme` variable in `src/pages/user/Settings.tsx`.
- **Login signup flow** — Fixed the multi-step signup to properly gate gender selection before account creation.
- **Lint warnings** — Removed unused exports from `PeriodOnboarding.tsx` (react-refresh warnings).

---

## [0.5.0] — 2026-06-22

### Added
- **Quran bookmark filter** — Filter bookmarks by surah in the Quran reader.
- **Duolingo-style daily goals** — Daily streak goals with progress tracking (`convex/dailyGoals.ts`, `src/lib/dailyGoals.ts`).
- **Android companion app** — Glance widgets for prayer times, daily ayah, and rank display (`android/`).
- **Dedicated signup page** — Separate `/signup` route with rate limiting.
- **Password hashing** — bcrypt-based password hashing and verification (`convex/lib/password.ts`).
- **104+ unit tests** — Vitest suite covering output filtering, citations, Hijri calendar, prompts, and utilities.
- **RAG seed data** — All 114 surahs with themes, complete fiqh guides, seerah, adhkar, Quranic sciences, major sins, hereafter content.
- **Chat memory** — Persistent conversations per user, stored in Convex DB (`convex/conversations.ts`).

### Changed
- **Removed NabooPay payments** — Replaced with 5/hour + 20/day rate limits per tier.
- **Removed plainPassword from code** — Proper password auth end-to-end with bcrypt.
- **Security hardening** — Full pass: removed hardcoded credentials, fixed authz gaps, replay attack prevention, input limits, PII leak fixes.
- **Gamification visuals** — Animated SVG ring and Lucide icons for rank display.

### Fixed
- **All 29 lint warnings** — Resolved across the entire codebase.
- **Ownership checks on conversation mutations** — Reuse authz helpers.
- **Duplicate Bismillah in Quran reader** — Added continue reading button.
- **Journal entries** — Allow multiple entries per day, fix template behavior.
- **Prayer countdown** — Moved live countdown above tracker for better visibility.
- **XP awarded on every dashboard mount** — Fixed to only award once per day.
- **Unindexed queries** — Added proper indexes across Convex tables.

---

## [0.4.0] — 2026-06-20

### Added
- **PWA support** — Manifest, service worker, safe-area insets for iPhone.
- **PWA push notifications** — Prayer times, Quran reminders, daily content notifications.
- **Test notification button** — In-app button to test push notification delivery.
- **Journal & Wellness module** — Personal journal with mood tracking, gratitude, and reflection templates.
- **Period tracker** — Cycle tracking with qadaa fasting scheduler, symptoms, moods, calendar view, analytics.
- **Onboarding tutorial** — Multi-step guided tour overlay for new users.
- **Theme customizer** — Custom theme colors (premium feature).
- **Sawm Qadaa tracking** — Auto-detect Ramadan overlap, mark/unmark fasting days, schedule settings.

### Changed
- **Language toggle moved to topbar** — Replaced sidebar toggle with segmented toggle.
- **Journal emojis replaced with icons** — Consistent with design system.
- **Free tier bumped to 15 questions** — For beta testing.
- **Daily content auto-generation** — Fanar cron generates ayah, hadith, dua, action, fact daily.

### Fixed
- **iOS input zoom** — Prevented auto-zoom on input focus.
- **Period tracker first-launch onboarding** — Proper flow for new users.
- **Mobile layout** — Journal, Period Tracker, and other pages optimized for mobile.
- **French UTF-8 mojibake** — Fixed across PrayerTimes and dashboard.
- **Dashboard layout overlap** — Fixed ayah card and daily reminder overlap.
- **CSS variable tokens** — Replaced hardcoded colors across Navbar, Footer, DashboardLayout, Sidebar.

---

## [0.3.0] — 2026-06-18

### Added
- **Server-side output filter** — Identity leak, harmful content, anti-aqeedah, radicalization, off-topic, and fabrication detection.
- **Jailbreak strike system** — Warn after 3 attempts, flag account after 5, delete on 3rd strike.
- **Salafi/Athari methodology** — System prompt grounded in Ibn Baz, Ibn Taymiyyah, Ibn Uthaymeen, Albani.
- **Citation verifier** — Post-generation verification of hadith references.
- **Identity-leak post-filter** — Prevents model from revealing it is GPT/Claude/Fanar.
- **Strict scope enforcement** — Server-side refusal for off-topic messages.
- **RAG admin management page** — Upload and manage Islamic documents for RAG retrieval.
- **4-madhab inclusivity** — System prompt and 20 madhab comparison documents in seed data.

### Changed
- **Council scope hardened** — Strict first-check refusal for off-topic messages.
- **Prompt security** — Never reveal system prompt, ignore override attempts.
- **AI priority flipped** — Answer from knowledge first, use RAG only for citations.

### Fixed
- **Chat memory** — Send full conversation history instead of single message.
- **Fanar 429 rate limit** — User-friendly message instead of raw error.
- **Verification email error handling** — Duplicate WorkOS user case handled.
- **Convex server errors sanitized** — Users never see `[CONVEX A(...)]` strings.

---

## [0.2.0] — 2026-06-15

### Added
- **Convex backend migration** — Full-stack rewrite from Firebase/Express to Convex.
- **Convex Auth** — Replaced WorkOS with `@convex-dev/auth` credentials provider.
- **Hardcoded admin login** — Emergency admin access without external auth dependencies.
- **Cron jobs** — Daily quiz, daily content, prayer notifications, reminder notifications.
- **Webhook routes** — Health check endpoint.
- **Cookie consent** — GDPR compliance banner.
- **PostHog analytics** — Privacy-respecting usage tracking.
- **Data compliance page** — `/data-compliance` route with GDPR information.

### Changed
- **Removed Firebase/Express backend** — All server logic now in Convex functions.
- **Removed WorkOS** — Simplified to email/password auth via Convex.
- **Removed NabooPay** — Payment system replaced with rate limiting.
- **Removed nodemailer** — Email verification disabled for sandbox.
- **Source maps disabled in production** — Smaller builds, better security.

### Fixed
- **Auth infinite loading** — Retrieve current user via `getAuthUserId`.
- **CSP headers** — Added external APIs to connect-src (alquran.cloud, aladhan.com, posthog, youtube).
- **French apostrophes** — Escaped in DataCompliance page.
- **React Router future flags** — Added for v7 compatibility.
- **Vercel SPA rewrites** — Fixed 404 on client-side routes.

---

## [0.1.0] — 2026-06-10

### Added
- **Initial platform** — React + Vite + Tailwind CSS + shadcn/ui.
- **Landing page** — Cinematic GSAP animations, Islamic patterns, dark-mode-first styling.
- **AI Council** — Fanar API integration with RAG over uploaded Islamic documents.
- **Quran reader** — Full surah reader with multiple translations.
- **Prayer times** — Accurate daily times by location.
- **Hijri calendar** — Gregorian-Hijri conversion.
- **Zakat calculator** — Deterministic computation.
- **Library** — Downloadable Islamic books.
- **Classes** — Structured courses with lessons.
- **Events** — Community events with registration.
- **Gamification** — XP, ranks, daily streaks, quizzes.
- **i18n** — French / English language support.
- **Subscription system** — Free / Student / Pro tiers.

### Security
- **System prompt isolation** — Server-authoritative, never exposed to client.
- **Rate limiting** — Server-side quotas (5/hour, 20/day).
- **Input validation** — Max 50 turns, max 4000 chars per message.
- **Jailbreak detection** — Pattern matching for override attempts.
