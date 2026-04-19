"use server";
import { requireAuth } from "@/lib/authorization/accessControl";
import { ParticipantsTab } from "./ParticipantsTab";
import { getTournamentParticipantsAction } from "@/features/tournament/action/feed/getTournamentParticipantsAction";
import { OnlyMember, redirectToOverview } from "../../_protect-flow";
import { getTournamentMemberAction } from "@/features/tournament/action/feed/getTournamentMemberAction";
import { staffRolesMap } from "@/constants/data";

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

  const { data: participant } = await getTournamentMemberAction(
    tournamentId,
    session.user.id,
  );

  if (!participant) return redirectToOverview(tournamentId);

  const participantRole = staffRolesMap[participant.role];

  return (
    <ParticipantsTab
      tournament={resultTournament.data}
      isStaff={participantRole.level > 3}
    />
  );
}
