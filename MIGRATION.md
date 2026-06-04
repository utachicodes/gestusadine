# GëstuSaDine — Migration & Completion Plan

> Living document. Firebase/Firestore → **Clerk + Convex**, retire Express, and build out the
> features that are currently mock/static. Track progress by checking boxes as phases complete.

## Locked decisions (2026-05-30)

| Decision | Choice |
|---|---|
| Timeline | Multi-day, done right. Today = **day one**. |
| Auth | **Convex Auth** (`@convex-dev/auth`) — native, single platform, no third-party vendor. Needs an email provider (Resend) for password reset/verification. |
| Database | **Convex** (greenfield — rebuild schema, NO data migration). |
| Backend | **Move everything into Convex** (queries/mutations/actions). Retire Express. |
| Council | **Simplified** — 4 agents + synthesis. Drop the 12-call peer-review stage. |
| Embeddings | **Hosted API** (required — local Transformers.js can't run serverless). |
| Wolof / i18n | **Drop Wolof.** Ship FR/EN (+AR only if strings completed). |
| Payments (XOF) | **Deferred** to a dedicated later phase (Paystack/Flutterwave/mobile money). |
| Scope | **All 8 facade features** built for real (see Phase 4). |

## Honest estimate
~**2–4 weeks** solo. Core migration (Phases 0–3): ~3–5 focused days. Feature build-out (Phase 4):
the bulk — Community, Islamic content, and Classes are each multi-day. Payments + hardening on top.

---

## Architecture: before → after

**Before:** React SPA → Express monolith (`backend/services/api-gateway`) → Firestore + Firebase
Auth + Firebase Storage + local Transformers.js embeddings + a spawned Python (Wolof) process +
a half-wired Supabase backend. OpenRouter key shipped to the browser.

**After:** React SPA → **Convex** for everything — **auth** (Convex Auth), data, functions, actions,
file storage, and vector search. Council + RAG run as Convex actions calling OpenRouter + a hosted
embeddings API. No Clerk, no Express, no Firebase, no Supabase, no Python process. All secrets server-side.

---

## Phase 0 — Foundation & de-risking (DAY 1)
Goal: stand up the new stack and kill the security landmines before building on top.

- [ ] `npm i convex @convex-dev/auth` ; `npx convex dev` to init `convex/`.
- [ ] Run `npx @convex-dev/auth` to scaffold `convex/auth.ts`, `auth.config.ts`, `http.ts`. Add the **`Password` provider** (matches current email/password). Wire **Resend** (decided) for password reset + email verification — set `AUTH_RESEND_KEY` in Convex env.
- [ ] Define `convex/schema.ts` — clean, normalized (see "Schema" below). Spread `...authTables` for the Convex Auth tables. One naming convention (snake_case → camelCase), all timestamps `v.number()` (epoch ms).
- [ ] Single source of truth for **admin** = `users.role` in Convex (synced from Clerk). Kill the other 3 definitions.
- [ ] **Security:** stop shipping `VITE_OPENROUTER_API_KEY` to the browser — move ALL LLM calls server-side (Convex actions). Remove direct calls in `src/lib/openrouter.ts`, `DocumentUpload.tsx`, `AdminConfig.tsx`, `RAGTest.tsx`.
- [ ] **Delete dead code:** `src/contexts/AuthContext.tsx`, `src/auth/ProtectedRoute.tsx`, `src/components/HeroSection.tsx.bak`. Repoint `Navbar.tsx` to the real auth.
- [ ] Update `CLAUDE.md` (it points at the wrong AuthContext + claims chat persistence that doesn't exist).

**Acceptance:** `convex dev` runs, schema compiles, Convex Auth sign-in renders, no secret in the client bundle (`grep VITE_OPENROUTER dist/` is empty).

## Phase 1 — Auth cutover (Clerk + Convex)
- [ ] Wrap app in `ConvexAuthProvider` (replaces Firebase `AuthProvider`).
- [ ] Rewrite `src/auth/AuthContext.tsx` around Convex Auth (`useAuthActions`, `useConvexAuth`, a Convex `users` query). Keep the `useAuth()` API stable so the 12 consumers don't all change.
- [ ] User doc auto-created via Convex Auth's **`createOrUpdateUser` callback** (set `role: 'user'`, `subscription_tier: 'free'` there). No webhook needed.
- [ ] Rewrite `src/components/layout/ProtectedRoute.tsx`, `PublicRoute.tsx`, `components/auth/AccessGuard.tsx` with Convex Auth state (`useConvexAuth` / `<Authenticated>`/`<Unauthenticated>`).
- [ ] **Frontend RBAC already consolidated** (`src/auth/rbac.ts` + `useAuthz` + `RequirePermission`): one capability-role model reads `profile.role`; ProtectedRoute + Sidebar route through it. Convex Auth just needs to supply the role claim — `toRole()` is the only swap point. The old 4 conflicting admin definitions are down to 1 on the frontend (backend `ADMIN_EMAIL` retires with Express).
- [ ] `src/lib/api.ts`: token-minting goes away — Convex Auth handles tokens internally; delete `apiFetch` as the Express backend is retired.
- [ ] `src/pages/auth/Login.tsx`: Convex Auth-backed (`useAuthActions().signIn`) sign in / sign up / reset.

**Acceptance:** sign up → `users` row created in Convex; admin role gates admin routes; protected pages redirect when logged out.

## Phase 2 — Data layer → Convex (replace Firestore + Express services)
Port each **working** service to Convex queries/mutations. Greenfield: define it right, don't copy the mess.

- [ ] Tables + functions: `library_books`, `events` + `event_registrations`, `videos`/`media` (consolidate the two collections), `media_progress`, `user_themes`, `subscription_plans`, `user_subscriptions`, `usage_tracking`, `daily_content`, `user_activity`, `products`, `orders` + `order_items`, agent `config`.
- [ ] **Fix the public/admin data-source mismatch** — everything reads & writes Convex now (mismatch disappears).
- [ ] Frontend: replace `firebase-helpers` + `apiFetch` with Convex `useQuery`/`useMutation` in admin pages + Library.
- [ ] **Data seam already in place** (`src/data/{products,videos,events,podcasts,classes}.ts`): each hook has a documented one-line swap to `useQuery(api.*)`. Public pages (Shop, Events, Media, Podcasts, Classes) consume these — swapping the hook bodies wires them to Convex with zero component changes.
- [ ] File storage: Firebase Storage → **Convex file storage** (library files, doc uploads, thumbnails).
- [ ] Drop the dead Supabase path (`admin.subscription.routes.ts`) and in-memory `library.ts`.

**Acceptance:** admin creates an event/video/book → it appears on the public page (same store). No Firestore reads remain.

## Phase 3 — AI pipeline on Convex (council + RAG)
- [ ] **Hosted embeddings** via Convex action (pick model → fixes vector dimension; e.g. OpenAI 1536, Voyage 512/1024).
- [ ] `ragChunks` table with `vectorIndex` (dimensions = model's, `filterFields: ["category"]`) + `ragDocuments` for metadata/content.
- [ ] Ingest = action (chunk → embed → insert). Search = action using `ctx.vectorSearch` (deletes the in-memory cosine loop).
- [ ] **Council = Convex action**: 4 agents (fiqh/aqeedah/context/humility) + synthesis. **Drop peer-review.** **Fix the synthesis bug** (`claude-opus` key doesn't exist in `COUNCIL_MODELS`). **Prompts:** prepend the *Council System-Prompt Preamble* from [METHODOLOGY.md](./METHODOLOGY.md) to every agent + the synthesis prompt — this is the canonical source for the methodology the AI must follow (hierarchy of evidence, hadith grading, four madhhabs, empathy-before-evidence, citation-first, the Silence Rule, disclaimer).
- [ ] Streaming: write partial tokens to a Convex table the client subscribes to via `useQuery` (the serverless streaming pattern).
- [ ] Agent config → Convex table; `AdminConfig.tsx` writes to Convex (not localStorage).
- [ ] Wire `DocumentUpload.tsx` to **real** RAG ingestion (currently a no-op).
- [ ] **Auth + credit-gate** the council/chat (currently `/api/council/ask` is fully public).
- [ ] Add chat persistence (`conversations`/`messages`) — doesn't exist today.

**Acceptance:** ask a question → cited RAG answer with confidence, streamed, gated by tier/credits, key never leaves server.

## Phase 4 — Build the facade features for real (the bulk)
- [ ] **Shop**: catalog from Convex, cart → checkout → order, order history. (Payment stubbed → Phase 5.) Fix dead "Proceed to Checkout".
- [ ] **Subscriptions/paywall**: real tiers/credits/usage gating; fix the `localStorage('token')` bug; add `/pricing` + upgrade flow (payment stubbed).
- [ ] **Profile/gamification**: real activity tracking (`user_activity`); compute XP/streaks/badges from real events (kill `Math.random()` graph).
- [ ] **Video playback**: real player + progress (replace the toast stub).
- [ ] **Community/forums**: circles, membership, posts (new schema + UI). *Largest build.*
- [ ] **Podcasts**: episode catalog + audio player.
- [ ] **Islamic content** (Fiqh/Hadith/Tawhid): content model + seed real data (replace static brochures).
- [ ] **Classes/courses**: catalog + enrollment.
- [ ] Fix routing dead-ends: `/tarteel`, `/pricing`, orphaned `/settings`; dead CTAs on landing/islamic/classes; fake `Contact.tsx` submit.

**Acceptance:** every nav item leads to a functional, data-backed page. No `MOCK_*`/`DEMO_*` imports remain in `src/`.

## Phase 5 — Payments (XOF)
- [ ] Choose provider (Paystack / Flutterwave / mobile money — Wave/Orange Money).
- [ ] Checkout + webhook (order paid → status, stock decrement) as Convex action/httpAction.
- [ ] Subscription upgrades wired to real billing.

## Phase 6 — Hardening & launch
- [ ] Convex function-level authorization on EVERY function (replaces `firestore.rules`).
- [ ] i18n: complete AR strings or remove AR; purge Wolof remnants.
- [ ] **Remove Express, Firebase, Supabase, Python deps**; clean `Dockerfile*`, `nginx.conf`, `docker-compose*`, `package.json`.
- [ ] Loading/error/empty states; tests (Vitest); `/security-review` on the diff.

---

## Schema (Convex target — from recon)
Hub table `users` (extends Convex Auth's user table — add role, subscription_tier). Referenced by: `orders`, `user_subscriptions`,
`usage_tracking`, `event_registrations`, `media_progress`, `user_themes`, `user_activity`.
Plus: `products`, `order_items`, `subscription_plans`, `events`, `videos`(+progress), `library_books`,
`daily_content` (polymorphic by `contentType`), `config`/`agents`, `ragDocuments`, `ragChunks` (+vectorIndex),
`conversations`/`messages` (new). Drop: `documents`, `vectors`, `subscriptions` alias, `config/app-settings`.

## Risk register
- **Council latency/limits** — mitigated by dropping peer-review; still verify the action stays under Convex limits.
- **Embedding dimension** — locked once the hosted model is chosen; vectorIndex dimension must match.
- **Convex Auth is beta** — you own more of the auth surface; password reset/verification require an email provider (Resend) wired up, else cut reset for v1.
- **Feature creep** — 8 features is the real cost; protect the phase order, don't half-build many at once.
- **No real data** — greenfield is the gift; do NOT reintroduce the snake/camel + timestamp inconsistencies.
