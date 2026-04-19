import { safeExecute } from "@/lib/safeExecute";
import { TournamentOrchestrator } from "../../orchestrator";
import { BadRequestError } from "nextfastapi/errors";
import { validateObjectId } from "@/lib/validation/fields";

export async function getTournamentOverviewAction(tournamentId: string) {
  return await safeExecute(async () => {
    if (!validateObjectId(tournamentId)) {
      throw new BadRequestError({
        message: "ID inserido não é válido",
      });
    }

    return await TournamentOrchestrator.feed.getTournamentOverview(
      tournamentId,
    );
  });
}
