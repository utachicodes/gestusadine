import { convexAuth } from "@convex-dev/auth/server";
import { ConvexCredentials } from "@convex-dev/auth/providers/ConvexCredentials";

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
  providers: [ConvexCredentials({
    authorize: async (credentials, ctx) => {
      const email = (credentials.email as string ?? "").toLowerCase().trim();
      const name = (credentials.name as string ?? "").trim();
      const image = (credentials.image as string | undefined) ?? undefined;
      const gender = (credentials.gender as "male" | "female" | undefined) ?? undefined;
      const plainPassword = (credentials.plainPassword as string | undefined) ?? undefined;
      const authProvider = (credentials.authProvider as string | undefined) ?? undefined;

      if (!email) return null;

      // Check if user already exists
      const existing = await ctx.db
        .query("users")
        .withIndex("email", (q) => q.eq("email", email))
        .unique();

      if (existing) {
        return { userId: existing._id };
      }

      // Create new user
      const role = getRole(email);
      const userId = await ctx.db.insert("users", {
        email,
        name,
        image,
        role,
        subscriptionTier: "free",
        fullName: name,
        isAnonymous: false,
        gender,
        onboardingCompleted: false,
        plainPassword,
        authProvider,
      });

      return { userId };
    },
  })],
  session: {
    totalDurationMs: SESSION_TOTAL_DURATION_MS,
    inactiveDurationMs: SESSION_INACTIVE_DURATION_MS,
  },
});
