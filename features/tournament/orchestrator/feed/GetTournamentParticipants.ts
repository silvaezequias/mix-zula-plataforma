import { prisma } from "@/infra/prisma";
import { unstable_cache } from "next/cache";

export async function getTournamentParticipants(tournamentId: string) {
  const participants = await unstable_cache(
    async (tournamentId: string) =>
      prisma.participant.findMany({
        where: { tournamentId },
      }),
    ["participants"],
    { tags: [`participants:${tournamentId}`] },
  )(tournamentId);

  return participants;
}
