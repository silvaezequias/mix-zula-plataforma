import { ParticipantRole, RequestStatus } from "@prisma/client";
import { RoleService } from "../service";
import { prisma } from "@/infra/prisma";
import { ParticipantCache } from "@/features/participant/cache";
import { TournamentCache } from "@/features/tournament/cache";

export async function updateRoleRequest(data: {
  userId: string;
  tournamentId: string;
  role: ParticipantRole;
  status: RequestStatus;
}) {
  const result = await RoleService.updateRoleRequest(prisma, data);

  await ParticipantCache.revalidate(data.userId, data.tournamentId);
  await TournamentCache.revalidate(data.tournamentId);

  return result;
}
