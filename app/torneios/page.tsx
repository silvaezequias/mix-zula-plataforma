"use client";

import React from "react";
import { useRouter } from "next/navigation";
import {
  Trophy,
  Target,
  Medal,
  ChevronRight,
  Map as MapIcon,
  Clock,
  LayoutGrid,
} from "lucide-react";
import { MOCK_TOURNAMENTS } from "@/contansts/data";

// --- Tipagens ---
type ChampStatus = "open" | "randomizing" | "ready" | "live" | "finished";

interface Championship {
  id: string;
  name: string;
  prize: string;
  status: ChampStatus;
  settings: {
    gameMode: string;
    map: string;
  };
}

/* ===============================================================================
  COMPONENTE: CARD DE TORNEIO
===============================================================================
*/
const TournamentCard = ({
  tournament,
  onClick,
}: {
  tournament: Championship;
  onClick: () => void;
}) => {
  const getStatusConfig = (status: ChampStatus) => {
    switch (status) {
      case "open":
        return {
          label: "INSCRIÇÕES ABERTAS",
          color: "text-green-500",
          border: "border-green-500/50",
        };
      case "live":
        return {
          label: "EM ANDAMENTO",
          color: "text-indigo-500",
          border: "border-indigo-500/50",
          pulse: true,
        };
      case "finished":
        return {
          label: "FINALIZADO",
          color: "text-red-500",
          border: "border-red-500/50",
        };
      default:
        return {
          label: "PREPARANDO",
          color: "text-[#FFB300]",
          border: "border-[#FFB300]/50",
        };
    }
  };

  const config = getStatusConfig(tournament.status);

  return (
    <div
      onClick={onClick}
      className={`group relative bg-[#111] border-l-4 ${config.border} p-6 sm:p-8 hover:bg-zinc-900 transition-all cursor-pointer overflow-hidden shadow-xl`}
    >
      {/* Background Decorativo */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-[#FFB300] opacity-[0.02] transform rotate-45 translate-x-16 -translate-y-16 group-hover:opacity-[0.05] transition-opacity"></div>

      <div className="relative z-10 flex flex-col h-full">
        <header className="flex justify-between items-start mb-6">
          <div className="space-y-1">
            <span
              className={`text-[8px] font-black tracking-[0.4em] uppercase ${config.color} ${config.pulse ? "animate-pulse" : ""}`}
            >
              {config.label}
            </span>
            <h3 className="text-2xl sm:text-3xl font-black italic tracking-tighter uppercase leading-none group-hover:text-[#FFB300] transition-colors">
              {tournament.name}
            </h3>
          </div>
          <div className="bg-zinc-900 p-2 border border-zinc-800 group-hover:border-[#FFB300] transition-colors">
            <Trophy
              size={20}
              className={
                tournament.status === "finished"
                  ? "text-zinc-500"
                  : "text-[#FFB300]"
              }
            />
          </div>
        </header>

        <div className="grid grid-cols-2 gap-4 mb-8">
          <div className="flex items-center gap-2">
            <MapIcon size={14} className="text-zinc-600" />
            <span className="text-[10px] font-bold text-zinc-400 uppercase">
              {tournament.settings.map}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <Target size={14} className="text-zinc-600" />
            <span className="text-[10px] font-bold text-zinc-400 uppercase">
              {tournament.settings.gameMode}
            </span>
          </div>
          <div className="col-span-2 flex items-center gap-2 mt-2">
            <Medal size={14} className="text-[#FFB300]" />
            <span className="text-xs font-black text-[#FFB300] uppercase italic tracking-tighter">
              PRÉMIO: {tournament.prize}
            </span>
          </div>
        </div>

        <div className="mt-auto flex items-center gap-2 text-[9px] font-black text-zinc-500 group-hover:text-white transition-colors uppercase tracking-widest">
          Acessar informações do torneio{" "}
          <ChevronRight
            size={14}
            className="group-hover:translate-x-1 transition-transform"
          />
        </div>
      </div>
    </div>
  );
};

/* ===============================================================================
  PÁGINA PRINCIPAL: LISTAGEM
===============================================================================
*/
export default function TournamentListPage() {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-[#050505] text-white font-sans italic tracking-widest overflow-x-hidden">
      {/* Hero Section / Header */}
      <div className="relative h-[40vh] flex items-center justify-center border-b border-zinc-900 overflow-hidden bg-zinc-950">
        <div className="absolute inset-0 opacity-20 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')]"></div>
        <div className="absolute inset-0 bg-linear-to-t from-[#050505] to-transparent"></div>

        {/* Efeito de Luz */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-[#FFB300] opacity-10 blur-[120px] rounded-full"></div>

        <div className="relative z-10 text-center flex flex-col justify-center items-center space-y-4 animate-in fade-in zoom-in-95 duration-1000">
          <div className="flex items-center justify-center gap-4 mb-2">
            <div className="h-0.5 w-8 bg-[#FFB300]"></div>
            <Trophy size={24} className="text-[#FFB300]" />
            <div className="h-0.5 w-8 bg-[#FFB300]"></div>
          </div>
          <h1 className="text-5xl sm:text-7xl font-black italic tracking-tighter uppercase leading-none">
            MIX ZULA <span className="text-[#FFB300]">TORNEIOS</span>
          </h1>
          <p className="text-zinc-500 text-[10px] max-w-[80%] font-bold tracking-[0.5em] uppercase">
            Participe de um torneio e testes suas habilidades, pode levar a
            melhor.
          </p>
        </div>
      </div>

      <main className="max-w-7xl mx-auto px-6 py-16 sm:py-24">
        {/* Barra de Filtros (Estética) */}
        <div className="flex flex-col sm:flex-row justify-between items-center mb-12 gap-6 border-b border-zinc-900 pb-8">
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-2 border-b-2 border-[#FFB300] pb-2 cursor-pointer">
              <LayoutGrid size={16} className="text-[#FFB300]" />
              <span className="text-xs font-black uppercase">
                Todos os Torneios
              </span>
            </div>
          </div>

          <div className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">
            {MOCK_TOURNAMENTS.length} TORNEIOs LOCALIZADOS
          </div>
        </div>

        {/* Grid de Torneios */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-2 gap-8 animate-in slide-in-from-bottom-4 duration-700">
          {MOCK_TOURNAMENTS.map((tournament) => (
            <TournamentCard
              key={tournament.id}
              tournament={tournament as Championship}
              onClick={() => router.push(`/torneios/${tournament.id}`)}
            />
          ))}
        </div>

        {/* Mensagem de Rodapé */}
        <div className="mt-24 text-center space-y-6 opacity-30">
          <Clock size={32} className="mx-auto text-zinc-700" />
          <p className="text-[10px] font-bold uppercase tracking-[0.4em]">
            Novos torneios em breve em Mix Zula
          </p>
        </div>
      </main>
    </div>
  );
}
