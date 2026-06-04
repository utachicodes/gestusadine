import { useMemo } from "react";
import { useAuth, type SubscriptionTier } from "@/auth/AuthContext";
import { api } from "../../convex/_generated/api";
import { useQuery, useMutation } from "convex/react";

export type Feature =
  | "council.access"
  | "council.specialized"
  | "library.premium"
  | "courses.access"
  | "community.participate"
  | "theme.customize"
  | "institution.console"
  | "institution.privateKb"
  | "support.priority";

const STUDENT_FEATURES: Feature[] = [
  "council.access",
  "council.specialized",
  "library.premium",
  "courses.access",
  "community.participate",
  "theme.customize",
];

const FEATURE_MATRIX: Record<SubscriptionTier, Feature[]> = {
  free: ["council.access"],
  student: STUDENT_FEATURES,
  institution: [...STUDENT_FEATURES, "institution.console", "institution.privateKb", "support.priority"],
};

const TIER_RANK: Record<SubscriptionTier, number> = { free: 0, student: 1, institution: 2 };

export function tierRank(tier: SubscriptionTier): number {
  return TIER_RANK[tier] ?? 0;
}

export function tierHasFeature(tier: SubscriptionTier, feature: Feature): boolean {
  return FEATURE_MATRIX[tier]?.includes(feature) ?? false;
}

export function useSubscription() {
  const { profile, isAdmin } = useAuth();
  const sub = useQuery(api.subscription.getMySubscription);
  const recordCouncilQueryMut = useMutation(api.subscription.recordCouncilQuery);

  const tier: SubscriptionTier = isAdmin
    ? "institution"
    : (profile?.subscription_tier ?? "free");

  return useMemo(() => {
    const limit = sub?.limit ?? 5;
    const unlimited = sub?.unlimited ?? false;
    const used = sub?.used ?? 0;
    const remaining = sub?.remaining ?? Infinity;

    const usage = {
      chat_credits_used: used,
      chat_credits_limit: limit,
      percentage_used: unlimited ? 0 : Math.min(100, Math.round((used / limit) * 100)),
      period_end: sub?.period ?? "",
      fair_use: sub?.fairUse ?? false,
    };

    const can = (feature: Feature) => tierHasFeature(tier, feature);
    const meetsTier = (required: SubscriptionTier) => tierRank(tier) >= tierRank(required);

    return {
      tier,
      usage,
      can,
      meetsTier,
      councilRemaining: remaining,
      canAskCouncil: sub?.canAskCouncil ?? true,
      recordCouncilQuery: () => { recordCouncilQueryMut(); },
      canCustomizeTheme: can("theme.customize"),
    };
  }, [tier, sub, recordCouncilQueryMut]);
}
