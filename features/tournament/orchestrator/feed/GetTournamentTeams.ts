import { prisma } from "@/infra/prisma";
import { unstable_cache } from "next/cache";

export async function getTournamentTeams(tournamentId: string) {
  const teams = await unstable_cache(
    async (tournamentId: string) =>
      prisma.team.findMany({
        where: { tournamentId },
        include: { members: { include: { participant: true } } },
      }),
    ["tournament-detail"],
    { tags: [`teams:${tournamentId}`] },
  )(tournamentId);

  return teams;
}
