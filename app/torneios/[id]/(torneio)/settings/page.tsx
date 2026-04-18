"use server";

import { requireAuth } from "@/lib/authorization/accessControl";
import { OnlyStaff, redirectToOverview } from "../_protect-flow";
import { SettingsTab } from "./SettingsTab";
import { getTournamentOverviewAction } from "@/features/tournament/action/feed/getTournamentOverviewAction";

type StaffPage = {
  params: Promise<{ id: string }>;
};

export default async function StaffPage(props: StaffPage) {
  const { id: tournamentId } = await props.params;

  const resultTournament = await getTournamentOverviewAction(tournamentId);

  if (!resultTournament.success || !resultTournament.data) {
    return redirectToOverview(tournamentId);
  }

  const { session } = await requireAuth();
  await OnlyStaff(tournamentId, session.user.id);

  return <SettingsTab tournament={resultTournament.data} />;
}
