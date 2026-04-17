import { DB } from "@/types";
import { ParticipantRole, RequestStatus } from "@prisma/client";

async function createRoleRequest(
  db: DB,
  data: {
    userId: string;
    tournamentId: string;
    role: ParticipantRole;
    status: RequestStatus;
  },
) {
  return await db.tournamentRoleRequest.create({
    data: {
      requestedRole: data.role,
      ownerId: data.userId,
      tournamentId: data.tournamentId,
      status: data.status,
    },
  });
}

async function updateRoleRequest(
  db: DB,
  data: {
    userId: string;
    tournamentId: string;
    role: ParticipantRole;
    status: RequestStatus;
  },
) {
  return await db.tournamentRoleRequest.update({
    where: {
      ownerId_tournamentId: {
        ownerId: data.userId,
        tournamentId: data.tournamentId,
      },
    },
    data: {
      requestedRole: data.role,
      status: data.status,
    },
  });
}

async function findRoleRequest(db: DB, tournamentId: string, userId: string) {
  const request = await db.tournamentRoleRequest.findUnique({
    where: { ownerId_tournamentId: { ownerId: userId, tournamentId } },
  });

  return request;
}

async function findRoleRequestById(db: DB, requestId: string) {
  const request = await db.tournamentRoleRequest.findUnique({
    where: { id: requestId },
  });

  return request;
}

export const RoleService = {
  createRoleRequest,
  updateRoleRequest,
  findRoleRequestById,
  findRoleRequest,
};
