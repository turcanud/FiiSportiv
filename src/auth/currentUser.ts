import {cookies} from "next/headers";
import {cache} from "react";
import {getUserFromSession} from "./core/session";
import {prisma as db} from "@/lib/prisma";
import {redirect} from "next/navigation";

export const getCurrentUser = cache(_getCurrentUser);

async function _getCurrentUser() {
  const user = await getUserFromSession(await cookies());
  if (user == null) return redirect("sign-in");
  const fullUser = await getUserFromDb(user.id);
  if (fullUser == null) throw new Error("User not in db");
  return fullUser;
}

async function getUserFromDb(id: string) {
  return await db.user.findFirst({
    where: {id: id},
    select: {
      email: true,
      name: true,
    },
  });
}
