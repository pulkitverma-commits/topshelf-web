import { createHash, randomBytes, timingSafeEqual } from "node:crypto";

/** 32 random bytes, base64url (43 chars). Given to a Mac once; only its hash is stored. */
export function newSecret(): string {
  return randomBytes(32).toString("base64url");
}

export function hashSecret(secret: string): string {
  return createHash("sha256").update(secret, "utf8").digest("hex");
}

export function sameHash(a: string, b: string): boolean {
  const x = Buffer.from(a, "hex");
  const y = Buffer.from(b, "hex");
  return x.length === y.length && timingSafeEqual(x, y);
}

// No 0/O, 1/I/L: easy to read aloud and type.
const ALPHABET = "ABCDEFGHJKMNPQRSTUVWXYZ23456789";

/** "ABCD-EFGH". 31^8 ≈ 8.5e11 combinations; codes expire after 10 minutes. */
export function newUserCode(): string {
  const bytes = randomBytes(8);
  let s = "";
  for (let i = 0; i < 8; i++) s += ALPHABET[bytes[i] % ALPHABET.length];
  return `${s.slice(0, 4)}-${s.slice(4)}`;
}

export function normaliseUserCode(input: string): string | null {
  const s = input.toUpperCase().replace(/[^A-Z0-9]/g, "");
  if (s.length !== 8 || [...s].some((c) => !ALPHABET.includes(c))) return null;
  return `${s.slice(0, 4)}-${s.slice(4)}`;
}

/** Extracts the device token from "Authorization: Bearer <token>". */
export function bearer(header: string | null): string | null {
  const m = header?.match(/^Bearer ([A-Za-z0-9_-]{32,128})$/);
  return m ? m[1] : null;
}
