import { STAFF_ROLES } from "@/constants/data";
import { prisma } from "@/infra/prisma";
import validation from "@/lib/validation";
import { PayloadUser } from "@/types/next-auth";
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
                  status: true,
                  role: true,
                  user: {
                    select: {
                      discordId: true,
                    },
                  },
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

async function findParticipantById(participantId: string) {
  const participant = await prisma.participant.findUnique({
    where: { id: participantId },
  });

  return participant;
}

async function removeStaffParticipantById(
  sessionUser: PayloadUser,
  participantId: string,
) {
  const existingParticipant = await prisma.participant.findUnique({
    where: { id: participantId },
  });

  if (!existingParticipant) {
    throw new NotFoundError({
      message: "Não foi encontrado nenhum participante com esse ID",
    });
  }

  const sessionMember = await TournamentService.findParticipantByUserId(
    existingParticipant.tournamentId,
    sessionUser.id,
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

  if (memberRole && participantRole) {
    if (memberRole!.level < 8) {
      throw new UnauthorizedError({
        message: "Você não tem permissão pra realizar essa operação",
      });
    }

    if (participantRole.level >= memberRole.level) {
      throw new UnauthorizedError({
        message:
          "Não tem como você remover a participação desse usuário no torneio",
      });
    }
  } else if (!memberRole) {
    throw new UnauthorizedError({
      message: "Você está tentando fazer o que?",
    });
  }

  await prisma.participant.delete({ where: { id: existingParticipant.id } });

  return null;
}

async function createStaffParticipant(
  tournamentId: string,
  userId: string,
  role: ParticipantRole,
) {
  const existingTournament = await findById(tournamentId);

  if (!existingTournament) {
    throw new NotFoundError({
      message: "Não foi encontrado um torneio com o ID inserido",
    });
  }

  const existingParticipant = await findParticipantByUserId(
    tournamentId,
    userId,
  );

  if (existingParticipant) {
    return await prisma.participant.update({
      where: { id: existingParticipant.id },
      data: { role },
    });
  }

  const newParticipant = await prisma.participant.create({
    data: {
      userId,
      tournamentId,
      status: ParticipantStatus.ACTIVE,
      role: role,
    },
  });

  return newParticipant;
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

async function updateParticipantRole(
  participantId: string,
  role: ParticipantRole,
) {
  const updatedParticipant = await prisma.participant.update({
    where: { id: participantId },
    data: { role },
  });

  return updatedParticipant;
}

async function updateParticipantStatus(
  participantId: string,
  status: ParticipantStatus,
) {
  const updatedParticipant = await prisma.participant.update({
    where: { id: participantId },
    data: { status },
  });

  return updatedParticipant;
}

async function findTournamentRoleRequest(tournamentId: string, userId: string) {
  const request = await prisma.tournamentRoleRequest.findUnique({
    where: { ownerId_tournamentId: { ownerId: userId, tournamentId } },
  });

  return request;
}

async function findTournamentRoleRequestById(requestId: string) {
  const request = await prisma.tournamentRoleRequest.findUnique({
    where: { id: requestId },
    include: { tournament: true },
  });

  return request;
}

async function findManyTournamentRoleRequest(tournamentId: string) {
  const requests = await prisma.tournamentRoleRequest.findMany({
    where: { tournamentId },
    select: {
      owner: true,
      id: true,
      status: true,
      createdAt: true,
      requestedRole: true,
      updatedAt: true,
    },
    orderBy: { updatedAt: "desc" },
    take: 30,
  });

  return requests;
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

async function handleTournamentRoleRequestStatus(
  sessionUser: PayloadUser,
  requestId: string,
  status: RequestStatus,
) {
  const existingRequest = await findTournamentRoleRequestById(requestId);

  if (!existingRequest) {
    throw new NotFoundError({
      message: "Nenhuma solicitação com esse ID foi encontrada",
    });
  }

  const sessionParticipant = await prisma.participant.findUnique({
    where: {
      tournamentId_userId: {
        tournamentId: existingRequest.tournamentId,
        userId: sessionUser.id,
      },
    },
  });

  if (sessionParticipant?.role !== "ADMIN") {
    throw new UnauthorizedError({
      message:
        "Você precisa ser o administrador para aceitar ou negar solicitações de cargos",
    });
  }

  const updatedRequest = await prisma.tournamentRoleRequest.update({
    where: { id: existingRequest.id },
    data: { status },
  });

  return updatedRequest;
}

export const TournamentService = {
  create,
  list,
  findById,
  findParticipantById,
  findParticipantByUserId,
  findTournamentRoleRequest,
  findTournamentRoleRequestById,
  findManyTournamentRoleRequest,
  handleTournamentRoleRequestStatus,
  updateParticipantRole,
  updateParticipantStatus,
  createParticipant,
  findFirstByStatus,
  createTournamentRoleRequest,
  createStaffParticipant,
  removeStaffParticipantById,
};
