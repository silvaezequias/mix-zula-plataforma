"use server";

import { redirect } from "next/navigation";
import { TeamsView } from "./TeamsTab";
import { getTournamentTeamsAction } from "@/features/tournament/action/feed/getTournamentTeamsAction";
import { canShow, redirectToOverview } from "../../_protect-flow";
import { getTournamentOverviewAction } from "@/features/tournament/action/feed/getTournamentOverviewAction";
import { staffRolesMap } from "@/constants/data";
import { getTournamentMemberAction } from "@/features/tournament/action/feed/getTournamentMemberAction";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

type TeamsProps = {
  params: Promise<{ id: string }>;
};

export default async function TeamsPage(props: TeamsProps) {
  const { id: tournamentId } = await props.params;

  const session = await getServerSession(authOptions);

  const resultTournament = await getTournamentOverviewAction(tournamentId);

  if (!resultTournament.success || !resultTournament.data) {
    return redirect(`/torneios/nao-encontrado?id=${tournamentId}`);
  }
  const resultTeams = await getTournamentTeamsAction(tournamentId);

  if (!canShow("teams", resultTournament.data) || !resultTeams.data) {
    return redirectToOverview(tournamentId);
  }

  let isStaff = false;

  if (session) {
    const { data: participant } = await getTournamentMemberAction(
      tournamentId,
      session.user.id,
    );

    if (!participant) return redirectToOverview(tournamentId);
    const participantRole = staffRolesMap[participant.role];
    isStaff = participantRole.level > 3;
  }

  return (
    <TeamsView
      isStaff={isStaff}
      teams={resultTeams.data}
      tournament={resultTournament.data}
    />
  );
}
