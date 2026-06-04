import * as React from "react";
import { useConvexAuth, useAuthActions } from "@convex-dev/auth/react";
import { useQuery, useMutation, useConvex } from "convex/react";
import { api } from "../../convex/_generated/api";
import type { Doc } from "../../convex/_generated/dataModel";
import { UserRole } from "./rbac";

const HARDCODED_ADMIN_EMAIL = "admin@gestusadine.org";
const HARDCODED_ADMIN_PASSWORD = "gestus@dine";
const LS_KEY = "gestu_hardcoded_admin";

export type SubscriptionTier = 'free' | 'student' | 'pro';

export type UserProfile = {
  id: string;
  email: string;
  role: UserRole;
  subscription_tier: SubscriptionTier;
  full_name?: string;
  avatar_url?: string;
  created_at: any;
};

export type User = {
  uid: string;
  email: string | null;
  displayName: string | null;
  photoURL: string | null;
};

type AuthState = {
  user: User | null;
  profile: UserProfile | null;
  isAdmin: boolean;
  loading: boolean;
  signInWithPassword: (params: { email: string; password: string }) => Promise<void>;
  signUp: (params: { email: string; password: string; fullName: string }) => Promise<{ error: Error | null }>;
  signOut: () => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
  refreshProfile: () => Promise<void>;
  setSubscriptionTier: (tier: SubscriptionTier) => void;
};

const AuthContext = React.createContext<AuthState | undefined>(undefined);

function toUserProfile(doc: Doc<"users"> | null): UserProfile | null {
  if (!doc) return null;
  return {
    id: doc._id,
    email: doc.email ?? "",
    role: (doc.role ?? "user") as UserRole,
    subscription_tier: (doc.subscriptionTier ?? "free") as SubscriptionTier,
    full_name: doc.fullName ?? undefined,
    avatar_url: doc.avatarUrl ?? undefined,
    created_at: doc._creationTime,
  };
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const { isLoading, isAuthenticated } = useConvexAuth();
  const { signIn, signOut: convexSignOut } = useAuthActions();
  const currentUser = useQuery(api.users.currentUser);
  const updateTier = useMutation(api.users.updateSubscriptionTier);
  const convex = useConvex();

  const [hardcodedAdmin, setHardcodedAdmin] = React.useState<boolean>(() => {
    try {
      return localStorage.getItem(LS_KEY) === "true";
    } catch {
      return false;
    }
  });

  React.useEffect(() => {
    try {
      if (hardcodedAdmin) {
        localStorage.setItem(LS_KEY, "true");
      } else {
        localStorage.removeItem(LS_KEY);
      }
    } catch { /* noop */ }
  }, [hardcodedAdmin]);

  // Detect stale JWT tokens (e.g., after key rotation) and auto-sign-out
  // to break the infinite WebSocket reconnect loop
  const wasAuthenticatedRef = React.useRef(false);

  React.useEffect(() => {
    if (isLoading) return;

    if (wasAuthenticatedRef.current && !isAuthenticated) {
      convexSignOut();
    }

    wasAuthenticatedRef.current = isAuthenticated;
  }, [isLoading, isAuthenticated, convexSignOut]);

  const profile = React.useMemo(() => {
    if (hardcodedAdmin) {
      return {
        id: "hardcoded-admin",
        email: HARDCODED_ADMIN_EMAIL,
        role: "admin" as UserRole,
        subscription_tier: "pro" as SubscriptionTier,
        full_name: "Admin",
        created_at: Date.now(),
      };
    }
    return toUserProfile(currentUser ?? null);
  }, [currentUser, hardcodedAdmin]);

  const user = React.useMemo((): User | null => {
    if (hardcodedAdmin) {
      return {
        uid: "hardcoded-admin",
        email: HARDCODED_ADMIN_EMAIL,
        displayName: "Admin",
        photoURL: null,
      };
    }
    if (!currentUser) return null;
    return {
      uid: currentUser._id,
      email: currentUser.email ?? null,
      displayName: currentUser.fullName ?? currentUser.name ?? null,
      photoURL: currentUser.image ?? null,
    };
  }, [currentUser, hardcodedAdmin]);

  const isAdmin = React.useMemo(() => profile?.role === 'admin', [profile]);

  const signInWithPassword = React.useCallback(async ({ email, password }: { email: string; password: string }) => {
    const trimmedEmail = email.toLowerCase().trim();

    if (trimmedEmail === HARDCODED_ADMIN_EMAIL) {
      if (password !== HARDCODED_ADMIN_PASSWORD) {
        throw new Error("Incorrect password for admin account.");
      }
      setHardcodedAdmin(true);
      return;
    }

    // Pre-check if email exists to avoid triggering a server exception from the auth provider
    const exists = await convex.query(api.users.checkEmailExists, { email: trimmedEmail });
    if (!exists) {
      throw new Error("Invalid email or password.");
    }

    try {
      await signIn("password", { email, password, flow: "signIn" });
    } catch (err: any) {
      const msg = err?.message ?? "";
      if (msg.includes("Invalid") || msg.includes("incorrect")) {
        throw new Error("Invalid email or password.");
      }
      throw new Error(msg || "Sign in failed. Please try again.");
    }
  }, [signIn, convex]);

  const signUp = React.useCallback(async ({ email, password, fullName }: { email: string; password: string; fullName: string }) => {
    try {
      const trimmedEmail = email.toLowerCase().trim();
      // Pre-check if email exists to avoid triggering a server exception from the auth provider
      const exists = await convex.query(api.users.checkEmailExists, { email: trimmedEmail });
      if (exists) {
        return { error: new Error("An account with this email already exists.") };
      }
      await signIn("password", { email, password, name: fullName, flow: "signUp" });
      return { error: null };
    } catch (err: any) {
      const msg = err?.message ?? "";
      if (msg.includes("already exists") || msg.includes("already in use")) {
        return { error: new Error("An account with this email already exists.") };
      }
      return { error: new Error(msg || "Sign up failed. Please try again.") };
    }
  }, [signIn, convex]);

  const signOutFn = React.useCallback(async () => {
    setHardcodedAdmin(false);
    await convexSignOut();
  }, [convexSignOut]);

  const resetPassword = React.useCallback(async (_email: string) => {
    console.warn("Password reset not yet implemented — needs email provider");
  }, []);

  const refreshProfile = React.useCallback(async () => {
    // Profile is reactive via useQuery — nothing to do.
  }, []);

  const setSubscriptionTier = React.useCallback((tier: SubscriptionTier) => {
    updateTier({ tier });
  }, [updateTier]);

  const loading = hardcodedAdmin ? false : (isLoading || (isAuthenticated && currentUser === undefined));

  const value = React.useMemo(
    () => ({
      user,
      profile,
      isAdmin,
      loading,
      signInWithPassword,
      signUp,
      signOut: signOutFn,
      resetPassword,
      refreshProfile,
      setSubscriptionTier,
    }),
    [user, profile, isAdmin, loading, signInWithPassword, signUp, signOutFn, resetPassword, refreshProfile, setSubscriptionTier]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

// eslint-disable-next-line react-refresh/only-export-components
export function useAuth() {
  const context = React.useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
