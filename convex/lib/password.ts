const ITERATIONS = 100_000;
const KEY_LENGTH = 64;
const HASH_ALGORITHM = "PBKDF2";
const DIGEST_ALGORITHM = "SHA-256";

export async function hashPassword(password: string, salt?: string): Promise<{ hash: string; salt: string }> {
  const encoder = new TextEncoder();
  const saltBytes = salt
    ? Uint8Array.from(atob(salt), (c) => c.charCodeAt(0))
    : crypto.getRandomValues(new Uint8Array(16));

  const key = await crypto.subtle.importKey(
    "raw",
    encoder.encode(password),
    { name: HASH_ALGORITHM },
    false,
    ["deriveBits"]
  );

  const derivedBits = await crypto.subtle.deriveBits(
    { name: HASH_ALGORITHM, salt: saltBytes, iterations: ITERATIONS, hash: DIGEST_ALGORITHM },
    key,
    KEY_LENGTH * 8
  );

  const hashArray = new Uint8Array(derivedBits);
  const saltArray = new Uint8Array(saltBytes);

  return {
    hash: btoa(String.fromCharCode(...hashArray)),
    salt: btoa(String.fromCharCode(...saltArray)),
  };
}

export async function verifyPassword(password: string, storedHash: string, storedSalt: string): Promise<boolean> {
  const { hash } = await hashPassword(password, storedSalt);
  return hash === storedHash;
}
