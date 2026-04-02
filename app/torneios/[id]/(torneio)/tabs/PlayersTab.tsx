import { Player } from "@/types";
import { Search } from "lucide-react";
import { useState } from "react";

type PlayersTabProps = {
  players: Player[];
  onManageUser: (player: Player) => void;
};

export const PlayersTab = ({ players, onManageUser }: PlayersTabProps) => {
  const [searchTerm, setSearchTerm] = useState("");
  const isStaff = true; // TODO: substituir pela verificação real de permissão

  const filteredPlayers = players.filter(
    (p) =>
      p.gameNick.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.discordName.toLowerCase().includes(searchTerm.toLowerCase()),
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
  );
};
