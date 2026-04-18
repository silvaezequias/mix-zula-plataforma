import { safeExecute } from "@/lib/safeExecute";
import { TournamentOrchestrator } from "../../orchestrator";

export async function getTournamentTeamsAction(tournamentId: string) {
  return await safeExecute(async () => {
    return await TournamentOrchestrator.feed.getTournamentTeams(tournamentId);
  });
}
