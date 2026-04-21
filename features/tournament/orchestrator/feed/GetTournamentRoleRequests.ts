import { prisma } from "@/infra/prisma";
import { unstable_cache } from "next/cache";

export async function getTournamentRoleRequests(tournamentId: string) {
  const roleRequests = await unstable_cache(
    async (tournamentId: string) =>
      prisma.tournamentRoleRequest.findMany({
        where: { tournamentId },
      }),
    ["role-requests"],
    { tags: [`role-requests:${tournamentId}`] },
  )(tournamentId);

  return roleRequests;
}
