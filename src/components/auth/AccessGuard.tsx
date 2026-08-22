import * as React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '@/auth/AuthContext';

interface AccessGuardProps {
  children: React.ReactNode;
  requiredTier?: string;
  fallback?: React.ReactNode;
}

const TIER_RANK: Record<string, number> = { free: 0, student: 1, pro: 2 };

/**
 * Feature-tier gate. Roles gate capabilities (see ProtectedRoute /
 * RequirePermission); tiers gate features. Must be rendered inside a
 * ProtectedRoute so an authenticated user is guaranteed.
 */
export const AccessGuard: React.FC<AccessGuardProps> = ({
  children,
  requiredTier = 'student',
  fallback,
}) => {
  const { profile, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-background" role="status" aria-label="Loading">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary" aria-hidden="true" />
        <span className="sr-only">Loading…</span>
      </div>
    );
  }

  const role = profile?.role;
  const isStaff = role === 'admin' || role === 'system' || role === 'moderator';
  const tierRank = TIER_RANK[profile?.subscriptionTier ?? 'free'] ?? 0;
  const requiredRank = TIER_RANK[requiredTier] ?? 0;

  if (!isStaff && tierRank < requiredRank) {
    return <>{fallback ?? <Navigate to="/dashboard" replace />}</>;
  }

  return <>{children}</>;
};
