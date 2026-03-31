"use client";

import React, { useMemo } from "react";
import {
  Trophy,
  ChevronRight,
  Target,
  Zap,
  Shield,
  Users,
  Globe,
  Play,
  Sword,
  Medal,
  Activity,
} from "lucide-react";
import { MOCK_TOURNAMENTS } from "@/contansts/data";

/**
 * Simulação do useRouter para o ambiente de preview do Canvas.
 * No seu projeto real, utilize 'import { useRouter } from "next/navigation"'.
 */
const useRouter = () => ({
  push: (url: string) => {
    console.log(`Redirecionando para: ${url}`);
    window.location.href = url; // Simulação básica
  },
});

/* ===============================================================================
  ESTILOS GLOBAIS
===============================================================================
*/
const GlobalStyles = () => (
  <style>{`
    @keyframes slide {
      from { transform: translateX(0); }
      to { transform: translateX(-50%); }
    }
    .animate-marquee {
      display: flex;
      white-space: nowrap;
      animation: slide 20s linear infinite;
    }
    .skew-fix {
      transform: skewX(-15deg);
    }
    .skew-content {
      transform: skewX(15deg);
    }
  `}</style>
);

/* ===============================================================================
  COMPONENTE: LANDING PAGE
===============================================================================
*/
export default function LandingPage() {
  const router = useRouter();

  // Busca o torneio com inscrições abertas para a tarja de destaque
  const highlightedTournament = useMemo(() => {
    return MOCK_TOURNAMENTS.find((t) => t.status === "open");
  }, []);

  return (
    <div className="min-h-screen bg-[#050505] text-white font-sans overflow-x-hidden selection:bg-[#FFB300] selection:text-black italic tracking-widest">
      <GlobalStyles />

      {/* --- TARJA DE DESTAQUE (ANÚNCIO) --- */}
      {highlightedTournament && (
        <div
          onClick={() =>
            router.push(`/torneios/${highlightedTournament.id}/participar`)
          }
          className="relative h-10 bg-[#FFB300] flex items-center overflow-hidden cursor-pointer group z-100 border-b border-black/10 shadow-[0_4px_15px_rgba(255,179,0,0.3)]"
        >
          <div className="animate-marquee">
            {Array.from({ length: 10 }).map((_, i) => (
              <div
                key={i}
                className="flex items-center gap-4 px-4 text-black font-black text-[10px] uppercase"
              >
                <Zap size={14} fill="black" />
                ALISTAMENTO ABERTO: {highlightedTournament.name}
                <span className="opacity-40">•</span>
                PREMIAÇÃO: {highlightedTournament.prize}
                <span className="opacity-40">•</span>
                VAGAS: {highlightedTournament.players.length}/
                {highlightedTournament.settings.totalTeams *
                  highlightedTournament.settings.playersPerTeam}
                <span className="opacity-40">•</span>
              </div>
            ))}
          </div>
          <div className="absolute right-0 top-0 bottom-0 bg-[#FFB300] pl-6 pr-4 flex items-center shadow-[-20px_0_20px_rgba(255,179,0,1)]">
            <span className="text-[10px] font-black text-black uppercase mr-2">
              INSCREVER AGORA
            </span>
            <ChevronRight
              size={14}
              className="text-black group-hover:translate-x-1 transition-transform"
            />
          </div>
        </div>
      )}

      {/* --- NAVBAR --- */}
      <nav className="h-20 flex items-center justify-between px-6 lg:px-12 border-b border-zinc-900 bg-black/50 backdrop-blur-md sticky top-0 z-50">
        <div className="flex items-center gap-3">
          <div className="bg-[#FFB300] p-1.5 transform -rotate-12 shadow-[0_0_15px_rgba(255,179,0,0.3)]">
            <Trophy size={20} className="text-black" />
          </div>
          <span className="text-2xl font-black italic tracking-tighter uppercase">
            MIX <span className="text-[#FFB300]">ZULA</span>
          </span>
        </div>

        <div className="hidden md:flex items-center gap-8">
          <a
            href="#"
            className="text-[10px] font-black text-[#FFB300] hover:opacity-80 transition-opacity"
          >
            INÍCIO
          </a>
          <a
            href="/torneios"
            className="text-[10px] font-black text-zinc-500 hover:opacity-80 transition-opacity"
          >
            TORNEIOS
          </a>
          <a
            href="/login"
            className="text-[10px] font-black text-zinc-500 hover:opacity-80 transition-opacity"
          >
            LOGIN
          </a>
        </div>

        <button
          onClick={() => router.push("/login")}
          className="border hidden lg:inline-block border-[#FFB300] uppercase text-[#FFB300] px-6 py-2 text-[10px] font-black hover:bg-[#FFB300] hover:text-black transition-all"
        >
          Entrar com Discord
        </button>
      </nav>

      {/* --- HERO SECTION --- */}
      <section className="relative min-h-[85vh] flex items-center px-6 lg:px-12 overflow-hidden">
        {/* BG FX */}
        <div className="absolute inset-0 z-0">
          <div className="absolute top-1/2 left-0 -translate-y-1/2 w-125 h-125 bg-[#FFB300] opacity-5 blur-[120px] rounded-full"></div>
          <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-20"></div>
          <div className="absolute inset-0 bg-linear-to-r from-black via-black/80 to-transparent"></div>
        </div>

        <div className="relative z-10 max-w-4xl space-y-8 animate-in fade-in slide-in-from-left-8 duration-1000">
          <div className="flex items-center gap-3 text-[#FFB300] text-xs font-black">
            <Shield size={16} />
            <span className="tracking-[0.5em] uppercase">
              Plataforma Oficial de Competição
            </span>
          </div>

          <h2 className="text-6xl sm:text-8xl font-black italic tracking-tighter leading-tight uppercase">
            DOMINE A <br />
            <span className="text-[#FFB300]">OPERAÇÃO.</span>
          </h2>

          <p className="text-zinc-500 font-bold max-w-xl text-sm sm:text-base leading-relaxed uppercase">
            Participe de torneios táticos, suba no ranking global e garanta
            premiações exclusivas. O Único lugar onde diversão e competitividade
            estão juntas.
          </p>

          <div className="flex flex-col sm:flex-row items-center gap-6 pt-4">
            <button
              onClick={() => router.push("/torneios")}
              className="w-full sm:w-auto bg-[#FFB300] text-black px-12 py-5 font-black text-sm tracking-widest flex items-center justify-center gap-4 hover:brightness-110 transition-all shadow-[0_10px_30px_rgba(255,179,0,0.2)] active:scale-95 uppercase"
            >
              CONFERIR TORNEIOS <Play size={18} fill="currentColor" />
            </button>

            <div className="flex items-center gap-4">
              <div className="flex -space-x-3">
                {[1, 2, 3].map((i) => (
                  <div
                    key={i}
                    className="w-10 h-10 rounded-full border-2 border-[#050505] bg-zinc-800 flex items-center justify-center overflow-hidden"
                  >
                    {/*eslint-disable-next-line @next/next/no-img-element*/}
                    <img
                      src={`https://i.pravatar.cc/100?img=${i + 10}`}
                      alt="avatar"
                    />
                  </div>
                ))}
              </div>
              <div className="text-[10px] font-bold text-zinc-500 uppercase">
                <span className="text-white">+30</span> jogadores online <br />{" "}
                aguardando sorteio
              </div>
            </div>
          </div>
        </div>

        {/* Floating Graphics (Desktop Only) */}
        <div className="hidden lg:block absolute right-0 top-1/2 -translate-y-1/2 w-1/3 opacity-20">
          <Activity size={400} className="text-zinc-800" strokeWidth={0.5} />
        </div>
      </section>

      {/* --- RECURSOS (QUICK STATS) --- */}
      <section className="px-6 lg:px-12 py-20 border-t border-zinc-900 bg-zinc-950/30">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-12">
          <div className="flex gap-6 group">
            <div className="bg-zinc-900 p-4 border border-zinc-800 group-hover:border-[#FFB300] transition-colors h-fit">
              <Sword size={24} className="text-[#FFB300]" />
            </div>
            <div className="space-y-2">
              <h4 className="text-lg font-black uppercase">
                Sorteio Inteligente
              </h4>
              <p className="text-xs text-zinc-500 font-bold uppercase leading-relaxed">
                Equipes balanceadas automaticamente com base no ranking e
                experiência.
              </p>
            </div>
          </div>

          <div className="flex gap-6 group">
            <div className="bg-zinc-900 p-4 border border-zinc-800 group-hover:border-[#FFB300] transition-colors h-fit">
              <Target size={24} className="text-[#FFB300]" />
            </div>
            <div className="space-y-2">
              <h4 className="text-lg font-black uppercase">Tracking de KD</h4>
              <p className="text-xs text-zinc-500 font-bold uppercase leading-relaxed">
                Estatísticas detalhadas por round para cada partida disputada na
                arena.
              </p>
            </div>
          </div>

          <div className="flex gap-6 group">
            <div className="bg-zinc-900 p-4 border border-zinc-800 group-hover:border-[#FFB300] transition-colors h-fit">
              <Globe size={24} className="text-[#FFB300]" />
            </div>
            <div className="space-y-2">
              <h4 className="text-lg font-black uppercase">Lives Oficiais</h4>
              <p className="text-xs text-zinc-500 font-bold uppercase leading-relaxed">
                Transmissão em tempo real das finais com streamers da equipe
                técnica.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* --- CTA FINAL --- */}
      <section className="py-32 px-6 text-center relative overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-[#FFB300] opacity-5 blur-[120px] rounded-full"></div>
        <div className="relative z-10 space-y-8">
          <Medal size={48} className="text-[#FFB300] mx-auto animate-bounce" />
          <h3 className="text-4xl sm:text-6xl font-black italic tracking-tighter uppercase">
            PRONTO PARA O <br />{" "}
            <span className="text-[#FFB300]">PRÓXIMO NÍVEL?</span>
          </h3>
          <p className="text-zinc-500 text-xs sm:text-sm font-bold uppercase tracking-widest max-w-lg mx-auto leading-loose">
            Não perca tempo. Os melhores agentes já estão em campo. <br />
            Garanta sua vaga na próxima operação.
          </p>
          <button
            onClick={() => router.push("/torneios")}
            className="group relative bg-white text-black px-12 py-5 font-black text-sm tracking-widest uppercase transition-all hover:bg-[#FFB300] overflow-hidden"
          >
            <span className="relative z-10 flex items-center gap-3">
              LISTA DE TORNEIOS{" "}
              <ChevronRight
                size={18}
                className="group-hover:translate-x-2 transition-transform"
              />
            </span>
          </button>
        </div>
      </section>

      {/* --- FOOTER --- */}
      <footer className="border-t border-zinc-900 p-12 bg-black">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-8">
          <div className="flex items-center gap-3 opacity-50">
            <div className="bg-white p-1 transform -rotate-12">
              <Trophy size={16} className="text-black" />
            </div>
            <span className="text-sm font-black italic tracking-tighter uppercase">
              MIX <span className="text-zinc-400">ZULA</span>
            </span>
          </div>
          <p className="text-[9px] text-zinc-700 font-bold uppercase tracking-[0.4em]">
            © 2026 MIX ZULA • TODOS OS DIREITOS RESERVADOS
          </p>
          <div className="flex gap-6">
            <div className="w-8 h-8 rounded-full border border-zinc-800 flex items-center justify-center hover:border-[#FFB300] transition-colors cursor-pointer text-zinc-600 hover:text-[#FFB300]">
              <Activity size={14} />
            </div>
            <div className="w-8 h-8 rounded-full border border-zinc-800 flex items-center justify-center hover:border-[#FFB300] transition-colors cursor-pointer text-zinc-600 hover:text-[#FFB300]">
              <Users size={14} />
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
