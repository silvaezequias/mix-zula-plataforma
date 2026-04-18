import { safeExecute } from "@/lib/safeExecute";
import { TournamentOrchestrator } from "../../orchestrator";

export async function getTournamentMemberAction(
  tournamentId: string,
  userId: string,
) {
  return await safeExecute(async () => {
    return await TournamentOrchestrator.feed.getTournamentMember(
      tournamentId,
      userId,
    );
  });
}
