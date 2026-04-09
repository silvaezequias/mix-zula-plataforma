"use server";

import { getAuthOrThrow } from "@/lib/authorization/accessControl";
import { TournamentService, TournamentProps } from "./service";
import { safeExecute } from "@/lib/safeExecute";
import { BETA_WHITELIST, STAFF_ROLES } from "@/constants/data";
import { NotFoundError, UnauthorizedError } from "nextfastapi/errors";
import { revalidatePath, revalidateTag } from "next/cache";
import { ParticipantRole } from "@prisma/client";

export async function createTournamentAction(formData: TournamentProps) {
  return await safeExecute(async () => {
    const session = await getAuthOrThrow();

    if (!BETA_WHITELIST.includes(session.user.discordId)) {
      throw new UnauthorizedError({
        message: "Você não tem permissão para executar essa ação",
      });
    }

    const newTournament = await TournamentService.create(
      session.user.id,
      formData,
    );

    revalidatePath("/torneios");
    revalidateTag("tournaments", "max");

    return newTournament;
  });
}

export async function createTournamentParticipantAction(tournamentId: string) {
  return await safeExecute(async () => {
    const session = await getAuthOrThrow();

    const newParticipant = await TournamentService.createParticipant(
      tournamentId,
      session.user.id,
    );

    revalidatePath("/torneios");
    revalidateTag("tournaments", "max");

    return newParticipant;
  });
}

export async function createTournamentRoleRequestAction(
  tournamentId: string,
  role: ParticipantRole,
) {
  return await safeExecute(async () => {
    const session = await getAuthOrThrow();

    const newRequest = await TournamentService.createTournamentRoleRequest(
      tournamentId,
      session.user.id,
      role,
    );

    return newRequest;
  });
}

export async function handleTournamentRoleRequestAction(
  requestId: string,
  accept: boolean,
) {
  return await safeExecute(async () => {
    const session = await getAuthOrThrow();

    const updatedRequest =
      await TournamentService.handleTournamentRoleRequestStatus(
        session.user,
        requestId,
        accept ? "ACCEPTED" : "DENIED",
      );

    if (accept) {
      await TournamentService.createStaffParticipant(
        updatedRequest.tournamentId,
        updatedRequest.ownerId,
        updatedRequest.requestedRole,
      );
    }

    return updatedRequest;
  });
}

export async function changeParticipantRole(
  tournamentId: string,
  userId: string,
  role: ParticipantRole,
) {
  return await safeExecute(async () => {
    const session = await getAuthOrThrow();
    const existingParticipant = await TournamentService.findParticipantByUserId(
      tournamentId,
      userId,
    );

    if (!existingParticipant) {
      throw new NotFoundError({
        message: "Nenhum usuário encontrado com o ID inserido",
      });
    }

    const sessionMember = await TournamentService.findParticipantByUserId(
      tournamentId,
      session.user.id,
    );

    if (!sessionMember) {
      throw new UnauthorizedError({
        message: "Você nem devia estar fazendo isso",
      });
    }

    const participantRole = STAFF_ROLES.find(
      (r) => r.id === existingParticipant.role,
    );
    const memberRole = STAFF_ROLES.find((r) => r.id === sessionMember.role);
    const targetRole = STAFF_ROLES.find((r) => r.id === role);

    if (targetRole && memberRole && participantRole) {
      if (memberRole!.level < 8) {
        throw new UnauthorizedError({
          message: "Você não tem permissão para fazer alterações de cargos",
        });
      }

      if (participantRole.level >= memberRole.level) {
        throw new UnauthorizedError({
          message:
            "Não tem como você mudar o cargo de alguem igual a você ou acima",
        });
      }

      if (targetRole.level >= memberRole.level) {
        throw new UnauthorizedError({
          message: "Esse cargo você não tem permissão de alterar",
        });
      }
    } else if (!memberRole) {
      throw new UnauthorizedError({
        message: "Você está tentando fazer o que?",
      });
    } else if (!targetRole) {
      throw new UnauthorizedError({
        message: "Que cargo é esse? Isso não existe no sistema, amigo.",
      });
    }

    const participant = await TournamentService.createStaffParticipant(
      tournamentId,
      userId,
      role,
    );

    return participant;
  });
}

export async function removeParticipant(participantId: string) {
  return await safeExecute(async () => {
    const session = await getAuthOrThrow();

    const participant = await TournamentService.removeStaffParticipantById(
      session.user,
      participantId,
    );

    return participant;
  });
}
