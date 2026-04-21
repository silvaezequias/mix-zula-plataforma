import { DB } from "@/types";
import { ParticipantRole, ParticipantStatus, Prisma } from "@prisma/client";

async function getActive(db: DB, tournamentId: string) {
  return await db.participant.findMany({
    where: {
      tournamentId,
      status: ParticipantStatus.ACTIVE,
    },
  });
}

async function getReserved(db: DB, tournamentId: string) {
  return await db.participant.findMany({
    where: {
      tournamentId,
      status: ParticipantStatus.RESERVED,
    },
  });
}

async function findByUserId(db: DB, tournamentId: string, userId: string) {
  return await db.participant.findUnique({
    where: {
      tournamentId_userId: {
        tournamentId,
        userId,
      },
    },
  });
}

async function findById(db: DB, participantId: string) {
  return await db.participant.findUnique({
    where: {
      id: participantId,
    },
  });
}

async function update(
  db: DB,
  participantId: string,
  data: Prisma.ParticipantUpdateInput,
) {
  return await db.participant.update({
    where: { id: participantId },
    data,
  });
}

async function create(
  db: DB,
  data: {
    tournamentId: string;
    userId: string;
    status: ParticipantStatus;
    role: ParticipantRole;
    name: string;
    nickname: string;
    discordId: string;
  },
) {
  return await db.participant.create({
    data,
  });
}

async function bulkUpdateStatus(
  db: DB,
  playersId: string[],
  status: ParticipantStatus,
) {
  return await db.participant.updateMany({
    where: {
      id: { in: playersId },
    },
    data: {
      status,
    },
  });
}

async function countByTournamentId(db: DB, tournamentId: string) {
  return (await db.participant.findMany({ where: { tournamentId } })).length;
}

async function removeParticipant(db: DB, participantId: string) {
  return await db.participant.delete({ where: { id: participantId } });
}

export const ParticipantService = {
  create,
  update,
  findById,
  getActive,
  getReserved,
  findByUserId,
  bulkUpdateStatus,
  removeParticipant,
  countByTournamentId,
};
