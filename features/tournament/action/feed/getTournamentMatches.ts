import { safeExecute } from "@/lib/safeExecute";
import { TournamentOrchestrator } from "../../orchestrator";

export async function getTournamentMatchesAction(tournamentId: string) {
  return await safeExecute(async () => {
    return await TournamentOrchestrator.feed.getTournamentMatches(tournamentId);
  });
}
