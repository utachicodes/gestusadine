# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

**GëstuSaDine** is a full-stack Islamic knowledge platform combining multi-agent AI consensus with e-commerce, education, and community features. The target market is West Africa (currency: XOF).

## Development Commands

```bash
# Run frontend + backend together
npm run dev

# Run individually
npm run dev:frontend   # Vite dev server on port 3000
npm run dev:backend    # Express API gateway on port 4000

# Build
npm run build          # Production build (Vite + Python translation deps)
npm run build:dev      # Development build

# Lint & test
npm run lint
npm test               # Vitest
```

Frontend proxies `/api` to `http://localhost:4000` (configured in `vite.config.ts`).

## Architecture

### Frontend (`/src`)

React 18 + TypeScript + Vite SPA. App entry: `src/main.tsx` → `src/App.tsx`.

**Provider nesting order (outermost first):**
`ErrorBoundary → AuthProvider → QueryClientProvider → ThemeProvider → TooltipProvider → LanguageProvider → BrowserRouter`

**Routing** uses React Router v6 with two layout wrappers:
- `AppShell` — public pages (navbar + footer)
- `DashboardLayout` — authenticated pages (sidebar + nav)
- `ProtectedRoute` — guards authenticated + admin-only routes

**State management:**
- Firebase Auth state → `AuthContext` (`src/contexts/AuthContext.tsx`)
- Theme (dark/light/personalized) → `ThemeContext` (persisted to localStorage)
- i18n → `LanguageContext` (translations in `src/data/`)
- Server state → TanStack React Query (used by `src/hooks/use-council.ts`)

**API calls** go through `src/lib/api.ts` (`apiFetch()`), which attaches Firebase auth tokens automatically.

### Backend (`/backend`)

Single Express server (`backend/services/api-gateway/src/server.ts`) on port 4000 that handles all routes. Despite the `services/` folder structure, this is effectively a monolith — the sub-service folders contain specialized logic imported by the gateway.

**Auth middleware** (`backend/services/api-gateway/src/auth.ts`): Firebase Admin SDK verifies JWT tokens. Use `requireAuth` and `requireAdmin` middleware on protected routes.

**Key API routes:**
- `/api/council/*` — multi-agent Islamic guidance (ask, documents, RAG search)
- `/api/fatwa` — Islamic rulings
- `/api/chat` — conversational AI
- `/api/shop/*`, `/api/events/*`, `/api/media/video`, `/api/library/*`

### The LLM Council (Core Feature)

The platform's main AI feature: multiple specialized agents independently answer Islamic questions, then a synthesis layer produces a consensus response with a confidence score.

**Agents** (in `backend/agents/`):
- `fiqh.ts` — Islamic jurisprudence (temp=0.3)
- `aqeedah.ts` — Islamic theology, acts as a boundary guard (temp=0.1)
- `context.ts` — Contemporary context (temp=0.5)
- `humility.ts` — Epistemic caution / hallucination prevention

**Flow:** User query → RAG document search → each agent runs independently → `backend/synthesis/` combines responses → confidence score returned.

**Agent LLM config** is in `backend/config.json`. Models are served via OpenRouter API (`src/lib/openrouter.ts`).

Frontend integration: `src/hooks/use-council.ts` (React Query mutations/queries).

### Firebase

- **Auth**: Email/password
- **Firestore**: User profiles, documents, orders, subscriptions, chat history
- **Storage**: Uploaded Islamic texts for RAG
- Config: `src/lib/firebase.ts` (frontend), `backend/services/api-gateway/src/lib/firebase-admin.ts` (backend)
- Security rules: `firestore.rules`

### UI Components

Uses **shadcn/ui** (configured in `components.json`) built on Radix UI primitives. Base components live in `src/components/ui/`. The design system is "Premium Dark Fintech" aesthetic using Tailwind CSS + Framer Motion animations.

## Key Files

| Path | Purpose |
|------|---------|
| `src/App.tsx` | All route definitions |
| `src/lib/api.ts` | Auth-aware API fetch wrapper |
| `src/contexts/AuthContext.tsx` | Firebase auth + Firestore profile |
| `src/hooks/use-council.ts` | Council API integration (React Query) |
| `backend/services/api-gateway/src/server.ts` | Express app + route registration |
| `backend/agents/council-agent.ts` | Base agent class |
| `backend/config.json` | Agent LLM model configuration |
| `vite.config.ts` | Frontend build + API proxy config |

## Environment

Copy `.env.example` to `.env`. Required variables include Firebase config, OpenRouter API key, and backend URL. The backend reads env via `backend/services/api-gateway/src/config-env.ts`.
