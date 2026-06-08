"use node";
import webpush from "web-push";
import { internalAction, action } from "./_generated/server";
import { v } from "convex/values";
import { internal } from "./_generated/api";

export const sendPush = internalAction({
  args: {
    endpoint: v.string(),
    p256dh: v.string(),
    auth: v.string(),
    title: v.string(),
    body: v.string(),
    icon: v.optional(v.string()),
    tag: v.optional(v.string()),
    url: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const publicKey = process.env.VAPID_PUBLIC_KEY;
    const privateKey = process.env.VAPID_PRIVATE_KEY;
    const subject = process.env.VAPID_SUBJECT ?? "mailto:admin@gestusadine.com";
    if (!publicKey || !privateKey) {
      console.error("[webPush] VAPID keys not configured");
      return;
    }
    webpush.setVapidDetails(subject, publicKey, privateKey);
    const payload = JSON.stringify({
      title: args.title,
      body: args.body,
      icon: args.icon ?? "/logo.png",
      badge: "/logo.png",
      tag: args.tag ?? "default",
      url: args.url ?? "/dashboard",
    });
    try {
      await webpush.sendNotification(
        { endpoint: args.endpoint, keys: { p256dh: args.p256dh, auth: args.auth } },
        payload,
        { TTL: 60 * 60 * 24 }
      );
    } catch (err: any) {
      if (err.statusCode === 410 || err.statusCode === 404) {
        await ctx.runMutation(internal.notifications.removeSubscriptionByEndpoint, {
          endpoint: args.endpoint,
        });
      } else {
        console.error(
          "[webPush] sendNotification error:",
          err.statusCode,
          err.body?.slice?.(0, 200)
        );
      }
    }
  },
});

export const getVapidPublicKey = action({
  args: {},
  handler: async () => process.env.VAPID_PUBLIC_KEY ?? null,
});
