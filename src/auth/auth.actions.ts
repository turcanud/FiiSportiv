"use server";
import {z} from "zod";
import {redirect} from "next/navigation";
import {signInSchema, signUpSchema} from "./schemas";

import {prisma as db} from "@/lib/prisma";
import {
  comparePasswords,
  generateSalt,
  hashPassword,
} from "./core.actions/crypting.security";
import {
  createUserSession,
  removeUserFromSession,
} from "./core.actions/user.session";
import {cookies} from "next/headers";
import {sendVerificationEmailByToken} from "./email/sender.actions";
import {Prisma} from "@prisma/client";

export async function signIn(unsafeData: z.infer<typeof signInSchema>) {
  const {success, data} = signInSchema.safeParse(unsafeData);
  if (!success) return "Something went wrong";

  try {
    const user = await db.user.findUnique({
      where: {email: data.email},
      select: {
        id: true,
        email: true,
        password: true,
        salt: true,
        emailVerified: true,
        verificationToken: true,
        verificationTokenExpires: true,
      },
    });

    if (user == null) return "User doesnt exist";

    const now = new Date();
    const verificationDate: Date | null = user.verificationTokenExpires;

    if (verificationDate != null && verificationDate < now) {
      await db.user.delete({
        where: {
          id: user.id,
        },
      });
      return "User doesnt exist((";
    }

    if (user?.emailVerified == false) return "Email not verified";

    const passwordCheck = await comparePasswords({
      hashedPassword: user.password,
      password: data.password,
      salt: user.salt,
    });
    if (!passwordCheck) return "Unable to log u in";
    await createUserSession(user, await cookies());
  } catch (error) {
    return "Something went wrong: " + error;
  }
  redirect("/");
}

export async function signUp(unsafeData: z.infer<typeof signUpSchema>) {
  const {success, data} = signUpSchema.safeParse(unsafeData);
  if (!success) return "Unable to create ur account";

  try {
    const existingUser = await db.user.findUnique({
      where: {email: data.email},
    });
    if (existingUser != null) return "Account already exists";

    const salt = generateSalt();
    const hashedPassword = await hashPassword(data.password, salt);

    console.log("Aici?");

    const userData: Prisma.UserCreateInput = {
      name: data.name,
      email: data.email,
      password: hashedPassword,
      salt: salt,
      emailVerified: false,
    };

    const user = await db.user.create({data: userData});

    console.log("Aici??creat in db");

    if (user == null) return "Unable creating the account";

    console.log("Aici???if user null");

    await sendVerificationEmailByToken(user.id, user.email);

    console.log("Aici????dupa email sent");

    return "Please verify email: " + user.email;
  } catch (error) {
    return "Unable creating the account: " + error;
  }
}

export async function logOut(): Promise<void> {
  await removeUserFromSession(await cookies());
  redirect("/");
}
