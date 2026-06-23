# Daily Loop

Run this checklist silently on startup (9 AM). No user prompts needed.
When complete, post a daily report summary.

---

## 1. Health Check

- [ ] `git pull origin main` — sync latest
- [ ] `npx tsc --noEmit` — type check
- [ ] `npm run lint` — lint check
- [ ] `npm test -- --run` — test suite
- [ ] `npm run build` — production build
- [ ] Check Convex dashboard for runtime errors in last 24h
- [ ] Check Vercel deployment status (latest prod build passing?)

If anything fails → fix it, commit, push, merge, deploy.

## 2. GitHub Triage

- [ ] `gh issue list --state open` — check new issues
- [ ] `gh pr list --state open` — check open PRs
- [ ] `gh run list --limit 5` — check CI status on main
- [ ] Respond to any new issues (acknowledge, label, or close)
- [ ] Review and merge any ready PRs (lint+build+tests pass)
- [ ] If CI failed on main → investigate and fix

## 3. Bug Sweep

- [ ] Check Convex function logs for errors (last 24h)
- [ ] Search codebase for `TODO`, `FIXME`, `HACK` comments
- [ ] Check for unused imports or dead code
- [ ] Fix any bugs found → commit, push, merge

## 4. Research

Spend 15 minutes researching one topic from this queue.
Rotate through topics. Pick the next one not yet covered.

- [ ] Claude Code best practices and new features
- [ ] Convex best practices (schema design, query optimization)
- [ ] React 19 / Vite 7 new capabilities
- [ ] Islamic QA system architecture patterns
- [ ] RAG optimization techniques
- [ ] PWA performance optimization
- [ ] Accessibility (WCAG) audit improvements
- [ ] Security hardening patterns
- [ ] Testing strategies (unit, integration, E2E)
- [ ] CI/CD pipeline improvements

If research yields actionable improvements → implement them.
Document findings in `notes.md`.

## 5. Code Quality

- [ ] Run full test suite — aim for 100% pass rate
- [ ] Check for console.log statements that shouldn't be in production
- [ ] Verify all Convex API calls in frontend match exported functions
- [ ] Check for hardcoded values that should be environment variables
- [ ] Review recent commits for code smells

## 6. Documentation

- [ ] Update CHANGELOG.md if any changes were made today
- [ ] Verify README.md is accurate
- [ ] Check CONTRIBUTING.md for completeness

## 7. Daily Report

Write report to `reports/YYYY-MM-DD.md` with:

```
# Daily Report — YYYY-MM-DD

## Status
- Branch: main
- Last commit: <hash> <message>
- Tests: X/Y passing
- Build: passing/failing
- Lint: clean/errors

## Changes Made
- <list of commits and what they do>

## Bugs Fixed
- <list of bugs found and fixed>

## Research Done
- <topic researched>
- <key findings>
- <actionable items>

## Open Issues
- <any unresolved issues>

## Tomorrow's Priorities
- <what needs attention next>
```

## Rules

- Never commit secrets, API keys, or credentials
- Always run lint + type check before pushing
- Never force push to main
- Always create new branches for features
- Merge only when CI passes
- If unsure about a change, leave a note in the report rather than making it
