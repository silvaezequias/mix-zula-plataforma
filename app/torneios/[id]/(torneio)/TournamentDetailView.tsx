import { FullTournament } from "@/types";
import { GamesTab } from "./tabs/GamesTab";
import { InformationTab } from "./tabs/InformationTab";
import { PlayersTab } from "./tabs/PlayersTab";
import { DrawingTab } from "./tabs/DrawingTab";
import { Tab, Window } from "@/components/ui/Window";
import { SettingsTab } from "./tabs/SettingsTab";
import { TeamsView } from "./tabs/TeamsTab";

export type Tabs = "info" | "inscritos" | "teams" | "games";

interface DetailProps {
  tournament: FullTournament;
  isStaff: boolean;
  onRandomize: () => void;
  onManageUser: (p: FullTournament["participants"][number]) => void;
}

export const TournamentDetailView: React.FC<DetailProps> = (props) => {
  const { isStaff, tournament, onRandomize, onManageUser } = props;

  const isRandomizing = tournament.status === "SETTING_TEAM";

  const tabs: Tab[] = [
    {
      id: "info",
      label: "INFORMAÇÕES",
      content: <InformationTab tournament={tournament} />,
      enabled: !isRandomizing,
    },
    {
      id: "players",
      label: "INSCRITOS",
      enabled: !isRandomizing,
      content: (
        <PlayersTab tournament={tournament} onManageUser={onManageUser} />
      ),
    },
    {
      id: "teams",
      label: "EQUIPES",
      content: isRandomizing ? (
        <DrawingTab isRandomizing={isRandomizing} />
      ) : (
        <TeamsView tournament={tournament} />
      ),
    },
    {
      id: "games",
      label: "JOGOS",
      enabled: !isRandomizing,
      content: <GamesTab tournament={tournament} />,
    },
    {
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
    },
  ];

  return (
    <div className="space-y-8 animate-in fade-in duration-500 ">
      <Window tabs={tabs} focusAtTab={isRandomizing ? "teams" : "teams"} />
    </div>
  );
};
