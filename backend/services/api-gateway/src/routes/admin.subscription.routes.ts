import { Router, Request, Response } from "express";
import { requireAuth, requireAdmin } from "../auth.js";
import { supabase } from "../lib/supabase.js";
import { SubscriptionService } from "../../../subscription-service/subscription.service.js";

const router = Router();

// Middleware: Require Admin for all routes
router.use(requireAuth, requireAdmin);

// GET /api/admin/subscriptions/stats
// Get aggregate statistics
router.get("/stats", async (_req: Request, res: Response) => {
    try {
        const { count: totalUsers } = await supabase.from('profiles').select('*', { count: 'exact', head: true });
        const { count: activeSubs } = await supabase.from('user_subscriptions').select('*', { count: 'exact', head: true }).in('status', ['active', 'trialing']);

        // Count per tier
        const { data: tierCounts } = await supabase
            .from('user_subscriptions')
            .select('plan_id, status');

        const plans = await SubscriptionService.getAvailablePlans();

        const tierStats = plans.reduce((acc: any, plan) => {
            acc[plan.tier] = tierCounts?.filter(s => s.plan_id === plan.id && s.status === 'active').length || 0;
            return acc;
        }, {});

        // Calculate estimated revenue (simple calculation)
        const revenue = plans.reduce((acc, plan) => {
            return acc + (plan.price * (tierStats[plan.tier] || 0));
        }, 0);

        res.json({
            total_users: totalUsers || 0,
            active_subscriptions: activeSubs || 0,
            tier_breakdown: tierStats,
            estimated_monthly_revenue: revenue,
            currency: 'XOF'
        });
    } catch (error: any) {
        console.error("Admin Stats Error:", error);
        res.status(500).json({ error: "Failed to fetch stats" });
    }
});

// GET /api/admin/subscriptions/users
// Get list of users with subscription info
router.get("/users", async (req: Request, res: Response) => {
    try {
        const page = parseInt(req.query.page as string) || 1;
        const limit = parseInt(req.query.limit as string) || 20;
        const search = req.query.search as string;
        const offset = (page - 1) * limit;

        let query = supabase
            .from('user_subscriptions')
            .select(`
                *,
                profiles!inner(email, full_name),
                subscription_plans:plan_id (name, tier, price)
            `, { count: 'exact' });

        if (search) {
            query = query.or(`email.ilike.%${search}%,full_name.ilike.%${search}%`, { foreignTable: 'profiles' });
        }

        const { data: users, count, error } = await query
            .range(offset, offset + limit - 1)
            .order('created_at', { ascending: false });

        if (error) throw error;

        res.json({
            users,
            total: count || 0,
            page,
            limit
        });
    } catch (error: any) {
        console.error("Admin Users Error:", error);
        res.status(500).json({ error: "Failed to fetch users" });
    }
});

// POST /api/admin/subscriptions/assign
// Manually assign a plan to a user
router.post("/assign", async (req: Request, res: Response) => {
    try {
        const { userId, planId } = req.body;

        if (!userId || !planId) {
            res.status(400).json({ error: "userId and planId required" });
            return;
        }

        const sub = await SubscriptionService.createOrUpdateSubscription(userId, planId);
        res.json({ message: "Subscription assigned successfully", subscription: sub });
    } catch (error: any) {
        console.error("Admin Assign Error:", error);
        res.status(500).json({ error: error.message || "Failed to assign plan" });
    }
});

export default router;
