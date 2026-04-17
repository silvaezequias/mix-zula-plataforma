import { prisma } from "@/infra/prisma";
import { ParticipantStatus, TournamentStatus } from "@prisma/client";
import { ParticipantService } from "../service";
import { ForbiddenError, NotFoundError } from "nextfastapi/errors";
import { participantStatusMap, staffRolesMap } from "@/constants/data";
import { TournamentService } from "@/features/tournament/service";
import { TournamentCache } from "@/features/tournament/cache";

export async function updateStatus(
  participantId: string,
  status: ParticipantStatus,
  userId: string,
) {
  const result = await prisma.$transaction(async (tx) => {
    const existingParticipant = await ParticipantService.findById(
      tx,
      participantId,
    );

    if (!existingParticipant) {
      throw new NotFoundError({
        message: "Nenhum participante encontrado com o ID inserido",
      });
    }

    const tournament = await TournamentService.findById(
      tx,
      existingParticipant.tournamentId,
    );

    if (!tournament) {
      throw new NotFoundError({
        message: "Torneio não foi encontrado no sistema",
      });
    }

    const participant = await ParticipantService.findByUserId(
      tx,
      existingParticipant.tournamentId,
      userId,
    );

    if (!participant) {
      throw new ForbiddenError({
        message: "Você não pertence a este torneio",
      });
    }

    const foundStatus = participantStatusMap[status];

    if (!foundStatus) {
      throw new NotFoundError({
        message: "O status inserido não foi encontrado no sistema",
      });
    }

    const participantRole = staffRolesMap[participant.role];

    if (tournament.ownerId !== userId) {
      if (participantRole!.level < 9) {
        throw new ForbiddenError({
          message: "Você não tem permissão para fazer alterações de status",
        });
      }
    }

    if (tournament.status === TournamentStatus.FINISHED) {
      throw new ForbiddenError({
        message:
          "Você não pode mudar o status de um participante depois que o torneio foi finalizado",
      });
    }

    if (tournament.status === "LIVE") {
      if (status !== "ELIMINATED" && status !== "REPLACED") {
        throw new ForbiddenError({
          message:
            "Depois que o jogo começa, você só pode definir status de Eliminado ou Substituído",
        });
      }
    }

    if (tournament.status === "READY") {
      if (status !== "REPLACED") {
        throw new ForbiddenError({
          message:
            "Os times já foram criados. Apague os times atuais caso queira mudar status de algum jogador",
        });
      }
    }

    return await ParticipantService.update(tx, existingParticipant.id, {
      status: status,
    });
  });

  if (result) await TournamentCache.revalidate(result.tournamentId);

  return result;
}
