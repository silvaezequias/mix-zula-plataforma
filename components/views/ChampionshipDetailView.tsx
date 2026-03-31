import { Championship, Match, MatchStatus, Player } from "@/types";
import {
  MapIcon,
  Medal,
  Radio,
  RotateCcw,
  Search,
  Settings,
  Shield,
  Shuffle,
  Target,
  UserRoundPlus,
  Users,
  UserPlus,
  LogIn,
} from "lucide-react";
import { useMemo, useState } from "react";
import { GamesTab } from "./Games";
import { useRouter } from "next/navigation";

export type Tabs = "info" | "inscritos" | "teams" | "games";

interface DetailProps {
  activeChamp: Championship;
  isStaff: boolean;
  activeTab: Tabs;
  user: Player | null;
  tournamentId: string;
  setActiveTab: (tab: Tabs) => void;
  onBack: () => void;
  onRandomize: () => void;
  onStart: () => void;
  onOpenRules: () => void;
  onOpenBroadcast: () => void;
  onManageUser: (p: Player) => void;
  searchTerm: string;
  setSearchTerm: (v: string) => void;
  filteredPlayers: Player[];
  setChampionships: React.Dispatch<React.SetStateAction<Championship[]>>;
}

export const ChampionshipDetailView: React.FC<DetailProps> = (props) => {
  const {
    activeChamp,
    isStaff,
    activeTab,
    user,
    tournamentId,
    setActiveTab,
    onBack,
    onRandomize,
    onOpenRules,
    onOpenBroadcast,
    onManageUser,
    searchTerm,
    setSearchTerm,
    filteredPlayers,
    setChampionships,
  } = props;

  const isRandomizing = activeChamp.status === "randomizing";

  const router = useRouter();

  const [selectedChampId] = useState<string | null>(null);
  const [, setShowKdaModal] = useState(false);
  const [selectedPlayer] = useState<Player | null>(null);

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

  const isAdmin = useMemo(() => user?.role === "ADMIN", [user]);

  const handleAction = () => {
    router.push(`/torneios/${tournamentId}/participar`);
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <button
          onClick={onBack}
          className="text-zinc-500 hover:text-[#FFB300] font-black flex items-center gap-2 text-xs uppercase self-start italic tracking-widest"
        >
          <RotateCcw size={14} /> VOLTAR AO MENU
        </button>
        <div className="flex gap-2 flex-wrap">
          <button
            onClick={handleAction}
            className="group relative flex items-center justify-center gap-4 bg-[#FFB300] hover:bg-white text-black px-10 py-5 transition-all duration-500 transform hover:-translate-y-1 active:translate-y-0 shadow-[0_0_30px_rgba(255,179,0,0.2)] overflow-hidden"
          >
            <div className="absolute inset-0 bg-white/20 -translate-x-full group-hover:translate-x-full transition-transform duration-700 skew-x-[-20deg]"></div>
            {isAdmin ? (
              <>
                <UserPlus
                  size={20}
                  className="group-hover:rotate-12 transition-transform"
                />
                <span className="text-sm font-black italic tracking-tighter uppercase">
                  CONVIDAR JOGADOR
                </span>
              </>
            ) : (
              <>
                <LogIn
                  size={20}
                  className="group-hover:translate-x-1 transition-transform"
                />
                <span className="text-sm font-black italic tracking-tighter uppercase">
                  PARTICIPAR DO TORNEIO
                </span>
              </>
            )}
          </button>
          {activeChamp.status === "live" && (
            <span className="bg-indigo-600 text-white px-6 py-2 font-black text-sm uppercase flex items-center justify-center gap-2 italic tracking-widest">
              <Radio size={16} className="animate-pulse" /> EM ANDAMENTO
            </span>
          )}
          {activeChamp.status === "open" && (
            <span className="bg-green-600 text-white px-6 py-2 font-black text-sm uppercase flex items-center justify-center gap-2 italic tracking-widest">
              <UserRoundPlus size={16} className="animate-pulse" /> INCRIÇÕES
              ABERTAS
            </span>
          )}
          {activeChamp.status === "setting_teams" && (
            <span className="bg-yellow-600 text-white px-6 py-2 font-black text-sm uppercase flex items-center justify-center gap-2 italic tracking-widest">
              <Shuffle size={16} className="animate-pulse" /> DEFININDO EQUIPES
            </span>
          )}

          {activeChamp.status === "randomizing" && (
            <span className="bg-purple-600 text-white px-6 py-2 font-black  text-sm uppercase flex items-center justify-center gap-2 italic tracking-widest">
              <Shuffle size={16} className="animate-pulse" /> RANDOMIZANDO
              EQUIPES
            </span>
          )}

          {activeChamp.status === "finished" && (
            <span className="bg-red-600 text-white px-6 py-2 font-black text-sm uppercase flex items-center justify-center gap-2 italic tracking-widest">
              <Medal size={16} className="animate-pulse" /> FINALIZADO
            </span>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10">
        <div className="lg:col-span-8 space-y-6">
          <div className="flex border-b border-zinc-800 overflow-x-auto italic tracking-widest">
            <button
              onClick={() => setActiveTab("info")}
              className={`px-8 py-3 text-xs font-black italic transition-all border-b-2 ${activeTab === "info" ? "border-[#FFB300] text-[#FFB300] bg-zinc-900/50" : "border-transparent text-zinc-500 hover:text-white"}`}
            >
              INFORMAÇÕES
            </button>
            <button
              onClick={() => !isRandomizing && setActiveTab("inscritos")}
              disabled={isRandomizing}
              className={`px-8 py-3 text-xs font-black italic transition-all border-b-2 ${activeTab === "inscritos" ? "border-[#FFB300] text-[#FFB300] bg-zinc-900/50" : "border-transparent text-zinc-500 hover:text-white"} ${isRandomizing ? "opacity-20 cursor-not-allowed" : ""}`}
            >
              INSCRITOS
            </button>
            <button
              onClick={() => setActiveTab("teams")}
              className={`px-8 py-3 text-xs font-black italic transition-all border-b-2 ${activeTab === "teams" ? "border-[#FFB300] text-[#FFB300] bg-zinc-900/50" : "border-transparent text-zinc-500 hover:text-white"}`}
            >
              EQUIPES
            </button>
            <button
              onClick={() => setActiveTab("games")}
              className={`px-8 py-3 text-xs font-black italic transition-all border-b-2 ${activeTab === "games" ? "border-[#FFB300] text-[#FFB300] bg-zinc-900/50" : "border-transparent text-zinc-500 hover:text-white"}`}
            >
              JOGOS
            </button>
          </div>

          <div className="pt-2 md:max-h-[70vh] overflow-x-hidden overflow-y-auto custom-scrollbar">
            {activeTab === "info" && (
              <div className="space-y-6 uppercase animate-in fade-in duration-500">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="bg-[#111] p-6 border-l-2 border-[#FFB300]">
                    <Medal className="text-[#FFB300] mb-4" size={24} />
                    <p className="text-[10px] text-zinc-500 font-black">
                      PREMIAÇÃO
                    </p>
                    <p className="text-xl font-black italic text-white">
                      {activeChamp.prize}
                    </p>
                  </div>
                  <div className="bg-[#111] p-6 border-l-2 border-zinc-700">
                    <MapIcon className="text-zinc-500 mb-4" size={24} />
                    <p className="text-[10px] text-zinc-500 font-black">MAPA</p>
                    <p className="text-xl font-black italic text-white">
                      {activeChamp.settings.map}
                    </p>
                  </div>
                  <div className="bg-[#111] p-6 border-l-2 border-zinc-700">
                    <Target className="text-zinc-500 mb-4" size={24} />
                    <p className="text-[10px] text-zinc-500 font-black">MODO</p>
                    <p className="text-xl font-black italic text-white">
                      {activeChamp.settings.gameMode}
                    </p>
                  </div>
                </div>
                <div className="bg-[#111] border border-zinc-800 p-8">
                  <h4 className="text-xs font-black text-[#FFB300] mb-6 italic tracking-widest">
                    REGRAS DO TORNEIO
                  </h4>
                  <ul className="space-y-4 text-[11px] font-bold text-zinc-400">
                    <li className="flex gap-4 border-b border-zinc-900 pb-3">
                      <span className="text-[#FFB300]">01.</span> NICK EM JOGO
                      DEVE SER IDENTICO AO CADASTRADO.
                    </li>
                    <li className="flex gap-4 border-b border-zinc-900 pb-3">
                      <span className="text-[#FFB300]">02.</span>
                      USO DE SOFTWARE EXTERNO RESULTARÁ EM BANIMENTO.
                    </li>
                    <li className="flex gap-4 border-b border-zinc-900 pb-3">
                      <span className="text-[#FFB300]">03.</span>
                      <span>
                        ROUNDS POR LADO:{" "}
                        <span className="font-black text-white">
                          {activeChamp.settings.rounds}.
                        </span>
                      </span>
                    </li>
                    <li className="flex gap-4 border-b border-zinc-900 pb-3">
                      <span className="text-[#FFB300]">04.</span>
                      <span>
                        TROCA DE LADOS PERMITIDA:{" "}
                        <span className="font-black text-white">
                          {activeChamp.settings.sideSwap ? "SIM" : "NÃO"}
                        </span>
                        .
                      </span>
                    </li>
                    <li className="flex gap-4 border-b border-zinc-900 pb-3">
                      <span className="text-[#FFB300]">04.</span>
                      <span>
                        TOTAL DE TIMES:{" "}
                        <span className="font-black text-white">
                          {activeChamp.settings.totalTeams}
                        </span>
                        .
                      </span>
                    </li>
                    <li className="flex gap-4 border-b border-zinc-900 pb-3">
                      <span className="text-[#FFB300]">04.</span>
                      <span>
                        JOGADORES POR TIME:{" "}
                        <span className="font-black text-white">
                          {activeChamp.settings.playersPerTeam}
                        </span>
                        .
                      </span>
                    </li>
                  </ul>
                </div>
              </div>
            )}

            {activeTab === "inscritos" && !isRandomizing && (
              <div className="space-y-4 animate-in fade-in duration-300">
                {isStaff && (
                  <div className="relative group">
                    <Search
                      className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-600"
                      size={18}
                    />
                    <input
                      type="text"
                      placeholder="FILTRAR JOGADORES..."
                      className="w-full bg-zinc-900/50 border border-zinc-800 p-4 pl-12 text-xs font-black outline-none focus:border-[#FFB300] transition-all uppercase italic tracking-widest"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                  </div>
                )}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-h-125 overflow-y-auto pr-2 custom-scrollbar">
                  {filteredPlayers.map((p) => (
                    <div
                      key={p.id}
                      onClick={() => isStaff && onManageUser(p)}
                      className={`bg-zinc-900/50 border border-zinc-800 p-4 flex items-center justify-between group transition-colors ${isStaff ? "hover:border-[#FFB300]/50 cursor-pointer" : ""}`}
                    >
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 bg-zinc-800 flex items-center justify-center text-[#FFB300] font-black border border-zinc-700 italic">
                          {p.gameNick.charAt(0)}
                        </div>
                        <div>
                          <p className="text-sm font-black italic text-white uppercase  tracking-tighter">
                            {p.gameNick}
                          </p>
                          <p className="text-[10px] text-zinc-500 font-bold uppercase tracking-tight italic ">
                            @{p.discordName}
                          </p>
                        </div>
                      </div>
                      {isStaff && (
                        <span className="text-[9px] font-bold text-zinc-700 uppercase group-hover:text-[#FFB300] hidden sm:block italic tracking-widest">
                          GERENCIAR
                        </span>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}
            {activeTab === "games" && (
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
            )}
            {activeTab === "teams" && (
              <div className="animate-in slide-in-from-bottom-4 duration-500">
                {isRandomizing ? (
                  <div className="py-20 sm:py-32 text-center bg-[#111] border border-zinc-800 relative overflow-hidden uppercase italic tracking-widest">
                    <div className="absolute inset-0 bg-[#FFB300]/5 animate-pulse"></div>
                    <div className="w-12 h-12 sm:w-16 sm:h-16 border-4 border-[#FFB300] border-t-transparent rounded-full animate-spin mx-auto mb-6"></div>
                    <h4 className="text-2xl sm:text-3xl font-black italic tracking-tighter text-[#FFB300]">
                      PROCESSANDO SORTEIO
                    </h4>
                    <p className="text-zinc-500 text-[10px] font-bold mt-2 uppercase tracking-[0.5em] italic">
                      Aguarde a geração...
                    </p>
                  </div>
                ) : activeChamp.teams.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 uppercase italic tracking-widest">
                    {activeChamp.teams.map((team) => (
                      <div
                        key={team.id}
                        className="bg-zinc-900 border-t-2 border-[#FFB300]"
                      >
                        <div
                          className={`p-3 flex justify-between items-center ${team.side === "TR" ? "bg-orange-950/30" : "bg-blue-950/30"}`}
                        >
                          <h4 className="font-black italic uppercase text-lg tracking-tighter">
                            {team.name}
                          </h4>
                          <span
                            className={`text-[10px] font-black px-3 py-1 ${team.side === "TR" ? "bg-orange-600" : "bg-blue-600"}`}
                          >
                            {team.side}
                          </span>
                        </div>
                        <div className="p-4 space-y-2">
                          {team.players.map((p) => (
                            <div
                              key={p.id}
                              onClick={() => isStaff && onManageUser(p)}
                              className={`flex items-center justify-between bg-black/40 p-2 border border-zinc-800 transition-colors ${isStaff ? "hover:border-[#FFB300]/50 cursor-pointer group" : ""}`}
                            >
                              <span className="text-xs font-bold italic uppercase tracking-widest">
                                {p.gameNick}
                              </span>
                              {isStaff && (
                                <span className="text-[9px] text-zinc-700 font-bold uppercase group-hover:text-white italic tracking-widest">
                                  INFO
                                </span>
                              )}
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="col-span-full py-20 text-center border-2 border-dashed border-zinc-800">
                    <Users className="mx-auto text-zinc-800 mb-4" size={48} />
                    <p className="text-zinc-600 font-black italic tracking-widest">
                      EQUIPES AINDA NÃO SORTEADAS
                    </p>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        <div className="lg:col-span-4 space-y-6">
          <div className="bg-[#111] border border-zinc-800 p-6 uppercase italic tracking-widest">
            <h4 className="text-[10px] font-black text-[#FFB300] mb-6 flex items-center gap-2 uppercase italic">
              <Settings size={14} /> RESUMO TÉCNICO
            </h4>
            <div className="space-y-4 text-[10px] font-bold border-b border-zinc-800 pb-6 mb-6">
              <div className="flex justify-between uppercase">
                <span className="text-zinc-500">INSCRITOS</span>
                <span>{activeChamp.players.length} / 20</span>
              </div>
              <div className="flex justify-between uppercase">
                <span className="text-zinc-500">LISTA DE ESPERA</span>
                <span className="text-orange-500 italic">0</span>
              </div>
            </div>
          </div>

          {isStaff && (
            <div className="bg-red-950/10 border border-red-900/30 p-6 space-y-4 uppercase animate-in fade-in italic tracking-widest">
              <h4 className="text-[10px] font-black text-red-500 mb-2 flex items-center gap-2 uppercase italic">
                <Shield size={14} /> COMANDO
              </h4>
              <div className="space-y-2">
                {!isRandomizing &&
                  activeChamp.status !== "live" &&
                  activeChamp.status !== "finished" && (
                    <button
                      onClick={onRandomize}
                      className="w-full bg-[#FFB300] text-black font-black italic p-3 text-xs mb-2 uppercase tracking-widest"
                    >
                      {activeChamp.status === "ready"
                        ? "RE-SORTEAR EQUIPES"
                        : "SORTEAR EQUIPES"}
                    </button>
                  )}
                <button
                  onClick={onOpenBroadcast}
                  className="w-full bg-zinc-900 border border-zinc-800 text-white font-black p-3 text-xs hover:bg-zinc-800 uppercase italic tracking-widest"
                >
                  DIVULGAÇÃO / LIVE
                </button>
                <button
                  onClick={onOpenRules}
                  className="w-full bg-zinc-900 border border-zinc-800 text-white font-black p-3 text-xs hover:bg-zinc-800 uppercase italic tracking-widest"
                >
                  CONFIGURAR TORNEIO
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
