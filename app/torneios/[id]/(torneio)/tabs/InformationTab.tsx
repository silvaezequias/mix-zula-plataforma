import { ActionButton } from "@/components/ui/ActionButton";
import { FullTournament } from "@/types";
import { TournamentStatus } from "@prisma/client";
import {
  Ban,
  LogIn,
  Medal,
  Radio,
  Settings,
  Shuffle,
  Target,
  UserRoundPlus,
  Users,
} from "lucide-react";

import { useRouter } from "next/navigation";
import { JSX } from "react";

export type InformationTabProps = {
  tournament: FullTournament;
};

export const InformationTab = ({ tournament }: InformationTabProps) => {
  const router = useRouter();
  const tournamentId = tournament.id;

  const handleAction = () => {
    router.push(`/torneios/${tournamentId}/participar`);
  };

  const statusMap: Record<
    TournamentStatus,
    {
      label: string;
      className: string;
      icon: JSX.ElementType;
    }
  > = {
    LIVE: {
      label: "EM ANDAMENTO",
      className: "bg-indigo-600",
      icon: Radio,
    },
    READY: {
      label: "PREPARANDO PARA INÍCIO",
      className: "bg-emerald-600",
      icon: Radio,
    },
    OPEN: {
      label: "INCRIÇÕES ABERTAS",
      className: "bg-green-600",
      icon: UserRoundPlus,
    },
    SETTING_TEAM: {
      label: "DEFININDO EQUIPES",
      className: "bg-yellow-600",
      icon: Shuffle,
    },
    FINISHED: {
      label: "FINALIZADO",
      className: "bg-red-600",
      icon: Medal,
    },
    CLOSED: {
      label: "FECHADO",
      className: "bg-red-800",
      icon: Ban,
    },
  } as const;

  const status = statusMap[tournament.status] || {
    label: "STATUS DESCONHECIDO",
    className: "bg-gray-600",
    icon: Settings,
  };

  return (
    <div className="space-y-6 uppercase animate-in fade-in duration-500">
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 px-2">
        {tournament.status === "OPEN" && (
          <ActionButton className="w-full sm:col-span-2" onClick={handleAction}>
            <LogIn
              size={20}
              className="group-hover:translate-x-1 transition-transform"
            />
            <span className="text-sm font-black italic tracking-tighter uppercase">
              PARTICIPAR DO TORNEIO
            </span>
          </ActionButton>
        )}

        {status && (
          <span
            className={`${status.className} text-white w-full sm:col-span-1 px-6 py-2 font-black text-sm uppercase flex items-center justify-center gap-2 italic tracking-widest`}
          >
            <status.icon size={16} className="animate-pulse" />
            {status.label}
          </span>
        )}
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-[#111] p-6 border-l-2 border-primary">
          <Medal className="text-primary mb-4" size={24} />
          <p className="text-[10px] text-zinc-500 font-black">PREMIAÇÃO</p>
          <p className="text-xl font-black italic text-white">
            {tournament.prize}
          </p>
        </div>
        <div className="bg-[#111] p-6 border-l-2 border-zinc-700">
          <Target className="text-zinc-500 mb-4" size={24} />
          <p className="text-[10px] text-zinc-500 font-black">MODO</p>
          <p className="text-xl font-black italic text-white">
            {tournament.gameMode}
          </p>
        </div>
        <div className="bg-[#111] p-6 border-l-2 border-zinc-700">
          <Users className="text-zinc-500 mb-4" size={24} />
          <p className="text-[10px] text-zinc-500 font-black">INSCRITOS</p>
          <p className="text-xl font-black italic text-white">
            {tournament.participants.length}/{tournament.maxPlayers}
          </p>
        </div>
      </div>
      <div className="bg-[#111] border border-zinc-800 p-8">
        <h4 className="text-xs font-black text-primary mb-6 italic tracking-widest">
          REGRAS DO TORNEIO
        </h4>
        <ul className="space-y-4 text-[11px] font-bold text-zinc-400">
          <li className="flex gap-4 border-b border-zinc-900 pb-3">
            <span className="text-primary">01.</span> NICK EM JOGO DEVE SER
            IDENTICO AO CADASTRADO.
          </li>
          <li className="flex gap-4 border-b border-zinc-900 pb-3">
            <span className="text-primary">02.</span>
            USO DE SOFTWARE EXTERNO RESULTARÁ EM BANIMENTO.
          </li>
          <li className="flex gap-4 border-b border-zinc-900 pb-3">
            <span className="text-primary">03.</span>
            <span>
              ROUNDS POR LADO:{" "}
              <span className="font-black text-white">
                {10} {/* tournament.rounds /** */}.
              </span>
            </span>
          </li>
          <li className="flex gap-4 border-b border-zinc-900 pb-3">
            <span className="text-primary">04.</span>
            <span>
              TROCA DE LADOS PERMITIDA:{" "}
              <span className="font-black text-white">
                {tournament.swapTeam ? "SIM" : "NÃO"}
              </span>
              .
            </span>
          </li>
          <li className="flex gap-4 border-b border-zinc-900 pb-3">
            <span className="text-primary">04.</span>
            <span>
              TOTAL DE TIMES:{" "}
              <span className="font-black text-white">
                {tournament.totalTeams}
              </span>
              .
            </span>
          </li>
          <li className="flex gap-4 border-b border-zinc-900 pb-3">
            <span className="text-primary">04.</span>
            <span>
              JOGADORES POR TIME:{" "}
              <span className="font-black text-white">
                {tournament.playersPerTeam}
              </span>
              .
            </span>
          </li>
        </ul>
      </div>
    </div>
  );
};
