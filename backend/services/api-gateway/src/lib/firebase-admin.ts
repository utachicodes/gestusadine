/**
 * ⚠️ Firebase has been removed from this project.
 *
 * This module is a TOMBSTONE. It used to initialize the Firebase Admin SDK and
 * export `auth` / `db` / `storage`. The data + auth layer is migrating to Convex
 * (see MIGRATION.md), so there is no Firebase here anymore.
 *
 * `auth`, `db`, and `storage` are proxies that throw on first use. The server
 * still boots and routes that don't touch Firestore keep working; any endpoint
 * that did read/write Firestore now fails loudly instead of silently returning
 * stale/empty data.
 */

function tombstone(service: string): any {
  const fail = (): never => {
    throw new Error(
      `Firebase ${service} has been removed from this project. ` +
        `This endpoint is pending the Convex migration (see MIGRATION.md).`,
    );
  };
  // Any property access returns another callable tombstone, so chained calls
  // like db.collection('x').doc(id).get() throw at the first invocation.
  return new Proxy(function () {} as any, {
    get: () => tombstone(service),
    apply: fail,
    construct: fail,
  });
}

// No-op: there is nothing to initialize anymore. Kept so existing callers compile.
export function initializeFirebaseAdmin(): void {
  /* Firebase removed — intentionally a no-op. */
}

export const adminAuth: any = tombstone('Auth');
export const adminDb: any = tombstone('Firestore');
export const adminStorage: any = tombstone('Storage');

// Convenient aliases (same names the rest of the backend imports).
export const auth = adminAuth;
export const db = adminDb;
export const storage = adminStorage;

export default { auth, db, storage, initializeFirebaseAdmin };
