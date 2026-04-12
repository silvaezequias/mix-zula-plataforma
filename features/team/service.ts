import { prisma } from "@/infra/prisma";
import { getOrderLabel } from "@/lib/teamManagement";
import { FullTournament } from "@/types";

type Participant = FullTournament["participants"][number];

export async function create(
  tournamentId: string,
  teamMembers: Participant[],
  teamIndex: number,
) {
  const team = await prisma.team.create({
    data: {
      tournamentId,
      side: teamIndex % 2 === 0 ? "TR" : "CT",
      name: "Time " + getOrderLabel(teamIndex),
      members: { create: teamMembers.map((m) => ({ participantId: m.id })) },
    },
  });

  return team;
}

async function deleteAllOfTournament(tournamentId: string) {
  await prisma.team.deleteMany({
    where: { tournamentId },
  });
}

export const TeamService = {
  create,
  deleteAllOfTournament,
};
