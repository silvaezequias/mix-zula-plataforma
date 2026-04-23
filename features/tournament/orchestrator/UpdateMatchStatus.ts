import { MatchService } from "@/features/match/service";
import { prisma } from "@/infra/prisma";
import { MatchStatus } from "@prisma/client";
import { ForbiddenError, NotFoundError } from "nextfastapi/errors";
import { TournamentService } from "../service";
import { ParticipantService } from "@/features/participant/service";
import { TournamentCache } from "../cache";
import { MatchCache } from "@/features/match/cache";

export async function updateMatchStatus(
  matchId: string,
  status: MatchStatus,
  userId: string,
) {
  const existingMatch = await MatchService.findById(prisma, matchId);

  if (!existingMatch) {
    throw new NotFoundError({
      message: "Nenhuma partida com esse ID foi encontrada",
    });
  }

  const tournament = await TournamentService.findById(
    prisma,
    existingMatch.tournamentId,
  );

  if (!tournament) {
    throw new NotFoundError({
      message: "O torneio a qual essa partida pertence não existe mais",
    });
  }

  const participant = await ParticipantService.findByUserId(
    prisma,
    tournament.id,
    userId,
  );

  if (!participant) {
    throw new ForbiddenError({
      message:
        "Você não pode atualizar o status de uma partida de um torneio que não faz parte",
    });
  }

  if (!(status in MatchStatus)) {
    throw new ForbiddenError({
      message: "Status inválido para a partida",
    });
  }

  const updatedMatch = await MatchService.updateStatus(prisma, matchId, status);

  await TournamentCache.revalidate(tournament.id);
  await MatchCache.revalidate(tournament.id);

  return updatedMatch;
}
