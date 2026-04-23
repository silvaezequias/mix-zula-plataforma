import { prisma } from "@/infra/prisma";
import { TournamentCache } from "../cache";
import { TournamentService } from "../service";
import { ForbiddenError, NotFoundError } from "nextfastapi/errors";
import { ParticipantService } from "@/features/participant/service";
import { staffRolesMap } from "@/constants/data";
import { TeamService } from "@/features/team/service";
import { buildBracket } from "@/lib/buildBracket";
import { RoundService } from "@/features/round/service";
import { MatchService } from "@/features/match/service";
import { MatchCache } from "@/features/match/cache";

export async function generateBracket(tournamentId: string, userId: string) {
  const result = await prisma.$transaction(async (tx) => {
    const tournament = await TournamentService.findById(tx, tournamentId);

    if (!tournament) {
      throw new NotFoundError({
        message: "Não foi encontrado nenhum torneio com o ID inserido",
      });
    }

    const participant = await ParticipantService.findByUserId(
      tx,
      tournamentId,
      userId,
    );

    if (!participant) {
      throw new ForbiddenError({
        message: "Você não está nesse torneio",
      });
    }

    const participantRole = staffRolesMap[participant.role];

    if (!participantRole || participantRole.level < 8) {
      throw new ForbiddenError({
        message: "Você não tem permissão para executar essa ação",
      });
    }

    const existingMatches = await tx.match.count({
      where: { tournamentId },
    });

    if (existingMatches > 0) {
      throw new ForbiddenError({
        message: "Os jogos já foram gerados para esse torneio",
      });
    }

    if (tournament.status !== "SETTING_MATCHES") {
      throw new ForbiddenError({
        message: "Você não pode criar os jogos nesse estágio do torneio",
      });
    }

    const teams = await TeamService.findManyByTournamentId(tx, tournamentId);

    const bracket = buildBracket(teams);
    const rounds = await RoundService.createMany(
      tx,
      tournament.id,
      bracket.rounds,
    );

    const roundMap = new Map<number, string>();

    for (const round of rounds) {
      roundMap.set(round.index, round.id);
    }

    const matches = await MatchService.createMany(
      tx,
      tournament.id,
      bracket.matches,
      roundMap,
    );

    await MatchService.linkMatches(tx, matches);

    return {
      rounds,
      matches,
    };
  });

  if (result) {
    await TournamentCache.revalidate(tournamentId);
    await MatchCache.revalidate(tournamentId);
  }

  return result;
}
