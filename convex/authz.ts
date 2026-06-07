import { ConvexError } from "convex/values";
import { Doc, Id } from "./_generated/dataModel";
import { getAuthUserId } from "@convex-dev/auth/server";

export type Role = "user" | "moderator" | "admin" | "system";

export async function getCurrentUserOrThrow(ctx: {
  auth: { getUserIdentity: () => Promise<any> };
  db: { query: any; get: any };
}): Promise<Doc<"users">> {
  const userId = await getAuthUserId(ctx);
  if (!userId) throw new ConvexError("Please sign in to continue.");
  const user = await ctx.db.get(userId);
  if (!user) throw new ConvexError("Please sign in to continue.");
  return user as Doc<"users">;
}

export async function getCurrentUser(ctx: {
  auth: { getUserIdentity: () => Promise<any> };
  db: { query: any; get: any };
}): Promise<Doc<"users"> | null> {
  const userId = await getAuthUserId(ctx);
  if (!userId) return null;
  const user = await ctx.db.get(userId);
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
    throw new ConvexError("You don't have permission to do that.");
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
