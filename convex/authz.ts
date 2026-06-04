import { Doc, Id } from "../_generated/dataModel";

export type Role = "user" | "moderator" | "admin" | "system";

export async function getCurrentUserOrThrow(ctx: {
  auth: { getUserIdentity: () => Promise<any> };
  db: { query: any; get: any };
}): Promise<Doc<"users">> {
  const identity = await ctx.auth.getUserIdentity();
  if (!identity) throw new Error("Authentication required");
  const user = await ctx.db
    .query("users")
    .withIndex("email", (q: any) => q.eq("email", identity.email))
    .unique();
  if (!user) throw new Error("User not found");
  return user as Doc<"users">;
}

export async function getCurrentUser(ctx: {
  auth: { getUserIdentity: () => Promise<any> };
  db: { query: any; get: any };
}): Promise<Doc<"users"> | null> {
  const identity = await ctx.auth.getUserIdentity();
  if (!identity) return null;
  const user = await ctx.db
    .query("users")
    .withIndex("email", (q: any) => q.eq("email", identity.email))
    .unique();
  return user as Doc<"users"> | null;
}

export function hasRole(user: Doc<"users">, roles: Role[]): boolean {
  return roles.includes((user.role ?? "user") as Role);
}

export async function requireRole(
  ctx: {
    auth: { getUserIdentity: () => Promise<any> };
    db: { query: any; get: any };
  },
  roles: Role[]
): Promise<Doc<"users">> {
  const user = await getCurrentUserOrThrow(ctx);
  if (!hasRole(user, roles)) {
    throw new Error("Insufficient permissions");
  }
  return user;
}

export async function requireAdmin(ctx: {
  auth: { getUserIdentity: () => Promise<any> };
  db: { query: any; get: any };
}): Promise<Doc<"users">> {
  return requireRole(ctx, ["admin", "system"]);
}

export async function requireStaff(ctx: {
  auth: { getUserIdentity: () => Promise<any> };
  db: { query: any; get: any };
}): Promise<Doc<"users">> {
  return requireRole(ctx, ["admin", "system", "moderator"]);
}
