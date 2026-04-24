import { BETA_WHITELIST } from "@/constants/data";
import { UserService } from "@/features/user/service";
import { prisma } from "@/infra/prisma";
import validation from "@/lib/validation";
import { ParticipantRole, Tournament } from "@prisma/client";
import { UnauthorizedError } from "nextfastapi/errors";
import { TournamentService } from "../service";
import { TournamentCache } from "../cache";
import { ParticipantService } from "@/features/participant/service";

export type CreateTournamentProps = Partial<Tournament>;

export async function createTournament(
  data: CreateTournamentProps,
  userId: string,
) {
  const requester = await UserService.findById(prisma, userId);

  if (!requester?.discordId || !BETA_WHITELIST.includes(requester.discordId)) {
    throw new UnauthorizedError({
      message: "Você não tem permissão para executar essa ação",
    });
  }

  const validData = validation.tournament(
    {
      preset: false,
      title: true,
      description: true,
      prize: false,

      startDate: true,
      endType: false,
      endDate: false,

      format: false,
      gameMode: false,
      statsType: false,
      teamManagement: false,

      swapTeam: false,
      matchesPerMatch: false,

      totalTeams: true,
      playersPerTeam: true,
      maxPlayers: true,
      maxRegistrations: true,

      confirmationSystem: false,
      confirmationTime: false,

      hasSubstitutes: true,
      substitutesLimit: true,

      broadcastPlatform: false,
      broadcastUrl: false,
    },
    data,
  );

  const result = await prisma.$transaction(async (tx) => {
    const createdTournament = await TournamentService.create(
      tx,
      requester.id,
      validData,
    );

    await ParticipantService.create(tx, {
      discordId: requester.discordId!,
      name: requester.name!,
      nickname: requester.player!.nickname!,
      userId: requester.id,
      tournamentId: createdTournament.id,
      role: ParticipantRole.ADMIN,
      status: "ACTIVE",
    });

    return createdTournament;
  });

  if (result.id) await TournamentCache.revalidate(result.id);

  return result;
}
