import posthog from 'posthog-js';

const POSTHOG_KEY = import.meta.env.VITE_POSTHOG_KEY || 'phc_zGzu24gNdMuXHaJdsQYxwJnpuEKX2ZixiyzKb8vo8zMY';
const POSTHOG_HOST = import.meta.env.VITE_POSTHOG_HOST || 'https://us.i.posthog.com';

export function initPostHog() {
  if (typeof window === 'undefined') return;
  if (posthog.__loaded) return;

  posthog.init(POSTHOG_KEY, {
    api_host: POSTHOG_HOST,
    capture_pageview: false,
    capture_pageleave: false,
    session_recording: {
      maskAllInputs: true,
      maskTextSelector: '[data-ph-mask]',
    },
    autocapture: true,
    opt_out_capturing_by_default: false,
    loaded: (ph) => {
      ph.register({ app: 'gestusadine' });
    },
  });
}

export function capturePageView() {
  posthog.capture('$pageview');
}

export function identifyUser(userId: string, traits?: Record<string, unknown>) {
  posthog.identify(userId, traits);
}

export function resetUser() {
  posthog.reset();
}

export function captureError(error: Error, context?: Record<string, unknown>) {
  posthog.capture('$exception', {
    $exception_message: error.message,
    $exception_type: error.name,
    $exception_stack: error.stack,
    ...context,
  });
}

export function captureEvent(event: string, properties?: Record<string, unknown>) {
  posthog.capture(event, properties);
}
