import { prisma } from "@/infra/prisma";
import { unstable_cache } from "next/cache";

export async function getTournamentMatches(tournamentId: string) {
  const matches = await unstable_cache(
    async (tournamentId: string) =>
      prisma.match.findMany({
        where: { tournamentId },
        include: {
          round: true,
          team1: { include: { members: { include: { participant: true } } } },
          team2: { include: { members: { include: { participant: true } } } },
          winnerTeam: true,
        },
      }),
    ["tournament-detail"],
    { tags: [`matches:${tournamentId}`] },
  )(tournamentId);

  return matches;
}
