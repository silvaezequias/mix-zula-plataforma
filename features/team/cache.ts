import { revalidateTag } from "next/cache";

async function revalidate(tournamentId?: string) {
  revalidateTag("teams", "max");

  if (tournamentId) revalidateTag(`teams:${tournamentId}`, "max");
}

export const TeamsCache = {
  revalidate,
};
