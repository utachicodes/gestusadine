import type { NextFunction, Request, Response } from "express";
import { createRemoteJWKSet, jwtVerify } from "jose";

const ADMIN_EMAIL = process.env.ADMIN_EMAIL || "abdoullahaljersi@gmail.com";

// Lazy init variables
let issuer: string | undefined;
let jwks: any; // ReturnType<typeof createRemoteJWKSet>

function getJWKS() {
  if (jwks) return { jwks, issuer };

  const supabaseUrl = process.env.SUPABASE_URL;
  if (!supabaseUrl) {
    throw new Error("Missing SUPABASE_URL env var");
  }

  issuer = `${supabaseUrl}/auth/v1`;
  jwks = createRemoteJWKSet(new URL(`${issuer}/.well-known/jwks.json`));
  return { jwks, issuer };
}

export type AuthUser = {
  sub: string;
  email?: string;
};

declare global {
  namespace Express {
    interface Request {
      authUser?: AuthUser;
      isAdmin?: boolean;
    }
  }
}

async function parseBearerToken(req: Request): Promise<string | null> {
  const header = req.headers.authorization;
  if (!header) return null;
  const [scheme, token] = header.split(" ");
  if (scheme?.toLowerCase() !== "bearer" || !token) return null;
  return token;
}

export async function requireAuth(req: Request, res: Response, next: NextFunction) {
  try {
    const token = await parseBearerToken(req);
    if (!token) {
      res.status(401).json({ error: "Unauthorized" });
      return;
    }

    const { jwks, issuer } = getJWKS();

    const { payload } = await jwtVerify(token, jwks, {
      issuer,
      audience: "authenticated",
    });

    const email = typeof payload.email === "string" ? payload.email : undefined;
    req.authUser = {
      sub: String(payload.sub),
      email,
    };
    req.isAdmin = (email ?? "").toLowerCase() === ADMIN_EMAIL.toLowerCase();

    next();
  } catch (_err) {
    res.status(401).json({ error: "Unauthorized" });
  }
}

export async function optionalAuth(req: Request, res: Response, next: NextFunction) {
  try {
    const token = await parseBearerToken(req);
    if (!token) {
      next();
      return;
    }

    const { jwks, issuer } = getJWKS();

    const { payload } = await jwtVerify(token, jwks, {
      issuer,
      audience: "authenticated",
    });

    const email = typeof payload.email === "string" ? payload.email : undefined;
    req.authUser = {
      sub: String(payload.sub),
      email,
    };
    req.isAdmin = (email ?? "").toLowerCase() === ADMIN_EMAIL.toLowerCase();

    next();
  } catch (_err) {
    // If token is invalid, just proceed as guest
    next();
  }
}

export async function requireAdmin(req: Request, res: Response, next: NextFunction) {
  await requireAuth(req, res, () => {
    if (!req.isAdmin) {
      res.status(403).json({ error: "Forbidden" });
      return;
    }
    next();
  });
}
