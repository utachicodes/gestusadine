# Contributing to GëstuSaDine

Thank you for your interest in contributing! This guide will help you get started.

## Table of Contents

- [Code of Conduct](#code-of-conduct)
- [Getting Started](#getting-started)
- [Development Setup](#development-setup)
- [Project Structure](#project-structure)
- [Making Changes](#making-changes)
- [Commit Messages](#commit-messages)
- [Pull Request Process](#pull-request-process)
- [Style Guide](#style-guide)

## Code of Conduct

- Be respectful and inclusive
- Focus on constructive feedback
- Help maintain a welcoming environment for all contributors

## Getting Started

1. **Fork** the repository on GitHub
2. **Clone** your fork locally:
   ```bash
   git clone https://github.com/your-username/gestusadine.git
   cd gestusadine
   ```
3. **Install** dependencies:
   ```bash
   npm install
   ```
4. **Set up** environment variables (see [Development Setup](#development-setup))
5. **Create a branch** for your changes:
   ```bash
   git checkout -b feat/your-feature-name
   ```

## Development Setup

### Prerequisites

- Node.js 20+
- A [Convex](https://convex.dev) account (free tier works)

### Environment Variables

1. Copy the example env file:
   ```bash
   cp .env.example .env.local
   ```
2. Fill in `VITE_CONVEX_URL` — run `npx convex dev` to create/connect a deployment
3. Server-side secrets (API keys) are set via:
   ```bash
   npx convex env set FANAR_API_KEY your-key-here
   npx convex env set AUTH_SECRET $(openssl rand -hex 32)
   ```

> **Note:** You don't need to deploy to production. Just run `npm run dev:full` locally.
> Production deployment is handled by maintainers only.

### Running Locally

```bash
# Run frontend + Convex backend together
npm run dev:full

# Or separately:
npm run dev:frontend   # Vite dev server (port 5173)
npm run dev:convex     # Convex function watcher
```

### Other Commands

```bash
npm run build          # Production build
npm run lint           # ESLint check
npm test               # Run tests with Vitest
```

## Project Structure

```
gestusadine/
├── convex/             # Convex backend (queries, mutations, actions, schema)
│   ├── schema.ts       # Database schema definition
│   ├── auth.ts         # Authentication setup
│   ├── llm.ts          # AI chatbot action
│   ├── prompts.ts      # System prompts for the Council
│   └── ...
├── src/                # React frontend
│   ├── components/     # Reusable UI components
│   ├── pages/          # Route-level page components
│   ├── auth/           # Auth context and RBAC
│   ├── contexts/       # React context providers
│   ├── hooks/          # Custom React hooks
│   ├── lib/            # Utilities (i18n, helpers)
│   ├── data/           # Static data (surahs, etc.)
│   └── types/          # TypeScript type definitions
├── public/             # Static assets
└── scripts/            # Development scripts
```

## Making Changes

### Branch Naming

Use descriptive branch names:
- `feat/add-new-feature` — new features
- `fix/resolve-issue-123` — bug fixes
- `docs/update-readme` — documentation
- `refactor/cleanup-auth` — code refactoring

### Convex Functions

When modifying backend logic:
1. Edit files in `convex/`
2. The schema (`convex/schema.ts`) defines the database structure
3. Use `v` from `convex/values` for type-safe validation
4. Server-side secrets are accessed via `process.env` in actions/mutations

### Frontend Components

- Use existing shadcn/ui components from `src/components/ui/`
- Follow the existing file structure and naming conventions
- Use the `useTr()` hook or `useLanguage()` for internationalization (EN/FR/AR)

## Commit Messages

Write clear, concise commit messages:
- `feat: add new prayer notification system`
- `fix: resolve duplicate Bismillah in Quran reader`
- `docs: update contributing guide`
- `refactor: simplify auth context`

## Pull Request Process

1. **Update documentation** if your change affects user-facing behavior
2. **Ensure the build passes**: `npm run build`
3. **Ensure lint passes**: `npm run lint`
4. **Write a clear PR description** explaining what changed and why
5. **Reference any related issues** (e.g., "Closes #42")
6. **Request a review** from a maintainer

### PR Checklist

- [ ] Build passes (`npm run build`)
- [ ] Lint passes (`npm run lint`)
- [ ] No sensitive data (API keys, secrets) in code
- [ ] i18n updated if adding user-facing strings
- [ ] Schema changes are backward-compatible

## Style Guide

- **TypeScript** — strict mode, no `any` types
- **Tailwind CSS** — use utility classes, follow existing patterns
- **Components** — functional components with hooks
- **Naming** — PascalCase for components, camelCase for functions/variables
- **Files** — match component name (e.g., `PrayerTimes.tsx`)

## Questions?

Open a [GitHub Discussion](https://github.com/utachicodes/gestusadine/discussions) or reach out to the maintainers.
