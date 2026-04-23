import { revalidateTag } from "next/cache";

async function revalidate(tournamentId: string) {
  revalidateTag(`matches:${tournamentId}`, "max");
}

export const MatchCache = {
  revalidate,
};
