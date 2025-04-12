import {PasswordData} from "../schemas";

export async function hashPassword(
  password: string,
  salt: string
): Promise<string> {
  const encoder = new TextEncoder();
  const data = encoder.encode(password.normalize() + salt);
  const hashBuffer = await crypto.subtle.digest("SHA-256", data);
  return Array.from(new Uint8Array(hashBuffer))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("")
    .normalize();
}

export function generateSalt(): string {
  const array = new Uint8Array(16);
  crypto.getRandomValues(array);
  return Array.from(array)
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("")
    .normalize();
}

export async function comparePasswords({
  password,
  salt,
  hashedPassword,
}: PasswordData): Promise<boolean> {
  const inputHashedPassword = await hashPassword(password, salt);
  return inputHashedPassword === hashedPassword;
}

export async function generateSessionId(): Promise<string> {
  const array = new Uint8Array(64); // 512 bits / 8 = 64 bytes
  crypto.getRandomValues(array);
  return Array.from(array)
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("")
    .normalize();
}
