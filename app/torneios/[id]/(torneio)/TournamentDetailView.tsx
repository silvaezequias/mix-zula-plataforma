"use client";

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
import { Dispatch, SetStateAction, useTransition } from "react";
import { UserTab } from "./tabs/UserTab";
import { createRandomTeamsAction } from "@/features/team/action";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";
import { WebhookTab } from "./tabs/WebhookTab";

export type Tabs = "info" | "inscritos" | "teams" | "games";

interface DetailProps {
  tournament: FullTournament;
  sessionMember: Participant | null;
  tournamentRoleRequests: FullTournamentRoleRequest[] | null;
  selectedUser: FullTournament["participants"][number] | undefined;
  currentTab: string;
  handleSelectUser: (
    user: FullTournament["participants"][number] | undefined,
  ) => void;
  setCurrentTab: Dispatch<SetStateAction<string>>;
}

export const TournamentDetailView: React.FC<DetailProps> = (props) => {
  const {
    tournament,
    sessionMember,
    tournamentRoleRequests,
    selectedUser,
    handleSelectUser,
    currentTab,
    setCurrentTab,
  } = props;

  const isStaff = sessionMember && sessionMember?.role !== "PLAYER";
  const [isRandomizing, startTransition] = useTransition();
  const router = useRouter();

  const handleRandomize = () => {
    if (
      (
        ["FINISHED", "LIVE", "READY", "SETTING_TEAM"] as TournamentStatus[]
      ).includes(tournament.status)
    ) {
      setCurrentTab("teams");
      startTransition(async () => {
        const result = await createRandomTeamsAction(tournament.id);
        if (!result.success) toast.error(result.error);
        router.refresh();
      });
    }
  };

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

  if (selectedUser) {
    tabs.push({
      id: "user",
      label: "USUÁRIO",
      enabled: !!selectedUser,
      content: (
        <UserTab
          key={selectedUser.id}
          setSelectedUser={handleSelectUser}
          selectedUser={selectedUser}
          tournament={tournament}
        />
      ),
    });
  }

  if (sessionMember) {
    tabs.push({
      id: "participants",
      label: "INSCRITOS",
      enabled: !isRandomizing,
      content: (
        <PlayersTab
          isStaff={!!isStaff}
          tournament={tournament}
          onManageUser={handleSelectUser}
        />
      ),
    });
  }

  if (
    (
      ["FINISHED", "LIVE", "READY", "SETTING_TEAM"] as TournamentStatus[]
    ).includes(tournament.status)
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
          onManageUser={handleSelectUser}
          tournament={tournament}
        />
      ),
    });

    tabs.push({
      id: "webhooks",
      label: "DISCORD WEBHOOKS",
      enabled: isStaff && !isRandomizing,
      content: <WebhookTab tournamentId={tournament.id} />,
    });

    tabs.push({
      id: "settings",
      label: "CONFIGURAÇÕES",
      enabled: isStaff && !isRandomizing,
      content: (
        <SettingsTab
          isRandomizing={isRandomizing}
          handleRandomize={handleRandomize}
          tournament={tournament}
        />
      ),
    });
  }

  return (
    <div className="space-y-8 animate-in fade-in duration-500 ">
      <Window tabs={tabs} activeTab={currentTab} setActiveTab={setCurrentTab} />
    </div>
  );
};
