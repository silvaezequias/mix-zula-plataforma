// /features/match/service.ts

import { DB } from "@/types";
import { MatchSlot, MatchStatus } from "@prisma/client";
import { InternalError } from "nextfastapi/errors";

type CreateMatchInput = {
  roundIndex: number;
  matchIndex: number;

  team1Id: string | null;
  team2Id: string | null;

  nextMatchIndex: number | null;
  nextMatchSlot: MatchSlot | null;
};

async function createMany(
  db: DB,
  tournamentId: string,
  matches: CreateMatchInput[],
  roundMap: Map<number, string>,
) {
  const createdMatches = [];

  for (const match of matches) {
    const roundId = roundMap.get(match.roundIndex);

    if (!roundId) {
      throw new InternalError({
        message: `Round não encontrado para index ${match.roundIndex}`,
      });
    }

    const created = await db.match.create({
      data: {
        roundId,
        tournamentId,
        team1Id: match.team1Id ?? undefined,
        team2Id: match.team2Id,
        nextMatchId: null,
        nextMatchSlot: match.nextMatchSlot,
      },
    });

    createdMatches.push({
      ...created,
      matchIndex: match.matchIndex,
      nextMatchIndex: match.nextMatchIndex,
    });
  }

  return createdMatches;
}

async function linkMatches(
  db: DB,
  matches: {
    id: string;
    matchIndex: number;
    nextMatchIndex: number | null;
    nextMatchSlot: MatchSlot | null;
  }[],
) {
  const matchMap = new Map<number, string>();

  for (const match of matches) {
    matchMap.set(match.matchIndex, match.id);
  }

  for (const match of matches) {
    if (match.nextMatchIndex === null) continue;

    const nextMatchId = matchMap.get(match.nextMatchIndex);

    if (!nextMatchId) {
      throw new Error("Next match não encontrado");
    }

    await db.match.update({
      where: { id: match.id },
      data: {
        nextMatchId,
      },
    });
  }
}

async function findById(db: DB, matchId: string) {
  return await db.match.findUnique({
    where: { id: matchId },
  });
}

async function updateStatus(db: DB, matchId: string, status: MatchStatus) {
  return await db.match.update({
    where: { id: matchId },
    data: {
      status,
    },
  });
}

export const MatchService = {
  linkMatches,
  createMany,
  findById,
  updateStatus,
};
