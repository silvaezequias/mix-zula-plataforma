import { revalidateTag } from "next/cache";

async function revalidate(tournamentId?: string) {
  revalidateTag("tournament-detail", "max");

  if (tournamentId) revalidateTag(`role-requests:${tournamentId}`, "max");
}

export const RoleCache = {
  revalidate,
};
