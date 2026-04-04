import { ActionButton } from "@/components/ui/ActionButton";
import { Championship } from "@/types";
import {
  LogIn,
  MapIcon,
  Medal,
  Radio,
  Settings,
  Shuffle,
  Target,
  UserRoundPlus,
} from "lucide-react";
import { useRouter } from "next/navigation";

export type InformationTabProps = {
  championship: Championship;
};

export const InformationTab = ({ championship }: InformationTabProps) => {
  const isAdmin = true; // TODO: substituir pela verificação real de permissão

  const router = useRouter();
  const tournamentId = championship.id; // Certifique-se de que o ID do torneio esteja disponível no objeto championship

  const handleAction = () => {
    router.push(`/torneios/${tournamentId}/participar`);
  };

  const statusMap = {
    live: {
      label: "EM ANDAMENTO",
      className: "bg-indigo-600",
      icon: Radio,
    },
    ready: {
      label: "PREPARANDO PARA INÍCIO",
      className: "bg-emerald-600",
      icon: Radio,
    },
    open: {
      label: "INCRIÇÕES ABERTAS",
      className: "bg-green-600",
      icon: UserRoundPlus,
    },
    setting_teams: {
      label: "DEFININDO EQUIPES",
      className: "bg-yellow-600",
      icon: Shuffle,
    },
    randomizing: {
      label: "RANDOMIZANDO EQUIPES",
      className: "bg-purple-600",
      icon: Shuffle,
    },
    finished: {
      label: "FINALIZADO",
      className: "bg-red-600",
      icon: Medal,
    },
  } as const;

  const status = statusMap[championship.status] || {
    label: "STATUS DESCONHECIDO",
    className: "bg-gray-600",
    icon: Settings,
  };

  return (
    <div className="space-y-6 uppercase animate-in fade-in duration-500">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 px-2 flex-wrap">
        {!isAdmin && championship.status === "open" ? (
          <>
            <ActionButton
              className="w-full ring ring-red-400 col-span-2 hidden md:inline-block"
              onClick={handleAction}
            >
              <LogIn
                size={20}
                className="group-hover:translate-x-1 transition-transform"
              />
              <span className="text-sm font-black italic tracking-tighter uppercase">
                PARTICIPAR DO TORNEIO
              </span>
            </ActionButton>
            <ActionButton
              className="w-full ring ring-red-400 col-span-1 md:hidden"
              onClick={handleAction}
            >
              <LogIn
                size={20}
                className="group-hover:translate-x-1 transition-transform"
              />
              <span className="text-sm font-black italic tracking-tighter uppercase">
                PARTICIPAR DO TORNEIO
              </span>
            </ActionButton>
          </>
        ) : (
          <>
            <span />
            <span />
          </>
        )}
        {status && (
          <span
            className={`${status.className} text-white w-full col-span-1 md:col-span-1  px-6 py-2 font-black text-sm uppercase flex items-center justify-center gap-2 italic tracking-widest`}
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
            {championship.prize}
          </p>
        </div>
        <div className="bg-[#111] p-6 border-l-2 border-zinc-700">
          <MapIcon className="text-zinc-500 mb-4" size={24} />
          <p className="text-[10px] text-zinc-500 font-black">MAPA</p>
          <p className="text-xl font-black italic text-white">
            {championship.settings.map}
          </p>
        </div>
        <div className="bg-[#111] p-6 border-l-2 border-zinc-700">
          <Target className="text-zinc-500 mb-4" size={24} />
          <p className="text-[10px] text-zinc-500 font-black">MODO</p>
          <p className="text-xl font-black italic text-white">
            {championship.settings.gameMode}
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
                {championship.settings.rounds}.
              </span>
            </span>
          </li>
          <li className="flex gap-4 border-b border-zinc-900 pb-3">
            <span className="text-primary">04.</span>
            <span>
              TROCA DE LADOS PERMITIDA:{" "}
              <span className="font-black text-white">
                {championship.settings.sideSwap ? "SIM" : "NÃO"}
              </span>
              .
            </span>
          </li>
          <li className="flex gap-4 border-b border-zinc-900 pb-3">
            <span className="text-primary">04.</span>
            <span>
              TOTAL DE TIMES:{" "}
              <span className="font-black text-white">
                {championship.settings.totalTeams}
              </span>
              .
            </span>
          </li>
          <li className="flex gap-4 border-b border-zinc-900 pb-3">
            <span className="text-primary">04.</span>
            <span>
              JOGADORES POR TIME:{" "}
              <span className="font-black text-white">
                {championship.settings.playersPerTeam}
              </span>
              .
            </span>
          </li>
        </ul>
      </div>
    </div>
  );
};
