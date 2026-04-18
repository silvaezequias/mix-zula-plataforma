import { revalidateTag } from "next/cache";

async function revalidate(userId?: string, tournamentId?: string) {
  revalidateTag("participant", "max");
  revalidateTag("participants", "max");

  if (userId) revalidateTag(`participant:${userId}`, "max");
  if (tournamentId) revalidateTag(`participants:${tournamentId}`, "max");
}

export const ParticipantCache = {
  revalidate,
};
