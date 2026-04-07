"use server";

import { getAuthOrThrow } from "@/lib/authorization/accessControl";
import { TournamentService, TournamentProps } from "./service";
import { safeExecute } from "@/lib/safeExecute";
import { BETA_WHITELIST } from "@/constants/data";
import { UnauthorizedError } from "nextfastapi/errors";
import { revalidatePath, revalidateTag } from "next/cache";

export async function createTournamentAction(formData: TournamentProps) {
  return await safeExecute(async () => {
    const session = await getAuthOrThrow();

    if (!BETA_WHITELIST.includes(session.user.discordId)) {
      throw new UnauthorizedError({
        message: "Você não tem permissão para executar essa ação",
      });
    }

    const newTournament = await TournamentService.create(
      session.user.id,
      formData,
    );

    revalidatePath("/torneios");
    revalidateTag("tournaments", "max");

    return newTournament;
  });
}
