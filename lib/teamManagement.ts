import { FullTournament } from "@/types";

type Participant = FullTournament["participants"][number];

export const normalizeLimit = (value: number): number => {
  return value === 0 ? Infinity : value;
};

export const getOrderLabel = (index: number): string => {
  let result = "";

  while (index > 0) {
    index--;

    const charCode = 65 + (index % 26);
    result = String.fromCharCode(charCode) + result;

    index = Math.floor(index / 26);
  }

  return result;
};

export const getTeamCount = (
  totalPlayers: number,
  maxTeams: number,
  maxPlayersPerTeam: number,
  forceSpread = false,
) => {
  if (totalPlayers === 0) return 0;

  const teamsLimit =
    maxTeams === 0 ? Math.ceil(totalPlayers / maxPlayersPerTeam) : maxTeams;

  if (forceSpread) {
    return Math.min(teamsLimit, totalPlayers);
  }

  return teamsLimit;
};

export const shuffle = <T>(array: T[]): T[] => {
  return [...array].sort(() => Math.random() - 0.5);
};

export const distributePlayers = (
  players: Participant[],
  maxTeams: number,
  maxPlayersPerTeam: number,
  forceSpread = false,
) => {
  const shuffled = shuffle(players);

  const totalPerTeam = Math.min(8, normalizeLimit(maxPlayersPerTeam));

  const teamCount = getTeamCount(
    players.length,
    maxTeams,
    totalPerTeam,
    forceSpread,
  );

  if (teamCount === 0) {
    return { teams: [], leftovers: shuffled };
  }

  const teams: Participant[][] = Array.from({ length: teamCount }, () => []);

  const leftovers: Participant[] = [];

  let teamIndex = 0;

  for (const player of shuffled) {
    if (teams[teamIndex].length < totalPerTeam) {
      teams[teamIndex].push(player);
    } else {
      leftovers.push(player);
    }

    teamIndex = (teamIndex + 1) % teamCount;
  }

  return { teams, leftovers };
};
