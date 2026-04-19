import { prisma } from "@/infra/prisma";
import { RoleService } from "@/features/role/service";
import { ForbiddenError, NotFoundError } from "nextfastapi/errors";
import { ParticipantService } from "@/features/participant/service";
import { staffRolesMap } from "@/constants/data";
import { TournamentService } from "../service";
import { RequestStatus } from "@prisma/client";
import { ParticipantCache } from "@/features/participant/cache";
import { TournamentCache } from "../cache";

export async function handleRoleRequest(
  requestId: string,
  acceptRequest: boolean,
  userId: string,
) {
  const result = await prisma.$transaction(async (tx) => {
    const existingRequest = await RoleService.findRoleRequestById(
      tx,
      requestId,
    );

    if (!existingRequest) {
      throw new NotFoundError({
        message: "Nenhuma solicitação com esse ID foi encontrada",
      });
    }

    if (userId === existingRequest.ownerId) {
      throw new ForbiddenError({
        message: "Você não pode gerenciar sua própria solicitação de cargo",
      });
    }

    const tournament = await TournamentService.findById(
      tx,
      existingRequest.tournamentId,
    );

    if (!tournament) {
      throw new NotFoundError({
        message: "O torneio a qual essa solicitação pertence não existe mais",
      });
    }

    const participant = await ParticipantService.findByUserId(
      tx,
      existingRequest.tournamentId,
      userId,
    );

    if (!participant) {
      throw new ForbiddenError({
        message:
          "Você não pode gerenciar solicitações de um torneio que não faz parte",
      });
    }

    const requesterParticipant = await ParticipantService.findByUserId(
      tx,
      existingRequest.tournamentId,
      existingRequest.ownerId,
    );

    if (!requesterParticipant) {
      throw new ForbiddenError({
        message: "Quem solicitou esse cargo não pertence mais ao torneio",
      });
    }

    const participantRole = staffRolesMap[participant.role];
    const requesterRole = staffRolesMap[requesterParticipant.role];

    if (tournament.ownerId !== userId) {
      if (participantRole!.level < 8) {
        throw new ForbiddenError({
          message:
            "Você não tem permissão para gerenciar solicitações deste cargo",
        });
      }

      if (requesterRole.level >= participantRole.level) {
        throw new ForbiddenError({
          message:
            "Você não tem permissão para gerenciar solicitações deste usuário",
        });
      }
    }

    const foundRole = staffRolesMap[existingRequest.requestedRole];

    if (!foundRole) {
      throw new NotFoundError({
        message: "O cargo solicitado não existe mais no sistema",
      });
    }

    if (acceptRequest) {
      await ParticipantService.update(tx, requesterParticipant.id, {
        role: existingRequest.requestedRole,
      });
    }

    return await RoleService.updateRoleRequest(tx, {
      role: existingRequest.requestedRole,
      status: acceptRequest ? RequestStatus.ACCEPTED : RequestStatus.DENIED,
      tournamentId: existingRequest.tournamentId,
      userId: existingRequest.ownerId,
    });
  });

  await ParticipantCache.revalidate(result.ownerId, result.tournamentId);
  await TournamentCache.revalidate(result.tournamentId);

  return result;
}
