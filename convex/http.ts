import { httpRouter } from "convex/server";
import { httpAction } from "./_generated/server";
import { internal } from "./_generated/api";
import { auth } from "./auth";

const http = httpRouter();

auth.addHttpRoutes(http);

http.route({
  path: "/naboopay-webhook",
  method: "POST",
  handler: httpAction(async (ctx, request) => {
    const signature = request.headers.get("X-Signature");
    const payload: any = await request.json();

    const secret = process.env.NABOOPAY_WEBHOOK_SECRET;
    // Signature verification is mandatory — no secret means misconfigured deployment.
    if (!secret) {
      console.error("[naboopay] NABOOPAY_WEBHOOK_SECRET is not set — rejecting webhook");
      return new Response("Webhook secret not configured", { status: 500 });
    }
    if (!signature) {
      return new Response("Missing signature", { status: 401 });
    }
    const encoder = new TextEncoder();
    const key = await crypto.subtle.importKey(
      "raw",
      encoder.encode(secret),
      { name: "HMAC", hash: "SHA-256" },
      false,
      ["verify"],
    );
    const payloadBytes = encoder.encode(JSON.stringify(payload));
    const expected = await crypto.subtle.sign("HMAC", key, payloadBytes);
    const expectedHex = Array.from(new Uint8Array(expected))
      .map((b) => b.toString(16).padStart(2, "0"))
      .join("");

    if (signature !== expectedHex) {
      return new Response("Invalid signature", { status: 401 });
    }

    // Replay-attack window: reject webhooks whose embedded timestamp is older
    // than 5 minutes. If NabooPay includes `created_at` (Unix s) or `timestamp`
    // we enforce it; if absent we proceed but log a warning.
    const webhookTs: number | undefined =
      typeof payload.created_at === "number" ? payload.created_at :
      typeof payload.timestamp   === "number" ? payload.timestamp  : undefined;
    if (webhookTs !== undefined) {
      const ageSecs = Math.floor(Date.now() / 1000) - webhookTs;
      if (ageSecs > 300 || ageSecs < -60) {
        console.warn("[naboopay] webhook outside 5-min freshness window", { ageSecs });
        return new Response("Webhook expired", { status: 400 });
      }
    } else {
      console.warn("[naboopay] webhook payload missing timestamp — cannot enforce freshness window");
    }

    const orderId = payload.order_id;
    const status = payload.transaction_status;

    if (status === "completed" && orderId) {
      await ctx.runMutation(internal.naboopay.confirmPayment, {
        orderId,
        transactionStatus: status,
        customerEmail: payload.customer?.email,
      });
    }

    return new Response(JSON.stringify({ status: "received" }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  }),
});

http.route({
  path: "/health",
  method: "GET",
  handler: httpAction(async () => {
    return new Response(JSON.stringify({ status: "ok" }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  }),
});

export default http;
