import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuthz } from './useAuthz';
import { Permission } from './rbac';

interface RequirePermissionProps {
  permission: Permission;
  children: React.ReactNode;
  /** Where to send users who lack the permission (default: home). */
  redirectTo?: string;
}

/**
 * Route/section guard. Redirects unauthenticated users to /login and
 * authenticated-but-unauthorized users to `redirectTo`.
 */
export const RequirePermission: React.FC<RequirePermissionProps> = ({
  permission,
  children,
  redirectTo = '/',
}) => {
  const { can, isAuthenticated, loading } = useAuthz();
  const location = useLocation();

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-background" role="status" aria-label="Loading">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-islamic-primary-green" aria-hidden="true" />
        <span className="sr-only">Loading…</span>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (!can(permission)) {
    return <Navigate to={redirectTo} replace />;
  }

  return <>{children}</>;
};
