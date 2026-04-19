import { STAFF_ROLES } from "@/constants/data";
import { prisma } from "@/infra/prisma";
import { DB } from "@/types";
import { PayloadUser } from "@/types/next-auth";
import {
  ParticipantRole,
  ParticipantStatus,
  Prisma,
  RequestStatus,
  Tournament,
  TournamentStatus,
} from "@prisma/client";
import { revalidatePath, revalidateTag, unstable_cache } from "next/cache";
import {
  BadRequestError,
  ForbiddenError,
  InternalError,
  NotFoundError,
  UnauthorizedError,
} from "nextfastapi/errors";
import { UserService } from "../user/service";
import { validateObjectId } from "@/lib/validation/fields";

export type TournamentProps = Partial<Tournament>;

async function create(db: DB, ownerId: string, data: TournamentProps) {
  let createdTournament;

  try {
    createdTournament = await db.tournament.create({
      data: {
        ownerId,
        preset: data.preset,
        title: data.title!,
        description: data.description!,
        prize: data.prize!,

        startDate: data.startDate!,
        endType: data.endType!,
        endDate: data.endDate,

        format: data.format,
        gameMode: data.gameMode,
        statsType: data.statsType,
        teamManagement: data.teamManagement,

        swapTeam: data.swapTeam,
        matchesPerMatch: data.matchesPerMatch,

        totalTeams: data.totalTeams!,
        playersPerTeam: data.playersPerTeam!,
        maxPlayers: data.maxPlayers!,
        maxRegistrations: data.maxRegistrations!,

        confirmationSystem: data.confirmationSystem,
        confirmationTime: data.confirmationTime,

        hasSubstitutes: data.hasSubstitutes!,
        substitutesLimit: data.substitutesLimit!,

        broadcastPlatform: data.broadcastPlatform,
        broadcastUrl: data.broadcastUrl,
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

async function update(db: DB, tournamentId: string, data: TournamentProps) {
  let updatedTournament;

  try {
    updatedTournament = await db.tournament.update({
      where: { id: tournamentId },
      data: {
        title: data.title!,
        description: data.description!,
        prize: data.prize!,

        status: data.status!,

        startDate: data.startDate!,
        endType: data.endType!,
        endDate: data.endDate,

        format: data.format,
        gameMode: data.gameMode,
        statsType: data.statsType,
        teamManagement: data.teamManagement,

        swapTeam: data.swapTeam,
        matchesPerMatch: data.matchesPerMatch,

        totalTeams: data.totalTeams!,
        playersPerTeam: data.playersPerTeam!,
        maxPlayers: data.maxPlayers!,
        maxRegistrations: data.maxRegistrations!,

        confirmationSystem: data.confirmationSystem,
        confirmationTime: data.confirmationTime,

        hasSubstitutes: data.hasSubstitutes!,
        substitutesLimit: data.substitutesLimit!,

        broadcastPlatform: data.broadcastPlatform,
        broadcastUrl: data.broadcastUrl,
      },
    });
  } catch (err) {
    console.log(err);
    throw new InternalError({
      message: "Houve um erro interno. Tente novamente mais tarde",
    });
  }

  return updatedTournament;
}

function list(include?: Prisma.TournamentInclude, cursor?: { id: string }) {
  if (!cursor) {
    return unstable_cache(
      async () => {
        return prisma.tournament.findMany({
          take: 10,
          orderBy: [{ createdAt: "desc" }, { id: "desc" }],
          include: include,
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
    include: include,
  });
}

async function findById(db: DB, tournamentId: string) {
  if (!validateObjectId(tournamentId)) {
    throw new BadRequestError({
      message: "ID inserido não é válido",
    });
  }

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

  const tournament = await db.tournament.findUnique({
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
                      name: true,
                      player: true,
                      discordId: true,
                      accounts: {
                        select: {
                          providerAccountId: true,
                        },
                      },
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

export function findByIdForImage(tournamentId: string) {
  return unstable_cache(
    async () => {
      return prisma.tournament.findUnique({
        where: { id: tournamentId },
        include: {
          _count: {
            select: {
              participants: true,
            },
          },
        },
      });
    },
    [`tournament-image-${tournamentId}`],
    {
      tags: [`tournament-${tournamentId}`, `tournament-image-${tournamentId}`],
      revalidate: 300,
    },
  )();
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
    include: { user: true, tournament: true },
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
  name: string,
  nickname: string,
) {
  const existingTournament = await findById(prisma, tournamentId);

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
      name,
      nickname,
      userId,
      tournamentId,
      status: ParticipantStatus.ACTIVE,
      role: role,
    },
  });

  return newParticipant;
}

async function createParticipant(tournamentId: string, userId: string) {
  const existingTournament = await findById(prisma, tournamentId);

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

  const existingUser = await UserService.findById(prisma, userId);

  if (!existingUser) {
    throw new ForbiddenError({
      message: "Você não pode executar essa ação",
    });
  }

  if (await findParticipantByUserId(tournamentId, userId)) {
    throw new ForbiddenError({
      message: "Você já está registrado nesse torneio",
    });
  }

  const newParticipant = await prisma.participant.create({
    data: {
      name: existingUser.name!,
      nickname: existingUser.player!.nickname!,
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
  const existingTournament = await findById(prisma, tournamentId);

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

  const existingUser = await UserService.findById(prisma, userId);

  if (!existingUser) {
    throw new ForbiddenError({
      message: "Você não pode executar essa ação",
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
    : await prisma.tournamentRoleRequest.create({
        data: {
          ...data,
          name: existingUser.name!,
          nickname: existingUser.player!.nickname!,
        },
      });

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

async function revalidateCache(tournamentId?: string) {
  revalidatePath("/torneios");
  revalidateTag("tournaments", "max");

  if (tournamentId) revalidateTag(`tournament-${tournamentId}`, "max");
}

export const TournamentService = {
  create,
  update,
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
  findByIdForImage,
  createTournamentRoleRequest,
  createStaffParticipant,
  removeStaffParticipantById,
  revalidateCache,
};
