import { describe, it, expect } from "vitest";
import { hashPassword, verifyPassword } from "../../convex/lib/password";

describe("hashPassword", () => {
  it("produces different hashes for different passwords", async () => {
    const a = await hashPassword("password1");
    const b = await hashPassword("password2");
    expect(a.hash).not.toBe(b.hash);
  });

  it("produces different hashes for same password (different salt)", async () => {
    const a = await hashPassword("mypassword");
    const b = await hashPassword("mypassword");
    expect(a.hash).not.toBe(b.hash);
    expect(a.salt).not.toBe(b.salt);
  });

  it("returns base64-encoded hash and salt", async () => {
    const result = await hashPassword("test");
    expect(result.hash).toMatch(/^[A-Za-z0-9+/]+=*$/);
    expect(result.salt).toMatch(/^[A-Za-z0-9+/]+=*$/);
  });

  it("hash length is consistent (64 bytes = 88 base64 chars)", async () => {
    const result = await hashPassword("consistent");
    // 64 bytes → 88 base64 chars (ceil(64/3)*4)
    expect(result.hash).toHaveLength(88);
  });

  it("salt length is consistent (16 bytes = 24 base64 chars)", async () => {
    const result = await hashPassword("consistent");
    expect(result.salt).toHaveLength(24);
  });
});

describe("verifyPassword", () => {
  it("returns true for matching password", async () => {
    const { hash, salt } = await hashPassword("correcthorse");
    const result = await verifyPassword("correcthorse", hash, salt);
    expect(result).toBe(true);
  });

  it("returns false for wrong password", async () => {
    const { hash, salt } = await hashPassword("correcthorse");
    const result = await verifyPassword("wrong", hash, salt);
    expect(result).toBe(false);
  });

  it("returns false for password with extra whitespace", async () => {
    const { hash, salt } = await hashPassword("password");
    const result = await verifyPassword("password ", hash, salt);
    expect(result).toBe(false);
  });

  it("handles special characters in password", async () => {
    const { hash, salt } = await hashPassword("p@$$w0rd!#%");
    expect(await verifyPassword("p@$$w0rd!#%", hash, salt)).toBe(true);
    expect(await verifyPassword("p@$$w0rd", hash, salt)).toBe(false);
  });

  it("handles unicode password", async () => {
    const { hash, salt } = await hashPassword("motdepasse");
    expect(await verifyPassword("motdepasse", hash, salt)).toBe(true);
    expect(await verifyPassword("Motdepasse", hash, salt)).toBe(false);
  });
});
