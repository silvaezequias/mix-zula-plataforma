import { FullTournament, FullTournamentRoleRequest } from "@/types";
import { GamesTab } from "./tabs/GamesTab";
import { InformationTab } from "./tabs/InformationTab";
import { PlayersTab } from "./tabs/PlayersTab";
import { DrawingTab } from "./tabs/DrawingTab";
import { Tab, Window } from "@/components/ui/Window";
import { SettingsTab } from "./tabs/SettingsTab";
import { TeamsView } from "./tabs/TeamsTab";
import { Participant, ParticipantRole, TournamentStatus } from "@prisma/client";
import { StaffTab } from "./tabs/StaffTab";
import { useSearchParams } from "next/navigation";

export type Tabs = "info" | "inscritos" | "teams" | "games";

interface DetailProps {
  tournament: FullTournament;
  sessionMember: Participant | null;
  tournamentRoleRequests: FullTournamentRoleRequest[] | null;
  onRandomize: () => void;
  onManageUser: (p: FullTournament["participants"][number]) => void;
}

export const TournamentDetailView: React.FC<DetailProps> = (props) => {
  const {
    tournament,
    onRandomize,
    onManageUser,
    sessionMember,
    tournamentRoleRequests,
  } = props;

  const searchParams = useSearchParams();
  const tab = searchParams.get("tab") || "info";
  const isStaff = sessionMember && sessionMember?.role !== "PLAYER";
  const isRandomizing = tournament.status === "SETTING_TEAM";

  const tabs: Tab[] = [
    {
      id: "info",
      label: "INFORMAÇÕES",
      content: (
        <InformationTab tournament={tournament} sessionMember={sessionMember} />
      ),
      enabled: !isRandomizing,
    },
  ];

  if (sessionMember) {
    tabs.push({
      id: "participants",
      label: "INSCRITOS",
      enabled: !isRandomizing,
      content: (
        <PlayersTab tournament={tournament} onManageUser={onManageUser} />
      ),
    });
  }

  if (
    (["FINISHED", "LIVE", "READY"] as TournamentStatus[]).includes(
      tournament.status,
    )
  ) {
    tabs.push({
      id: "teams",
      label: "EQUIPES",
      content: isRandomizing ? (
        <DrawingTab isRandomizing={isRandomizing} />
      ) : (
        <TeamsView tournament={tournament} />
      ),
    });
  }

  if (
    (["FINISHED", "LIVE", "READY"] as TournamentStatus[]).includes(
      tournament.status,
    )
  ) {
    tabs.push({
      id: "games",
      label: "JOGOS",
      enabled: !isRandomizing,
      content: <GamesTab tournament={tournament} />,
    });
  }

  if (
    isStaff &&
    (["MODERADOR", "ADMIN", "AJUDANTE", "JUIZ"] as ParticipantRole[]).includes(
      sessionMember.role,
    )
  ) {
    tabs.push({
      id: "staff",
      label: "STAFF",
      enabled: isStaff && !isRandomizing,
      content: (
        <StaffTab
          tournamentRoleRequests={tournamentRoleRequests}
          onManageUser={() => {}}
          tournament={tournament}
        />
      ),
    });

    tabs.push({
      id: "settings",
      label: "CONFIGURAÇÕES",
      enabled: isStaff && !isRandomizing,
      content: (
        <SettingsTab
          isRandomizing={isRandomizing}
          onRandomize={onRandomize}
          tournament={tournament}
        />
      ),
    });
  }

  return (
    <div className="space-y-8 animate-in fade-in duration-500 ">
      <Window tabs={tabs} focusAtTab={tab} />
    </div>
  );
};
