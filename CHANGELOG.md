# Changelog

All notable changes to GëstuSaDine are documented here.

## [Unreleased]

### Added
- **Chat memory** — Conversations are now persisted server-side via Convex. Each user can have multiple conversations, switch between them, and delete them. A sidebar lists all past conversations with timestamps.
  - New Convex table: `conversations` and `messages` (schema already existed, now wired up)
  - New Convex module: `convex/conversations.ts` — list, create, message, delete
  - `ChatInterface` rewritten: conversation sidebar, new/switch/delete conversations, messages stored in Convex DB

### Fixed
- **Lint errors** — Resolved all 3 CI-blocking errors:
  - `src/components/landing/EcosystemGrid.tsx`: Replaced Unicode curly quotes (`'` `'`) used as JS string delimiters with backtick template literals for French strings containing apostrophes
  - `src/components/landing/FeatureGrid.tsx`: Same curly-quote fix across all affected string literals
  - `src/test/utils.test.ts`: Fixed `no-constant-binary-expression` lint error by extracting `false` into a named variable (`showHidden`)

### Changed
- Removed localStorage-based chat history (`STORAGE_KEY = 'GëstuSaDine_chat_history'`). All chat data now lives in the Convex database, tied to the authenticated user.
