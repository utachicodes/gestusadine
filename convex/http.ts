import { httpRouter } from "convex/server";
import { httpAction } from "./_generated/server";
import { internal } from "./_generated/api";
import { v } from "convex/values";
import { auth } from "./auth";

const http = httpRouter();

auth.addHttpRoutes(http);

http.route({
  path: "/naboopay-webhook",
  method: "POST",
  handler: httpAction(async (ctx, request) => {
    const signature = request.headers.get("X-Signature");
    const payload = await request.json();

    const secret = process.env.NABOOPAY_WEBHOOK_SECRET;
    if (secret) {
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
    }

    const eventType = payload.event ?? "payment_status";
    const orderId = payload.order_id;
    const status = payload.transaction_status;
    const products = payload.products ?? [];
    const tier = products[0]?.name?.includes("Student") ? "student" : null;

    if (eventType === "payment_status" && status === "completed" && orderId && tier) {
      await ctx.runMutation(internal.naboopay.confirmPayment, {
        orderId,
        transactionStatus: status,
        tier,
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
