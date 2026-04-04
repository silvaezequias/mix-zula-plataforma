import { Championship, Match, MatchStatus } from "@/types";
import { useState } from "react";
import { GamesTab } from "./tabs/GamesTab";
import { InformationTab } from "./tabs/InformationTab";
import { PlayersTab } from "./tabs/PlayersTab";
import { DrawingTab } from "./tabs/DrawingTab";
import { Tab, Window } from "@/components/ui/Window";
import { SettingsTab } from "./tabs/SettingsTab";
import { TeamsView } from "./tabs/TeamsTab";
import { PayloadUser } from "@/types/next-auth";

export type Tabs = "info" | "inscritos" | "teams" | "games";

interface DetailProps {
  players: PayloadUser[];
  activeChamp: Championship;
  isStaff: boolean;
  tournamentId: string;
  onRandomize: () => void;
  onManageUser: (p: PayloadUser) => void;
  setChampionships: React.Dispatch<React.SetStateAction<Championship[]>>;
}

export const ChampionshipDetailView: React.FC<DetailProps> = (props) => {
  const {
    isStaff,
    players,
    activeChamp,
    tournamentId,
    onRandomize,
    onManageUser,
    setChampionships,
  } = props;

  const isRandomizing = activeChamp.status === "randomizing";

  const [selectedChampId] = useState<string | null>(null);
  const [, setShowKdaModal] = useState(false);
  const [selectedPlayer] = useState<PayloadUser | null>(null);

  const updateMatchStatus = (matchId: string, status: MatchStatus) => {
    setChampionships((prev) =>
      prev.map((c) => {
        if (c.id === selectedChampId) {
          return {
            ...c,
            matches: c.matches.map((m) =>
              m.id === matchId ? { ...m, status } : m,
            ),
          };
        }
        return c;
      }),
    );
  };

  const setMatchWinner = (matchId: string, winnerId: string) => {
    setChampionships((prev) =>
      prev.map((c) => {
        if (c.id === selectedChampId) {
          const matches = c.matches.map((m) =>
            m.id === matchId
              ? { ...m, winnerId, status: "finalizado" as MatchStatus }
              : m,
          );

          // Lógica simples de avanço: Se m1 e m2 acabaram, cria a final
          const m1 = matches.find((m) => m.id === "m1");
          const m2 = matches.find((m) => m.id === "m2");
          if (
            m1?.winnerId &&
            m2?.winnerId &&
            !matches.find((m) => m.id === "m_final")
          ) {
            matches.push({
              id: "m_final",
              teamAId: m1.winnerId,
              teamBId: m2.winnerId,
              status: "preparando",
              phase: 2,
              currentRound: 0,
              order: 1,
              swappedSides: false,
            });
          }

          return { ...c, matches };
        }
        return c;
      }),
    );
  };

  const updatePlayerKda = (
    playerId: string,
    matchId: string,
    round: number,
    kills: number,
    deaths: number,
    assists: number,
  ) => {
    if (!selectedPlayer || !selectedChampId) return;
    setChampionships((prev) =>
      prev.map((c) => {
        if (c.id === selectedChampId) {
          return {
            ...c,
            players: c.players.map((p) =>
              p.id === selectedPlayer.id
                ? { ...p, stats: { kills, deaths, assists } }
                : p,
            ),
            teams: c.teams.map((t) => ({
              ...t,
              players: t.players.map((p) =>
                p.id === selectedPlayer.id
                  ? { ...p, stats: { kills, deaths, assists } }
                  : p,
              ),
            })),
          };
        }
        return c;
      }),
    );
    setShowKdaModal(false);
  };

  const tabs: Tab[] = [
    {
      id: "info",
      label: "INFORMAÇÕES",
      content: <InformationTab championship={activeChamp} />,
      enabled: !isRandomizing,
    },
    {
      id: "players",
      label: "INSCRITOS",
      enabled: !isRandomizing,
      content: <PlayersTab players={players} onManageUser={onManageUser} />,
    },
    {
      id: "teams",
      label: "EQUIPES",
      content: isRandomizing ? (
        <DrawingTab isRandomizing={isRandomizing} />
      ) : (
        <TeamsView championsip={activeChamp} />
      ),
    },
    {
      id: "games",
      label: "JOGOS",
      enabled: !isRandomizing,
      content: (
        <GamesTab
          isStaff={isStaff}
          matches={activeChamp.matches as Match[]}
          onSetWinner={setMatchWinner}
          onUpdateMatchStatus={updateMatchStatus}
          onUpdatePlayerKda={updatePlayerKda}
          teams={activeChamp.teams}
          onSwapSides={() => {}}
          onUpdateMatchRound={() => {}}
        />
      ),
    },
    {
      id: "settings",
      label: "CONFIGURAÇÕES",
      enabled: isStaff && !isRandomizing,
      content: (
        <SettingsTab
          isRandomizing={isRandomizing}
          onRandomize={onRandomize}
          championship={activeChamp}
          tournamentId={tournamentId}
          updateChampInfo={(field, value) => {
            setChampionships((prev) =>
              prev.map((c) =>
                c.id === activeChamp.id ? { ...c, [field]: value } : c,
              ),
            );
          }}
          updateChampSettings={(field, value) => {
            setChampionships((prev) =>
              prev.map((c) =>
                c.id === activeChamp.id
                  ? {
                      ...c,
                      settings: { ...c.settings, [field]: value },
                    }
                  : c,
              ),
            );
          }}
        />
      ),
    },
  ];

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <Window tabs={tabs} focusAtTab={isRandomizing ? "teams" : "teams"} />
    </div>
  );
};
