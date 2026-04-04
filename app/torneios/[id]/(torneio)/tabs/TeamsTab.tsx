import { Championship } from "@/types";
import { Check, Users } from "lucide-react";

export const TeamsView = ({ championsip }: { championsip: Championship }) => (
  <div className="grid grid-cols-1 md:grid-cols-2 gap-8 animate-in fade-in duration-700">
    {championsip.teams.length > 0 ? (
      championsip.teams.map((team) => (
        <div
          key={team.id}
          className={`bg-[#111] border-t-2 ${team.side === "TR" ? "border-orange-600" : "border-blue-600"} shadow-2xl overflow-hidden`}
        >
          <div
            className={`p-4 flex justify-between items-center ${team.side === "TR" ? "bg-orange-600/10" : "bg-blue-600/10"}`}
          >
            <div className="flex items-center gap-4">
              <div
                className={`w-10 h-10 flex items-center justify-center font-black text-sm ${team.side === "TR" ? "bg-orange-600" : "bg-blue-600"}`}
              >
                {team.side}
              </div>
              <h3 className="text-xl font-black italic tracking-tighter uppercase">
                {team.name}
              </h3>
            </div>
            <Users size={20} className="text-zinc-700" />
          </div>

          <div className="p-6 space-y-3 bg-black/20">
            <p className="text-[9px] font-black text-zinc-500 tracking-[0.3em] uppercase mb-4 italic">
              Lista de Jogadores
            </p>
            {team.players.map((player) => (
              <div
                key={player.id}
                className="flex items-center justify-between border-b border-zinc-800/50 pb-2 last:border-0 group"
              >
                <div className="flex items-center gap-3">
                  <div className="w-6 h-6 bg-zinc-900 border border-zinc-800 flex items-center justify-center text-[10px] text-zinc-500 group-hover:text-primary transition-colors uppercase italic font-bold">
                    {player.gameNick.charAt(0)}
                  </div>
                  <span className="text-xs font-black italic text-zinc-300 group-hover:text-white transition-colors uppercase">
                    {player.gameNick}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-[8px] font-bold text-zinc-600 uppercase italic">
                    Verificado
                  </span>
                  <Check size={12} className="text-green-600 opacity-50" />
                </div>
              </div>
            ))}
          </div>

          <div className="px-6 py-4 bg-zinc-900/30 border-t border-zinc-800 flex justify-between items-center">
            <span className="text-[9px] font-black text-zinc-600 uppercase italic tracking-widest">
              TIME ALEATORIO
            </span>
            <span className="text-[9px] font-black text-green-500 uppercase italic tracking-widest animate-pulse">
              Definido
            </span>
          </div>
        </div>
      ))
    ) : (
      <div className="col-span-2 py-32 text-center border-2 border-dashed border-zinc-900">
        <Users size={48} className="mx-auto text-zinc-900 mb-4" />
        <p className="text-zinc-700 font-black uppercase italic tracking-[0.4em]">
          As equipas ainda não foram sorteadas pela Staff.
        </p>
      </div>
    )}
  </div>
);
