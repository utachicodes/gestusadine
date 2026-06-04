/**
 * Role-Based Access Control — single source of truth for capabilities.
 *
 * Two distinct concepts, intentionally separated:
 *  - UserRole: the role stored on a user profile (maps to the `users.role`
 *    field today, and the future Convex `users.role`).
 *  - Role: the capability role used for access checks across the app.
 *  - Subscription tier (free/student/institution) is a SEPARATE axis handled
 *    by AccessGuard — roles gate *capabilities*, tiers gate *features*.
 *
 * This replaces the four previously-conflicting "admin" definitions
 * (Firestore role, backend ADMIN_EMAIL, a hardcoded email, and Firestore
 * rules) with one model the whole frontend reads from.
 */

// Stored on the user profile.
export type UserRole = 'user' | 'moderator' | 'admin' | 'system';

// Capability role used for access control.
export type Role = 'guest' | 'user' | 'moderator' | 'admin';

export type Permission =
  | 'admin.access'        // enter the admin area / dashboard
  | 'content.manage'      // create/edit events, videos, library, daily content
  | 'config.manage'       // configure the AI council agents
  | 'documents.manage'    // upload/manage RAG knowledge documents
  | 'rag.test'            // RAG diagnostics tool
  | 'community.moderate'; // moderate community circles and posts

const ROLE_PERMISSIONS: Record<Role, Permission[]> = {
  guest: [],
  user: [],
  moderator: ['community.moderate'],
  admin: [
    'admin.access',
    'content.manage',
    'config.manage',
    'documents.manage',
    'rag.test',
    'community.moderate',
  ],
};

/** Resolve the stored profile role (+ auth presence) into a capability role. */
export function toRole(userRole: UserRole | null | undefined, isAuthenticated: boolean): Role {
  if (!isAuthenticated) return 'guest';
  switch (userRole) {
    case 'admin':
    case 'system':
      return 'admin';
    case 'moderator':
      return 'moderator';
    default:
      return 'user';
  }
}

export function permissionsFor(role: Role): Permission[] {
  return ROLE_PERMISSIONS[role] ?? [];
}

export function roleCan(role: Role, permission: Permission): boolean {
  return permissionsFor(role).includes(permission);
}
