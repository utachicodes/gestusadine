import { useMemo } from "react";
import { api } from "../../convex/_generated/api";
import { useQuery } from "convex/react";
import type { SubscriptionTier } from "@/auth/AuthContext";

const TIER_RANK: Record<SubscriptionTier, number> = { free: 0, student: 1, pro: 2 };

export function tierRank(tier?: SubscriptionTier | string | null): number {
  return TIER_RANK[(tier ?? 'free') as SubscriptionTier] ?? 0;
}

export function useSubscription() {
  const sub = useQuery(api.subscription.getMySubscription);

  return useMemo(() => {
    const hourlyUsed = sub?.hourlyUsed ?? 0;
    const hourlyLimit = sub?.hourlyLimit ?? 5;
    const dailyUsed = sub?.dailyUsed ?? 0;
    const dailyLimit = sub?.dailyLimit ?? 20;

    return {
      hourlyUsed,
      hourlyLimit,
      hourlyRemaining: sub?.hourlyRemaining ?? 5,
      dailyUsed,
      dailyLimit,
      dailyRemaining: sub?.dailyRemaining ?? 20,
      canAskCouncil: sub?.canAskCouncil ?? true,
    };
  }, [sub]);
}
