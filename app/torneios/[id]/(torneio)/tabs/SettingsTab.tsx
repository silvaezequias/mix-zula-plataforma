import { MOCK_MAPS } from "@/contansts/data";
import { Championship } from "@/types";
import {
  Check,
  Copy,
  Flame,
  Power,
  PowerOff,
  Settings,
  Shuffle,
  Sliders,
  Target,
} from "lucide-react";
import { JSX, useState } from "react";

type SettingsTabProps = {
  championship: Championship;
  tournamentId: string;
  isRandomizing: boolean;
  updateChampInfo: (field: keyof Championship, value: string) => void;
  onRandomize: () => void;
  updateChampSettings: (
    field: keyof Championship["settings"],
    value: string | number | boolean,
  ) => void;
};

export const SettingsTab = (props: SettingsTabProps) => {
  const {
    championship,
    tournamentId,
    updateChampInfo,
    updateChampSettings,
    onRandomize,
  } = props;

  const [copied, setCopied] = useState(false);

  const handleCopyLink = () => {
    const link = `${window.location.origin}/torneios/${tournamentId}/participar`;
    navigator.clipboard.writeText(link);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const maxPlayersCount =
    championship.settings.playersPerTeam * championship.settings.totalTeams;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 animate-in fade-in duration-500">
      <Card
        icon={Sliders}
        title="Parâmetros de Operação"
        className="col-span-1"
      >
        <div className="space-y-4">
          <ConfigInput
            label="Nome do Torneio"
            value={championship.name}
            onChange={(v: string) => updateChampInfo("name", v)}
          />
          <ConfigInput
            label="Premiação"
            value={championship.prize}
            onChange={(v: string) => updateChampInfo("prize", v)}
          />

          <div className="pt-4 border-t border-zinc-800">
            <label className="text-[9px] font-bold text-zinc-500 uppercase block mb-3 italic">
              Link de Recrutamento Direto
            </label>
            <div className="flex gap-2">
              <div className="flex-1 bg-zinc-900 border border-zinc-800 p-3 text-[10px] text-zinc-500 truncate font-mono italic">
                {window.location.origin}/torneios/{tournamentId}/participar
              </div>
              <button
                onClick={handleCopyLink}
                className={`px-6 transition-all flex items-center justify-center ${copied ? "bg-green-600 text-white" : "bg-zinc-800 text-primary hover:bg-zinc-700"}`}
              >
                {copied ? <Check size={18} /> : <Copy size={18} />}
              </button>
            </div>
            <p className="text-[8px] text-zinc-700 mt-2 italic font-bold">
              Nota: Apenas agentes autorizados pela Staff devem receber este
              link.
            </p>
          </div>
        </div>
      </Card>

      <Card icon={Target} title="Logística" className="col-span-1">
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <ConfigInput
              label="Máx. Rodadas"
              type="number"
              value={championship.settings.rounds}
              onChange={(v: string) =>
                updateChampSettings("rounds", `${parseInt(v)}`)
              }
            />
            <ConfigInput
              label="Máx. Times"
              type="number"
              value={championship.settings.totalTeams}
              onChange={(v: string) =>
                updateChampSettings("totalTeams", `${parseInt(v)}`)
              }
            />
            <ConfigInput
              label="Máx. Jogadores por Time"
              type="number"
              value={championship.settings.playersPerTeam}
              onChange={(v: string) =>
                updateChampSettings("playersPerTeam", `${parseInt(v)}`)
              }
            />
            <ConfigSwitch
              label="Troca de Lados"
              checked={championship.settings.sideSwap}
              onChange={(v: boolean) => updateChampSettings("sideSwap", v)}
            />

            <div className="space-y-1 col-span-2">
              <label className="text-[9px] font-bold text-zinc-500 uppercase">
                Mapa da Missão
              </label>
              <select
                className="w-full bg-zinc-900 border border-zinc-800 p-3 text-white italic outline-none focus:border-primary"
                value={championship.settings.map}
                onChange={(e) => updateChampSettings("map", e.target.value)}
              >
                {MOCK_MAPS.map((m) => (
                  <option key={m.id} value={m.name}>
                    {m.name}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>
      </Card>

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
              {championship.status === "ready"
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
        className="col-span-1 md:col-span-2"
      >
        <div className="space-y-4 text-[10px] font-bold border-b border-zinc-800 pb-6 mb-6">
          <div className="flex justify-between uppercase">
            <span className="text-zinc-500">INSCRITOS</span>
            <span>
              {championship.players.length} / {maxPlayersCount}
            </span>
          </div>
          <div className="flex justify-between uppercase">
            <span className="text-zinc-500">LISTA DE ESPERA</span>
            <span className="text-orange-500 italic">
              {Math.max(0, championship.players.length - maxPlayersCount)}
            </span>
          </div>
        </div>
        <div className="col-span-1 flex justify-center items-start pt-4">
          <button
            className="w-full bg-primary text-black font-black py-5 text-sm tracking-[0.4em] hover:brightness-110 active:scale-[0.98] transition-all uppercase italic shadow-[0_10px_30px_rgba(255,179,0,0.1)] border-b-4 border-black/20 flex items-center justify-center gap-4 group"
            onClick={() => console.log("Informações atualizadas no radar.")}
          >
            <Check
              size={20}
              className="group-hover:scale-110 transition-transform"
            />
            Atualizar
          </button>
        </div>
      </Card>
    </div>
  );
};

const Card = ({
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
        <h3 className="text-xl font-bold italic tracking-tighter">{title}</h3>
      </div>
      {children}
    </div>
  );
};

export const ConfigInput = ({
  label,
  type = "text",
  value,
  onChange,
}: {
  label: string;
  type?: string;
  value: string | number;
  onChange: (value: string) => void;
}) => {
  return (
    <div className="space-y-1">
      <label className="text-[9px] font-bold text-zinc-500 uppercase italic">
        {label}
      </label>
      <input
        type={type}
        className="w-full bg-zinc-900 border border-zinc-800 p-3 text-white italic outline-none focus:border-primary text-sm font-bold"
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
    </div>
  );
};

const ConfigSwitch = ({
  label,
  checked,
  onChange,
}: {
  label: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
}) => (
  <div className="flex items-center justify-between p-4 bg-zinc-900/50 border border-zinc-800 group hover:border-primary/30 transition-colors">
    <label className="text-[9px] font-black text-zinc-500 uppercase italic group-hover:text-zinc-300 transition-colors">
      {label}
    </label>
    <button
      onClick={() => onChange(!checked)}
      className={`relative inline-flex h-6 w-12 items-center transition-all focus:outline-none border-2 ${checked ? "bg-primary border-primary" : "bg-zinc-800 border-zinc-700"}`}
    >
      <span
        className={`inline-block h-4 w-4 transform transition-transform duration-200 ${checked ? "translate-x-6 bg-black" : "translate-x-1 bg-zinc-500"}`}
      />
    </button>
  </div>
);
