import { convexAuth } from "@convex-dev/auth/server";
import { Password } from "@convex-dev/auth/providers/Password";
import { ConvexError } from "convex/values";
import { MutationCtx } from "./_generated/server";

const SESSION_TOTAL_DURATION_MS = 1000 * 60 * 60 * 24 * 7;
const SESSION_INACTIVE_DURATION_MS = 1000 * 60 * 60 * 24 * 7;

const ADMIN_EMAILS = (process.env.ADMIN_EMAILS ?? "")
  .split(",")
  .map((e) => e.trim().toLowerCase())
  .filter(Boolean);

function getRole(email: string): "admin" | "user" {
  return ADMIN_EMAILS.includes(email.toLowerCase()) ? "admin" : "user";
}

export const { auth, signIn, signOut, store, isAuthenticated } = convexAuth({
  providers: [Password({
    profile(params) {
      // Accept any extra signup fields (gender) forwarded by the client.
      const p = params as Record<string, unknown>;
      return {
        email: p.email as string,
        name: p.name as string,
        gender: (p.gender as "male" | "female" | undefined) ?? undefined,
      };
    },
  })],
  session: {
    totalDurationMs: SESSION_TOTAL_DURATION_MS,
    inactiveDurationMs: SESSION_INACTIVE_DURATION_MS,
  },
  callbacks: {
    async createOrUpdateUser(ctx: MutationCtx, args) {
      const email = (args.profile.email ?? "").toLowerCase().trim();
      const role = getRole(email);
      const p = args.profile as Record<string, unknown>;
      const gender = p.gender as "male" | "female" | undefined;
      const name = (p.name as string | undefined)?.trim() ?? "";

      if (args.existingUserId) {
        // The auth account already exists. Verify the users row is complete —
        // a previous signup may have created the authAccount then crashed before
        // inserting the user row (or inserted it without a name).
        const existing = await ctx.db.get(args.existingUserId);
        if (existing && !existing.fullName && name) {
          await ctx.db.patch(args.existingUserId, {
            email,
            name,
            fullName: name,
            role,
            gender,
          });
        }
        return args.existingUserId;
      }

      if (!name) {
        throw new ConvexError("Full name is required.");
      }

      return ctx.db.insert("users", {
        email,
        name,
        image: p.image as string | undefined,
        role,
        subscriptionTier: "free",
        fullName: name,
        isAnonymous: false,
        gender,
        onboardingCompleted: false,
      });
    },
  },
});
