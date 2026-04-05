"use server";

import { getAuthOrThrow } from "@/lib/authorization/accessControl";
import { UpdateUserProps, UserService } from "./service";
import { safeExecute } from "@/lib/safeExecute";

export async function updateUserAction(formData: UpdateUserProps) {
  return await safeExecute(async () => {
    const session = await getAuthOrThrow();

    return UserService.update(session.user.id, formData);
  });
}
