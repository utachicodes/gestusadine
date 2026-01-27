import { Router } from 'express';
import { requireAuth, optionalAuth, requireTier, requireCredits } from '../auth.js';
import { SubscriptionService } from '../../../subscription-service/subscription.service.js';

const router = Router();

/**
 * GET /api/subscriptions/plans
 * Get all available subscription plans (public)
 */
router.get('/plans', async (_req, res) => {
    try {
        const plans = await SubscriptionService.getAvailablePlans();
        res.json({ plans });
    } catch (error: any) {
        console.error('Error fetching plans:', error);
        res.status(500).json({
            error: 'Failed to fetch plans',
            message: error.message
        });
    }
});

/**
 * GET /api/subscriptions/me
 * Get current user's subscription and usage
 */
router.get('/me', requireAuth, async (req, res) => {
    try {
        const userId = req.authUser!.sub;

        const [subscription, usage] = await Promise.all([
            SubscriptionService.getUserSubscription(userId),
            SubscriptionService.getUsageStats(userId),
        ]);

        if (!subscription) {
            res.status(404).json({
                error: 'No subscription found',
                message: 'Please contact support'
            });
            return;
        }

        res.json({
            subscription,
            usage,
        });
    } catch (error: any) {
        console.error('Error fetching user subscription:', error);
        res.status(500).json({
            error: 'Failed to fetch subscription',
            message: error.message
        });
    }
});

/**
 * POST /api/subscriptions/upgrade
 * Upgrade or change subscription plan
 * Note: Payment integration deferred
 */
router.post('/upgrade', requireAuth, async (req, res) => {
    try {
        const userId = req.authUser!.sub;
        const { planId } = req.body;

        if (!planId) {
            res.status(400).json({
                error: 'Missing planId',
                message: 'Please provide a planId'
            });
            return;
        }

        // For now, directly update subscription without payment
        // TODO: Integrate with payment provider when ready
        const subscription = await SubscriptionService.createOrUpdateSubscription(userId, planId);

        res.json({
            success: true,
            subscription,
            message: 'Subscription updated successfully',
            note: 'Payment integration pending - subscription activated immediately'
        });
    } catch (error: any) {
        console.error('Error upgrading subscription:', error);
        res.status(500).json({
            error: 'Failed to upgrade subscription',
            message: error.message
        });
    }
});

/**
 * POST /api/subscriptions/cancel
 * Cancel user's subscription (remains active until period end)
 */
router.post('/cancel', requireAuth, async (req, res) => {
    try {
        const userId = req.authUser!.sub;
        const subscription = await SubscriptionService.cancelSubscription(userId);

        res.json({
            success: true,
            subscription,
            message: 'Subscription cancelled. You will retain access until the end of your billing period.'
        });
    } catch (error: any) {
        console.error('Error cancelling subscription:', error);
        res.status(500).json({
            error: 'Failed to cancel subscription',
            message: error.message
        });
    }
});

/**
 * GET /api/subscriptions/usage
 * Get detailed usage statistics for current user
 */
router.get('/usage', requireAuth, async (req, res) => {
    try {
        const userId = req.authUser!.sub;
        const usage = await SubscriptionService.getUsageStats(userId);

        res.json(usage);
    } catch (error: any) {
        console.error('Error fetching usage:', error);
        res.status(500).json({
            error: 'Failed to fetch usage',
            message: error.message
        });
    }
});

/**
 * POST /api/subscriptions/check-access
 * Check if user has access to a specific feature
 */
router.post('/check-access', requireAuth, async (req, res) => {
    try {
        const userId = req.authUser!.sub;
        const { feature } = req.body;

        if (!feature) {
            res.status(400).json({
                error: 'Missing feature',
                message: 'Please provide a feature name'
            });
            return;
        }

        const hasAccess = await SubscriptionService.hasFeatureAccess(userId, feature);

        res.json({
            feature,
            hasAccess,
            tier: await SubscriptionService.getUserTier(userId),
        });
    } catch (error: any) {
        console.error('Error checking feature access:', error);
        res.status(500).json({
            error: 'Failed to check feature access',
            message: error.message
        });
    }
});

/**
 * GET /api/subscriptions/tier
 * Get user's current tier
 */
router.get('/tier', optionalAuth, async (req, res) => {
    try {
        if (!req.authUser) {
            res.json({ tier: 'free', authenticated: false });
            return;
        }

        const tier = await SubscriptionService.getUserTier(req.authUser.sub);
        res.json({ tier, authenticated: true });
    } catch (error: any) {
        console.error('Error fetching tier:', error);
        res.status(500).json({
            error: 'Failed to fetch tier',
            message: error.message
        });
    }
});

/**
 * POST /api/subscriptions/track-usage
 * Track credit usage for current user
 */
router.post('/track-usage', requireAuth, async (req, res) => {
    try {
        const userId = req.authUser!.sub;
        await SubscriptionService.trackUsage(userId, 1);

        res.json({ success: true });
    } catch (error: any) {
        console.error('Error tracking usage:', error);
        res.status(500).json({
            error: 'Failed to track usage',
            message: error.message
        });
    }
});

export default router;
