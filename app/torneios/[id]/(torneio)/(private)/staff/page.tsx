"use server";

import { redirect } from "next/navigation";
import { StaffTab } from "./StaffTab";
import { getTournamentParticipantsAction } from "@/features/tournament/action/feed/getTournamentParticipantsAction";
import { requireAuth } from "@/lib/authorization/accessControl";
import { OnlyStaff } from "../../_protect-flow";
import { getTournamentRoleRequestsAction } from "@/features/tournament/action/feed/getTournamentRoleRequests";
import { getTournamentOverviewAction } from "@/features/tournament/action/feed/getTournamentOverviewAction";

type StaffPage = {
  params: Promise<{ id: string }>;
};

export default async function StaffPage(props: StaffPage) {
  const { id: tournamentId } = await props.params;
  const resultTournament = await getTournamentOverviewAction(tournamentId);

  const { session } = await requireAuth({
    forceRedirect: `/torneios/${tournamentId}/overview`,
  });

  if (!resultTournament.success || !resultTournament.data) {
    return redirect(`/torneios/nao-encontrado?id=${tournamentId}`);
  }

  const { data: roleRequests } =
    await getTournamentRoleRequestsAction(tournamentId);
  const { data: participants } =
    await getTournamentParticipantsAction(tournamentId);

  await OnlyStaff(tournamentId, session.user.id);

  return (
    <StaffTab
      tournament={resultTournament.data}
      {...{ roleRequests, participants }}
    />
  );
}
