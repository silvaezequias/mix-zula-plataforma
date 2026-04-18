import { MatchSlot, Team } from "@prisma/client";
import { ForbiddenError } from "nextfastapi/errors";

type RoundInput = {
  index: number;
  tournamentId: string;
};

type MatchInput = {
  roundIndex: number;
  matchIndex: number;

  team1Id: string | null;
  team2Id: string | null;

  nextMatchIndex: number | null;
  nextMatchSlot: MatchSlot | null;
};

export function buildBracket(teams: Team[]) {
  if (teams.length < 2) {
    throw new ForbiddenError({
      message: "Não existem times suficientes para criar as Matches",
    });
  }

  const size = Math.pow(2, Math.ceil(Math.log2(teams.length)));

  const slots: (Team | null)[] = [...teams];
  while (slots.length < size) {
    slots.push(null);
  }

  const rounds: RoundInput[] = [];
  const matches: MatchInput[] = [];

  let currentRoundSize = size;
  let roundIndex = 1;
  let globalMatchIndex = 0;

  const roundMatchIndexes: number[][] = [];

  while (currentRoundSize > 1) {
    const matchesInRound = currentRoundSize / 2;

    rounds.push({ index: roundIndex, tournamentId: teams[0].tournamentId });
    roundMatchIndexes[roundIndex] = [];

    for (let i = 0; i < matchesInRound; i++) {
      const team1 = roundIndex === 1 ? slots[i * 2] : null;
      const team2 = roundIndex === 1 ? slots[i * 2 + 1] : null;

      matches.push({
        roundIndex,
        matchIndex: globalMatchIndex,
        team1Id: team1?.id ?? null,
        team2Id: team2?.id ?? null,
        nextMatchIndex: null,
        nextMatchSlot: null,
      });

      roundMatchIndexes[roundIndex].push(globalMatchIndex);
      globalMatchIndex++;
    }

    currentRoundSize /= 2;
    roundIndex++;
  }

  for (let r = 1; r < roundMatchIndexes.length - 1; r++) {
    const currentRound = roundMatchIndexes[r];
    const nextRound = roundMatchIndexes[r + 1];

    for (let i = 0; i < currentRound.length; i++) {
      const currentMatchIndex = currentRound[i];
      const nextMatchIndex = nextRound[Math.floor(i / 2)];

      matches[currentMatchIndex].nextMatchIndex = nextMatchIndex;
      matches[currentMatchIndex].nextMatchSlot =
        i % 2 === 0 ? MatchSlot.TEAM1 : MatchSlot.TEAM2;
    }
  }

  for (const match of matches) {
    if (match.team1Id && !match.team2Id) {
      propagateWinner(match, match.team1Id, matches);
    }

    if (!match.team1Id && match.team2Id) {
      propagateWinner(match, match.team2Id, matches);
    }
  }

  return { rounds, matches };
}

export function propagateWinner(
  match: MatchInput,
  winnerId: string,
  matches: MatchInput[],
) {
  if (match.nextMatchIndex === null) return;

  const nextMatch = matches[match.nextMatchIndex];

  if (match.nextMatchSlot === MatchSlot.TEAM1) {
    nextMatch.team1Id = winnerId;
  } else {
    nextMatch.team2Id = winnerId;
  }

  if (nextMatch.team1Id && !nextMatch.team2Id) {
    propagateWinner(nextMatch, nextMatch.team1Id, matches);
  }

  if (!nextMatch.team1Id && nextMatch.team2Id) {
    propagateWinner(nextMatch, nextMatch.team2Id, matches);
  }
}
