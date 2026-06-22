import { convexAuth } from "@convex-dev/auth/server";
import { ConvexCredentials } from "@convex-dev/auth/providers/ConvexCredentials";
import { api } from "./_generated/api";

const SESSION_TOTAL_DURATION_MS = 1000 * 60 * 60 * 24 * 7;
const SESSION_INACTIVE_DURATION_MS = 1000 * 60 * 60 * 24 * 7;

export const { auth, signIn, signOut, store, isAuthenticated } = convexAuth({
  providers: [ConvexCredentials({
    authorize: async (credentials, ctx) => {
      const email = (credentials.email as string ?? "").toLowerCase().trim();
      const name = (credentials.name as string ?? "").trim();
      const password = (credentials.password as string ?? "");
      const image = (credentials.image as string | undefined) ?? undefined;
      const gender = (credentials.gender as "male" | "female" | undefined) ?? undefined;

      if (!email || !password) return null;

      // Check if user already exists
      const existingUser = await ctx.runQuery(api.users.checkEmailExists, { email });

      if (existingUser) {
        // Existing user — verify password
        const userId = await ctx.runMutation(api.users.verifyUserPassword, {
          email,
          password,
        });
        return { userId };
      }

      // New user — create account
      const userId = await ctx.runMutation(api.users.createUser, {
        email,
        name: name || email.split("@")[0],
        image,
        gender,
        password,
      });

      return { userId };
    },
  })],
  session: {
    totalDurationMs: SESSION_TOTAL_DURATION_MS,
    inactiveDurationMs: SESSION_INACTIVE_DURATION_MS,
  },
});
