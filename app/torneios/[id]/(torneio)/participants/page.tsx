"use server";
import { requireAuth } from "@/lib/authorization/accessControl";
import { ParticipantsTab } from "./ParticipantsTab";
import { getTournamentParticipantsAction } from "@/features/tournament/action/feed/getTournamentParticipantsAction";
import { OnlyMember, redirectToOverview } from "../_protect-flow";

type ParticipantsPage = {
  params: Promise<{ id: string }>;
};

export default async function ParticipantsPage(props: ParticipantsPage) {
  const { id: tournamentId } = await props.params;
  const resultTournament = await getTournamentParticipantsAction(tournamentId);

  if (!resultTournament.success || !resultTournament.data) {
    return redirectToOverview(tournamentId);
  }

  const { session } = await requireAuth();
  await OnlyMember(resultTournament.data.id, session.user.id);

  return <ParticipantsTab tournament={resultTournament.data} />;
}
