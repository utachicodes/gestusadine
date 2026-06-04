import { useMemo } from 'react';
import { useAuth } from './AuthContext';
import { Role, Permission, toRole, roleCan } from './rbac';

/**
 * Authorization hook — derives the current capability role and permission
 * checks from auth state. The single place the UI asks "can this user…?".
 *
 * When auth moves to Convex Auth, only `toRole`'s input changes (role claim
 * from the session) — every `can(...)` call site stays identical.
 */
export function useAuthz() {
  const { user, profile, loading } = useAuth();
  const role: Role = useMemo(() => toRole(profile?.role, !!user), [profile?.role, user]);

  return useMemo(
    () => ({
      role,
      loading,
      isAuthenticated: !!user,
      isAdmin: role === 'admin',
      isModerator: role === 'moderator' || role === 'admin',
      can: (permission: Permission) => roleCan(role, permission),
    }),
    [role, loading, user],
  );
}
