"use client";

import Container from "@/components/ui/Container";
import {
  AlertTriangle,
  Clock,
  Loader2,
  Play,
  Trophy,
  Users,
  Zap,
} from "lucide-react";
import { useState, useTransition } from "react";
import { AboutTournament } from "./AboutTournamentSection";
import { PresenceConfirmation } from "./PresenceConfirmationSection";
import { BroadcastSection } from "./BroadcastSection";
import { ParametersSection } from "./ParametersSection";
import { PresetButton } from "./components";
import {
  EndType,
  Format,
  GameMode,
  StatsType,
  TeamManagement,
} from "@prisma/client";
import { TournamentProps } from "@/features/tournament/service";
import { ActionButton } from "@/components/ui/ActionButton";
import { createTournamentAction } from "@/features/tournament/action";
import { useRouter } from "next/navigation";

export default function CreateTournament() {
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState<TournamentProps>({
    id: "0_1",
    preset: "custom",
    title: "",
    description: "",
    prize: "",
    endType: EndType.MANUAL,
    endDate: null,
    format: Format.SINGLE_ELIMINATION,
    gameMode: GameMode.SABOTAGEM,
    swapTeam: true,
    matchesPerMatch: 1,
    totalTeams: 4,
    playersPerTeam: 5,
    maxPlayers: 20,
    maxRegistrations: 50,
    // Campos de Confirmação e Reservas
    confirmationSystem: true,
    confirmationTime: 15,
    hasSubstitutes: true,
    substitutesLimit: 2,
    // Estatísticas e Gestão
    statsType: StatsType.MATCH,
    teamManagement: TeamManagement.RANDOM,
    startDate: new Date(),
    createdAt: new Date(),
    updatedAt: new Date(),
  });

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleToggle = (field: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: !prev[field as keyof typeof prev],
    }));
  };

  const handleCreate = () => {
    startTransition(async () => {
      const result = await createTournamentAction({
        ...formData,
        endDate: undefined,
        teamManagement: TeamManagement.RANDOM,
        statsType: StatsType.MATCH,
      });

      if (result.success) router.push(`/torneios/${result.data!.id}`);
      else setError(result.error!);
    });
  };

  const applyPreset = (type: string) => {
    const presets: Record<string, TournamentProps> = {
      quick: {
        preset: "quick",
        title: "Campeonato Rápido (Padrão Clan)",
        gameMode: GameMode.SABOTAGEM,
        totalTeams: 2,
        playersPerTeam: 5,
        maxPlayers: 10,
        maxRegistrations: 15,
        matchesPerMatch: 1,
        swapTeam: true,
        confirmationSystem: true,
        substitutesLimit: 0,
        confirmationTime: 10,
      },
      competitive: {
        preset: "competitive",
        title: "Torneio Competitivo Arena",
        gameMode: GameMode.SABOTAGEM,
        totalTeams: 16,
        playersPerTeam: 5,
        maxPlayers: 80,
        maxRegistrations: 100,
        matchesPerMatch: 3,
        swapTeam: true,
        hasSubstitutes: true,
        substitutesLimit: 2,
      },
      casual: {
        preset: "casual",
        title: "Modo Casual / Mix",
        gameMode: GameMode.MATA_MATA,
        totalTeams: 0,
        playersPerTeam: 1,
        maxPlayers: 0,
        maxRegistrations: 0,
        matchesPerMatch: 1,
        substitutesLimit: 0,
        swapTeam: false,
        confirmationSystem: false,
      },
    };

    if (presets[type]) {
      setFormData((prev) => ({ ...prev, ...presets[type] }));
    }
  };

  return (
    <Container className="p-5">
      <header className="mb-12 space-y-6">
        <div className="space-y-2">
          <div className="flex items-center gap-3 text-primary">
            <Zap size={18} fill="#FFB300" />
            <span className="text-xs font-black tracking-[0.4em]">
              Briefing de Criação
            </span>
          </div>
          <h1 className="text-4xl sm:text-6xl font-black italic tracking-tighter uppercase leading-none">
            CONFIGURAR <span className="text-primary">NOVO TORNEIO</span>
          </h1>
        </div>

        <div className="pt-4">
          <p className="text-[9px] text-zinc-500 font-bold mb-3 tracking-[0.2em] uppercase italic">
            Presets de Comando:
          </p>
          <div className="flex flex-wrap gap-3">
            <PresetButton
              active={formData.preset === "quick"}
              onClick={() => applyPreset("quick")}
              label="Campeonato Rápido (Clan)"
              icon={<Clock size={14} />}
            />
            <PresetButton
              active={formData.preset === "competitive"}
              onClick={() => applyPreset("competitive")}
              label="Competitivo"
              icon={<Trophy size={14} />}
            />
            <PresetButton
              active={formData.preset === "casual"}
              onClick={() => applyPreset("casual")}
              label="Casual"
              icon={<Users size={14} />}
            />
          </div>
        </div>
      </header>
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 space-y-8 ">
        <div className="lg:col-span-7 flex flex-col  gap-10">
          <AboutTournament
            title={formData.title}
            description={formData.description}
            prize={formData.prize}
            handleChange={handleChange}
          />

          <PresenceConfirmation
            confirmationSystem={formData.confirmationSystem}
            confirmationTime={formData.confirmationTime}
            hasSubstitutes={formData.hasSubstitutes}
            substitutesLimit={formData.substitutesLimit}
            handleChange={handleChange}
            handleToggle={handleToggle}
          />

          <BroadcastSection
            broadcastPlatform={formData.broadcastPlatform}
            broadcastUrl={formData.broadcastUrl}
            handleChange={handleChange}
          />
        </div>
        <div className="lg:col-span-5 flex flex-col space-y-8">
          <ParametersSection
            gameMode={formData.gameMode}
            handleChange={handleChange}
            handleToggle={handleToggle}
            matchesPerMatch={formData.matchesPerMatch}
            maxPlayers={formData.maxPlayers}
            maxRegistrations={formData.maxRegistrations}
            playersPerTeam={formData.playersPerTeam}
            setFormData={setFormData}
            statsType={formData.statsType}
            swapTeam={formData.swapTeam}
            teamManagement={formData.teamManagement}
            totalTeams={formData.totalTeams}
          />

          <div className="flex flex-col gap-10">
            {error && (
              <div className="bg-red-500/10 border border-red-500/50 p-4 flex items-center gap-3 animate-in fade-in slide-in-from-top-1">
                <AlertTriangle size={16} className="text-red-500" />
                <span className="text-[10px] font-black text-red-500 uppercase italic tracking-tight leading-tight">
                  {error}
                </span>
              </div>
            )}
            <ActionButton
              onClick={handleCreate}
              disabled={isPending}
              className="w-full font-black py-6 text-md border-b-4 border-black/20 uppercase italic"
            >
              {!isPending ? (
                <>
                  Criar Campeonato <Play size={20} fill="black" />
                </>
              ) : (
                <Loader2 className="animate-spin" />
              )}
            </ActionButton>
          </div>
        </div>
      </div>
    </Container>
  );
}
