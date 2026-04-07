import { prisma } from "@/infra/prisma";
import validation from "@/lib/validation";
import { Prisma, Tournament } from "@prisma/client";
import { unstable_cache } from "next/cache";
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

function list(select?: Prisma.TournamentSelect, cursor?: { id: string }) {
  if (!cursor) {
    return unstable_cache(
      async () => {
        return prisma.tournament.findMany({
          take: 10,
          orderBy: [{ createdAt: "desc" }, { id: "desc" }],
          select: select,
        });
      },
      ["tournaments-initial"],
      { tags: ["tournaments"] },
    )();
  }

  return prisma.tournament.findMany({
    take: 10,
    skip: 1,
    cursor: { id: cursor.id },
    orderBy: [{ createdAt: "desc" }, { id: "desc" }],
    select: select,
  });
}

async function findById(tournamentId: string) {
  const includedTeam = {
    select: {
      id: true,
      name: true,
      members: {
        include: {
          participant: {
            select: {
              user: true,
            },
          },
        },
      },
    },
  };

  const tournament = await prisma.tournament.findUnique({
    where: { id: tournamentId },
    include: {
      teams: {
        include: {
          members: {
            include: {
              participant: {
                select: {
                  user: true,
                },
              },
            },
          },
        },
      },
      matches: {
        include: {
          team1: includedTeam,
          team2: includedTeam,
          winnerTeam: includedTeam,
        },
      },
      participants: {
        include: {
          user: true,
        },
      },
    },
  });

  return tournament;
}

export const TournamentService = {
  create,
  list,
  findById,
};
