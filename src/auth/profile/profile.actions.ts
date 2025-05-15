"use server";
import {z} from "zod";
import {prisma as db} from "@/lib/prisma";
import {cookies} from "next/headers";
import {
  comparePasswords,
  generateSalt,
  hashPassword,
} from "../core.actions/crypting.security";
import {
  getUserFromSession,
  removeUserFromSession,
} from "../core.actions/user.session";
import {changeNameSchema, changePasswordSchema} from "../schemas";
import {redirect} from "next/navigation";

export async function changePassword(
  unsafeData: z.infer<typeof changePasswordSchema>
) {
  const {success, data} = changePasswordSchema.safeParse(unsafeData);
  if (!success) return "Something went wrong";
  try {
    const userData = await getUserFromSession(await cookies());

    const user = await db.user.findUnique({
      where: {id: userData?.id},
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
      where: {id: userData?.id},
      data: {password: hashedPassword, salt: salt},
    });
  } catch (error) {
    console.error("Failed to update name:", error);
    return "Failed to update name. Please try again.";
  }
  redirect("/");
}

export async function deleteAccount() {
  const userData = await getUserFromSession(await cookies());
  if (!userData?.id) return "Something went wrong";
  await db.user.delete({
    where: {
      id: userData.id,
    },
  });
  await removeUserFromSession(await cookies());
  redirect("/");
}

export async function changeName(unsafeData: z.infer<typeof changeNameSchema>) {
  const {success, data} = changeNameSchema.safeParse(unsafeData);
  if (!success) return "Something went wrong";
  try {
    const userData = await getUserFromSession(await cookies());
    await db.user.update({
      where: {id: userData?.id},
      data: {name: data.name},
    });
  } catch (error) {
    console.error("Failed to update name:", error);
    return "Failed to update name. Please try again.";
  }
  redirect("/");
}
