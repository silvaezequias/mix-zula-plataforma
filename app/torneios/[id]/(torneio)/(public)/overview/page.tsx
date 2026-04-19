"use server";

import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { getTournamentMemberAction } from "@/features/tournament/action/feed/getTournamentMemberAction";
import { getTournamentOverviewAction } from "@/features/tournament/action/feed/getTournamentOverviewAction";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { InformationTab } from "./InformationTab";

type OverviewProps = {
  params: Promise<{ id: string }>;
};

export default async function OverviewPage(props: OverviewProps) {
  const { id: tournamentId } = await props.params;
  const session = await getServerSession(authOptions);

  const resultTournament = await getTournamentOverviewAction(tournamentId);

  if (!resultTournament.success || !resultTournament.data) {
    return redirect(`/torneios/nao-encontrado?id=${tournamentId}`);
  }

  const resultMember = session
    ? await getTournamentMemberAction(resultTournament.data.id, session.user.id)
    : undefined;

  return (
    <InformationTab
      sessionMember={resultMember?.data}
      tournament={resultTournament.data}
    />
  );
}
