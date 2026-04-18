import { staffRolesMap } from "@/constants/data";
import { getTournamentMemberAction } from "@/features/tournament/action/feed/getTournamentMemberAction";
import { TabKey } from "@/providers/TabContext";
import { Tournament } from "@prisma/client";
import { redirect } from "next/navigation";

export async function OnlyMember(tournamentId: string, userId: string) {
  const { data: participant } = await getTournamentMemberAction(
    tournamentId,
    userId,
  );

  if (!participant) {
    return redirectToOverview(tournamentId);
  }

  return participant;
}

export async function OnlyStaff(tournamentId: string, userId: string) {
  const participant = await OnlyMember(tournamentId, userId);
  const participantRole = staffRolesMap[participant.role];

  if (participantRole.level < 3) {
    return redirectToOverview(tournamentId);
  }

  return participant;
}

export function redirectToOverview(tournamentId: string) {
  return redirect(`/torneios/${tournamentId}/overview`);
}

export function canShow(tab: TabKey, tournament: Tournament) {
  const showMatches = ["LIVE", "SETTING_MATCHES", "FINISHED", "READY"].includes(
    tournament.status,
  );
  const showTeams = ["SETTING_TEAM"].includes(tournament.status) || showMatches;

  if (tab === "overview") return true;
  if (tab === "matches") return showMatches;
  if (tab === "teams") return showTeams;

  return false;
}
