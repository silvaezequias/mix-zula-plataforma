import { prisma } from "@/infra/prisma";
import validation from "@/lib/validation";
import {
  ParticipantRole,
  ParticipantStatus,
  Prisma,
  RequestStatus,
  Tournament,
  TournamentStatus,
} from "@prisma/client";
import { unstable_cache } from "next/cache";
import {
  InternalError,
  NotFoundError,
  UnauthorizedError,
} from "nextfastapi/errors";

export type TournamentProps = Partial<Tournament>;

async function create(ownerId: string, data: TournamentProps) {
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

    await prisma.participant.create({
      data: {
        status: "ACTIVE",
        userId: ownerId,
        role: ParticipantRole.ADMIN,
        tournamentId: createdTournament.id,
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

async function findFirstByStatus(status: TournamentStatus) {
  const foundTournament = await prisma.tournament.findFirst({
    where: { status: status },
    include: { _count: true },
  });

  return foundTournament;
}

async function findParticipantByUserId(tournamentId: string, userId: string) {
  const participant = await prisma.participant.findUnique({
    where: { tournamentId_userId: { tournamentId, userId } },
  });

  return participant;
}

async function createParticipant(tournamentId: string, userId: string) {
  const existingTournament = await findById(tournamentId);

  if (!existingTournament) {
    throw new NotFoundError({
      message: "Não foi encontrado um torneio com o ID inserido",
    });
  }

  if (existingTournament.status !== "OPEN") {
    throw new UnauthorizedError({
      message: "Este torneio não está com as inscrições abertas",
    });
  }

  if (await findParticipantByUserId(tournamentId, userId)) {
    throw new UnauthorizedError({
      message: "Você já está registrado nesse torneio",
    });
  }

  const newParticipant = await prisma.participant.create({
    data: {
      userId,
      tournamentId,
      status: ParticipantStatus.ACTIVE,
      role: ParticipantRole.PLAYER,
    },
  });

  return newParticipant;
}

async function findTournamentRoleRequest(tournamentId: string, userId: string) {
  const request = await prisma.tournamentRoleRequest.findUnique({
    where: { ownerId_tournamentId: { ownerId: userId, tournamentId } },
  });

  return request;
}

async function createTournamentRoleRequest(
  tournamentId: string,
  userId: string,
  requestedRole: ParticipantRole,
) {
  const existingTournament = await findById(tournamentId);

  if (!existingTournament) {
    throw new NotFoundError({
      message: "Não foi encontrado um torneio com o ID inserido",
    });
  }

  if (userId === existingTournament.ownerId) {
    throw new UnauthorizedError({
      message:
        "Você não pode solicitar cargo no seu próprio torneio. Você já é admin, seu animal.",
    });
  }

  const existingRequest = await findTournamentRoleRequest(tournamentId, userId);

  if (existingRequest && existingRequest.status !== "DENIED") {
    throw new UnauthorizedError({
      message: "Você já tem uma solicitação pendente ou aceita",
    });
  }

  const data = {
    tournamentId,
    requestedRole,
    ownerId: userId,
    status: RequestStatus.PENDING,
  };

  const request = existingRequest
    ? await prisma.tournamentRoleRequest.update({
        where: { id: existingRequest.id },
        data,
      })
    : await prisma.tournamentRoleRequest.create({ data });

  return request;
}

export const TournamentService = {
  create,
  list,
  findById,
  findParticipantByUserId,
  findTournamentRoleRequest,
  createParticipant,
  findFirstByStatus,
  createTournamentRoleRequest,
};
