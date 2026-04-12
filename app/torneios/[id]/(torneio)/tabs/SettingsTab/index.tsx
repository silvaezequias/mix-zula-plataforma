import { FullTournament } from "@/types";
import { Tournament } from "@prisma/client";
import { Check, Flame, Power, PowerOff, Settings, Shuffle } from "lucide-react";
import { JSX, useState } from "react";
import { AboutTournament } from "./AboutTournament";
import { PresenceConfirmation } from "./PresenceConfirmationSection";
import { BroadcastSection } from "./BroadcastSection";
import { ParametersSection } from "./ParametersSection";
import { ActionButton } from "@/components/ui/ActionButton";

type SettingsTabProps = {
  tournament: FullTournament;
  isRandomizing: boolean;
  onRandomize: () => void;
};

export type HandleTournamentChange = <T extends keyof Tournament>(
  key: T,
  value: Tournament[T],
) => void;

export type HandleTournamentToggle = <T extends keyof Tournament>(
  key: T,
) => void;

export const SettingsTab = (props: SettingsTabProps) => {
  const { onRandomize } = props;

  const [tournament, setTournament] = useState<FullTournament>(
    props.tournament,
  );

  const handleTournamentChange: HandleTournamentChange = (key, value) => {
    setTournament((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  const handleTournamentToggle: HandleTournamentToggle = (key) => {
    if (typeof tournament[key] === "boolean") {
      setTournament((prev) => ({
        ...prev,
        [key]: !tournament[key],
      }));
    }
  };

  const maxPlayersCount = tournament.playersPerTeam * tournament.totalTeams;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-8 animate-in fade-in duration-500">
      <AboutTournament
        title={tournament.title}
        description={tournament.description}
        prize={tournament.prize}
        handleChange={handleTournamentChange}
      />

      <PresenceConfirmation
        handleChange={handleTournamentChange}
        handleToggle={handleTournamentToggle}
        confirmationSystem={tournament.confirmationSystem}
        confirmationTime={tournament.confirmationTime}
        hasSubstitutes={tournament.hasSubstitutes}
        substitutesLimit={tournament.substitutesLimit}
      />

      <BroadcastSection
        handleChange={handleTournamentChange}
        broadcastPlatform={tournament.broadcastPlatform}
        broadcastUrl={tournament.broadcastUrl}
      />

      <ParametersSection
        handleChange={handleTournamentChange}
        handleToggle={handleTournamentToggle}
        gameMode={tournament.gameMode}
        matchesPerMatch={tournament.matchesPerMatch}
        maxPlayers={tournament.maxPlayers}
        maxRegistrations={tournament.maxRegistrations}
        playersPerTeam={tournament.playersPerTeam}
        statsType={tournament.statsType}
        swapTeam={tournament.swapTeam}
        teamManagement={tournament.teamManagement}
        totalTeams={tournament.totalTeams}
      />

      <Card title="Ações" icon={Power} className="col-span-1">
        <div className="space-y-4 flex-1 flex flex-col justify-between">
          <div className="space-y-3">
            <p className="text-[9px] text-zinc-600 font-bold leading-relaxed uppercase">
              Controle geral de ações operacionais do torneio. Cuidado ao
              executar comandos que
            </p>

            <button
              className="w-full bg-primary text-black font-black py-4 text-xs tracking-[0.2em] hover:brightness-110 active:scale-[0.98] transition-all uppercase italic shadow-[0_10px_20px_rgba(255,179,0,0.1)] flex items-center justify-center gap-3 group border-b-4 border-black/20"
              onClick={() => onRandomize()}
            >
              <Shuffle
                size={18}
                className="group-hover:scale-125 transition-transform"
              />
              {tournament.status === "READY"
                ? "RE-SORTEAR EQUIPES"
                : "SORTEAR EQUIPES"}
            </button>

            <button className="w-full bg-zinc-900 border border-zinc-800 text-red-500/50 p-3 text-[10px] font-black hover:text-red-500 hover:border-red-500/50 transition-all flex items-center gap-3 uppercase italic">
              <Flame size={14} /> Iniciar Torneio
            </button>

            <button className="w-full bg-zinc-900 border border-zinc-800 text-red-500/50 p-3 text-[10px] font-black hover:text-red-500 hover:border-red-500/50 transition-all flex items-center gap-3 uppercase italic">
              <PowerOff size={14} /> Encerrar Torneio
            </button>
          </div>
        </div>
      </Card>

      <Card
        icon={Settings}
        title="Resumo Técnico"
        className="col-span-1 lg:col-span-2 xl:col-span-3"
      >
        <div className="space-y-4 text-sm font-bold border-b border-zinc-800">
          <div className="flex justify-between uppercase">
            <span className="text-zinc-500">INSCRITOS</span>
            <span>
              {tournament.participants.length} / {maxPlayersCount}
            </span>
          </div>
          <div className="flex justify-between uppercase">
            <span className="text-zinc-500">LISTA DE ESPERA</span>
            <span className="text-orange-500 italic">
              {Math.max(0, tournament.participants.length - maxPlayersCount)}
            </span>
          </div>
        </div>
        <div className="col-span-1 flex flex-col pt-4">
          <ActionButton
            className="w-full"
            onClick={() => console.log("Informações atualizadas no radar.")}
          >
            <Check
              size={20}
              className="group-hover:scale-110 transition-transform"
            />
            Atualizar
          </ActionButton>
        </div>
      </Card>
    </div>
  );
};

export const Card = ({
  title,
  children,
  icon: Icon,
  className,
}: {
  title: string;
  children: React.ReactNode;
  icon: JSX.ElementType;
  className?: string;
}) => {
  return (
    <div
      className={`space-y-8 bg-[#111] border border-zinc-800 p-8 shadow-2xl relative overflow-hidden ${className || ""}`}
    >
      <div className="flex items-center gap-3 text-primary">
        <Icon size={20} />
        <h3 className="text-xl font-bold italic tracking-tighter uppercase">
          {title}
        </h3>
      </div>
      {children}
    </div>
  );
};
