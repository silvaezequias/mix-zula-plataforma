import React, { useState, useMemo } from "react";
import {
  Trophy,
  Settings,
  X,
  Target,
  Skull,
  Users,
  Sword,
  Clock,
  Plus,
  Minus,
  Shuffle,
} from "lucide-react";
import { Match, MatchStatus, Player, Team } from "@/types";

/* ===============================================================================
  INTERFACES DE DEPENDÊNCIA (Tipos)
===============================================================================
*/

interface GamesTabProps {
  matches: Match[];
  teams: Team[];
  isStaff: boolean;
  onUpdateMatchStatus: (matchId: string, status: MatchStatus) => void;
  onSetWinner: (matchId: string, teamId: string) => void;
  onUpdatePlayerKda: (
    playerId: string,
    matchId: string,
    round: number,
    kills: number,
    deaths: number,
    assists: number,
  ) => void;
  onUpdateMatchRound: (matchId: string, increment: boolean) => void;
  onSwapSides: (matchId: string) => void;
}

/* ===============================================================================
  COMPONENTE: MODAL DE KDA (COM PERSISTÊNCIA POR ROUND)
===============================================================================
*/
const KdaModal = ({
  player,
  currentRound,
  onClose,
  onSave,
}: {
  player: Player;
  currentRound: number;
  onClose: () => void;
  onSave: (k: number, d: number, a: number) => void;
}) => {
  // Busca os dados já salvos especificamente para este round
  const existingRoundStats = player.roundStats?.find(
    (s) => s.round === currentRound,
  );

  const [k, setK] = useState(existingRoundStats?.kills || 0);
  const [d, setD] = useState(existingRoundStats?.deaths || 0);
  const [a, setA] = useState(existingRoundStats?.assists || 0);

  // Soma acumulada para exibir o impacto total no placar
  const totalKills =
    (player.roundStats?.reduce((acc, curr) => acc + curr.kills, 0) || 0) -
    (existingRoundStats?.kills || 0) +
    k;

  return (
    <div className="fixed inset-0 z-250 flex items-center justify-center p-4 bg-black/95 backdrop-blur-sm uppercase italic">
      <div className="bg-[#111] border-2 border-[#FFB300] w-full max-w-sm shadow-[0_0_50px_rgba(255,179,0,0.2)] overflow-hidden animate-in zoom-in-95">
        <div className="bg-[#FFB300] p-4 flex justify-between items-center text-black font-black">
          <h3 className="text-lg tracking-tighter italic">
            REGISTRO DE RODADA: R{currentRound}
          </h3>
          <button
            onClick={onClose}
            className="hover:rotate-90 transition-transform"
          >
            <X />
          </button>
        </div>
        <div className="p-8 space-y-6">
          <div className="text-center">
            <p className="text-zinc-500 text-[10px] font-black uppercase tracking-widest mb-1">
              JOGADOR
            </p>
            <p className="text-xl text-white font-black italic">
              {player.gameNick}
            </p>
            <div className="inline-block px-3 py-1 bg-[#FFB300]/10 border border-[#FFB300]/20 mt-2">
              <span className="text-[10px] text-[#FFB300] font-black uppercase">
                PLACAR TOTAL: {totalKills} KILLS
              </span>
            </div>
          </div>
          <div className="grid grid-cols-3 gap-4">
            <div className="space-y-2">
              <label className="text-[8px] font-black text-zinc-500 flex items-center gap-1 uppercase">
                <Target size={12} /> KILLS
              </label>
              <input
                type="number"
                className="w-full bg-zinc-900 border border-zinc-800 p-2 text-white font-black text-center outline-none focus:border-[#FFB300]"
                value={k}
                onChange={(e) => setK(parseInt(e.target.value) || 0)}
              />
            </div>
            <div className="space-y-2">
              <label className="text-[8px] font-black text-zinc-500 flex items-center gap-1 uppercase">
                <Skull size={12} /> DEATHS
              </label>
              <input
                type="number"
                className="w-full bg-zinc-900 border border-zinc-800 p-2 text-white font-black text-center outline-none focus:border-[#FFB300]"
                value={d}
                onChange={(e) => setD(parseInt(e.target.value) || 0)}
              />
            </div>
            <div className="space-y-2">
              <label className="text-[8px] font-black text-zinc-500 flex items-center gap-1 uppercase">
                <Users size={12} /> ASSISTS
              </label>
              <input
                type="number"
                className="w-full bg-zinc-900 border border-zinc-800 p-2 text-white font-black text-center outline-none focus:border-[#FFB300]"
                value={a}
                onChange={(e) => setA(parseInt(e.target.value) || 0)}
              />
            </div>
          </div>
          <button
            onClick={() => onSave(k, d, a)}
            className="w-full bg-[#FFB300] text-black font-black py-4 text-xs tracking-widest hover:brightness-110 transition-all uppercase italic"
          >
            SALVAR NO HISTÓRICO
          </button>
        </div>
      </div>
    </div>
  );
};

/* ===============================================================================
  COMPONENTE: CARD DE TIME (REFLETE KD ACUMULADO E LADOS)
===============================================================================
*/
const TeamMatchCard = ({
  team,
  isWinner,
  isLost,
  isStaff,
  matchStatus,
  onSetWinner,
  onEditKda,
  isCurrentMatch,
  displaySide,
}: {
  team?: Team;
  isWinner: boolean;
  isLost: boolean;
  isStaff: boolean;
  matchStatus: MatchStatus;
  onSetWinner: () => void;
  onEditKda: (p: Player) => void;
  isCurrentMatch: boolean;
  displaySide: "TR" | "CT";
}) => {
  // Função para somar KD de todos os rounds salvos no histórico
  const getPlayerKdaText = (p: Player) => {
    const k = p.roundStats?.reduce((acc, curr) => acc + curr.kills, 0) || 0;
    const d = p.roundStats?.reduce((acc, curr) => acc + curr.deaths, 0) || 0;
    const a = p.roundStats?.reduce((acc, curr) => acc + curr.assists, 0) || 0;
    return `${k}/${d}/${a}`;
  };

  return (
    <div
      className={`flex flex-col w-full max-w-70 bg-[#111] border-l-4 transition-all duration-500 shadow-xl ${
        isWinner
          ? "border-green-500 bg-green-500/5"
          : isLost
            ? "border-zinc-800 opacity-30 grayscale"
            : isCurrentMatch
              ? "border-[#FFB300] bg-[#FFB300]/5"
              : "border-zinc-900 opacity-20 grayscale scale-[0.98]"
      }`}
    >
      <div className="bg-zinc-900 p-3 flex justify-between items-center border-b border-zinc-800">
        <div className="flex items-center gap-3">
          <div
            className={`w-8 h-8 flex items-center justify-center font-black text-xs transition-colors ${displaySide === "TR" ? "bg-orange-600" : "bg-blue-600"}`}
          >
            {displaySide}
          </div>
          <span className="font-black text-sm uppercase tracking-tighter truncate w-32 italic">
            {team?.name || "AGUARDANDO..."}
          </span>
        </div>
        {isWinner && (
          <Trophy size={16} className="text-[#FFB300] animate-bounce" />
        )}
      </div>

      <div className="p-4 space-y-2 bg-black/20 min-h-30">
        {team?.players.map((p) => (
          <div
            key={p.id}
            className="flex justify-between items-center text-[10px] font-bold py-1 border-b border-zinc-900/30 group"
          >
            <span className="text-zinc-400 group-hover:text-white transition-colors uppercase italic">
              {p.gameNick}
            </span>
            <div className="flex items-center gap-3">
              <span
                className="text-zinc-600 font-mono tracking-tighter"
                title="Kills / Deaths / Assists"
              >
                {getPlayerKdaText(p)}
              </span>
              {isStaff && matchStatus !== "finalizado" && isCurrentMatch && (
                <button
                  onClick={() => onEditKda(p)}
                  className="text-zinc-700 hover:text-[#FFB300] transition-transform active:scale-110"
                >
                  <Settings size={10} />
                </button>
              )}
            </div>
          </div>
        ))}
        {!team && (
          <div className="h-full flex flex-col items-center justify-center mt-6 space-y-2">
            <Clock size={20} className="text-zinc-800 opacity-20" />
            <p className="text-[9px] text-zinc-800 font-black text-center italic uppercase tracking-widest">
              Aguardando oponente
            </p>
          </div>
        )}
      </div>

      {isStaff &&
        team &&
        matchStatus !== "finalizado" &&
        !isWinner &&
        isCurrentMatch && (
          <button
            onClick={onSetWinner}
            className="w-full bg-zinc-800/50 hover:bg-green-600 text-zinc-500 hover:text-white py-2 text-[9px] font-black uppercase transition-all border-t border-zinc-800 italic tracking-widest"
          >
            DEFINIR VENCEDOR
          </button>
        )}
    </div>
  );
};

/* ===============================================================================
  COMPONENTE PRINCIPAL: ABA DE JOGOS
===============================================================================
*/
export const GamesTab: React.FC<GamesTabProps> = ({
  matches,
  teams,
  isStaff,
  onUpdateMatchStatus,
  onSetWinner,
  onUpdatePlayerKda,
  onUpdateMatchRound,
  onSwapSides,
}) => {
  const [editingPlayer, setEditingPlayer] = useState<Player | null>(null);
  const [editingMatchId, setEditingMatchId] = useState<string | null>(null);

  // Ordenação por fase e ordem de criação
  const sortedMatches = useMemo(() => {
    return [...matches].sort((a, b) => {
      if (a.phase !== b.phase) return a.phase - b.phase;
      return a.order - b.order;
    });
  }, [matches]);

  return (
    <div className="py-10 px-4 space-y-24 flex flex-col items-center italic tracking-widest">
      {sortedMatches.map((match) => {
        const teamA = teams.find((t) => t.id === match.teamAId);
        const teamB = teams.find((t) => t.id === match.teamBId);

        // Lógica de Destaque: Apenas o Confronto 1 ou o que estiver em curso ("iniciado")
        const isCurrentMatch = match.id === "m1" || match.status === "iniciado";
        const isLocked = !match.teamAId || !match.teamBId;
        const isFinished = match.status === "finalizado";

        // Lógica de Lados baseada no estado Swapped
        const sideA = match.swappedSides ? "CT" : "TR";
        const sideB = match.swappedSides ? "TR" : "CT";

        return (
          <div
            key={match.id}
            className={`flex flex-col items-center w-full transition-all duration-700 ${
              isCurrentMatch
                ? "scale-105 z-10"
                : isFinished
                  ? "opacity-60 grayscale-[0.5] scale-95"
                  : "opacity-40 grayscale blur-[1px] scale-90 pointer-events-none"
            }`}
          >
            {/* Título do Confronto e Controle de Rodadas */}
            <div className="flex flex-col items-center gap-2 mb-10">
              <div className="flex items-center gap-4">
                <div
                  className={`h-px w-12 sm:w-32 transition-colors ${isCurrentMatch ? "bg-[#FFB300]" : "bg-zinc-800"}`}
                ></div>
                <h4
                  className={`font-black text-xs sm:text-sm tracking-[0.5em] uppercase italic transition-colors ${isCurrentMatch ? "text-[#FFB300]" : "text-zinc-600"}`}
                >
                  {match.phase === 2
                    ? "GRANDE FINAL"
                    : `CONFRONTO ${match.id.replace("m", "")}`}
                </h4>
                <div
                  className={`h-px w-12 sm:w-32 transition-colors ${isCurrentMatch ? "bg-[#FFB300]" : "bg-zinc-800"}`}
                ></div>
              </div>

              {/* Controle de Rounds (Apenas se em destaque) */}
              <div
                className={`flex items-center gap-4 bg-zinc-900 border px-6 py-2 mt-3 shadow-2xl transition-all ${isCurrentMatch ? "border-[#FFB300] shadow-[0_0_20px_rgba(255,179,0,0.1)]" : "border-zinc-800 opacity-40"}`}
              >
                <span className="text-[10px] font-black text-zinc-500 uppercase tracking-widest italic mr-2">
                  RODADA ATUAL:
                </span>
                {isStaff && !isFinished && isCurrentMatch && (
                  <button
                    onClick={() => onUpdateMatchRound(match.id, false)}
                    className="text-zinc-600 hover:text-[#FFB300] transition-colors"
                  >
                    <Minus size={16} />
                  </button>
                )}
                <span
                  className={`text-xl font-black w-8 text-center ${isCurrentMatch ? "text-white" : "text-zinc-700"}`}
                >
                  {match.currentRound}
                </span>
                {isStaff && !isFinished && isCurrentMatch && (
                  <button
                    onClick={() => onUpdateMatchRound(match.id, true)}
                    className="text-zinc-600 hover:text-[#FFB300] transition-colors"
                  >
                    <Plus size={16} />
                  </button>
                )}
              </div>
            </div>

            {/* Visualização de Duelo */}
            <div className="flex flex-col md:flex-row items-center justify-center gap-8 md:gap-0 w-full max-w-4xl relative">
              <TeamMatchCard
                team={teamA}
                isWinner={match.winnerId === teamA?.id}
                isLost={!!match.winnerId && match.winnerId !== teamA?.id}
                isStaff={isStaff}
                matchStatus={match.status}
                onSetWinner={() => teamA && onSetWinner(match.id, teamA.id)}
                onEditKda={(p) => {
                  setEditingPlayer(p);
                  setEditingMatchId(match.id);
                }}
                isCurrentMatch={isCurrentMatch}
                displaySide={sideA}
              />

              {/* Conector VS com Ação de Troca de Lados */}
              <div className="flex flex-row md:flex-col mb-10 md:mb-0 items-center justify-center h-full min-w-25 relative">
                <div
                  className={`hidden md:block w-px h-32 transition-colors ${isCurrentMatch ? "bg-[#FFB300]/40" : "bg-zinc-800"}`}
                ></div>
                <div
                  className={`md:hidden h-px w-16 transition-colors ${isCurrentMatch ? "bg-[#FFB300]/40" : "bg-zinc-800"}`}
                ></div>

                <div className="flex flex-col items-center gap-4 z-10 mx-15">
                  <div
                    className={`p-3 border-2 transform rotate-45 transition-all ${isCurrentMatch ? "bg-[#FFB300] border-[#FFB300] shadow-[0_0_15px_rgba(255,179,0,0.3)]" : "bg-zinc-900 border-zinc-800"}`}
                  >
                    <Sword
                      size={20}
                      className={`transform -rotate-45 transition-colors ${isCurrentMatch ? "text-black" : "text-zinc-700"}`}
                    />
                  </div>
                  {isStaff && !isLocked && !isFinished && isCurrentMatch && (
                    <button
                      onClick={() => onSwapSides(match.id)}
                      className="bg-zinc-900 p-2 border border-zinc-800 hover:border-[#FFB300] hover:text-[#FFB300] text-zinc-500 transition-all rounded-full shadow-xl animate-in fade-in"
                      title="Inverter Lados (TR/CT)"
                    >
                      <Shuffle size={14} />
                    </button>
                  )}
                </div>

                <div
                  className={`hidden md:block w-px h-32 transition-colors ${isCurrentMatch ? "bg-[#FFB300]/40" : "bg-zinc-800"}`}
                ></div>
                <div
                  className={`md:hidden h-px w-16 transition-colors ${isCurrentMatch ? "bg-[#FFB300]/40" : "bg-zinc-800"}`}
                ></div>

                {/* Status Badge */}
                <div
                  className={`absolute -bottom-10 md:-bottom-[-25%] md:left-1/2 md:-translate-x-1/2 px-4 py-1.5 border text-[9px] font-black whitespace-nowrap uppercase tracking-[0.2em] italic transition-all ${
                    match.status === "iniciado"
                      ? "bg-indigo-600 border-indigo-400 text-white animate-pulse shadow-[0_0_15px_rgba(99,102,241,0.4)]"
                      : isCurrentMatch
                        ? "bg-zinc-900 border-[#FFB300] text-[#FFB300]"
                        : "bg-zinc-950 border-zinc-800 text-zinc-700"
                  }`}
                >
                  {match.status}
                </div>
              </div>

              <TeamMatchCard
                team={teamB}
                isWinner={match.winnerId === teamB?.id}
                isLost={!!match.winnerId && match.winnerId !== teamB?.id}
                isStaff={isStaff}
                matchStatus={match.status}
                onSetWinner={() => teamB && onSetWinner(match.id, teamB.id)}
                onEditKda={(p) => {
                  setEditingPlayer(p);
                  setEditingMatchId(match.id);
                }}
                isCurrentMatch={isCurrentMatch}
                displaySide={sideB}
              />
            </div>

            {/* Comando de Desbloqueio (Apenas para o confronto em destaque) */}
            {isStaff && !isLocked && !isFinished && isCurrentMatch && (
              <div className="mt-16 animate-in fade-in duration-1000">
                <button
                  onClick={() => onUpdateMatchStatus(match.id, "iniciado")}
                  className={`px-10 py-3 text-[11px] font-black border transition-all uppercase italic tracking-[0.3em] ${
                    match.status === "iniciado"
                      ? "bg-indigo-600 border-indigo-500 text-white shadow-[0_0_25px_rgba(99,102,241,0.3)]"
                      : "bg-transparent border-[#FFB300] text-[#FFB300] hover:bg-[#FFB300] hover:text-black"
                  }`}
                >
                  {match.status === "iniciado"
                    ? "JOGO INICIADO"
                    : "INICIAR JOGO"}
                </button>
              </div>
            )}
          </div>
        );
      })}

      {/* Mensagem Final de Conclusão */}
      {sortedMatches.length > 0 &&
        sortedMatches.every((m) => m.status === "finalizado") && (
          <div className="py-24 text-center space-y-6 animate-in zoom-in duration-1000">
            <div className="relative inline-block">
              <div className="absolute inset-0 bg-[#FFB300] blur-3xl opacity-5"></div>
              <Trophy
                size={80}
                className="text-[#FFB300] mx-auto relative z-10"
              />
            </div>
            <div className="space-y-2">
              <h2 className="text-4xl font-black italic text-white tracking-tighter uppercase">
                CAMPANHA ENCERRADA
              </h2>
              <p className="text-zinc-500 font-bold uppercase tracking-[0.4em] text-sm italic">
                O Grande Vencedor foi Coroado
              </p>
            </div>
          </div>
        )}

      {/* Modal de KDA (Salva performance por Round) */}
      {editingPlayer && editingMatchId && (
        <KdaModal
          player={editingPlayer}
          currentRound={
            matches.find((m) => m.id === editingMatchId)?.currentRound || 1
          }
          onClose={() => {
            setEditingPlayer(null);
            setEditingMatchId(null);
          }}
          onSave={(k, d, a) => {
            onUpdatePlayerKda(
              editingPlayer.id,
              editingMatchId,
              matches.find((m) => m.id === editingMatchId)!.currentRound,
              k,
              d,
              a,
            );
            setEditingPlayer(null);
            setEditingMatchId(null);
          }}
        />
      )}
    </div>
  );
};
