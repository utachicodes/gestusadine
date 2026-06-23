# Changelog

All notable changes to GëstuSaDine are documented here.

## [Unreleased]

### Added
- **Chat memory** — Conversations are now persisted server-side via Convex. Each user can have multiple conversations, switch between them, and delete them. A sidebar lists all past conversations with timestamps.
  - New Convex table: `conversations` and `messages` (schema already existed, now wired up)
  - New Convex module: `convex/conversations.ts` — list, create, message, delete
  - `ChatInterface` rewritten: conversation sidebar, new/switch/delete conversations, messages stored in Convex DB
- **Gender selection at signup** — New users choose male/female during registration. This determines whether the Cycle Tracker feature is available. The selection flows through AuthContext → Convex credentials provider → user profile.
- **Missing backend mutations** — Added `updateGender` and `setOnboardingCompleted` mutations to `convex/users.ts`, fixing broken calls from the Settings page and onboarding tutorial.

### Changed
- Removed localStorage-based chat history (`STORAGE_KEY = 'GëstuSaDine_chat_history'`). All chat data now lives in the Convex database, tied to the authenticated user.
- **Emojis replaced with Lucide icons** — All emoji characters removed from UI in favour of Lucide icon components: period tracker symptoms, moods, contraception options, and theme customizer upgrade prompt.
- **AI chatbot temporarily disabled** — The Council displays an unavailability notice ("The Council is Currently Unavailable") with an expandable "Read more" section explaining that the model is under scholarly review for authenticity verification.

### Fixed
- **Lint errors** — Resolved all 3 CI-blocking errors:
  - `src/components/landing/EcosystemGrid.tsx`: Replaced Unicode curly quotes (`'` `'`) used as JS string delimiters with backtick template literals for French strings containing apostrophes
  - `src/components/landing/FeatureGrid.tsx`: Same curly-quote fix across all affected string literals
  - `src/test/utils.test.ts`: Fixed `no-constant-binary-expression` lint error by extracting `false` into a named variable (`showHidden`)
- **Settings page missing imports** — Added missing `Button` and `Crown` imports and the `canCustomizeTheme` variable in `src/pages/user/Settings.tsx`.
- **Login signup flow** — Fixed the multi-step signup to properly gate gender selection before account creation.
