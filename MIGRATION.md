# GëstuSaDine — Migration record (complete)

> Historical note. The migration off the old stack is **done** — this file records
> what changed so the git history makes sense. For the current architecture see
> [README.md](./README.md) and [CLAUDE.md](./CLAUDE.md).

## From → to

| | Before | Now |
|---|---|---|
| Frontend | React + Vite SPA | React + Vite SPA (unchanged) |
| Backend | Express monolith (`backend/services/*`) | **Convex** functions only — no separate server |
| Auth | Firebase Auth | **Convex Auth** (`@convex-dev/auth`), Password provider |
| Database | Firestore | **Convex** database |
| File storage | Firebase Storage | **Convex** file storage |
| AI | OpenRouter (multi-model council) + local Transformers.js embeddings | **Fanar API**, single server-authoritative Council prompt + keyword/synonym RAG |
| Payments | (stubbed) | **NabooPay** (Wave / Orange Money, XOF) via Convex HTTP webhook |
| Admin source of truth | 4 conflicting definitions | one — `users.role`, derived from `ADMIN_EMAILS` |

## What was removed

- The entire `backend/` Express service (api-gateway, council, RAG, translation, commerce, etc.).
- Firebase, Supabase, OpenRouter, and local-embedding code paths.
- A half-built **WorkOS** auth integration (module, HTTP verify route, packages, `workosId` schema field) — never used; the app stayed on Convex Auth.
- The Wolof translation service and Python process.
- Dead setup/health scripts that targeted the old backend.

## Notable decisions that stuck

- **Council = single Convex action.** Rather than the old multi-call peer-review council, the methodology (hierarchy of evidence, hadith grading, four madhhabs, empathy-before-evidence, citation-first, the Silence Rule, disclaimer) lives in one server-side system prompt — [convex/prompts.ts](convex/prompts.ts), applied by [convex/llm.ts](convex/llm.ts). See [METHODOLOGY.md](./METHODOLOGY.md).
- **All LLM/payment secrets are server-side** (Convex env), never shipped to the browser.
- **Authorization is enforced per Convex function** (auth + role/ownership + tier), not on the client.
- **i18n** ships FR/EN/AR; Wolof was dropped.

## Still open / future

- True **vector/semantic RAG** (current retrieval is keyword + bilingual synonym matching) — pending a confirmed embeddings provider.
- Email-based flows (password reset / verification) need an email provider wired up if reintroduced.
