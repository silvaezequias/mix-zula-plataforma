"use server";

import { redirect } from "next/navigation";
import { StaffTab } from "./StaffTab";
import { getTournamentParticipantsAction } from "@/features/tournament/action/feed/getTournamentParticipantsAction";
import { requireAuth } from "@/lib/authorization/accessControl";
import { OnlyStaff } from "../_protect-flow";

type StaffPage = {
  params: Promise<{ id: string }>;
};

export default async function StaffPage(props: StaffPage) {
  const { id: tournamentId } = await props.params;
  const resultTournament = await getTournamentParticipantsAction(tournamentId);

  if (!resultTournament.success || !resultTournament.data) {
    return redirect(`/torneios/nao-encontrado?id=${tournamentId}`);
  }
  const { session } = await requireAuth();

  await OnlyStaff(tournamentId, session.user.id);

  return <StaffTab tournament={resultTournament.data} />;
}
