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

    const totalUsers = await ctx.db.query("users").collect();
    const totalDocs = await ctx.db.query("libraryBooks").collect();

    const recentActivity = await ctx.db
      .query("userActivity")
      .order("desc")
      .take(5);

    const activeUsers = new Set(
      (await ctx.db.query("userActivity").collect())
        .filter((a) => a.createdAt >= sevenDaysAgo)
        .map((a) => a.userId)
    ).size;

    const todayQueries = (
      await ctx.db.query("userActivity").collect()
    ).filter((a) => a.activityType === "chat_query" && a.createdAt >= todayMs).length;

    const adminUsers = (totalUsers as any[]).filter(
      (u: any) => u.role === "admin" || u.role === "system"
    ).length;

    const newUsersToday = (totalUsers as any[]).filter(
      (u: any) => u._creationTime >= todayMs
    ).length;

    return {
      totalUsers: totalUsers.length,
      activeUsers,
      totalQueries: (totalUsers as any[]).filter(
        (u: any) => u._creationTime > 0
      ).length,
      todayQueries,
      totalDocuments: totalDocs.length,
      newUsersToday,
      adminUsers,
      recentActivity: recentActivity.map((a: any) => ({
        _id: a._id,
        userId: a.userId,
        activityType: a.activityType,
        createdAt: a.createdAt,
      })),
    };
  },
});
