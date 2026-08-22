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
    // Expo Push Tokens (React Native) are stored in the same table but routed
    // via Expo's push service, not VAPID. Skip them here — they are handled
    // separately by the Expo push infrastructure.
    if (args.endpoint.startsWith("ExponentPushToken[") || args.p256dh === "") {
      await ctx.runAction(internal.webPush.sendExpoPush, {
        token: args.endpoint,
        title: args.title,
        body: args.body,
        url: args.url,
      });
      return;
    }

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
      icon: args.icon ?? "/icons/icon-192.png",
      badge: "/icons/icon-192.png",
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

// Send a push notification to a React Native device via Expo's push service.
// No VAPID needed — Expo handles APNs/FCM delivery.
export const sendExpoPush = internalAction({
  args: {
    token: v.string(),
    title: v.string(),
    body: v.string(),
    url: v.optional(v.string()),
  },
  handler: async (_ctx, args) => {
    if (!args.token.startsWith("ExponentPushToken[")) return;
    try {
      const res = await fetch("https://exp.host/--/api/v2/push/send", {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify({
          to: args.token,
          title: args.title,
          body: args.body,
          data: { url: args.url ?? "/" },
          sound: "default",
          channelId: "default",
        }),
      });
      const json = await res.json();
      if (json.data?.status === "error") {
        console.error("[expoPush] delivery error:", json.data.message);
      }
    } catch (err) {
      console.error("[expoPush] fetch error:", err);
    }
  },
});
