import { FullTournament } from "@/types";

type Participant = FullTournament["participants"][number];

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
  if (forceSpread) {
    return Math.min(maxTeams, totalPlayers);
  }

  return Math.min(maxTeams, Math.ceil(totalPlayers / maxPlayersPerTeam));
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

  const teamCount = getTeamCount(
    players.length,
    maxTeams,
    maxPlayersPerTeam,
    forceSpread,
  );

  const teams: Participant[][] = Array.from({ length: teamCount }, () => []);

  let teamIndex = 0;

  for (const player of shuffled) {
    teams[teamIndex].push(player);

    teamIndex = (teamIndex + 1) % teamCount;
  }

  return teams;
};
