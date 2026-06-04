# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

**GëstuSaDine** is a full-stack Islamic knowledge platform combining multi-agent AI consensus with e-commerce, education, and community features. The target market is West Africa (currency: XOF).

**Architecture:** React SPA → **Convex** (auth, database, serverless functions, vector search, file storage).

**Production deployment:** `elegant-schnauzer-786` at `https://elegant-schnauzer-786.convex.cloud`
**HTTP actions URL:** `https://elegant-schnauzer-786.convex.site`

## Development Commands

```bash
npm run dev:full        # Run frontend + Convex together
npm run dev:frontend    # Vite dev server on port 3000
npm run dev:convex      # npx convex dev (watch convex/ functions)
npm run build           # Production build (Vite only)

npx convex deploy       # Deploy convex/ functions to production
npx convex env set      # Set env vars on production

npm run lint
npm test                # Vitest
```

## Architecture

### Frontend (`/src`)

React 18 + TypeScript + Vite SPA. App entry: `src/main.tsx` → `src/App.tsx`.

**Full provider chain (outermost → innermost):**
`ConvexAuthProvider (main.tsx) → ErrorBoundary → AuthProvider → QueryClientProvider → ThemeProvider → TooltipProvider → Toaster + Sonner → LanguageProvider → CartProvider → BrowserRouter → Routes`

**Auth flow:**
- `ConvexAuthProvider` (in `main.tsx`) handles JWT/session management (uses Convex Auth with Password provider)
- `AuthProvider` (in `src/auth/AuthContext.tsx`) wraps Convex Auth hooks into a stable `useAuth()` API consumed by 12+ components
- `AuthProvider` includes **stale token detection** — when JWT key rotation causes auth to fail, it auto-signs-out to break the infinite WebSocket reconnect loop
- `convex/auth.ts` auto-detects admins via `ADMIN_EMAILS` env var in `createOrUpdateUser` callback
- `convex/http.ts` must include `auth.addHttpRoutes(http)` for auth provider discovery (`/.well-known/openid-configuration`) to work

**Routing** uses React Router v6 with:
- `AppShell` — public pages (navbar + footer)
- `DashboardLayout` — authenticated pages (sidebar + nav)
- `ProtectedRoute` — guards authenticated + admin-only routes
- `PublicRoute` — prevents authenticated users from seeing login page

**State management:**
- Auth: Convex Auth + `AuthContext`
- Theme: `ThemeContext` (persisted to localStorage)
- i18n: `LanguageContext` (FR/EN/AR translations in `src/data/translations.ts`)
- Server state: Convex `useQuery`/`useMutation` hooks (reactive — DB changes auto-update UI)

### Convex Backend (`convex/`)

All backend logic lives in `convex/`:

| Path | Purpose |
|------|---------|
| `convex/schema.ts` | All tables, indexes, vector index for RAG |
| `convex/auth.ts` | Convex Auth (Password provider, admin detection via ADMIN_EMAILS) |
| `convex/auth.config.ts` | Empty provider config file (required by Convex Auth) |
| `convex/http.ts` | HTTP routes: NabooPay webhook + `auth.addHttpRoutes(http)` |
| `convex/users.ts` | User queries/mutations (currentUser, updateProfile, setRole, updateSubscriptionTier) |
| `convex/products.ts` | Shop CRUD |
| `convex/events.ts` | Events CRUD + registration |
| `convex/videos.ts` | Video CRUD + progress tracking |
| `convex/library.ts` | Library book CRUD |
| `convex/daily.ts` | Daily content (ayah/hadith/dua/fact) |
| `convex/podcasts.ts` | Podcast CRUD |
| `convex/classes.ts` | Classes CRUD |
| `convex/community.ts` | Community/circle features |
| `convex/gamification.ts` | XP system, rank computation, leaderboard, daily streak |
| `convex/quizzes.ts` | Daily quiz CRUD + submitAnswer with XP rewards |
| `convex/subscription.ts` | Server-side tier enforcement + `effectiveTier()` helper |
| `convex/naboopay.ts` | NabooPay payment checkout + webhook confirmation |
| `convex/rag.ts` | RAG document management (upload, search, chunk) |
| `convex/ragInternal.ts` | Internal RAG operations (chunking, vector storing) |
| `convex/llm.ts` | Chat action that calls Fanar API + searches RAG |
| `convex/rateLimiter.ts` | Rate limit definitions (failedLogins, signUp, council, chat) |
| `convex/seed.ts` | Admin user seeding |
| `convex/stats.ts` | Platform statistics |
| `convex/authz.ts` | Authorization helpers |

### Key Backend Patterns

**Subscription/tier system:**
- Users have a `subscriptionTier` field: `free` | `student` | `institution`
- `convex/subscription.ts` provides `effectiveTier()` — admins always act as `institution` tier
- `useQuery(api.users.currentUser)` in `AuthContext.tsx` is **reactive** — when a NabooPay webhook updates the DB, the UI reflects the tier change immediately (no re-login needed)
- "Join the circle" button on Pricing page calls `naboopay.createCheckoutSession` action

**Gamification:**
- `convex/gamification.ts`: XP tracking, rank computation, leaderboard, daily streak
- Ranks: Talib (0) → Murid (100) → Bahith (500) → Alim (1000) → Faqih (2500)
- XP earned from quiz answers, daily content, etc.

**Daily quizzes:**
- `convex/quizzes.ts`: CRUD for admin, `submitAnswer` grants XP
- `submitAnswer` mutation checks if already answered today

**Chatbot:**
- `convex/llm.ts`: Action that:
  1. Searches RAG for relevant Islamic content
  2. Calls Fanar API (OpenAI-compatible, base URL: `https://api.fanar.qa/v1`)
  3. Streams response back via Convex mutation
- System prompts follow strict methodology: hierarchy of evidence (Quran → Sahih Hadith → Scholarly Consensus), "I don't know" rule, citation protocol, empathy-first tone, unnamed Salafi theology, madhab respect, disclaimer

**NabooPay integration:**
- `naboopay.createCheckoutSession`: Creates payment link for Wave/Orange Money (XOF)
- `convex/http.ts`: Webhook handler at `/naboopay-webhook` processes payment confirmations and updates subscription tier
- No `nodemailer` dependency (was removed to fix Vercel build peer dep conflict with `@auth/core`)

## Key Files

| Path | Purpose |
|------|---------|
| `convex/auth.ts` | Convex Auth config (Password, session, admin detection) |
| `convex/schema.ts` | Full database schema (all tables) |
| `convex/http.ts` | HTTP routes (webhook + auth.addHttpRoutes) |
| `convex/naboopay.ts` | NabooPay payment + webhook |
| `convex/gamification.ts` | XP, ranks, leaderboard, streaks |
| `convex/quizzes.ts` | Daily quiz CRUD + submission |
| `convex/subscription.ts` | Tier enforcement + effectiveTier helper |
| `convex/llm.ts` | Chat action (Fanar API + RAG search) |
| `convex/_generated/api.d.ts` | Auto-generated Convex API types |
| `src/main.tsx` | App entry (ConvexAuthProvider wraps App) |
| `src/auth/AuthContext.tsx` | Auth context (Convex Auth-backed + stale token detection) |
| `src/auth/rbac.ts` | Role/permission model |
| `src/App.tsx` | Route definitions |
| `vite.config.ts` | Frontend build config (sourcemap disabled in prod) |
| `src/components/chat/ChatInterface.tsx` | Chatbot with full methodology system prompts |

## Environment Variables

All env vars are set via `npx convex env set <NAME> <VALUE>` on the production deployment.

| Variable | Required | Description |
|----------|----------|-------------|
| `VITE_CONVEX_URL` | Yes (Vercel) | Convex deployment URL: `https://elegant-schnauzer-786.convex.cloud` |
| `AUTH_SECRET` | Yes | Convex Auth secret |
| `JWT_PRIVATE_KEY` | Yes | RSA private key for JWT signing (must set alongside `JWKS`) |
| `JWKS` | Yes | JWKS key set (required by Convex Auth for token verification) |
| `ADMIN_EMAILS` | Yes | Comma-separated admin emails |
| `FANAR_API_KEY` | Yes | Fanar API key for AI chat |
| `NABOOPAY_API_KEY` | Yes | NabooPay API key for payments |
| `NABOOPAY_WEBHOOK_SECRET` | Yes | NabooPay webhook signing secret |

## Important Behaviors

- **Auth sign-in fix:** Requires BOTH `auth.addHttpRoutes(http)` in `convex/http.ts` AND `JWT_PRIVATE_KEY` + `JWKS` env vars. Missing `auth.addHttpRoutes` causes `/.well-known/openid-configuration` to return 404, which prevents auth provider discovery and breaks the WebSocket.
- **Source maps** are disabled in production (`build.sourcemap: mode !== "production"` in `vite.config.ts`) to hide source code from DevTools.
- **nodemailer** overridden to `6.10.1` in `package.json` (peer dep conflict with `@auth/core` on Vercel).
- **Admin seeding:** `Password12345!` (run `npx convex run seed`).
- **Ranks:** Talib (0) → Murid (100) → Bahith (500) → Alim (1000) → Faqih (2500).
- **Stale token detection:** `AuthContext.tsx` auto-calls `convexSignOut()` when `isAuthenticated` drops from `true` to `false` (breaks infinite WebSocket reconnect loop after JWT key rotation).
