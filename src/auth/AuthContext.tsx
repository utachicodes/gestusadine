import * as React from "react";
import { useConvexAuth, useAuthActions } from "@convex-dev/auth/react";
import { useQuery, useMutation, useConvex } from "convex/react";
import { api } from "../../convex/_generated/api";
import type { Doc } from "../../convex/_generated/dataModel";
import { UserRole } from "./rbac";

export type SubscriptionTier = 'free' | 'student' | 'pro';
export type Gender = 'male' | 'female';

export type UserProfile = {
  id: string;
  email: string;
  role: UserRole;
  subscription_tier: SubscriptionTier;
  full_name?: string;
  avatar_url?: string;
  created_at: any;
  gender?: Gender;
  onboarding_completed?: boolean;
};

export type User = {
  uid: string;
  email: string | null;
  displayName: string | null;
  photoURL: string | null;
};

type SignUpResult = {
  error: Error | null;
};

type AuthState = {
  user: User | null;
  profile: UserProfile | null;
  isAdmin: boolean;
  loading: boolean;
  signInWithPassword: (params: { email: string; password: string }) => Promise<void>;
  signUp: (params: { email: string; password: string; fullName: string; gender?: Gender }) => Promise<SignUpResult>;
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
    gender: doc.gender as Gender | undefined,
    onboarding_completed: doc.onboardingCompleted ?? false,
  };
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const { isLoading, isAuthenticated } = useConvexAuth();
  const { signIn, signOut: convexSignOut } = useAuthActions();
  const currentUser = useQuery(api.users.currentUser);
  const updateTier = useMutation(api.users.updateSubscriptionTier);
  const convex = useConvex();

  // Detect stale JWT tokens (e.g., after key rotation) and auto-sign-out
  // to break the infinite WebSocket reconnect loop. We only trigger this
  // after the initial load settles — not on first mount — to avoid signing
  // out PWA users whose tokens are still valid when the app resumes.
  const wasAuthenticatedRef = React.useRef<boolean | null>(null);

  React.useEffect(() => {
    if (isLoading) return;

    if (wasAuthenticatedRef.current === true && !isAuthenticated) {
      // Auth was confirmed on a previous render, now it's gone — stale token.
      convexSignOut();
    }

    if (wasAuthenticatedRef.current === null) {
      // First settled render: record state without triggering sign-out.
      wasAuthenticatedRef.current = isAuthenticated;
    } else {
      wasAuthenticatedRef.current = isAuthenticated;
    }
  }, [isLoading, isAuthenticated, convexSignOut]);

  const profile = React.useMemo(() => toUserProfile(currentUser ?? null), [currentUser]);

  const user = React.useMemo((): User | null => {
    if (!currentUser) return null;
    return {
      uid: currentUser._id,
      email: currentUser.email ?? null,
      displayName: currentUser.fullName ?? currentUser.name ?? null,
      photoURL: currentUser.image ?? null,
    };
  }, [currentUser]);

  const isAdmin = React.useMemo(() => profile?.role === 'admin' || profile?.role === 'system', [profile]);

  const signInWithPassword = React.useCallback(async ({ email, password }: { email: string; password: string }) => {
    const trimmedEmail = email.toLowerCase().trim();

    // Pre-check if email exists to avoid triggering a server exception from the auth provider
    try {
      const exists = await convex.query(api.users.checkEmailExists, { email: trimmedEmail });
      if (!exists) {
        throw new Error("Invalid email or password.");
      }
    } catch (e: any) {
      if (e?.message?.includes("Invalid email")) throw e;
      throw new Error("Connection error. Please check the server is running.");
    }

    try {
      await signIn("password", { email, password, flow: "signIn" });
    } catch {
      throw new Error("Invalid email or password.");
    }
  }, [signIn, convex]);

  const signUp = React.useCallback(async ({
    email,
    password,
    fullName,
    gender,
  }: {
    email: string;
    password: string;
    fullName: string;
    gender?: Gender;
  }) => {
    const trimmedEmail = email.toLowerCase().trim();

    if (!fullName?.trim()) {
      return { error: new Error("Please enter your full name.") };
    }

    const exists = await convex.query(api.users.checkEmailExists, { email: trimmedEmail });
    if (exists) {
      return { error: new Error("An account with this email already exists.") };
    }

    try {
      await signIn("password", {
        email: trimmedEmail,
        password,
        name: fullName.trim(),
        gender: gender ?? undefined,
        flow: "signUp",
      } as any);
    } catch (err: any) {
      return { error: new Error(err?.message ?? "Sign up failed. Please try again.") };
    }

    // Signup succeeded — user is now authenticated, redirect them straight in.
    return { error: null };
  }, [signIn, convex]);

  const signOutFn = React.useCallback(async () => {
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

  const loading = isLoading || (isAuthenticated && currentUser === undefined);

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
