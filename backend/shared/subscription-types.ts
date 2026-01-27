// Subscription Types for XamSaDine Platform

export type SubscriptionTier = 'free' | 'core' | 'pro';

export type SubscriptionStatus = 'active' | 'cancelled' | 'expired' | 'trialing';

export type BillingInterval = 'month' | 'year';

export interface PlanFeatures {
  chat_credits_monthly: number; // -1 means unlimited
  specialized_modes: boolean;
  personalized_themes: boolean;
  memory_enabled: boolean;
  templates_enabled: boolean;
  priority_responses: boolean;
  advanced_planning: boolean;
  early_access: boolean;
}

export interface SubscriptionPlan {
  id: string;
  tier: SubscriptionTier;
  name: string;
  description: string | null;
  price: number; // in XOF
  currency: string;
  billing_interval: BillingInterval;
  chat_credits_monthly: number;
  specialized_modes: boolean;
  personalized_themes: boolean;
  memory_enabled: boolean;
  templates_enabled: boolean;
  priority_responses: boolean;
  advanced_planning: boolean;
  early_access: boolean;
  created_at: string;
  updated_at: string;
}

export interface UserSubscription {
  id: string;
  user_id: string;
  plan_id: string;
  status: SubscriptionStatus;
  current_period_start: string;
  current_period_end: string;
  payment_provider: string | null;
  payment_provider_subscription_id: string | null;
  cancelled_at: string | null;
  created_at: string;
  updated_at: string;
  plan?: SubscriptionPlan; // Joined data
}

export interface UsageStats {
  id: string;
  user_id: string;
  chat_credits_used: number;
  period_start: string;
  period_end: string;
  metadata: Record<string, any>;
  created_at: string;
  updated_at: string;
}

export interface UserSubscriptionWithPlan extends Omit<UserSubscription, 'plan'> {
  plan: SubscriptionPlan;
}

export interface UsageSummary {
  chat_credits_used: number;
  chat_credits_limit: number;
  period_start: string;
  period_end: string;
  percentage_used: number;
}

export interface TierInfo {
  subscription_id: string;
  tier: SubscriptionTier;
  plan_name: string;
  status: SubscriptionStatus;
  features: PlanFeatures;
  current_period_start: string;
  current_period_end: string;
}
