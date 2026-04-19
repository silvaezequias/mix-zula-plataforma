"use server";

import { getTournamentParticipantsAction } from "@/features/tournament/action/feed/getTournamentParticipantsAction";
import { requireAuth } from "@/lib/authorization/accessControl";
import { WebhookTab } from "./WebhookTab";
import { OnlyStaff, redirectToOverview } from "../../_protect-flow";

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

  return <WebhookTab tournamentId={tournamentId} />;
}
