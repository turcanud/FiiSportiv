"use server";

import {addMinutes} from "date-fns";
import {prisma as db} from "@/lib/prisma";
import {redisClient} from "@/redis/redis";
import {sendVerificationEmailByCode} from "./sender.actions";
import {getUserFromSession} from "../core.actions/user.session";
import {cookies} from "next/headers";
import {verificationCodeSchema} from "../schemas";

const TOKEN_EXPIRATION_MINUTES = 30;
const CODE_EXPIRATION_SECONDS = 600;

// Utility: Generates a cryptographically secure random hex string
function generateRandomHex(length: number): string {
  const byteLength = Math.ceil(length / 2);
  const array = new Uint8Array(byteLength);
  crypto.getRandomValues(array);
  return Array.from(array, (b) => b.toString(16).padStart(2, "0")).join("");
}

// 🛡️ Securely generate and store token with expiry
export const generateVerificationToken = async (
  userId: string
): Promise<string> => {
  const token = generateRandomHex(32); // 128-bit token

  await db.user.update({
    where: {id: userId},
    data: {
      verificationToken: token,
      verificationTokenExpires: addMinutes(
        new Date(),
        TOKEN_EXPIRATION_MINUTES
      ),
    },
  });

  return token;
};

// 🎯 Generate 6-digit verification code and send via email
export const generateVerificationCode = async (
  email: string
): Promise<string> => {
  const userData = await getUserFromSession(await cookies());
  if (!userData?.id) {
    console.error("User not found in session");
    return "Something went wrong";
  }

  const code = Math.floor(100_000 + Math.random() * 900_000).toString();

  const parsedCode = verificationCodeSchema.parse({code});

  await redisClient.set(userData.id, parsedCode, {
    ex: CODE_EXPIRATION_SECONDS,
  });

  await sendVerificationEmailByCode(email, code);

  return "Sent";
};
