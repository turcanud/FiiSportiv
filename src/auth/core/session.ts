import {z} from "zod";
import {redisClient} from "@/redis/redis";
import {Cookies} from "../schemas";
import {generateSessionId} from "./passwordHasher";

const SESSION_EXPIRATION_SECONDS = 60 * 60 * 24 * 7;
const COOKIE_SESSION_KEY = "session-id";

const sessionSchema = z.object({
  id: z.string(),
});

type UserSession = z.infer<typeof sessionSchema>;

export async function createUserSession(
  user: UserSession,
  cookies: Pick<Cookies, "set">
) {
  const sessionId = await generateSessionId();
  await redisClient.set(`session:${sessionId}`, sessionSchema.parse(user), {
    ex: SESSION_EXPIRATION_SECONDS,
  });
  setCookie(sessionId, cookies);
}

export async function setCookie(
  sessionId: string,
  cookies: Pick<Cookies, "set">
) {
  cookies.set(COOKIE_SESSION_KEY, sessionId, {
    secure: true,
    httpOnly: true,
    sameSite: "lax",
    expires: Date.now() + SESSION_EXPIRATION_SECONDS * 1000,
  });
}
export function getUserFromSession(cookies: Pick<Cookies, "get">) {
  const sessionId = cookies.get(COOKIE_SESSION_KEY)?.value;
  if (sessionId == null) return null;
  return getUserSessionById(sessionId);
}
export async function removeUserFromSession(
  cookies: Pick<Cookies, "delete" | "get">
) {
  const sessionId = cookies.get(COOKIE_SESSION_KEY)?.value;
  if (sessionId == null) return null;
  await redisClient.del(`session:${sessionId}`);
  cookies.delete(COOKIE_SESSION_KEY);
}

async function getUserSessionById(sessionId: string) {
  const rawUser = await redisClient.get(`session:${sessionId}`);
  const {success, data: user} = sessionSchema.safeParse(rawUser);
  return success ? user : null;
}

export async function changeNameFromSession(cookies: Pick<Cookies, "get">) {
  const sessionId = cookies.get(COOKIE_SESSION_KEY)?.value;
  if (sessionId == null) return null;
  return getUserSessionById(sessionId);
}
