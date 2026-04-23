"use server";

import { redirect } from "next/navigation";
import { canShow, redirectToOverview } from "../../_protect-flow";
import { getTournamentOverviewAction } from "@/features/tournament/action/feed/getTournamentOverviewAction";
import { MatchesTab } from "./MatchesTab";
import { getTournamentMatchesAction } from "@/features/tournament/action/feed/getTournamentMatches";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { getTournamentMemberAction } from "@/features/tournament/action/feed/getTournamentMemberAction";
import { staffRolesMap } from "@/constants/data";

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
  const resultMatches = await getTournamentMatchesAction(tournamentId);

  if (!canShow("matches", resultTournament.data) || !resultMatches.data) {
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
    <MatchesTab
      tournamentId={resultTournament.data.id}
      matches={resultMatches.data}
      swapTeam={resultTournament.data.swapTeam}
      isStaff={isStaff}
    />
  );
}
