import { TournamentCache } from "@/features/tournament/cache";
import { prisma } from "@/infra/prisma";
import { ParticipantService } from "../service";
import { ForbiddenError, NotFoundError } from "nextfastapi/errors";
import { TournamentService } from "@/features/tournament/service";
import { staffRolesMap } from "@/constants/data";
import { TeamService } from "@/features/team/service";
import { RoleService } from "@/features/role/service";
import { ParticipantCache } from "../cache";

export async function removeParticipant(participantId: string, userId: string) {
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

    const participant = await ParticipantService.findByUserId(
      tx,
      existingParticipant.tournamentId,
      userId,
    );

    if (!participant) {
      throw new ForbiddenError({
        message: "Você tem permissão para gerenciar membros deste torneio",
      });
    }

    if (existingParticipant.userId === userId) {
      throw new ForbiddenError({
        message:
          "POR QUÊ DIABOS VOCÊ ESTÁ TENTANDO SE EXPULSAR? TÁ QUERENDO QUEBRAR O SISTEMA É?",
      });
    }

    const tournament = await TournamentService.findById(
      tx,
      existingParticipant.tournamentId,
    );

    if (!tournament) {
      throw new NotFoundError({
        message: "Esse torneio não foi encontrado no sistema",
      });
    }

    if (tournament?.ownerId === existingParticipant.userId) {
      throw new ForbiddenError({
        message:
          "Pronto! Agora o dono do torneio vai ficar sabendo que você tentou expulsar ele... Brincadeira",
      });
    }

    const participantRole = staffRolesMap[participant.role];
    const targetRole = staffRolesMap[existingParticipant.role];

    if (tournament?.ownerId !== userId) {
      if (participantRole.level < 8) {
        throw new ForbiddenError({
          message:
            "Você não tem permissão para gerenciar usuários nesse torneio",
        });
      }
      if (targetRole.level >= participantRole.level) {
        throw new ForbiddenError({
          message:
            "Você não pode expulsar alguem que tem o mesmo cargo ou acima de você",
        });
      }
    }

    const participantRoleRequest = await RoleService.findRoleRequest(
      tx,
      tournament.id,
      existingParticipant.userId,
    );

    if (participantRoleRequest) {
      await RoleService.updateRoleRequest(tx, {
        role: participantRoleRequest.requestedRole,
        status: "DENIED",
        tournamentId: tournament.id,
        userId: participantId,
      });
    }

    await TeamService.removeMemberByParticipantId(
      tx,
      existingParticipant.tournamentId,
      participantId,
    );
    await ParticipantService.removeParticipant(tx, participantId);

    return participant;
  });

  if (result) {
    await ParticipantCache.revalidate(result.userId, result.tournamentId);
    await TournamentCache.revalidate();
  }

  return result;
}
