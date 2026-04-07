import { FullTournament } from "@/types";
import { Search, Users } from "lucide-react";
import { useState } from "react";

type PlayersTabProps = {
  tournament: FullTournament;
  onManageUser: (participant: FullTournament["participants"][number]) => void;
};

export const PlayersTab = ({ tournament, onManageUser }: PlayersTabProps) => {
  const [searchTerm, setSearchTerm] = useState("");
  const isStaff = true; // TODO: substituir pela verificação real de permissão

  const filteredPlayers = tournament.participants.filter((p) =>
    p.user.player?.nickname.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  return (
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
            className="w-full bg-zinc-900/50 border border-zinc-800 p-4 pl-12 text-xs font-black outline-none focus:border-primary transition-all uppercase italic tracking-widest"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      )}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-h-125 overflow-y-auto pr-2 custom-scrollbar">
        {filteredPlayers.length ? (
          filteredPlayers.map((p) => (
            <div
              key={p.id}
              onClick={() => isStaff && onManageUser(p)}
              className={`bg-zinc-900/50 border border-zinc-800 p-4 flex items-center justify-between group transition-colors ${isStaff ? "hover:border-primary/50 cursor-pointer" : ""}`}
            >
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 bg-zinc-800 flex items-center justify-center text-primary font-black border border-zinc-700 italic">
                  {p.user.player?.nickname.charAt(0)}
                </div>
                <div>
                  <p className="text-sm font-black italic text-white uppercase  tracking-tighter">
                    {p.user.player?.nickname}
                  </p>
                  <p className="text-[10px] text-zinc-500 font-bold uppercase tracking-tight italic ">
                    @{p.user.name}
                  </p>
                </div>
              </div>
              {isStaff && (
                <span className="text-[9px] font-bold text-zinc-700 uppercase group-hover:text-primary hidden sm:block italic tracking-widest">
                  GERENCIAR
                </span>
              )}
            </div>
          ))
        ) : (
          <div className="col-span-2 py-32 text-center border-2 border-dashed border-zinc-900">
            <Users size={48} className="mx-auto text-zinc-900 mb-4" />
            <p className="text-zinc-700 font-black uppercase italic tracking-[0.4em]">
              Nenhum jogador inscrito encontrado nesse torneio
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
