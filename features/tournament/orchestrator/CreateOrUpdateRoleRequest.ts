import { prisma } from "@/infra/prisma";
import { ParticipantRole, RequestStatus } from "@prisma/client";
import { TournamentCache } from "../cache";
import { TournamentService } from "../service";
import { ForbiddenError, NotFoundError } from "nextfastapi/errors";
import { RoleService } from "@/features/role/service";
import { ParticipantService } from "@/features/participant/service";
import { staffRolesMap } from "@/constants/data";
import { RoleOchestrator } from "@/features/role/ochestrator";

export async function createOrUpdateRoleRequest(
  tournamentId: string,
  userId: string,
  role: ParticipantRole,
) {
  const result = await prisma.$transaction(async (tx) => {
    const existingTournament = await TournamentService.findById(
      tx,
      tournamentId,
    );

    if (!existingTournament) {
      throw new NotFoundError({
        message: "Não foi encontrado um torneio com o ID inserido",
      });
    }

    const participant = await ParticipantService.findByUserId(
      tx,
      tournamentId,
      userId,
    );

    if (!participant) {
      throw new ForbiddenError({
        message: "Você precisa participar do torneio para solicitar um cargo",
      });
    }

    if (userId === existingTournament.ownerId) {
      throw new ForbiddenError({
        message:
          "Você não pode solicitar cargo no seu próprio torneio. Você já é admin, seu animal.",
      });
    }

    const existingRoleRequest = await RoleService.findRoleRequest(
      tx,
      tournamentId,
      userId,
    );

    const foundRole = staffRolesMap[role];

    if (!foundRole) {
      throw new NotFoundError({
        message: "Não foi possível encontrar esse cargo no torneio",
      });
    }

    if (existingRoleRequest) {
      if (existingRoleRequest.status !== RequestStatus.DENIED) {
        throw new ForbiddenError({
          message: "Você já tem uma solicitação de cargo registrada no sistema",
        });
      }

      return RoleOchestrator.updateRoleRequest({
        status: RequestStatus.PENDING,
        tournamentId,
        role,
        userId,
      });
    }

    return RoleService.createRoleRequest(tx, {
      status: RequestStatus.PENDING,
      nickname: participant.nickname,
      name: participant.name,
      tournamentId,
      role,
      userId,
    });
  });

  if (result) await TournamentCache.revalidate(tournamentId);

  return result;
}
