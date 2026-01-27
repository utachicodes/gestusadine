/* eslint-disable @typescript-eslint/no-namespace */
import type { NextFunction, Request, Response } from "express";
import { auth } from "./lib/firebase-admin.js";
import { SubscriptionService } from "../../subscription-service/subscription.service.js";
import { TierInfo, SubscriptionTier } from "../../../shared/subscription-types.js";

const ADMIN_EMAIL = process.env.ADMIN_EMAIL || "abdoullahaljersi@gmail.com";

export type AuthUser = {
  sub: string;
  email?: string;
  uid: string;
};

declare global {
  namespace Express {
    interface Request {
      authUser?: AuthUser;
      isAdmin?: boolean;
      userTier?: TierInfo;
      subscription?: TierInfo;
    }
  }
}

async function parseBearerToken(req: Request): Promise<string | null> {
  const header = req.headers.authorization;
  if (!header) return null;
  const [scheme, token] = header.split(" ");
  if (scheme?.toLowerCase() !== "bearer" || !token) return null;
  return token;
}

export async function requireAuth(req: Request, res: Response, next: NextFunction) {
  try {
    const token = await parseBearerToken(req);
    if (!token) {
      res.status(401).json({ error: "Unauthorized" });
      return;
    }

    const decodedToken = await auth.verifyIdToken(token);

    req.authUser = {
      sub: decodedToken.uid,
      email: decodedToken.email,
      uid: decodedToken.uid,
    };
    req.isAdmin = (decodedToken.email ?? "").toLowerCase() === ADMIN_EMAIL.toLowerCase();

    next();
  } catch (error) {
    console.error("Auth Error:", error);
    res.status(401).json({ error: "Unauthorized" });
  }
}

export async function optionalAuth(req: Request, res: Response, next: NextFunction) {
  try {
    const token = await parseBearerToken(req);
    if (!token) {
      next();
      return;
    }

    const decodedToken = await auth.verifyIdToken(token);

    req.authUser = {
      sub: decodedToken.uid,
      email: decodedToken.email,
      uid: decodedToken.uid,
    };
    req.isAdmin = (decodedToken.email ?? "").toLowerCase() === ADMIN_EMAIL.toLowerCase();

    next();
  } catch (_err) {
    // If token is invalid, just proceed as guest
    next();
  }
}

export async function requireAdmin(req: Request, res: Response, next: NextFunction) {
  await requireAuth(req, res, () => {
    if (!req.isAdmin) {
      res.status(403).json({ error: "Forbidden" });
      return;
    }
    next();
  });
}

/**
 * Middleware to attach user's tier information to request
 * Does not block access - just adds tier info
 */
export async function optionalTier(req: Request, res: Response, next: NextFunction) {
  if (!req.authUser) {
    next();
    return;
  }

  try {
    const tierInfo = await SubscriptionService.getUserSubscription(req.authUser.sub);
    if (tierInfo) {
      req.userTier = tierInfo;
      req.subscription = tierInfo;
    }
    next();
  } catch (error) {
    // Don't block on tier lookup failure
    console.error('Error fetching tier info:', error);
    next();
  }
}

/**
 * Middleware factory to require minimum tier level
 * Usage: requireTier('core') or requireTier('pro')
 */
export function requireTier(minTier: SubscriptionTier) {
  const tierHierarchy: Record<SubscriptionTier, number> = {
    free: 0,
    core: 1,
    pro: 2,
  };

  return async (req: Request, res: Response, next: NextFunction) => {
    await requireAuth(req, res, async () => {
      try {
        const tierInfo = await SubscriptionService.getUserSubscription(req.authUser!.sub);

        if (!tierInfo) {
          res.status(403).json({
            error: "No active subscription",
            message: "Please subscribe to access this feature",
            requiredTier: minTier
          });
          return;
        }

        req.userTier = tierInfo;
        req.subscription = tierInfo;

        const userTierLevel = tierHierarchy[tierInfo.tier];
        const requiredTierLevel = tierHierarchy[minTier];

        if (userTierLevel < requiredTierLevel) {
          res.status(403).json({
            error: "Insufficient tier",
            message: `This feature requires ${minTier} tier or higher`,
            currentTier: tierInfo.tier,
            requiredTier: minTier
          });
          return;
        }

        next();
      } catch (error: any) {
        res.status(500).json({
          error: "Failed to verify subscription",
          message: error.message
        });
      }
    });
  };
}

/**
 * Middleware to check if user has credits available
 */
export async function requireCredits(req: Request, res: Response, next: NextFunction) {
  await requireAuth(req, res, async () => {
    try {
      const hasCredits = await SubscriptionService.checkCreditsAvailable(req.authUser!.sub);

      if (!hasCredits) {
        const usageStats = await SubscriptionService.getUsageStats(req.authUser!.sub);
        res.status(429).json({
          error: "Credit limit exceeded",
          message: "You've used all your chat credits for this billing period",
          usage: usageStats,
          upgradeUrl: "/pricing"
        });
        return;
      }

      next();
    } catch (error: any) {
      res.status(500).json({
        error: "Failed to check credits",
        message: error.message
      });
    }
  });
}
