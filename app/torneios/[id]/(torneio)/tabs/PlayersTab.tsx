import { Button } from "@/components/ui/Button";
import { CardPlayer } from "@/components/ui/CardPlayer";
import { participantStatusMap, roleColors } from "@/constants/data";
import { FullTournament } from "@/types";
import { Search, Users } from "lucide-react";
import { useState } from "react";

type PlayersTabProps = {
  tournament: FullTournament;
  isStaff: boolean;
  onManageUser: (participant: FullTournament["participants"][number]) => void;
};

export const PlayersTab = ({
  tournament,
  onManageUser,
  isStaff,
}: PlayersTabProps) => {
  const [searchTerm, setSearchTerm] = useState("");

  let filteredPlayers = tournament.participants.filter((p) =>
    p.user.player?.nickname.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  if (!isStaff) {
    filteredPlayers = filteredPlayers.filter((p) => p.status === "ACTIVE");
  }

  return (
    <div className="space-y-4 animate-in fade-in duration-300">
      {isStaff && (
        <div className="grid grid-cols-4">
          <div className="relative group col-span-4">
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
        </div>
      )}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-h-125 overflow-y-auto custom-scrollbar">
        {filteredPlayers.length ? (
          filteredPlayers.map((p) => (
            <CardPlayer
              key={p.id}
              name={p.user.name!}
              nickname={p.user.player!.nickname!}
              className="grid-cols-3"
            >
              {isStaff && (
                <span className="text-white text-xs uppercase font-bold place-self-center self-center">
                  Satus:{" "}
                  <span className={participantStatusMap[p.status].color}>
                    {participantStatusMap[p.status].label}
                  </span>
                </span>
              )}

              {isStaff && (
                <span className="text-white text-xs uppercase font-bold place-self-end self-center">
                  Cargo: <span className={roleColors[p.role]}>{p.role}</span>
                </span>
              )}

              {isStaff && (
                <span
                  className={`flex gap-2 place-self-center self-center w-full ${isStaff ? "col-span-3" : "col-span-1"}`}
                >
                  <Button className="w-full" onClick={() => onManageUser(p)}>
                    Gerenciar
                  </Button>
                </span>
              )}
            </CardPlayer>
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
