import { convexAuth } from "@convex-dev/auth/server";
import { Password } from "@convex-dev/auth/providers/Password";
import { MutationCtx } from "./_generated/server";

const SESSION_TOTAL_DURATION_MS = 1000 * 60 * 60 * 24 * 7;
const SESSION_INACTIVE_DURATION_MS = 1000 * 60 * 60 * 24;

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

      return ctx.db.insert("users", {
        email,
        name: args.profile?.name,
        image: args.profile?.image,
        role,
        subscriptionTier: "free",
        fullName: args.profile?.name,
        isAnonymous: false,
      });
    },
  },
});
