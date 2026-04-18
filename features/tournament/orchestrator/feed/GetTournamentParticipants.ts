import { prisma } from "@/infra/prisma";
import { unstable_cache } from "next/cache";

export async function getTournamentParticipants(tournamentId: string) {
  const participants = await unstable_cache(
    async (tournamentId: string) =>
      prisma.tournament.findUnique({
        where: { id: tournamentId },
        include: { participants: true, tournamentRoleRequest: true },
      }),
    ["participants"],
    { tags: [`participants:${tournamentId}`] },
  )(tournamentId);

  return participants;
}
