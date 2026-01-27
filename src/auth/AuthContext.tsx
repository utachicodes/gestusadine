import * as React from "react";
import {
  User,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut as firebaseSignOut,
  onAuthStateChanged,
  updateProfile,
  sendPasswordResetEmail
} from "firebase/auth";
import { doc, getDoc, setDoc, serverTimestamp } from "firebase/firestore";
import { auth, db } from "@/lib/firebase";

type UserRole = 'user' | 'admin';

type UserProfile = {
  id: string;
  email: string;
  role: UserRole;
  full_name?: string;
  avatar_url?: string;
  created_at: any;
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
};

const AuthContext = React.createContext<AuthState | undefined>(undefined);

// Function to get user role from profile
const getUserRole = (profile: UserProfile | null): UserRole => {
  if (!profile) return 'user';
  return profile.role || 'user';
};

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = React.useState<User | null>(null);
  const [profile, setProfile] = React.useState<UserProfile | null>(null);
  const [loading, setLoading] = React.useState(true);

  // Fetch user profile from Firestore
  const fetchUserProfile = React.useCallback(async (userId: string) => {
    try {
      const profileRef = doc(db, 'users', userId);
      const profileSnap = await getDoc(profileRef);

      if (profileSnap.exists()) {
        return profileSnap.data() as UserProfile;
      }
      return null;
    } catch (error) {
      if (import.meta.env.DEV) {
        console.error('Error fetching user profile:', error);
      }
      return null;
    }
  }, []);

  // Listen for auth state changes
  React.useEffect(() => {
    let mounted = true;

    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (!mounted) return;

      setUser(firebaseUser);

      if (firebaseUser) {
        // Fetch profile from Firestore
        const userProfile = await fetchUserProfile(firebaseUser.uid);
        if (mounted) {
          setProfile(userProfile);
        }
      } else {
        setProfile(null);
      }

      if (mounted) {
        setLoading(false);
      }
    });

    // Safety timeout
    const timeout = setTimeout(() => {
      if (mounted) {
        console.warn('Auth loading timeout - setting loading to false');
        setLoading(false);
      }
    }, 5000);

    return () => {
      mounted = false;
      clearTimeout(timeout);
      unsubscribe();
    };
  }, [fetchUserProfile]);

  const signInWithPassword = React.useCallback(async ({ email, password }: { email: string; password: string }) => {
    setLoading(true);
    try {
      await signInWithEmailAndPassword(auth, email, password);
    } finally {
      setLoading(false);
    }
  }, []);

  const signUp = React.useCallback(async ({ email, password, fullName }: { email: string; password: string; fullName: string }) => {
    setLoading(true);
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // Update display name
      await updateProfile(user, {
        displayName: fullName
      });

      // Create user profile in Firestore
      const userProfile: UserProfile = {
        id: user.uid,
        email: email,
        full_name: fullName,
        role: 'user',
        created_at: serverTimestamp()
      };

      await setDoc(doc(db, 'users', user.uid), userProfile);

      return { error: null };
    } catch (error) {
      if (import.meta.env.DEV) {
        console.error('Signup error:', error);
      }
      return { error: error as Error };
    } finally {
      setLoading(false);
    }
  }, []);

  const signOut = React.useCallback(async () => {
    // Clear state immediately
    setProfile(null);
    setUser(null);
    setLoading(false);

    // Sign out from Firebase
    try {
      await firebaseSignOut(auth);
    } catch (error) {
      if (import.meta.env.DEV) {
        console.error('Sign out error:', error);
      }
    }
  }, []);

  const resetPassword = React.useCallback(async (email: string) => {
    await sendPasswordResetEmail(auth, email);
  }, []);

  const refreshProfile = React.useCallback(async () => {
    if (user) {
      try {
        const userProfile = await fetchUserProfile(user.uid);
        setProfile(userProfile);
      } catch (error) {
        if (import.meta.env.DEV) {
          console.error('Error refreshing profile:', error);
        }
      }
    }
  }, [user, fetchUserProfile]);

  const isAdmin = React.useMemo(() => {
    return getUserRole(profile) === 'admin';
  }, [profile]);

  const value = React.useMemo(
    () => ({
      user,
      profile,
      isAdmin,
      loading,
      signInWithPassword,
      signUp,
      signOut,
      refreshProfile,
    }),
    [user, profile, isAdmin, loading, signInWithPassword, signUp, signOut, refreshProfile]
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
