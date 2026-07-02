# Daily Loop

Run this checklist silently on startup (9 AM). No user prompts needed.
Post midday report at 2 PM. Post final daily report at 2 AM.

---

## Phase 1 — Morning (9 AM)

### 1. Health Check

- [ ] `git pull origin main` — sync latest
- [ ] `npx tsc --noEmit` — type check
- [ ] `npm run lint` — lint check
- [ ] `npm test -- --run` — test suite
- [ ] `npm run build` — production build
- [ ] Check Convex dashboard for runtime errors in last 24h
- [ ] Check Vercel deployment status (latest prod build passing?)

If anything fails → fix it, commit, push, merge, deploy.

### 2. GitHub Triage + PR Notifications

- [ ] `gh issue list --state open` — check new issues
- [ ] `gh pr list --state open` — check open PRs
- [ ] `gh run list --limit 5` — check CI status on main
- [ ] Respond to any new issues (acknowledge, label, or close)
- [ ] Review and merge any ready PRs (lint+build+tests pass)
- [ ] If CI failed on main → investigate and fix

**PR email notification** — after triage, send a summary of open PRs:

```bash
PR_LIST=$(gh pr list --state open --json number,title,author,createdAt,labels --jq '.[] | "#\(.number) \(.title) — by \(.author.login) (\(.createdAt[:10]))"')

if [ -n "$PR_LIST" ]; then
  echo -e "OPEN PULL REQUESTS\n\n$PR_LIST" > /tmp/pr-digest.md
  node scripts/report-helpers.mjs send-email "$REPORT_EMAIL" "GëstuSaDine PR Digest — $(date +%Y-%m-%d)" /tmp/pr-digest.md
  rm /tmp/pr-digest.md
fi
```

### 3. Bug Sweep

- [ ] Check Convex function logs for errors (last 24h)
- [ ] Search codebase for `TODO`, `FIXME`, `HACK` comments
- [ ] Check for unused imports or dead code
- [ ] Fix any bugs found → commit, push, merge

---

## Phase 2 — Midday (2 PM)

### 4. Market Research — ArXiv & Industry

Spend 30 minutes scanning for new papers and ideas relevant to GëstuSaDine.

**Search queries to rotate through:**
- `arxiv.org/search/?query=islamic+qa+retrieval+augmented&searchtype=all`
- `arxiv.org/search/?query=religious+qa+hallucination+grounding&searchtype=all`
- `arxiv.org/search/?query=multilingual+rag+arabic+english&searchtype=all`
- `arxiv.org/search/?query=tool+augmented+llm+agent+architecture&searchtype=all`
- `arxiv.org/search/?query=llm+safety+jailbreak+detection&searchtype=all`
- `arxiv.org/search/?query=convex+serverless+database&searchtype=all`
- `arxiv.org/search/?query=pwa+notification+engagement&searchtype=all`
- `arxiv.org/search/?query=islamic+fiqh+ruling+automation&searchtype=all`
- `arxiv.org/search/?query=quran+hadith+verification+ai&searchtype=all`
- `arxiv.org/search/?query=multi+agent+routing+intent+classification&searchtype=all`

**What to look for:**
- New RAG techniques that could improve our retrieval
- Better intent classification methods
- Citation verification approaches
- Arabic NLP advances
- Islamic QA benchmarks we should test against
- Safety/alignment techniques for religious AI
- Novel tool-use architectures

**Output:**
- Save findings to `reports/research/YYYY-MM-DD.md`
- If a paper has a concrete idea we can implement → create an issue with `gh issue create`
- If an idea is immediately actionable → implement it

### 5. Competitive Analysis

- [ ] Check Fanar API changelog/updates (fanar.qa)
- [ ] Check Convex changelog (github.com/get-convex/convex-js)
- [ ] Check shadcn/ui new components
- [ ] Check Lucide icons new additions
- [ ] Scan Product Hunt / Hacker News for Islamic tech or prayer apps
- [ ] Note any features competitors have that we should consider

### 6. Midday Report

Write to `reports/midday-YYYY-MM-DD.md`:

```
# Midday Report — YYYY-MM-DD (2 PM)

## Morning Summary
- Health: passing/failing
- Bugs fixed: <list>
- PRs merged: <list>

## Research Findings
- Papers reviewed: <count>
- Key papers:
  - <title> — <one-line summary> — <relevance to GëstuSaDine>
  - <title> — <one-line summary> — <relevance>
- Actionable ideas:
  - <idea 1>
  - <idea 2>

## Competitive Intel
- <notable updates from Fanar, Convex, competitors>

## Afternoon Plan
- <what to work on next>
```

---

## Phase 3 — Afternoon/Evening

### 7. Implement Research Findings

- [ ] Review morning research notes
- [ ] Implement any quick wins (estimated < 1 hour)
- [ ] Create issues for larger ideas
- [ ] Update architecture docs if new patterns adopted

### 8. Code Quality

- [ ] Run full test suite — aim for 100% pass rate
- [ ] Check for console.log statements that shouldn't be in production
- [ ] Verify all Convex API calls in frontend match exported functions
- [ ] Check for hardcoded values that should be environment variables
- [ ] Review recent commits for code smells

### 9. Documentation

- [ ] Update CHANGELOG.md if any changes were made today
- [ ] Verify README.md is accurate
- [ ] Check CONTRIBUTING.md for completeness

---

## Phase 4 — End of Day (2 AM)

### 10. Daily Report

Write to `reports/YYYY-MM-DD.md`:

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
- Papers reviewed: <count>
- Key findings:
  - <finding 1>
  - <finding 2>
- Ideas created as issues: <count>

## Competitive Intel
- <notable updates>

## Open Issues
- <any unresolved issues>

## Tomorrow's Priorities
- <what needs attention next>
```

---

## Rules

- Never commit secrets, API keys, or credentials
- Always run lint + type check before pushing
- Never force push to main
- Always create new branches for features
- Merge only when CI passes
- If unsure about a change, leave a note in the report rather than making it
- Research findings must include source URLs
- Never skip the midday report — it's how I stay informed
