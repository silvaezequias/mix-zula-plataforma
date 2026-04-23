import { prisma } from "@/infra/prisma";
import { TournamentCache } from "../../tournament/cache";
import { ParticipantService } from "@/features/participant/service";
import { ForbiddenError, NotFoundError } from "nextfastapi/errors";
import { TournamentService } from "../../tournament/service";
import { ParticipantRole, ParticipantStatus } from "@prisma/client";
import { UserService } from "@/features/user/service";
import { ParticipantCache } from "../cache";

export async function createParticipant(tournamentId: string, userId: string) {
  const result = await prisma.$transaction(async (tx) => {
    const existingParticipant = await ParticipantService.findByUserId(
      tx,
      tournamentId,
      userId,
    );

    if (existingParticipant) {
      throw new ForbiddenError({
        message:
          "Você já faz parte desse torneio, não pode criar mais um participante.",
      });
    }

    const existingTournament = await TournamentService.findById(
      tx,
      tournamentId,
    );

    if (!existingTournament) {
      throw new NotFoundError({
        message: "Não foi encontrado um torneio com o ID inserido",
      });
    }

    if (existingTournament.status !== "OPEN") {
      throw new ForbiddenError({
        message: "Este torneio não está com as inscrições abertas",
      });
    }

    const totalParticipants = await ParticipantService.countByTournamentId(
      tx,
      tournamentId,
    );

    if (existingTournament.maxRegistrations) {
      if (totalParticipants >= existingTournament.maxRegistrations) {
        throw new ForbiddenError({
          message: "Torneio já atingiu limite de participantes.",
        });
      }
    }

    const requester = await UserService.findById(tx, userId);

    if (!requester) {
      throw new ForbiddenError({
        message: "Como você chegou até aqui? Não pode continuar!",
      });
    }

    return await ParticipantService.create(tx, {
      name: requester.name!,
      nickname: requester.player!.nickname!,
      role: ParticipantRole.PLAYER,
      status: ParticipantStatus.ACTIVE,
      discordId: requester.discordId!,
      tournamentId,
      userId,
    });
  });

  if (result.id) {
    await TournamentCache.revalidate(tournamentId);
    await ParticipantCache.revalidate(userId, tournamentId);
  }

  return result;
}
