import { db, auth } from '../api-gateway/src/lib/firebase-admin.js';
import {
    SubscriptionPlan,
    UserSubscription,
    UsageStats,
    TierInfo,
    SubscriptionTier,
    UsageSummary
} from '../../shared/subscription-types';

export const SubscriptionService = {
    /**
     * Get all available subscription plans
     */
    async getAvailablePlans(): Promise<SubscriptionPlan[]> {
        const snapshot = await db.collection('subscription_plans')
            .orderBy('price', 'asc')
            .get();

        return snapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
        })) as SubscriptionPlan[];
    },

    /**
     * Get a specific plan by tier
     */
    async getPlanByTier(tier: SubscriptionTier): Promise<SubscriptionPlan> {
        const snapshot = await db.collection('subscription_plans')
            .where('tier', '==', tier)
            .limit(1)
            .get();

        if (snapshot.empty) {
            throw new Error('Plan not found');
        }

        const doc = snapshot.docs[0];
        return {
            id: doc.id,
            ...doc.data()
        } as SubscriptionPlan;
    },

    /**
     * Get user's current subscription with plan details
     */
    async getUserSubscription(userId: string): Promise<TierInfo | null> {
        const subDoc = await db.collection('user_subscriptions')
            .doc(userId)
            .get();

        if (!subDoc.exists) {
            return null;
        }

        const subscription = subDoc.data() as UserSubscription;

        // Get plan details
        const planDoc = await db.collection('subscription_plans')
            .doc(subscription.plan_id)
            .get();

        if (!planDoc.exists) {
            return null;
        }

        const plan = planDoc.data() as SubscriptionPlan;

        return {
            subscription_id: subDoc.id,
            tier: plan.tier,
            plan_name: plan.name,
            status: subscription.status,
            features: {
                chat_credits_monthly: plan.chat_credits_monthly,
                specialized_modes: plan.specialized_modes,
                personalized_themes: plan.personalized_themes,
                memory_enabled: plan.memory_enabled,
                templates_enabled: plan.templates_enabled,
                priority_responses: plan.priority_responses,
                advanced_planning: plan.advanced_planning,
                early_access: plan.early_access,
            },
            current_period_start: subscription.current_period_start,
            current_period_end: subscription.current_period_end,
        };
    },

    /**
     * Create or update a subscription for a user
     */
    async createOrUpdateSubscription(
        userId: string,
        planId: string
    ): Promise<UserSubscription> {
        // Get Plan Details
        const planDoc = await db.collection('subscription_plans').doc(planId).get();
        if (!planDoc.exists) {
            throw new Error('Plan not found');
        }
        const plan = planDoc.data() as SubscriptionPlan;

        // Check if user already has a subscription
        const subRef = db.collection('user_subscriptions').doc(userId);
        const existing = await subRef.get();

        const now = new Date();
        const periodEnd = new Date();
        periodEnd.setMonth(periodEnd.getMonth() + 1); // 1 month duration

        const subscriptionData: Partial<UserSubscription> = {
            plan_id: planId,
            status: 'active',
            current_period_start: now.toISOString(),
            current_period_end: periodEnd.toISOString(),
            updated_at: now.toISOString(),
            cancel_at_period_end: false
        };

        if (existing.exists) {
            // Update existing
            await subRef.update(subscriptionData);

            // Notify Upgrade
            const userRecord = await auth.getUser(userId);
            if (userRecord.email) {
                const name = userRecord.displayName || 'User';
                import('../notification-service/email.service.js').then(({ emailService }) => {
                    emailService.sendUpgradeConfirmation(userRecord.email!, name, plan.name, plan.price).catch(console.error);
                });
            }
        } else {
            // Create New
            subscriptionData.user_id = userId;
            subscriptionData.created_at = now.toISOString();
            await subRef.set(subscriptionData);
        }

        const updatedDoc = await subRef.get();
        return {
            id: updatedDoc.id,
            ...updatedDoc.data()
        } as UserSubscription;
    },

    /**
     * Cancel a user's subscription
     */
    async cancelSubscription(userId: string): Promise<UserSubscription> {
        const subRef = db.collection('user_subscriptions').doc(userId);
        const existing = await subRef.get();

        if (!existing.exists) {
            throw new Error('No active subscription found');
        }

        const now = new Date();
        await subRef.update({
            status: 'cancelled',
            cancelled_at: now.toISOString(),
            cancel_at_period_end: true,
            updated_at: now.toISOString()
        });

        // Notify Cancellation
        const userRecord = await auth.getUser(userId);
        const sub = existing.data() as UserSubscription;
        if (userRecord.email) {
            const name = userRecord.displayName || 'User';
            const endDate = new Date(sub.current_period_end).toLocaleDateString();

            import('../notification-service/email.service.js').then(({ emailService }) => {
                emailService.sendCancellationNotice(userRecord.email!, name, endDate).catch(console.error);
            });
        }

        const updatedDoc = await subRef.get();
        return {
            id: updatedDoc.id,
            ...updatedDoc.data()
        } as UserSubscription;
    },

    /**
     * Check if user has credits available
     */
    async checkCreditsAvailable(userId: string): Promise<boolean> {
        try {
            const tierInfo = await this.getUserSubscription(userId);
            if (!tierInfo) return false;

            const usageDoc = await db.collection('usage_tracking')
                .doc(userId)
                .get();

            if (!usageDoc.exists) return true;

            const usage = usageDoc.data() as UsageStats;
            const limit = tierInfo.features.chat_credits_monthly;

            // -1 means unlimited
            if (limit === -1) return true;

            return usage.chat_credits_used < limit;
        } catch (error) {
            console.error('Error checking credits:', error);
            return false;
        }
    },

    /**
     * Track usage (increment chat credits)
     */
    async trackUsage(userId: string, credits: number = 1): Promise<void> {
        const usageRef = db.collection('usage_tracking').doc(userId);
        const usageDoc = await usageRef.get();

        const periodStart = new Date();
        periodStart.setDate(1);
        periodStart.setHours(0, 0, 0, 0);

        if (!usageDoc.exists) {
            await usageRef.set({
                user_id: userId,
                chat_credits_used: credits,
                period_start: periodStart.toISOString(),
                last_updated: new Date().toISOString()
            });
        } else {
            const usage = usageDoc.data() as UsageStats;
            const usagePeriodStart = new Date(usage.period_start);

            // Reset if new period
            if (usagePeriodStart < periodStart) {
                await usageRef.set({
                    user_id: userId,
                    chat_credits_used: credits,
                    period_start: periodStart.toISOString(),
                    last_updated: new Date().toISOString()
                });
            } else {
                await usageRef.update({
                    chat_credits_used: usage.chat_credits_used + credits,
                    last_updated: new Date().toISOString()
                });
            }
        }
    },

    /**
     * Get usage statistics for current period
     */
    async getUsageStats(userId: string): Promise<UsageSummary> {
        const periodStart = new Date();
        periodStart.setDate(1);
        periodStart.setHours(0, 0, 0, 0);

        const usageDoc = await db.collection('usage_tracking')
            .doc(userId)
            .get();

        const tierInfo = await this.getUserSubscription(userId);

        const creditsUsed = usageDoc.exists ? (usageDoc.data() as UsageStats).chat_credits_used : 0;
        const creditsLimit = tierInfo?.features.chat_credits_monthly || 50; // Default to free tier

        const periodEnd = new Date(periodStart);
        periodEnd.setMonth(periodEnd.getMonth() + 1);

        return {
            chat_credits_used: creditsUsed,
            chat_credits_limit: creditsLimit,
            period_start: periodStart.toISOString(),
            period_end: periodEnd.toISOString(),
            percentage_used: creditsLimit === -1 ? 0 : Math.round((creditsUsed / creditsLimit) * 100),
        };
    },

    /**
     * Check if user has access to a feature
     */
    async hasFeatureAccess(
        userId: string,
        feature: keyof Pick<TierInfo['features'],
            'specialized_modes' | 'personalized_themes' | 'memory_enabled' |
            'templates_enabled' | 'priority_responses' | 'advanced_planning' | 'early_access'
        >
    ): Promise<boolean> {
        const tierInfo = await this.getUserSubscription(userId);
        if (!tierInfo) return false;
        return tierInfo.features[feature] === true;
    },

    /**
     * Get tier from subscription
     */
    async getUserTier(userId: string): Promise<SubscriptionTier> {
        const tierInfo = await this.getUserSubscription(userId);
        return tierInfo?.tier || 'free';
    },
};
