import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuthz } from '@/auth/useAuthz';

interface ProtectedRouteProps {
  children: React.ReactNode;
  adminOnly?: boolean;
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  children,
  adminOnly = false
}) => {
  const { isAuthenticated, can, loading } = useAuthz();
  const location = useLocation();
  void isAuthenticated;
  void location;

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50" role="status" aria-label="Loading">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-islamic-primary-green" aria-hidden="true"></div>
        <span className="sr-only">Loading...</span>
      </div>
    );
  }

  if (adminOnly && !can('admin.access')) {
    // Redirect to home page if admin access is required but not granted
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
};
