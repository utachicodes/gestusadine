/**
 * Common error types for the application
 */

import { ConvexError } from "convex/values";

export interface ApiError {
  error: string;
  message?: string;
  code?: string;
  details?: unknown;
}

export class AppError extends Error {
  constructor(
    message: string,
    public code?: string,
    public details?: unknown
  ) {
    super(message);
    this.name = 'AppError';
  }
}

export function isApiError(error: unknown): error is ApiError {
  return (
    typeof error === 'object' &&
    error !== null &&
    'error' in error &&
    typeof (error as ApiError).error === 'string'
  );
}

/**
 * Returns a SAFE, user-facing message for any error surfaced from a Convex call.
 *
 * Security: a Convex backend redacts plain `Error` messages to a generic
 * "Server Error" in production, and a raw `error.message` can otherwise leak
 * internal detail. So we only trust:
 *   - `ConvexError.data` — the intentional, user-safe message we set server-side
 *   - `AppError`         — an intentional client-side error
 *   - `ApiError`         — a structured API error
 * Everything else falls back to a generic message (never the raw `.message`).
 */
export function getErrorMessage(error: unknown, fallback = 'An unexpected error occurred'): string {
  if (error instanceof ConvexError) {
    const data = (error as ConvexError<unknown>).data;
    if (typeof data === 'string' && data.trim()) return data;
    if (data && typeof data === 'object' && typeof (data as { message?: unknown }).message === 'string') {
      return (data as { message: string }).message;
    }
    return fallback;
  }
  if (error instanceof AppError) {
    return error.message;
  }
  if (isApiError(error)) {
    return error.message || error.error || fallback;
  }
  return fallback;
}

