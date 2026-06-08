import { RateLimiter, MINUTE, HOUR } from "@convex-dev/rate-limiter";
import { components } from "./_generated/api";

const DAY = 24 * HOUR;

export const rateLimiter = new RateLimiter(components.rateLimiter, {
  // Auth
  failedLogins:  { kind: "token bucket", rate: 10,    period: HOUR },
  signUp:        { kind: "fixed window", rate: 5,     period: MINUTE },
  // AI council
  councilAsk:    { kind: "token bucket", rate: 20,    period: MINUTE, capacity: 5 },
  chatMessages:  { kind: "token bucket", rate: 60,    period: MINUTE, capacity: 10 },
  llmTokens:     { kind: "token bucket", rate: 40000, period: MINUTE, shards: 10 },
  llmRequests:   { kind: "fixed window", rate: 1000,  period: MINUTE, shards: 10 },
  // Wellness — prevents DB-bloat spam
  periodLog:     { kind: "fixed window", rate: 20,    period: HOUR },
  // Journal — one upsert per day is normal; allow bursts for edits
  journalWrite:  { kind: "token bucket", rate: 30,    period: HOUR,   capacity: 10 },
  // Qadaa mark/unmark actions
  qadaaAction:   { kind: "token bucket", rate: 60,    period: HOUR,   capacity: 20 },
  // External awardXp calls (not internal quiz/daily grants)
  xpAward:       { kind: "fixed window", rate: 50,    period: DAY },
});
