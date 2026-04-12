import { ActionButton } from "@/components/ui/ActionButton";
import { FullTournament } from "@/types";
import { Participant, TournamentStatus } from "@prisma/client";
import {
  Ban,
  Check,
  Copy,
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
import { JSX, useState } from "react";

export type InformationTabProps = {
  tournament: FullTournament;
  sessionMember: Participant | null;
};

export const InformationTab = ({
  tournament,
  sessionMember,
}: InformationTabProps) => {
  const router = useRouter();
  const tournamentId = tournament.id;

  const [copied, setCopied] = useState(false);

  const handleCopyLink = () => {
    const link = `${window.location.origin}/torneios/${tournament.id}/participar`;
    navigator.clipboard.writeText(link);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

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
      className: "border-indigo-600",
      icon: Radio,
    },
    READY: {
      label: "PREPARANDO PARA INÍCIO",
      className: "border-emerald-600",
      icon: Radio,
    },
    OPEN: {
      label: "INCRIÇÕES ABERTAS",
      className: "border-green-600",
      icon: UserRoundPlus,
    },
    SETTING_TEAM: {
      label: "DEFININDO EQUIPES",
      className: "border-yellow-600",
      icon: Shuffle,
    },
    FINISHED: {
      label: "FINALIZADO",
      className: "border-red-600",
      icon: Medal,
    },
    CLOSED: {
      label: "FECHADO",
      className: "border-red-800",
      icon: Ban,
    },
  } as const;

  const status = statusMap[tournament.status] || {
    label: "STATUS DESCONHECIDO",
    className: "border-gray-600",
    icon: Settings,
  };

  const canJoinInTournament = tournament.status === "OPEN" && !sessionMember;

  return (
    <div className="space-y-6 uppercase animate-in fade-in duration-500">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 px-2">
        {canJoinInTournament && (
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
      </div>
      <div className="pt-4 border-t border-zinc-800">
        <label className="text-[9px] font-bold text-zinc-500 uppercase block mb-3 italic">
          Link de Convite
        </label>
        <div className="flex gap-2">
          <div className="flex-1 bg-zinc-900 border border-zinc-800 p-3 text-[10px] text-zinc-500 truncate font-mono italic lowercase">
            {window.location.origin}/torneios/{tournament.id}/participar
          </div>
          <button
            onClick={handleCopyLink}
            className={`px-6 transition-all flex items-center justify-center ${copied ? "bg-green-600 text-white" : "bg-zinc-800 text-primary hover:bg-zinc-700"}`}
          >
            {copied ? <Check size={18} /> : <Copy size={18} />}
          </button>
        </div>
        <p className="text-[8px] text-zinc-700 mt-2 font-semibold">
          Compartilhe esse link para convidar jogadores para o torneio
        </p>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className={`bg-[#111] p-6 border-l-3 ${status.className}`}>
          <status.icon className="text-zinc-500 mb-4" size={24} />
          <p className="text-[10px] text-zinc-500 font-black">STATUS</p>
          <p className="text-xl font-black italic text-white">{status.label}</p>
        </div>
        <div className="bg-[#111] p-6 border-l-2 border-zinc-700">
          <Medal className="text-zinc-500 mb-4" size={24} />
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
