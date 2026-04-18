import { DB } from "@/types";

type CreateRoundInput = {
  index: number;
};

async function createMany(
  db: DB,
  tournamentId: string,
  rounds: CreateRoundInput[],
) {
  const createdRounds = [];

  for (const round of rounds) {
    const created = await db.round.create({
      data: {
        tournamentId,
        index: round.index,
      },
    });

    createdRounds.push(created);
  }

  return createdRounds;
}

export const RoundService = {
  createMany,
};
