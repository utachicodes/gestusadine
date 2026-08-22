import { useEffect, type ReactNode } from 'react';
import { useLocation } from 'react-router-dom';
import { useAuth } from '@/auth/AuthContext';
import { initPostHog, capturePageView, identifyUser, resetUser, captureError } from '@/lib/posthog';

declare global {
  interface Window {
    capturePostHogError: (error: Error) => void;
  }
}

export function PostHogProvider({ children }: { children: ReactNode }) {
  const { profile } = useAuth();
  const isAuthenticated = !!profile;
  const location = useLocation();

  useEffect(() => {
    initPostHog();
  }, []);

  useEffect(() => {
    if (isAuthenticated && profile?.id) {
      identifyUser(profile.id, {
        email: profile.email,
        name: profile.full_name,
        role: profile.role,
        subscriptionTier: profile.subscriptionTier,
      });
    } else if (isAuthenticated === false) {
      resetUser();
    }
  }, [isAuthenticated, profile?.id, profile?.email, profile?.full_name, profile?.role, profile?.subscriptionTier]);

  useEffect(() => {
    capturePageView();
  }, [location.pathname, location.search]);

  useEffect(() => {
    const originalOnError = window.onerror;
    window.onerror = (_message, _source, _lineno, _colno, error) => {
      if (error) captureError(error);
      originalOnError?.call(window, _message, _source, _lineno, _colno, error);
    };

    const originalOnUnhandledRejection = window.onunhandledrejection;
    window.onunhandledrejection = (event) => {
      const error = event.reason instanceof Error ? event.reason : new Error(String(event.reason));
      captureError(error, { type: 'unhandled_promise_rejection' });
      originalOnUnhandledRejection?.call(window, event);
    };

    window.capturePostHogError = (error: Error) => captureError(error);

    return () => {
      window.onerror = originalOnError;
      window.onunhandledrejection = originalOnUnhandledRejection;
      delete window.capturePostHogError;
    };
  }, []);

  return <>{children}</>;
}
