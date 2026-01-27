import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '@/auth/AuthContext';

interface PublicRouteProps {
  children: React.ReactNode;
}

/**
 * PublicRoute - Redirects authenticated users to dashboard
 * Use this for routes that should only be accessible to non-authenticated users
 */
export const PublicRoute: React.FC<PublicRouteProps> = ({ children }) => {
  const { user, loading } = useAuth();

  // Debug logging in development
  React.useEffect(() => {
    if (import.meta.env.DEV) {
      console.log('PublicRoute - loading:', loading, 'user:', user?.uid);
    }
  }, [loading, user]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-b from-sand-50 via-islamic-light to-sand-100">
        <div className="text-center">
          <div className="h-12 w-12 border-4 border-islamic-primary-green border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-islamic-dark/70">Loading...</p>
          {import.meta.env.DEV && (
            <p className="text-xs text-gray-400 mt-2">Checking authentication...</p>
          )}
        </div>
      </div>
    );
  }

  if (user) {
    // Redirect authenticated users to dashboard
    if (import.meta.env.DEV) {
      console.log('PublicRoute - Redirecting authenticated user to dashboard');
    }
    return <Navigate to="/dashboard" replace />;
  }

  return <>{children}</>;
};

