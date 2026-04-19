import { safeExecute } from "@/lib/safeExecute";
import { TournamentOrchestrator } from "../../orchestrator";
import { BadRequestError } from "nextfastapi/errors";

export async function getTournamentMatchesAction(tournamentId: string) {
  return await safeExecute(async () => {
    if (!tournamentId) {
      throw new BadRequestError({
        message: "ID inserido não é válido",
      });
    }

    return await TournamentOrchestrator.feed.getTournamentMatches(tournamentId);
  });
}
