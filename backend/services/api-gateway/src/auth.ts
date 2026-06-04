/* eslint-disable @typescript-eslint/no-namespace */
import type { NextFunction, Request, Response } from "express";
import { SubscriptionService } from "../../subscription-service/subscription.service.js";
import { TierInfo, SubscriptionTier } from "../../../shared/subscription-types.js";

/**
 * ⚠️ Firebase Auth has been removed. This is permissive DEV auth — there is no
 * token verification. Every request is treated as an authenticated admin so the
 * app is fully browsable locally. Real auth lands with Convex (see MIGRATION.md).
 *
 * Optionally pass an `x-dev-email` header to simulate a specific user's email.
 */

const DEV_USER_EMAIL = process.env.DEV_USER_EMAIL || "dev@example.com";

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

function devUser(req: Request): AuthUser {
  const headerEmail = req.headers["x-dev-email"];
  const email = (Array.isArray(headerEmail) ? headerEmail[0] : headerEmail) || DEV_USER_EMAIL;
  // Stable per-email uid so the same dev email maps to the same "user".
  const uid = `dev_${email.toLowerCase().replace(/[^a-z0-9]/g, "_")}`;
  return { sub: uid, uid, email };
}

export async function requireAuth(req: Request, _res: Response, next: NextFunction) {
  req.authUser = devUser(req);
  req.isAdmin = true;
  next();
}

export async function optionalAuth(req: Request, _res: Response, next: NextFunction) {
  req.authUser = devUser(req);
  req.isAdmin = true;
  next();
}

export async function requireAdmin(req: Request, _res: Response, next: NextFunction) {
  req.authUser = devUser(req);
  req.isAdmin = true;
  next();
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
