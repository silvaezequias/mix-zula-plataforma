import { Tournament, TournamentStatus } from "@prisma/client";
import { ChevronRight, Medal, Target, Trophy, Users } from "lucide-react";

export const TournamentCard = ({ tournament }: { tournament: Tournament }) => {
  const getStatusConfig = (status: TournamentStatus) => {
    switch (status) {
      case "OPEN":
        return {
          label: "INSCRIÇÕES ABERTAS",
          color: "text-green-500",
          border: "border-green-500/50",
        };
      case "LIVE":
        return {
          label: "EM ANDAMENTO",
          color: "text-indigo-500",
          border: "border-indigo-500/50",
          pulse: true,
        };
      case "FINISHED":
        return {
          label: "FINALIZADO",
          color: "text-red-500",
          border: "border-red-500/50",
        };

      case "READY":
        return {
          label: "INICÍADO",
          color: "text-emerald-500",
          border: "border-emerald-500/50",
        };
      case "CLOSED":
        return {
          label: "FECHADO",
          color: "text-red-500",
          border: "border-red-500/50",
        };
      default:
        return {
          label: "PREPARANDO",
          color: "text-primary",
          border: "border-primary/50",
        };
    }
  };

  const config = getStatusConfig(tournament.status);

  return (
    <div
      className={`group relative bg-[#111] border-l-4 ${config.border} p-6 sm:p-8 hover:bg-zinc-900 transition-all cursor-pointer overflow-hidden shadow-xl`}
    >
      <div className="absolute top-0 right-0 w-32 h-32 bg-primary opacity-[0.02] transform rotate-45 translate-x-16 -translate-y-16 group-hover:opacity-[0.05] transition-opacity"></div>

      <div className="relative z-10 flex flex-col h-full">
        <header className="flex justify-between items-start mb-6">
          <div className="space-y-1">
            <span
              className={`text-[8px] font-black tracking-[0.4em] uppercase ${config.color} ${config.pulse ? "animate-pulse" : ""}`}
            >
              {config.label}
            </span>
            <h3 className="text-2xl sm:text-3xl font-black italic tracking-tighter uppercase leading-none group-hover:text-primary transition-colors">
              {tournament.title}
            </h3>
          </div>
          <div className="bg-zinc-900 p-2 border border-zinc-800 group-hover:border-primary transition-colors">
            <Trophy
              size={20}
              className={
                tournament.status === "FINISHED"
                  ? "text-zinc-500"
                  : "text-primary"
              }
            />
          </div>
        </header>

        <div className="grid grid-cols-2 gap-4 mb-8">
          <div className="flex items-center gap-2">
            <Users size={14} className="text-zinc-600" />
            <span className="text-[10px] font-bold text-zinc-400 uppercase">
              0/{tournament.maxRegistrations}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <Target size={14} className="text-zinc-600" />
            <span className="text-[10px] font-bold text-zinc-400 uppercase">
              {tournament.gameMode}
            </span>
          </div>
          <div className="col-span-2 flex items-center gap-2 mt-2">
            <Medal size={14} className="text-primary" />
            <span className="text-xs font-black text-primary uppercase italic tracking-tighter">
              PRÉMIO: {tournament.prize}
            </span>
          </div>
        </div>

        <div className="mt-auto flex items-center gap-2 text-[9px] font-black text-zinc-500 group-hover:text-white transition-colors uppercase tracking-widest">
          Acessar informações do torneio{" "}
          <ChevronRight
            size={14}
            className="group-hover:translate-x-1 transition-transform"
          />
        </div>
      </div>
    </div>
  );
};
