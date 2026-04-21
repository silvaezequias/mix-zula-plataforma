"use server";
import { requireAuth } from "@/lib/authorization/accessControl";
import { ParticipantsTab } from "./ParticipantsTab";
import { OnlyMember, redirectToOverview } from "../../_protect-flow";
import { getTournamentMemberAction } from "@/features/tournament/action/feed/getTournamentMemberAction";
import { staffRolesMap } from "@/constants/data";
import { getTournamentOverviewAction } from "@/features/tournament/action/feed/getTournamentOverviewAction";
import { getTournamentParticipantsAction } from "@/features/tournament/action/feed/getTournamentParticipantsAction";

type ParticipantsPage = {
  params: Promise<{ id: string }>;
};

export default async function ParticipantsPage(props: ParticipantsPage) {
  const { id: tournamentId } = await props.params;
  const resultTournament = await getTournamentOverviewAction(tournamentId);

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

  const { data: participants } =
    await getTournamentParticipantsAction(tournamentId);

  if (!participants) {
    return redirectToOverview(tournamentId);
  }

  return (
    <ParticipantsTab
      participants={participants}
      isStaff={participantRole.level > 3}
    />
  );
}
