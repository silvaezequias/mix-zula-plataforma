import { safeExecute } from "@/lib/safeExecute";
import { TournamentOrchestrator } from "../../orchestrator";
import { BadRequestError } from "nextfastapi/errors";
import { validateObjectId } from "@/lib/validation/fields";

export async function getTournamentMemberAction(
  tournamentId: string,
  userId: string,
) {
  return await safeExecute(async () => {
    if (!validateObjectId(tournamentId) || !validateObjectId(userId)) {
      throw new BadRequestError({
        message: "ID inserido não é válido",
      });
    }
    return await TournamentOrchestrator.feed.getTournamentMember(
      tournamentId,
      userId,
    );
  });
}
