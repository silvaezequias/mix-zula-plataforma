"use server";

import { getAuthOrThrow } from "@/lib/authorization/accessControl";
import { TournamentService, TournamentProps } from "./service";
import { safeExecute } from "@/lib/safeExecute";
import {
  BETA_WHITELIST,
  PARTICIPANT_STATUS,
  STAFF_ROLES,
} from "@/constants/data";
import { NotFoundError, UnauthorizedError } from "nextfastapi/errors";
import { ParticipantRole, ParticipantStatus } from "@prisma/client";

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

    await TournamentService.revalidateCache();

    return newTournament;
  });
}

export async function updateTournament(
  tournamentId: string,
  data: TournamentProps,
) {
  return await safeExecute(async () => {
    const session = await getAuthOrThrow();

    const sessionMember = await TournamentService.findParticipantByUserId(
      tournamentId,
      session.user.id,
    );

    if (!sessionMember) {
      throw new UnauthorizedError({
        message: "Você não pode fazer isso. Você nem é membro desse torneio",
      });
    }

    const sessionMemberRole = STAFF_ROLES.find(
      (r) => r.id === sessionMember.role,
    );

    if (!sessionMemberRole || sessionMemberRole?.level < 9) {
      throw new UnauthorizedError({
        message:
          "Infelizmente você não tem permissão pra atualizar informações do torneio",
      });
    }

    const newTournament = await TournamentService.update(tournamentId, data);

    await TournamentService.revalidateCache(tournamentId);
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

    await TournamentService.revalidateCache(tournamentId);
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

    const existingRequest =
      await TournamentService.findTournamentRoleRequestById(requestId);

    if (!existingRequest) {
      throw new NotFoundError({
        message: "Nenhuma solicitação com esse ID foi encontrada",
      });
    }

    if (session.user.id === existingRequest.ownerId) {
      throw new UnauthorizedError({
        message:
          "Isso é estranho e nem deveria acontecer. Você não pode gerenciar sua própria solicitação.",
      });
    }

    const sessionMember = await TournamentService.findParticipantByUserId(
      existingRequest.tournamentId,
      session.user.id,
    );

    if (!sessionMember) {
      throw new UnauthorizedError({
        message: "Você nem devia estar fazendo isso",
      });
    }

    const memberRole = STAFF_ROLES.find((r) => r.id === sessionMember.role);
    const targetRole = STAFF_ROLES.find(
      (r) => r.id === existingRequest.requestedRole,
    );

    if (targetRole && memberRole) {
      if (existingRequest.tournament.ownerId !== sessionMember.userId) {
        if (memberRole!.level < 8) {
          throw new UnauthorizedError({
            message:
              "Você não tem permissão para gerenciar solicitações deste cargo",
          });
        }

        if (targetRole.level >= memberRole.level) {
          throw new UnauthorizedError({
            message:
              "Você não tem permissão para gerenciar solicitações deste cargo",
          });
        }
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

    if (session.user.id === existingParticipant.userId) {
      throw new UnauthorizedError({
        message: "Você não pode mudar de cargo por conta própria",
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

    const currentTournament = await TournamentService.findById(
      existingParticipant.tournamentId,
    );

    if (existingParticipant?.userId === currentTournament?.ownerId) {
      throw new UnauthorizedError({
        message:
          "Você sabe que não tem como mudar o cargo do dono do torneio né?",
      });
    }

    if (targetRole && memberRole && participantRole) {
      if (currentTournament?.ownerId !== sessionMember.userId) {
        if (memberRole!.level < 9) {
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

export async function changeParticipantStatus(
  tournamentId: string,
  userId: string,
  status: ParticipantStatus,
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

    const memberRole = STAFF_ROLES.find((r) => r.id === sessionMember.role);
    const targetStatus = PARTICIPANT_STATUS.find((r) => r.id === status);

    if (targetStatus && memberRole) {
      if (memberRole.level < 9) {
        throw new UnauthorizedError({
          message: "Você não tem permissão para fazer alterações status",
        });
      }
    } else if (!memberRole) {
      throw new UnauthorizedError({
        message: "Você está tentando fazer o que?",
      });
    } else if (!targetStatus) {
      throw new UnauthorizedError({
        message: "Que status é esse? Isso não existe no sistema, amigo.",
      });
    }

    const participant = await TournamentService.updateParticipantStatus(
      existingParticipant.id,
      targetStatus.id,
    );

    await TournamentService.revalidateCache(tournamentId);
    return participant;
  });
}

export async function removeParticipant(participantId: string) {
  return await safeExecute(async () => {
    const session = await getAuthOrThrow();
    const existingParticipant =
      await TournamentService.findParticipantById(participantId);

    if (!existingParticipant) {
      throw new NotFoundError({
        message: "Nenhum usuário encontrado com o ID inserido",
      });
    }

    if (existingParticipant.userId === session.user.id) {
      throw new UnauthorizedError({
        message:
          "POR QUÊ DIABOS VOCÊ ESTÁ TENTANDO SE EXPULSAR? TÁ QUERENDO QUEBRAR O SISTEMA É?",
      });
    }

    const tournament = await TournamentService.findById(
      existingParticipant.tournamentId,
    );

    if (tournament?.ownerId === existingParticipant.userId) {
      throw new UnauthorizedError({
        message:
          "Pronto! Agora o dono do torneio vai ficar sabendo que você tentou expulsar ele... Brincadeira",
      });
    }

    const participant = await TournamentService.removeStaffParticipantById(
      session.user,
      participantId,
    );

    await TournamentService.revalidateCache(existingParticipant.tournamentId);
    return participant;
  });
}
