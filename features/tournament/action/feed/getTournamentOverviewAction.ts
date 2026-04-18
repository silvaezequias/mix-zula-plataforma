import { safeExecute } from "@/lib/safeExecute";
import { TournamentOrchestrator } from "../../orchestrator";

export async function getTournamentOverviewAction(tournamentId: string) {
  return await safeExecute(async () => {
    return await TournamentOrchestrator.feed.getTournamentOverview(
      tournamentId,
    );
  });
}
