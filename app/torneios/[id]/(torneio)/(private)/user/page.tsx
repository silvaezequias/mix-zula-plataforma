"use server";

import { redirect } from "next/navigation";
import { requireAuth } from "@/lib/authorization/accessControl";
import { OnlyStaff } from "../../_protect-flow";
import { UserTab } from "./UserTab";
import { getTournamentOverviewAction } from "@/features/tournament/action/feed/getTournamentOverviewAction";
import { getTournamentMemberAction } from "@/features/tournament/action/feed/getTournamentMemberAction";

type UserPage = {
  params: Promise<{ id: string }>;
};

export default async function UserPage(props: UserPage) {
  const { id: tournamentId } = await props.params;
  const { data: tournament, success } =
    await getTournamentOverviewAction(tournamentId);

  if (!success || !tournament) {
    return redirect(`/torneios/nao-encontrado?id=${tournamentId}`);
  }
  const { session } = await requireAuth();

  await OnlyStaff(tournamentId, session.user.id);

  const { data: participant } = await getTournamentMemberAction(
    tournamentId,
    session.user.id,
  );

  if (!participant) {
    return redirect(
      `/torneios/${tournamentId}/usuario-nao-encontrado?id=${session.user.id}`,
    );
  }

  return <UserTab participant={participant} tournamentId={tournamentId} />;
}
