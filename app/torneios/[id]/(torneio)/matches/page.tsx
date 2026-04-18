"use server";

import { redirect } from "next/navigation";
import { canShow, redirectToOverview } from "../_protect-flow";
import { getTournamentOverviewAction } from "@/features/tournament/action/feed/getTournamentOverviewAction";
import { MatchesTab } from "./MatchesTab";
import { getTournamentMatchesAction } from "@/features/tournament/action/feed/getTournamentMatches";

type TeamsProps = {
  params: Promise<{ id: string }>;
};

export default async function TeamsPage(props: TeamsProps) {
  const { id: tournamentId } = await props.params;

  const resultTournament = await getTournamentOverviewAction(tournamentId);

  if (!resultTournament.success || !resultTournament.data) {
    return redirect(`/torneios/nao-encontrado?id=${tournamentId}`);
  }
  const resultMatches = await getTournamentMatchesAction(tournamentId);

  if (!canShow("matches", resultTournament.data) || !resultMatches.data) {
    return redirectToOverview(tournamentId);
  }

  return (
    <MatchesTab
      matches={resultMatches.data}
      swapTeam={resultTournament.data.swapTeam}
    />
  );
}
