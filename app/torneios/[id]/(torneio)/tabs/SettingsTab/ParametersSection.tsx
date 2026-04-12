import {
  History,
  LayoutGrid,
  Minus,
  Plus,
  Sliders,
  Target,
  UserPlus,
  Users,
} from "lucide-react";
import { GAME_MODES } from "@/constants/data";
import { GameMode, StatsType, TeamManagement } from "@prisma/client";
import {
  ConfigDropdown,
  ConfigNumberInput,
  ConfigSwitch,
} from "@/components/ui/components";
import { Card, HandleTournamentChange, HandleTournamentToggle } from ".";

type ParametersSectionProps = {
  teamManagement?: string;
  statsType?: string;
  matchesPerMatch?: number;
  swapTeam?: boolean;
  gameMode?: string;
  maxRegistrations?: number;
  playersPerTeam?: number;
  maxPlayers?: number;
  totalTeams?: number;
  handleToggle: HandleTournamentToggle;
  handleChange: HandleTournamentChange;
};

export const ParametersSection = (props: ParametersSectionProps) => {
  const { handleChange, handleToggle, ...rest } = props;

  return (
    <Card
      icon={Sliders}
      title="Parâmetros de Torneio"
      className="lg:col-span-5 space-y-8"
    >
      <div className="space-y-6">
        <TeamManagementSelect
          value={rest.teamManagement as TeamManagement}
          onChange={handleChange}
        />

        <StatsSelector
          statsType={rest.statsType as StatsType}
          handleChange={handleChange}
        />

        <LimitsGroup {...rest} handleChange={handleChange} />

        <MatchSettings
          {...rest}
          handleChange={handleChange}
          handleToggle={handleToggle}
        />
      </div>
    </Card>
  );
};

type MatchSettingsProps = {
  playersPerTeam?: number;
  matchesPerMatch?: number;
  swapTeam?: boolean;
  gameMode?: string;

  handleChange: HandleTournamentChange;
  handleToggle: HandleTournamentToggle;
};

const MatchSettings = ({
  playersPerTeam,
  matchesPerMatch,
  swapTeam,
  gameMode,
  handleChange,
  handleToggle,
}: MatchSettingsProps) => (
  <div className="space-y-4 pt-4 border-t border-zinc-900">
    <div className="flex items-center justify-between">
      <span className="text-[9px] font-black text-zinc-500 uppercase italic">
        Jogadores por time
      </span>
      <input
        type="number"
        name="playersPerTeam"
        className="w-16 bg-zinc-900 border border-zinc-800 p-2 text-center text-xs font-black italic text-white outline-none focus:border-primary"
        value={playersPerTeam}
        onChange={(v) => handleChange("playersPerTeam", +v.target.value)}
      />
    </div>
    <MatchCounter value={matchesPerMatch} handleChange={handleChange} />
    <ConfigSwitch
      label="TROCA DE LADOS"
      checked={!!swapTeam}
      onChange={() => handleToggle("swapTeam")}
    />
    <ConfigDropdown
      label="Modo"
      name="gameMode"
      value={gameMode ?? GameMode.SABOTAGEM}
      options={GAME_MODES}
      onChange={(v) => handleChange("gameMode", v.target.value as GameMode)}
      icon={<Target size={12} />}
    />
  </div>
);
type TeamManagementSelectProps = {
  value: TeamManagement;
  onChange: HandleTournamentChange;
};

const TeamManagementSelect = ({
  value,
  onChange,
}: TeamManagementSelectProps) => (
  <div className="space-y-2">
    <label className="text-[9px] font-black text-zinc-600 uppercase flex items-center gap-2 italic">
      <Users size={12} /> Gestão de times
    </label>
    <select
      name="teamManagement"
      className="w-full bg-zinc-900 border border-zinc-800 p-3 text-xs font-black italic text-white outline-none appearance-none cursor-pointer focus:border-primary"
      value={value}
      onChange={(v) =>
        onChange("teamManagement", v.target.value as TeamManagement)
      }
    >
      <option value="random">SORTEIO ALEATÓRIO (Padrão)</option>
      <option value="clan" disabled>
        POR CLÃ / TIME PRÉVIO
      </option>
    </select>
  </div>
);

type StatsSelectorProps = {
  statsType: StatsType;
  handleChange: HandleTournamentChange;
};

const StatsSelector = ({ statsType, handleChange }: StatsSelectorProps) => (
  <div className="space-y-2">
    <label className="text-[9px] font-black text-zinc-600 uppercase flex items-center gap-2 italic">
      <History size={12} /> Registo de Estatísticas (KDA)
    </label>

    <div className="grid grid-cols-2 gap-2">
      {[StatsType.ROUND, StatsType.MATCH].map((type) => (
        <button
          key={type}
          type="button"
          onClick={() => handleChange("statsType", StatsType.MATCH)}
          className={`p-3 text-[9px] font-black border italic ${
            statsType === type
              ? "bg-zinc-800 border-primary text-primary"
              : "bg-zinc-900 border-zinc-800 text-zinc-600 cursor-not-allowed"
          }`}
        >
          {type === StatsType.ROUND ? "POR GAME ROUND" : "POR PARTIDA"}
        </button>
      ))}
    </div>
  </div>
);

type MatchCounterProps = {
  value?: number;
  handleChange: HandleTournamentChange;
};

const MatchCounter = ({ value, handleChange }: MatchCounterProps) => (
  <div className="flex items-center justify-between">
    <span className="text-[9px] font-black text-zinc-500 uppercase italic">
      Partidas por Match
    </span>

    <div className="flex items-center gap-3">
      <button
        type="button"
        onClick={() =>
          handleChange("matchesPerMatch", Math.max(1, value || 0 - 2))
        }
        className="w-8 h-8 bg-zinc-900 border border-zinc-800 flex items-center justify-center hover:text-primary"
      >
        <Minus size={14} />
      </button>

      <span className="w-8 text-center font-black text-primary">MO{value}</span>

      <button
        type="button"
        onClick={() => handleChange("matchesPerMatch", value || 0 + 1)}
        className="w-8 h-8 bg-zinc-900 border border-zinc-800 flex items-center justify-center hover:text-primary"
      >
        <Plus size={14} />
      </button>
    </div>
  </div>
);

type LimitsGroupProps = {
  maxRegistrations?: number;
  maxPlayers?: number;
  totalTeams?: number;
  handleChange: HandleTournamentChange;
};

const LimitsGroup = ({
  maxRegistrations,
  maxPlayers,
  totalTeams,
  handleChange,
}: LimitsGroupProps) => (
  <div className="grid grid-cols-1 gap-6">
    <ConfigNumberInput
      label="Máximo de Inscrições"
      value={maxRegistrations || 0}
      onChange={(v: number) => handleChange("maxRegistrations", v)}
      icon={<UserPlus size={14} />}
    />

    <ConfigNumberInput
      label="Máximo de Jogadores em Campo"
      value={maxPlayers || 0}
      onChange={(v: number) => handleChange("maxPlayers", v)}
      icon={<Users size={14} />}
    />

    <ConfigNumberInput
      label="Quantidade de times"
      value={totalTeams || 0}
      onChange={(v: number) => handleChange("totalTeams", v)}
      icon={<LayoutGrid size={14} />}
    />
  </div>
);
