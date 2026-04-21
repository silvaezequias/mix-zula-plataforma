"use server";

import { redirect } from "next/navigation";
import { TeamsView } from "./TeamsTab";
import { getTournamentTeamsAction } from "@/features/tournament/action/feed/getTournamentTeamsAction";
import { canShow, redirectToOverview } from "../../_protect-flow";
import { getTournamentOverviewAction } from "@/features/tournament/action/feed/getTournamentOverviewAction";

type TeamsProps = {
  params: Promise<{ id: string }>;
};

export default async function TeamsPage(props: TeamsProps) {
  const { id: tournamentId } = await props.params;

  const resultTournament = await getTournamentOverviewAction(tournamentId);

  if (!resultTournament.success || !resultTournament.data) {
    return redirect(`/torneios/nao-encontrado?id=${tournamentId}`);
  }
  const resultTeams = await getTournamentTeamsAction(tournamentId);

  if (!canShow("teams", resultTournament.data) || !resultTeams.data) {
    return redirectToOverview(tournamentId);
  }

  return (
    <TeamsView teams={resultTeams.data} tournament={resultTournament.data} />
  );
}
