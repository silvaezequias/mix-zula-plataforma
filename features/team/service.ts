import { getOrderLabel } from "@/lib/teamManagement";
import { DB } from "@/types";

export async function create(
  db: DB,
  data: {
    tournamentId: string;
    teamIndex: number;
  },
) {
  const { teamIndex, tournamentId } = data;

  const team = await db.team.create({
    data: {
      tournamentId,
      side: teamIndex % 2 === 0 ? "TR" : "CT",
      name: "Time " + getOrderLabel(teamIndex),
    },
  });

  return team;
}

async function deleteAllOfTournament(db: DB, tournamentId: string) {
  await db.team.deleteMany({
    where: { tournamentId },
  });
}

async function addMembers(db: DB, teamId: string, players: string[]) {
  const participantsMap = players.map((player) => ({
    participantId: player,
  }));

  return await db.team.update({
    where: { id: teamId },
    data: {
      members: {
        createMany: {
          data: participantsMap,
        },
      },
    },
  });
}

async function findManyByTournamentId(db: DB, tournamentId: string) {
  return await db.team.findMany({
    where: { tournamentId },
  });
}

async function removeMemberByParticipantId(
  db: DB,
  tournamentId: string,
  participantId: string,
) {
  return await db.teamMember.deleteMany({
    where: {
      team: { tournamentId },
      participantId,
    },
  });
}

export const TeamService = {
  create,
  addMembers,
  deleteAllOfTournament,
  findManyByTournamentId,
  removeMemberByParticipantId,
};
