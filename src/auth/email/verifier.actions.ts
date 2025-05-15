"use server";
import {cookies} from "next/headers";
import {prisma as db} from "@/lib/prisma";
import {redisClient} from "@/redis/redis";
import {getUserFromSession} from "../core.actions/user.session";
import {verificationCodeSchema} from "../schemas";

export const verifyUserToken = async (token: string) => {
  const user = await db.user.findFirst({
    where: {
      verificationToken: token,
      verificationTokenExpires: {
        gt: new Date(),
      },
    },
  });

  if (user == null) return false;

  await db.user.update({
    where: {id: user.id},
    data: {
      emailVerified: true,
      verificationToken: null,
      verificationTokenExpires: null,
    },
  });

  return true;
};

export const verifyUserCode = async (
  code: unknown
): Promise<string | boolean> => {
  const userData = await getUserFromSession(await cookies());
  if (!userData?.id) return "Something went wrong";
  const rawCode = await redisClient.get(userData?.id);
  const {success, data: Rcode} = verificationCodeSchema.safeParse(rawCode);
  console.log((success ? Rcode.code : null) == code);
  return (success ? Rcode.code : null) == code;
};
