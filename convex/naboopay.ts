import { action, mutation } from "./_generated/server";
import { internal } from "./_generated/api";
import { v, ConvexError } from "convex/values";

const NABOOPAY_BASE = "https://api.naboopay.com";

const TIER_PRICES: Record<string, { amount: number; label: string }> = {
  student: { amount: 5000, label: "GëstuSaDine Student - Monthly" },
  pro: { amount: 0, label: "GëstuSaDine Pro" },
};

export const createCheckoutSession = action({
  args: {
    tier: v.union(v.literal("student"), v.literal("pro")),
    successUrl: v.string(),
    errorUrl: v.string(),
    firstName: v.optional(v.string()),
    lastName: v.optional(v.string()),
    phone: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new ConvexError("Authentication required. Please sign in.");
    const userId = identity.subject;

    const apiKey = process.env.NABOOPAY_API_KEY;
    if (!apiKey) throw new ConvexError("NABOOPAY_API_KEY not configured");

    const tierInfo = TIER_PRICES[args.tier];
    if (!tierInfo) throw new ConvexError(`Unknown tier: ${args.tier}`);

    if (args.tier === "pro") {
      return { requiresContact: true, message: "Contact us for Pro pricing" };
    }

    const customer: Record<string, string> = {
        first_name: args.firstName || identity.name || "Customer",
        last_name: args.lastName || "",
        email: identity.email || "",
      };
      if (args.phone) customer.phone = args.phone;

      const body: Record<string, unknown> = {
        method_of_payment: ["wave", "orange_money"],
        products: [
          {
            name: tierInfo.label,
            price: tierInfo.amount,
            quantity: 1,
            description: `${args.tier} subscription`,
          },
        ],
        customer,
      success_url: args.successUrl,
      error_url: args.errorUrl,
      fees_customer_side: false,
      is_escrow: false,
      is_merchant: false,
    };

    const res = await fetch(`${NABOOPAY_BASE}/api/v2/transactions`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify(body),
    });

    const data = await res.json();
    if (!res.ok) {
      throw new ConvexError(`NabooPay error: ${data.error ?? res.statusText}`);
    }

    const orderId = data.order_id ?? data.id;
    if (orderId) {
      await ctx.runMutation(internal.naboopay.recordPaymentInit, {
        userId: userId as any,
        orderId: String(orderId),
        tier: args.tier,
        amount: tierInfo.amount,
      });
    }

    return { checkoutUrl: data.checkout_url, orderId };
  },
});

export const recordPaymentInit = mutation({
  args: {
    userId: v.id("users"),
    orderId: v.string(),
    tier: v.string(),
    amount: v.number(),
  },
  handler: async (ctx, args) => {
    await ctx.db.insert("userActivity", {
      userId: args.userId,
      activityType: "payment_initiated",
      metadata: {
        orderId: args.orderId,
        tier: args.tier,
        amount: args.amount,
      },
      createdAt: Date.now(),
    });
  },
});

export const confirmPayment = mutation({
  args: {
    orderId: v.string(),
    transactionStatus: v.string(),
    tier: v.string(),
    customerEmail: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    if (args.transactionStatus !== "completed") return { success: false };

    const activity = await ctx.db
      .query("userActivity")
      .withIndex("userId", (q) => q.eq("activityType", "payment_initiated"))
      .filter((q) => q.eq(q.field("metadata.orderId"), args.orderId))
      .first();

    if (!activity) return { success: false };

    const userId = activity.userId;
    const tier = args.tier;

    await ctx.db.patch(userId, { subscriptionTier: tier as any });
    await ctx.db.insert("userActivity", {
      userId,
      activityType: "payment_completed",
      metadata: { orderId: args.orderId, tier },
      createdAt: Date.now(),
    });

    return { success: true, userId };
  },
});
