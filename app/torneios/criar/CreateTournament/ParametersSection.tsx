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
import { ChangeEvent, Dispatch, SetStateAction } from "react";
import { GAME_MODES } from "@/constants/data";
import {
  ConfigDropdown,
  ConfigNumberInput,
  ConfigSwitch,
  SectionHeader,
} from "../../../../components/ui/components";
import {
  GameMode,
  StatsType,
  TeamManagement,
  Tournament,
} from "@prisma/client";
import { TournamentProps } from "@/features/tournament/service";

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
  handleToggle: (key: string) => void;
  setFormData: Dispatch<SetStateAction<TournamentProps>>;
  handleChange: (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
  ) => void;
};

export const ParametersSection = (props: ParametersSectionProps) => {
  const { handleChange, setFormData, handleToggle, ...rest } = props;

  return (
    <div className="lg:col-span-5 space-y-8">
      <section className="bg-zinc-950 border border-zinc-800 p-8 shadow-2xl space-y-8 relative">
        <SectionHeader
          icon={<Sliders size={20} />}
          title="Parâmetros de Combate"
        />

        <div className="space-y-6">
          <TeamManagementSelect
            value={rest.teamManagement as TeamManagement}
            onChange={handleChange}
          />

          <StatsSelector
            statsType={rest.statsType as StatsType}
            setFormData={setFormData}
          />

          <LimitsGroup {...rest} setFormData={setFormData} />

          <MatchSettings
            {...rest}
            handleChange={handleChange}
            handleToggle={handleToggle}
            setFormData={setFormData}
          />
        </div>
      </section>
    </div>
  );
};

type MatchSettingsProps = {
  playersPerTeam?: number;
  matchesPerMatch?: number;
  swapTeam?: boolean;
  gameMode?: string;

  handleChange: (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;

  handleToggle: (key: keyof Tournament) => void;
  setFormData: Dispatch<SetStateAction<TournamentProps>>;
};

const MatchSettings = ({
  playersPerTeam,
  matchesPerMatch,
  swapTeam,
  gameMode,
  handleChange,
  handleToggle,
  setFormData,
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
        onChange={handleChange}
      />
    </div>
    <MatchCounter value={matchesPerMatch} setFormData={setFormData} />
    <ConfigSwitch
      label="TROCA DE LADOS"
      checked={!!swapTeam}
      onChange={() => handleToggle("swapTeam")}
    />
    <ConfigDropdown
      label="Modo"
      name="gameMode"
      value={gameMode ?? GameMode.SABOTAGEM}
      options={GAME_MODES.map((gm) => gm.id)}
      labels={GAME_MODES.map((gm) => gm.label)}
      onChange={handleChange}
      icon={<Target size={12} />}
    />
  </div>
);
type TeamManagementSelectProps = {
  value: TeamManagement;
  onChange: (e: ChangeEvent<HTMLSelectElement>) => void;
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
      onChange={onChange}
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
  setFormData: Dispatch<SetStateAction<TournamentProps>>;
};

const StatsSelector = ({ statsType, setFormData }: StatsSelectorProps) => (
  <div className="space-y-2">
    <label className="text-[9px] font-black text-zinc-600 uppercase flex items-center gap-2 italic">
      <History size={12} /> Registo de Estatísticas (KDA)
    </label>

    <div className="grid grid-cols-2 gap-2">
      {[StatsType.ROUND, StatsType.MATCH].map((type) => (
        <button
          key={type}
          type="button"
          onClick={() =>
            setFormData((p) => ({ ...p, statsType: StatsType.MATCH }))
          }
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
  setFormData: Dispatch<SetStateAction<TournamentProps>>;
};

const MatchCounter = ({ value, setFormData }: MatchCounterProps) => (
  <div className="flex items-center justify-between">
    <span className="text-[9px] font-black text-zinc-500 uppercase italic">
      Partidas por Match
    </span>

    <div className="flex items-center gap-3">
      <button
        type="button"
        onClick={() =>
          setFormData((p) => ({
            ...p,
            matchesPerMatch: Math.max(1, p.matchesPerMatch || 0 - 2),
          }))
        }
        className="w-8 h-8 bg-zinc-900 border border-zinc-800 flex items-center justify-center hover:text-primary"
      >
        <Minus size={14} />
      </button>

      <span className="w-8 text-center font-black text-primary">BO{value}</span>

      <button
        type="button"
        onClick={() =>
          setFormData((p) => ({
            ...p,
            matchesPerMatch: p.matchesPerMatch || 0 + 2,
          }))
        }
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
  setFormData: Dispatch<SetStateAction<TournamentProps>>;
};

const LimitsGroup = ({
  maxRegistrations,
  maxPlayers,
  totalTeams,
  setFormData,
}: LimitsGroupProps) => (
  <div className="grid grid-cols-1 gap-6">
    <ConfigNumberInput
      label="Máximo de Inscrições"
      value={maxRegistrations || 0}
      onChange={(v: number) =>
        setFormData((p) => ({ ...p, maxRegistrations: v }))
      }
      icon={<UserPlus size={14} />}
    />

    <ConfigNumberInput
      label="Máximo de Jogadores em Campo"
      value={maxPlayers || 0}
      onChange={(v: number) => setFormData((p) => ({ ...p, maxPlayers: v }))}
      icon={<Users size={14} />}
    />

    <ConfigNumberInput
      label="Quantidade de times"
      value={totalTeams || 0}
      onChange={(v: number) => setFormData((p) => ({ ...p, totalTeams: v }))}
      icon={<LayoutGrid size={14} />}
    />
  </div>
);
