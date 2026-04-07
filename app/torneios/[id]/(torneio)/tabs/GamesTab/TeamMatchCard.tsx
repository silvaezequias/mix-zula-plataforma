import { FullTournament } from "@/types";
import { TeamSide } from "@prisma/client";
import { Clock, Settings, Trophy } from "lucide-react";

export const TeamMatchCard = ({
  team,
  match,
  displaySide,
}: {
  displaySide: TeamSide;
  team: FullTournament["matches"][number]["team1"];
  match: FullTournament["matches"][number];
}) => {
  const isWinner = team!.id === match.winnerTeamId;
  const isLost = match.winnerTeamId && !isWinner;
  const isCurrentMatch = match.status === "ONGOING";
  const isStaff = true;

  return (
    <div
      className={`flex flex-col w-full max-w-70 bg-[#111] border-l-4 transition-all duration-500 shadow-xl ${
        isWinner
          ? "border-green-500 bg-green-500/5"
          : isLost
            ? "border-zinc-800 opacity-30 grayscale"
            : isCurrentMatch
              ? "border-primary bg-primary/5"
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
          <Trophy size={16} className="text-primary animate-bounce" />
        )}
      </div>

      <div className="p-4 space-y-2 bg-black/20 min-h-30">
        {team?.members.map((p) => (
          <div
            key={p.id}
            className="flex justify-between items-center text-[10px] font-bold py-1 border-b border-zinc-900/30 group"
          >
            <span className="text-zinc-400 group-hover:text-white transition-colors uppercase italic">
              {p.participant.user.player?.nickname}
            </span>
            <div className="flex items-center gap-3">
              <span
                className="text-zinc-600 font-mono tracking-tighter"
                title="Kills / Deaths / Assists"
              >
                0/0/0
              </span>
              {isStaff && match.status !== "FINISHED" && isCurrentMatch && (
                <button
                  onClick={() => {}}
                  className="text-zinc-700 hover:text-primary transition-transform active:scale-110"
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
        match.status !== "FINISHED" &&
        !isWinner &&
        isCurrentMatch && (
          <button className="w-full bg-zinc-800/50 hover:bg-green-600 text-zinc-500 hover:text-white py-2 text-[9px] font-black uppercase transition-all border-t border-zinc-800 italic tracking-widest">
            DEFINIR VENCEDOR
          </button>
        )}
    </div>
  );
};
