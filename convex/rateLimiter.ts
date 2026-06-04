import { RateLimiter, MINUTE, HOUR } from "@convex-dev/rate-limiter";
import { components } from "./_generated/api";

export const rateLimiter = new RateLimiter(components.rateLimiter, {
  failedLogins: { kind: "token bucket", rate: 10, period: HOUR },
  signUp: { kind: "fixed window", rate: 5, period: MINUTE },
  councilAsk: { kind: "token bucket", rate: 20, period: MINUTE, capacity: 5 },
  chatMessages: { kind: "token bucket", rate: 60, period: MINUTE, capacity: 10 },
  llmTokens: { kind: "token bucket", rate: 40000, period: MINUTE, shards: 10 },
  llmRequests: { kind: "fixed window", rate: 1000, period: MINUTE, shards: 10 },
});
