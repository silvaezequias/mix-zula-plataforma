import { prisma } from "@/infra/prisma";
import { unstable_cache } from "next/cache";
import { NotFoundError } from "nextfastapi/errors";

export async function getTournamentOverview(tournamentId: string) {
  const existingTournament = await unstable_cache(
    async (id: string) =>
      prisma.tournament.findUnique({
        where: { id },
        include: {
          _count: { select: { participants: { where: { status: "ACTIVE" } } } },
        },
      }),
    ["tournament-detail"],
    { tags: [`tournament:${tournamentId}`] },
  )(tournamentId);

  if (!existingTournament) {
    throw new NotFoundError({
      message: "Não foi possível encontrar o torneio com o ID inserido",
    });
  }

  return existingTournament;
}
