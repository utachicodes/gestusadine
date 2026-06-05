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
  const { user, isAuthenticated } = useAuth();
  const location = useLocation();

  useEffect(() => {
    initPostHog();
  }, []);

  useEffect(() => {
    if (isAuthenticated && user?.id) {
      identifyUser(user.id, {
        email: user.email,
        name: user.name,
        role: user.role,
        subscription_tier: user.subscription_tier,
      });
    } else if (isAuthenticated === false) {
      resetUser();
    }
  }, [isAuthenticated, user?.id, user?.email, user?.name, user?.role, user?.subscription_tier]);

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
