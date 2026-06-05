import { convexAuth } from "@convex-dev/auth/server";
import { Password } from "@convex-dev/auth/providers/Password";
import { MutationCtx } from "./_generated/server";
import { rateLimiter } from "./rateLimiter";

const SESSION_TOTAL_DURATION_MS = 1000 * 60 * 60 * 24 * 7;
const SESSION_INACTIVE_DURATION_MS = 1000 * 60 * 60 * 24 * 7;

export const { auth, signIn, signOut, store, isAuthenticated } = convexAuth({
  providers: [Password],
  session: {
    totalDurationMs: SESSION_TOTAL_DURATION_MS,
    inactiveDurationMs: SESSION_INACTIVE_DURATION_MS,
  },
  callbacks: {
    async createOrUpdateUser(ctx: MutationCtx, args) {
      const email = args.profile.email ?? "";
      const role = "user";

      if (args.existingUserId) {
        return args.existingUserId;
      }

      if (!args.profile?.name) {
        throw new Error("Full name is required.");
      }

      const status = await rateLimiter.check(ctx, "signUp", { key: email });
      if (!status.ok) {
        throw new Error("Too many sign-up attempts. Please try again later.");
      }

      return ctx.db.insert("users", {
        email,
        name: args.profile.name,
        image: args.profile?.image,
        role,
        subscriptionTier: "free",
        fullName: args.profile.name,
        isAnonymous: false,
      });
    },
  },
});
