import * as React from "react";
import { useConvexAuth, useAuthActions } from "@convex-dev/auth/react";
import { useQuery, useConvex } from "convex/react";
import { api } from "../../convex/_generated/api";
import type { Doc } from "../../convex/_generated/dataModel";
import { UserRole } from "./rbac";

function userMessage(err: unknown, fallback: string): string {
  if (!err || typeof err !== "object") return fallback;
  const e = err as Record<string, unknown>;
  if (typeof e.data === "string" && e.data) return e.data;
  if (typeof e.message === "string" && !e.message.startsWith("[CONVEX")) return e.message;
  return fallback;
}

export type Gender = 'male' | 'female';

export type UserProfile = {
  id: string;
  email: string;
  role: UserRole;
  full_name?: string;
  avatar_url?: string;
  created_at: number;
  gender?: Gender;
  onboarding_completed?: boolean;
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
  signIn: (email: string, password: string, name?: string, gender?: Gender) => Promise<void>;
  signOut: () => Promise<void>;
  refreshProfile: () => Promise<void>;
};

const AuthContext = React.createContext<AuthState | undefined>(undefined);

function toUserProfile(doc: Doc<"users"> | null): UserProfile | null {
  if (!doc) return null;
  return {
    id: doc._id,
    email: doc.email ?? "",
    role: (doc.role ?? "user") as UserRole,
    full_name: doc.fullName ?? undefined,
    avatar_url: doc.avatarUrl ?? undefined,
    created_at: doc._creationTime,
    gender: doc.gender as Gender | undefined,
    onboarding_completed: doc.onboardingCompleted ?? false,
  };
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const { isLoading, isAuthenticated } = useConvexAuth();
  const { signIn: convexSignIn, signOut: convexSignOut } = useAuthActions();
  const currentUser = useQuery(api.users.currentUser);
  const convex = useConvex();

  const wasAuthenticatedRef = React.useRef<boolean | null>(null);

  React.useEffect(() => {
    if (isLoading) return;
    if (wasAuthenticatedRef.current === true && !isAuthenticated) {
      convexSignOut();
    }
    wasAuthenticatedRef.current = isAuthenticated;
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

  const signInFn = React.useCallback(async (email: string, password: string, name?: string, gender?: Gender) => {
    const trimmedEmail = email.toLowerCase().trim();
    try {
      await convexSignIn("credentials", {
        email: trimmedEmail,
        password,
        name: name || trimmedEmail.split("@")[0],
        gender,
      } as any);
    } catch (err) {
      throw new Error(userMessage(err, "Sign in failed. Please try again."));
    }
  }, [convexSignIn]);

  const signOutFn = React.useCallback(async () => {
    await convexSignOut();
  }, [convexSignOut]);

  const refreshProfile = React.useCallback(async () => {}, []);

  const loading = isLoading || (isAuthenticated && currentUser === undefined);

  const value = React.useMemo(
    () => ({
      user,
      profile,
      isAdmin,
      loading,
      signIn: signInFn,
      signOut: signOutFn,
      refreshProfile,
    }),
    [user, profile, isAdmin, loading, signInFn, signOutFn, refreshProfile]
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
