import {PasswordData} from "../schemas";

export async function hashPassword(
  password: string,
  salt: string
): Promise<string> {
  const encoder = new TextEncoder();
  const passwordKey = encoder.encode(password);
  const saltBuffer = encoder.encode(salt);

  const key = await crypto.subtle.importKey(
    "raw",
    passwordKey,
    {name: "PBKDF2"},
    false,
    ["deriveBits"]
  );

  const derivedBits = await crypto.subtle.deriveBits(
    {
      name: "PBKDF2",
      salt: saltBuffer,
      iterations: 100_000, // Choose depending on security/performance tradeoff
      hash: "SHA-256",
    },
    key,
    256 // output length in bits
  );

  return Array.from(new Uint8Array(derivedBits))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

export function generateSalt(length: number = 24): string {
  const buffer = new Uint8Array(length); // 24 bytes = 192 bits
  crypto.getRandomValues(buffer);
  return Array.from(buffer)
    .map((byte) => byte.toString(16).padStart(2, "0"))
    .join("");
}

function constantTimeEqual(a: string, b: string): boolean {
  if (a.length !== b.length) return false;

  let result = 0;
  for (let i = 0; i < a.length; i++) {
    result |= a.charCodeAt(i) ^ b.charCodeAt(i);
  }
  return result === 0;
}

export async function comparePasswords({
  password,
  salt,
  hashedPassword,
}: PasswordData): Promise<boolean> {
  const inputHashedPassword = await hashPassword(password, salt);
  return constantTimeEqual(inputHashedPassword, hashedPassword);
}

export async function generateSessionId(): Promise<string> {
  const array = new Uint8Array(64); // 512-bit random
  crypto.getRandomValues(array);
  return Array.from(array)
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}
