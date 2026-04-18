import { safeExecute } from "@/lib/safeExecute";
import { TournamentOrchestrator } from "../../orchestrator";
import { getAuthOrThrow } from "@/lib/authorization/accessControl";
import { TournamentService } from "../../service";
import { ForbiddenError, NotFoundError } from "nextfastapi/errors";
import { prisma } from "@/infra/prisma";
import { ParticipantService } from "@/features/participant/service";

export async function getTournamentParticipantsAction(tournamentId: string) {
  return await safeExecute(async () => {
    const session = await getAuthOrThrow();

    const tournament = await TournamentService.findById(prisma, tournamentId);

    if (!tournament) {
      throw new NotFoundError({
        message: "Nenhum servidor encontrado com o ID inserido",
      });
    }

    const participant = await ParticipantService.findByUserId(
      prisma,
      tournamentId,
      session.user.id,
    );

    if (!participant) {
      throw new ForbiddenError({
        message: "Você não tem permissão para acessar a lista de usuários",
      });
    }

    return await TournamentOrchestrator.feed.getTournamentParticipants(
      tournamentId,
    );
  });
}
