"use server";

import { getTournamentParticipantsAction } from "@/features/tournament/action/feed/getTournamentParticipantsAction";
import { requireAuth } from "@/lib/authorization/accessControl";
import { WebhookTab } from "./WebhookTab";
import { OnlyStaff, redirectToOverview } from "../../_protect-flow";
import { getTournamentOverviewAction } from "@/features/tournament/action/feed/getTournamentOverviewAction";
import { getTournamentTeamsAction } from "@/features/tournament/action/feed/getTournamentTeamsAction";

type StaffPage = {
  params: Promise<{ id: string }>;
};

export default async function StaffPage(props: StaffPage) {
  const { id: tournamentId } = await props.params;

  const resultTournament = await getTournamentParticipantsAction(tournamentId);

  if (!resultTournament.success || !resultTournament.data) {
    return redirectToOverview(tournamentId);
  }

  const { session } = await requireAuth();
  await OnlyStaff(tournamentId, session.user.id);

  const { data: tournament } = await getTournamentOverviewAction(tournamentId);
  const { data: participants } =
    await getTournamentParticipantsAction(tournamentId);
  const { data: teams } = await getTournamentTeamsAction(tournamentId);

  if (!tournament) {
    return redirectToOverview(tournamentId);
  }

  return (
    <WebhookTab
      participants={participants}
      teams={teams}
      tournament={tournament}
    />
  );
}
