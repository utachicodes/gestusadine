import { query } from "./_generated/server";
import { getCurrentUser } from "./authz";

export const dashboard = query({
  args: {},
  handler: async (ctx) => {
    const user = await getCurrentUser(ctx);
    if (!user || (user.role !== "admin" && user.role !== "system")) {
      return null;
    }

    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const todayMs = today.getTime();
    const sevenDaysAgo = todayMs - 7 * 86400000;
    const thirtyDaysAgo = todayMs - 30 * 86400000;

    const totalUsers = await ctx.db.query("users").collect();
    const totalDocs = await ctx.db.query("libraryBooks").collect();
    const allActivity = await ctx.db.query("userActivity").collect();

    const recentActivity = allActivity
      .sort((a, b) => b.createdAt - a.createdAt)
      .slice(0, 5);

    const activeUsers = new Set(
      allActivity
        .filter((a) => a.createdAt >= sevenDaysAgo)
        .map((a) => a.userId)
    ).size;

    const todayQueries = allActivity.filter(
      (a) => a.activityType === "chat_query" && a.createdAt >= todayMs
    ).length;

    const totalQueries = allActivity.filter(
      (a) => a.activityType === "chat_query"
    ).length;

    const adminUsers = (totalUsers as any[]).filter(
      (u: any) => u.role === "admin" || u.role === "system"
    ).length;

    const newUsersToday = (totalUsers as any[]).filter(
      (u: any) => u._creationTime >= todayMs
    ).length;

    const paidSubscribers = (totalUsers as any[]).filter(
      (u: any) => u.subscriptionTier === "student" || u.subscriptionTier === "pro"
    ).length;

    const payments = allActivity.filter(
      (a) => a.activityType === "payment_completed"
    );
    const totalRevenue = payments.reduce((sum, p) => {
      const meta = p.metadata as Record<string, unknown> | undefined;
      return sum + ((meta?.amount as number) ?? 0);
    }, 0);

    const revenueThisMonth = payments
      .filter((p) => p.createdAt >= thirtyDaysAgo)
      .reduce((sum, p) => {
        const meta = p.metadata as Record<string, unknown> | undefined;
        return sum + ((meta?.amount as number) ?? 0);
      }, 0);

    return {
      totalUsers: totalUsers.length,
      activeUsers,
      totalQueries,
      todayQueries,
      totalDocuments: totalDocs.length,
      newUsersToday,
      adminUsers,
      paidSubscribers,
      totalRevenue,
      revenueThisMonth,
      recentActivity: recentActivity.map((a: any) => ({
        _id: a._id,
        userId: a.userId,
        activityType: a.activityType,
        createdAt: a.createdAt,
      })),
    };
  },
});
