"use server";

import {z} from "zod";
import {redirect} from "next/navigation";
import {
  changeNameSchema,
  changePasswordSchema,
  signInSchema,
  signUpSchema,
} from "./schemas";

import {prisma as db} from "@/lib/prisma";
import {
  comparePasswords,
  generateSalt,
  hashPassword,
} from "./core/passwordHasher";
import {
  createUserSession,
  getUserFromSession,
  removeUserFromSession,
} from "./core/session";
import {cookies} from "next/headers";

export async function signIn(unsafeData: z.infer<typeof signInSchema>) {
  const {success, data} = signInSchema.safeParse(unsafeData);
  if (!success) return "Unable to log you in";

  try {
    const user = await db.user.findUnique({
      where: {email: data.email},
      select: {
        id: true,
        email: true,
        password: true,
        salt: true,
      },
    });
    if (user == null) return "Unable to log u in";
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

    //OTP

    const salt = generateSalt();
    const hashedPassword = await hashPassword(data.password, salt);

    const user = await db.user.create({
      data: {
        name: data.name,
        email: data.email,
        password: hashedPassword,
        salt: salt,
      },
    });

    if (user == null) return "Unable creating the account";
    await createUserSession(user, await cookies());
  } catch (error) {
    return "Unable creating the account: " + error;
  }
  redirect("/");
}

export async function logOut(): Promise<void> {
  await removeUserFromSession(await cookies());
  redirect("/");
}

export async function changePassword(
  unsafeData: z.infer<typeof changePasswordSchema>
) {
  const {success, data} = changePasswordSchema.safeParse(unsafeData);
  if (!success) return "Something went wrong";
  try {
    const userId = await getUserFromSession(await cookies());

    const user = await db.user.findUnique({
      where: {id: userId?.id},
      select: {
        password: true,
        salt: true,
      },
    });
    if (user == null) return "Unable to log u in";

    const passwordCheck = await comparePasswords({
      hashedPassword: user.password,
      password: data.currentPassword,
      salt: user.salt,
    });

    if (!passwordCheck) return "Unable to log u in";

    const salt = generateSalt();
    const hashedPassword = await hashPassword(data.newPassword, salt);

    await db.user.update({
      where: {id: userId?.id},
      data: {password: hashedPassword, salt: salt},
    });
  } catch (error) {
    console.error("Failed to update name:", error);
    return "Failed to update name. Please try again.";
  }
  redirect("/");
}

export async function changeEmail(): Promise<void> {}

export async function deleteAccount() {
  const userId = await getUserFromSession(await cookies());
  if (!userId?.id) return "Something went wrong";
  await db.user.delete({
    where: {
      id: userId.id,
    },
  });
  await removeUserFromSession(await cookies());
  redirect("/");
}

export async function changeName(unsafeData: z.infer<typeof changeNameSchema>) {
  const {success, data} = changeNameSchema.safeParse(unsafeData);
  if (!success) return "Something went wrong";
  try {
    const userId = await getUserFromSession(await cookies());
    await db.user.update({
      where: {id: userId?.id},
      data: {name: data.name},
    });
  } catch (error) {
    console.error("Failed to update name:", error);
    return "Failed to update name. Please try again.";
  }
  redirect("/");
}
