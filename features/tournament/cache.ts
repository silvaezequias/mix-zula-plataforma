import { revalidatePath, revalidateTag } from "next/cache";

async function revalidate(tournamentId?: string) {
  revalidatePath("/torneios");
  revalidateTag("tournaments", "max");

  if (tournamentId) revalidateTag(`tournament-${tournamentId}`, "max");
}

export const TournamentCache = {
  revalidate,
};
