# Daily Loop

Run this checklist silently on startup (9 AM). No user prompts needed.
Post midday report at 2 PM. Post final daily report at 2 AM.

---

## Phase 1 — Morning (9 AM)

### 1. Health Check

- [ ] `git pull origin main` — sync latest
- [ ] `npm run lint` — lint check
- [ ] `npm test` — test suite
- [ ] `npm run build` — production build
- [ ] Check deployment status (latest prod build passing?)

If anything fails → fix it, commit, push, merge, deploy.

### 2. GitHub Triage

- [ ] `gh issue list --state open` — check new issues
- [ ] `gh pr list --state open` — check open PRs
- [ ] `gh run list --limit 5` — check CI status on main
- [ ] Respond to any new issues (acknowledge, label, or close)
- [ ] Review and merge any ready PRs (lint+build+tests pass)
- [ ] If CI failed on main → investigate and fix

### 3. Bug Sweep

- [ ] Search codebase for `TODO`, `FIXME`, `HACK` comments
- [ ] Check for unused imports or dead code
- [ ] Fix any bugs found → commit, push, merge

---

## Phase 2 — Midday (2 PM)

### 4. Market Research

Spend 30 minutes scanning for new ideas relevant to this project.

**Output:**
- Save findings to `reports/research/YYYY-MM-DD.md`
- If an idea is immediately actionable → implement it

### 5. Midday Report

Write to `reports/midday-YYYY-MM-DD.md`:

```
MIDDAY REPORT - YYYY-MM-DD (2 PM)

MORNING SUMMARY
  Health: passing/failing
  Bugs fixed: <list>
  PRs merged: <list>

RESEARCH FINDINGS
  Papers reviewed: <count>
  Key findings:
    - <finding 1>
    - <finding 2>

AFTERNOON PLAN
  - <what to work on next>
```

**Deliver report:**
- Send via Gmail: `node scripts/report-helpers.mjs send-email "$REPORT_EMAIL" "Project Name Midday Report — YYYY-MM-DD" "reports/midday-YYYY-MM-DD.md"`
- Write to Google Docs: `node scripts/report-helpers.mjs append-doc "$VITE_GOOGLE_REPORTS_DOC_ID" "reports/midday-YYYY-MM-DD.md"`

---

## Phase 3 — Afternoon/Evening

### 6. Code Quality

- [ ] Run full test suite — aim for 100% pass rate
- [ ] Check for console.log statements that shouldn't be in production
- [ ] Check for hardcoded values that should be environment variables
- [ ] Review recent commits for code smells

### 7. Documentation

- [ ] Update CHANGELOG.md if any changes were made today
- [ ] Verify README.md is accurate

---

## Phase 4 — End of Day (2 AM)

### 8. Daily Report

Write to `reports/YYYY-MM-DD.md`:

```
DAILY REPORT - YYYY-MM-DD

STATUS
  Branch: main
  Last commit: <hash> <message>
  Tests: X/Y passing
  Build: passing/failing
  Lint: clean/errors

CHANGES MADE
  - <list of commits and what they do>

BUGS FIXED
  - <list of bugs found and fixed>

RESEARCH DONE
  Papers reviewed: <count>
  Key findings:
    - <finding 1>
    - <finding 2>

OPEN ISSUES
  - <any unresolved issues>

TOMORROW'S PRIORITIES
  - <what needs attention next>
```

**Deliver report:**
- Send via Gmail: `node scripts/report-helpers.mjs send-email "$REPORT_EMAIL" "Project Name Daily Report — YYYY-MM-DD" "reports/YYYY-MM-DD.md"`
- Write to Google Docs: `node scripts/report-helpers.mjs append-doc "$VITE_GOOGLE_REPORTS_DOC_ID" "reports/YYYY-MM-DD.md"`

---

## Rules

- Never commit secrets, API keys, or credentials
- Always run lint + type check before pushing
- Never force push to main
- Always create new branches for features
- Merge only when CI passes
- If unsure about a change, leave a note in the report rather than making it
- Never skip the midday report — it's how I stay informed
