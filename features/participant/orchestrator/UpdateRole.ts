import { prisma } from "@/infra/prisma";
import { ParticipantRole } from "@prisma/client";
import { ParticipantService } from "../service";
import { ForbiddenError, NotFoundError } from "nextfastapi/errors";
import { staffRolesMap } from "@/constants/data";
import { TournamentService } from "@/features/tournament/service";
import { ParticipantCache } from "../cache";

export async function updateRole(
  participantId: string,
  role: ParticipantRole,
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

    const foundRole = staffRolesMap[role];

    if (!foundRole) {
      throw new NotFoundError({
        message: "O cargo inserido não foi encontrado no sistema",
      });
    }

    if (userId === participantId) {
      throw new ForbiddenError({
        message: "Você não pode mudar de cargo por conta própria",
      });
    }

    const participantRole = staffRolesMap[participant.role];
    const targetRole = staffRolesMap[existingParticipant.role];

    if (existingParticipant.userId === tournament.ownerId) {
      throw new ForbiddenError({
        message:
          "Você sabe que não tem como mudar o cargo do dono do torneio né?",
      });
    }

    if (tournament.ownerId !== userId) {
      if (participantRole!.level < 9) {
        throw new ForbiddenError({
          message: "Você não tem permissão para fazer alterações de cargos",
        });
      }

      if (targetRole.level >= participantRole.level) {
        throw new ForbiddenError({
          message:
            "Não tem como você mudar o cargo de alguem igual a você ou acima",
        });
      }

      if (foundRole.level >= participantRole.level) {
        throw new ForbiddenError({
          message: "Você não tem permissão de gerenciar este cargo",
        });
      }
    }

    return await ParticipantService.update(tx, existingParticipant.id, {
      role: role,
    });
  });

  if (result)
    await ParticipantCache.revalidate(result.userId, result.tournamentId);

  return result;
}
