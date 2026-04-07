import { prisma } from "@/infra/prisma";
import validation from "@/lib/validation";
import { Tournament } from "@prisma/client";
import { InternalError } from "nextfastapi/errors";

export type TournamentProps = Partial<Tournament>;

async function create(ownerId: string, data: TournamentProps) {
  const validData = await validation.tournament(
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

  let createdTournament;

  try {
    createdTournament = await prisma.tournament.create({
      data: {
        ownerId,
        preset: validData.preset,
        title: validData.title!,
        description: validData.description!,
        prize: validData.prize!,

        startDate: validData.startDate!,
        endType: validData.endType!,
        endDate: validData.endDate,

        format: validData.format,
        gameMode: validData.gameMode,
        statsType: validData.statsType,
        teamManagement: validData.teamManagement,

        swapTeam: validData.swapTeam,
        matchesPerMatch: validData.matchesPerMatch,

        totalTeams: validData.totalTeams!,
        playersPerTeam: validData.playersPerTeam!,
        maxPlayers: validData.maxPlayers!,
        maxRegistrations: validData.maxRegistrations!,

        confirmationSystem: validData.confirmationSystem,
        confirmationTime: validData.confirmationTime,

        hasSubstitutes: validData.hasSubstitutes!,
        substitutesLimit: validData.substitutesLimit!,

        broadcastPlatform: validData.broadcastPlatform,
        broadcastUrl: validData.broadcastUrl,
      },
    });
  } catch (err) {
    console.log(err);
    throw new InternalError({
      message: "Houve um erro interno. Tente novamente mais tarde",
    });
  }

  return createdTournament;
}

export const TournamentService = {
  create,
};
