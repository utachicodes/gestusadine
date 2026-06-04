# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

**GëstuSaDine** is a full-stack Islamic knowledge platform combining multi-agent AI consensus with e-commerce, education, and community features. The target market is West Africa (currency: XOF).

**Architecture:** React SPA → **Convex** (auth, database, serverless functions, vector search, file storage). Express backend being retired.

## Development Commands

```bash
# Run frontend + Convex together
npm run dev:full

# Run individually
npm run dev:frontend      # Vite dev server on port 3000
npm run dev:convex         # npx convex dev (watch convex/ functions)

# Build
npm run build              # Production build (Vite only)

# Lint & test
npm run lint
npm test                   # Vitest
```

## Architecture

### Frontend (`/src`)

React 18 + TypeScript + Vite SPA. App entry: `src/main.tsx` → `src/App.tsx`.

**Provider nesting order (outermost first):**
`ConvexAuthProvider → App → ErrorBoundary → AuthProvider → QueryClientProvider → ThemeProvider → TooltipProvider → LanguageProvider → CartProvider → BrowserRouter`

**ConvexAuthProvider** (in `main.tsx`) handles JWT/session management.
**AuthProvider** (in `src/auth/AuthContext.tsx`) wraps Convex Auth hooks into a stable `useAuth()` API consumed by 12+ components.

**Routing** uses React Router v6 with two layout wrappers:
- `AppShell` — public pages (navbar + footer)
- `DashboardLayout` — authenticated pages (sidebar + nav)
- `ProtectedRoute` — guards authenticated + admin-only routes

**State management:**
- Auth: Convex Auth → `AuthContext` (`src/auth/AuthContext.tsx`)
- Theme: `ThemeContext` (persisted to localStorage)
- i18n: `LanguageContext` (translations in `src/data/`)
- Server state: Convex `useQuery`/`useMutation` hooks + TanStack React Query

**API calls:** Use Convex hooks (`useQuery(api.module.fn)`, `useMutation(api.module.fn)`) directly. The old `apiFetch()` is deprecated.

### Convex Backend (`convex/`)

All backend logic lives in `convex/`:

| Path | Purpose |
|------|---------|
| `convex/schema.ts` | All tables, indexes, vector index for RAG |
| `convex/auth.ts` | Convex Auth (Password provider, session config, admin detection) |
| `convex/users.ts` | User queries/mutations (currentUser, updateProfile, setRole) |
| `convex/products.ts` | Shop CRUD |
| `convex/events.ts` | Events CRUD + registration |
| `convex/videos.ts` | Video CRUD + progress tracking |
| `convex/library.ts` | Library book CRUD |
| `convex/daily.ts` | Daily content (ayah/hadith/dua/fact) |
| `convex/rateLimiter.ts` | Rate limit definitions (failedLogins, signUp, council, chat) |
| `convex/seed.ts` | Admin user seeding |

**Key Convex features:**
- **Convex Auth** with Password provider, 7-day session expiry, 24hr inactivity timeout
- **Rate limiter** component (10 failed logins/hour, 5 sign-ups/minute, 20 council asks/min)
- **Vector index** on `ragChunks.embedding` (1536 dimensions, OpenAI) with category filter
- **Admin auto-detection** via `ADMIN_EMAILS` env var in `auth.ts`'s `createOrUpdateUser` callback
- **Row-level security** available via `convex-helpers` (wrap db access with authz checks)

### The LLM Council (Core Feature — To Be Migrated)

The platform's main AI feature lives in `backend/` and needs migration to Convex actions:
- 4 agents (Fiqh, Aqeedah, Context, Humility) + synthesis engine
- RAG document search via vector index
- Fanar API calls via Convex actions (key server-side only)

## Provider Nesting in src/App.tsx

```
ErrorBoundary
  → AuthProvider (Convex Auth-backed, same useAuth() API)
    → QueryClientProvider
      → ThemeProvider
        → TooltipProvider
          → Toaster + Sonner
            → LanguageProvider
              → CartProvider
                → BrowserRouter
```

## Key Files

| Path | Purpose |
|------|---------|
| `convex/auth.ts` | Convex Auth config (Password, session, admin detection) |
| `convex/schema.ts` | Full database schema (all tables) |
| `convex/_generated/api.d.ts` | Auto-generated Convex API types |
| `src/main.tsx` | App entry (ConvexAuthProvider wraps App) |
| `src/auth/AuthContext.tsx` | Auth context (Convex Auth-backed, stable useAuth() API) |
| `src/auth/rbac.ts` | Role/permission model |
| `src/App.tsx` | Route definitions |
| `vite.config.ts` | Frontend build config (no Express proxy) |

## Environment

Copy `.env.example` to `.env`. Required variables:
- `VITE_CONVEX_URL` — Convex deployment URL
- `ADMIN_EMAILS` — comma-separated admin emails (set via `npx convex env set`)
- `AUTH_SECRET` — Convex Auth secret (set via `npx convex env set`)
