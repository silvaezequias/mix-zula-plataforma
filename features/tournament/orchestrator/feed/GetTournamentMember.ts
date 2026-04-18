import { ParticipantService } from "@/features/participant/service";
import { prisma } from "@/infra/prisma";
import { unstable_cache } from "next/cache";
import { NotFoundError } from "nextfastapi/errors";

export async function getTournamentMember(
  tournamentId: string,
  userId: string,
) {
  const existingParticipant = await unstable_cache(
    async (tournamentId: string, userId: string) =>
      ParticipantService.findByUserId(prisma, tournamentId, userId),
    ["participant"],
    { tags: [`participant:${userId}`] },
  )(tournamentId, userId);

  if (!existingParticipant) {
    throw new NotFoundError({
      message: "Não foi possível encontrar o participante com o ID inserido",
    });
  }

  return existingParticipant;
}
