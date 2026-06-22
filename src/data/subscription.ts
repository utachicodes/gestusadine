import { useMemo } from "react";
import { api } from "../../convex/_generated/api";
import { useQuery } from "convex/react";

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
