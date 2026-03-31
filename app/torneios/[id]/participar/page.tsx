"use client";

import React, { useState, useMemo } from "react";
import { useParams } from "next/navigation";
import {
  Trophy,
  MapPin,
  Target,
  CheckCircle2,
  AlertTriangle,
  ChevronLeft,
  ShieldCheck,
  Zap,
  Info,
  Play,
} from "lucide-react";
import { Player } from "@/types";
import { MOCK_TOURNAMENTS } from "@/contansts/data";
import { useRouter } from "next/navigation";

export default function RegistrationPage() {
  const params = useParams();
  const router = useRouter();
  const tournamentId = params?.id as string;

  // Estados Locais (Em uma app real, viriam de um contexto de Auth ou API)
  const [currentUser, setCurrentUser] = useState<Player | null>(null);
  const [loading, setLoading] = useState(false);
  const [registered, setRegistered] = useState(false);

  // Busca o torneio na lista mockada pelo ID da URL
  const tournament = useMemo(() => {
    return MOCK_TOURNAMENTS.find((t) => t.id === tournamentId) || null;
  }, [tournamentId]);

  const maxPlayers = tournament
    ? tournament.settings.totalTeams * tournament.settings.playersPerTeam
    : 0;
  const currentPlayersCount = tournament?.players.length || 0;
  const isFull = currentPlayersCount >= maxPlayers;

  const handleJoinTournament = () => {
    if (!currentUser) return;
    setLoading(true);

    // Simulação de delay de rede para a inscrição
    setTimeout(() => {
      setLoading(false);
      setRegistered(true);
    }, 1500);
  };

  // Simulação de Login (Para testes na página)
  const simulateLogin = () => {
    setCurrentUser({
      id: "meuid_123",
      gameNick: "NICK_DO_JOGO",
      discordName: "nick_do_discord",
      discordId: "123456789123456789",
      role: "PLAYER",
      roundStats: [],
      stats: { kills: 0, deaths: 0, assists: 0 },
    });
  };

  if (!tournament) {
    return (
      <div className="min-h-screen bg-[#050505] flex items-center justify-center p-6 text-white uppercase italic">
        <div className="text-center space-y-4">
          <AlertTriangle size={48} className="text-[#FFB300] mx-auto" />
          <h2 className="text-2xl font-black italic tracking-tighter">
            TORNEIO NÃO LOCALIZADO
          </h2>
          <p className="text-zinc-500 text-xs uppercase tracking-widest">
            O ID DO TORNEIO É INVÁLIDO OU EXPIRADO
          </p>
          <button
            onClick={() => router.push("/torneios")}
            className="text-[#FFB300] hover:text-white transition-colors underline text-xs font-bold mt-4 uppercase"
          >
            Voltar ao Menu Principal
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#050505] text-white font-sans uppercase italic tracking-widest overflow-x-hidden">
      {/* Background Decorativo Estilo Zula */}
      <div className="fixed inset-0 pointer-events-none opacity-10">
        <div className="absolute top-[-10%] right-[-10%] w-[50%] h-[50%] bg-[#FFB300] blur-[150px] rounded-full"></div>
        <div className="absolute bottom-[-10%] left-[-10%] w-[40%] h-[40%] bg-zinc-800 blur-[120px] rounded-full"></div>
      </div>

      <main className="relative z-10 max-w-5xl mx-auto px-6 py-12 sm:py-20 animate-in fade-in duration-700">
        {/* Breadcrumb / Back */}
        <div className="flex items-center gap-2 text-zinc-500 hover:text-[#FFB300] transition-all cursor-pointer mb-10 group w-fit">
          <ChevronLeft
            size={18}
            className="group-hover:-translate-x-1 transition-transform"
          />
          <span className="text-[10px] font-black uppercase">
            Voltar para Operações
          </span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          {/* Coluna Esquerda: Informações da Missão */}
          <div className="lg:col-span-7 space-y-12">
            <header>
              <div className="inline-block bg-[#FFB300] text-black px-4 py-1 text-[10px] font-black mb-4 skew-x-[-15deg]">
                <span className="inline-block skew-x-15">
                  CONVITE DE INSCRIÇÃO
                </span>
              </div>
              <h1 className="text-4xl sm:text-7xl font-black italic tracking-tighter leading-none mb-6 uppercase">
                {tournament.name}
              </h1>
              <div className="flex flex-wrap gap-8 text-zinc-400">
                <div className="flex items-center gap-3">
                  <MapPin size={18} className="text-[#FFB300]" />
                  <span className="text-xs font-black uppercase tracking-tighter">
                    {tournament.settings.map}
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <Target size={18} className="text-[#FFB300]" />
                  <span className="text-xs font-black uppercase tracking-tighter">
                    {tournament.settings.gameMode}
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <Trophy size={18} className="text-[#FFB300]" />
                  <span className="text-xs font-black uppercase tracking-tighter text-[#FFB300]">
                    {tournament.prize}
                  </span>
                </div>
              </div>
            </header>

            <section className="bg-[#111] border border-zinc-800 p-8 sm:p-10 space-y-8 shadow-2xl relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-1 bg-[#FFB300]"></div>
              <div className="flex items-center gap-4">
                <Info size={24} className="text-[#FFB300]" />
                <h3 className="text-xl font-black uppercase italic tracking-tighter">
                  Briefing da Missão
                </h3>
              </div>
              <p className="text-zinc-500 text-sm leading-relaxed font-semibold normal-case italic border-l-2 border-zinc-800 pl-6">
                O torneio de Zula Global{" - "}
                <span className="font-bold">MIX ZULA</span> chega com muita
                competitividade e a oportunidade perfeita para você mostrar sua
                habilidade contra outros jogadores — garanta sua vaga agora e
                inscreva-se para entrar nessa disputa!
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {[
                  `Máximo de Agentes: ${maxPlayers}`,
                  `Rounds por Lado: ${tournament.settings.rounds}`,
                  `Troca de Lados: ${tournament.settings.sideSwap ? "Habilitado" : "Desabilitado"}`,
                  `${tournament.status === "open" ? "Inscrições Abertas" : "Fechado"}`,
                ].map((text, i) => (
                  <div
                    key={i}
                    className="flex items-center gap-3 bg-black/40 p-3 border border-zinc-900"
                  >
                    <div className="w-1.5 h-1.5 bg-[#FFB300] transform rotate-45"></div>
                    <span className="text-[10px] text-zinc-300 font-black uppercase">
                      {text}
                    </span>
                  </div>
                ))}
              </div>
            </section>
          </div>

          {/* Coluna Direita: Painel de Alistamento */}
          <div className="lg:col-span-5">
            <div className="bg-[#111] border-2 border-zinc-800 p-8 sm:p-12 shadow-[0_0_100px_rgba(255,179,0,0.05)] relative overflow-hidden">
              {!currentUser ? (
                /* ESTADO: IDENTIFICAÇÃO PENDENTE */
                <div className="text-center space-y-8 py-4">
                  <div className="bg-zinc-900 w-24 h-24 rounded-full flex items-center justify-center mx-auto border-2 border-zinc-800 shadow-inner">
                    <ShieldCheck size={48} className="text-zinc-800" />
                  </div>
                  <div className="space-y-2">
                    <h3 className="text-2xl font-black italic tracking-tighter uppercase">
                      ACESSO BLOQUEADO
                    </h3>
                    <p className="text-zinc-500 text-[10px] font-bold uppercase tracking-widest leading-loose">
                      Você precisa conectar sua conta Discord para poder se
                      inscrever
                    </p>
                  </div>
                  <button
                    onClick={simulateLogin}
                    className="w-full bg-white text-black font-black py-5 text-sm tracking-[0.3em] hover:bg-[#FFB300] transition-all uppercase italic shadow-xl active:scale-95"
                  >
                    Entrar com Discord
                  </button>
                </div>
              ) : registered ? (
                /* ESTADO: ALISTADO */
                <div className="text-center space-y-8 py-4 animate-in zoom-in-95">
                  <div className="bg-green-500/10 w-24 h-24 rounded-full flex items-center justify-center mx-auto border-2 border-green-500/50 shadow-[0_0_30px_rgba(34,197,94,0.1)]">
                    <CheckCircle2 size={48} className="text-green-500" />
                  </div>
                  <div className="space-y-2">
                    <h3 className="text-2xl font-black text-green-500 uppercase italic tracking-tighter">
                      INSCRIÇÃO CONCLUÍDA
                    </h3>
                    <p className="text-zinc-500 text-[10px] font-bold uppercase">
                      {currentUser.gameNick}, VOCÊ ESTÁ INSCRITO NO TORNEIO{" "}
                      {tournament.name}!
                    </p>
                  </div>
                  <div className="p-6 bg-zinc-900 border-l-4 border-green-500 text-left">
                    <p className="text-[10px] text-zinc-500 font-black mb-1 uppercase italic">
                      Próxima Fase:
                    </p>
                    <p className="text-xs font-black text-white italic tracking-wider leading-relaxed">
                      Aguarde o processamento da equipe administradora do
                      torneio.
                    </p>
                  </div>
                </div>
              ) : (
                /* ESTADO: FORMULÁRIO DE ENTRADA */
                <div className="space-y-10">
                  <div className="flex justify-between items-end border-b border-zinc-900 pb-6">
                    <div>
                      <p className="text-[10px] text-zinc-500 font-black mb-1 uppercase">
                        Jogador Logado
                      </p>
                      <h3 className="text-2xl font-black text-white italic tracking-tighter uppercase">
                        {currentUser.gameNick}
                      </h3>
                    </div>
                    <div className="text-right">
                      <p className="text-[10px] text-zinc-500 font-black mb-1 uppercase">
                        Ocupação
                      </p>
                      <h3
                        className={`text-2xl font-black italic tracking-tighter ${isFull ? "text-red-500" : "text-[#FFB300]"}`}
                      >
                        {currentPlayersCount}/{maxPlayers}
                      </h3>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div className="w-full h-1.5 bg-zinc-900 rounded-full overflow-hidden">
                      <div
                        className={`h-full transition-all duration-1000 ease-out ${isFull ? "bg-red-600" : "bg-[#FFB300] shadow-[0_0_10px_rgba(255,179,0,0.5)]"}`}
                        style={{
                          width: `${(currentPlayersCount / maxPlayers) * 100}%`,
                        }}
                      ></div>
                    </div>
                    <div className="flex justify-between items-center text-[9px] font-black text-zinc-600 uppercase tracking-widest italic">
                      <span>Início das Inscrições</span>
                      <span>Limite de Jogadores</span>
                    </div>
                  </div>

                  <div className="space-y-6">
                    <div className="bg-zinc-900/30 p-5 border border-zinc-800 group hover:border-[#FFB300]/50 transition-colors">
                      <div className="flex items-center gap-3 mb-4">
                        <Zap size={16} className="text-[#FFB300]" />
                        <span className="text-[11px] font-black text-white italic uppercase tracking-widest">
                          Protocolos de Entrada
                        </span>
                      </div>
                      <ul className="space-y-3">
                        <li className="text-[10px] text-zinc-500 font-bold flex justify-between items-center">
                          <span>Login</span>
                          <span className="text-green-500 font-black italic flex items-center gap-1">
                            AUTENTICADO <CheckCircle2 size={10} />
                          </span>
                        </li>
                        <li className="text-[10px] text-zinc-500 font-bold flex justify-between items-center">
                          <span>DISCORD</span>
                          <span className="text-zinc-200 font-black italic uppercase tracking-widest">
                            {currentUser.discordName}
                          </span>
                        </li>
                        <li className="text-[10px] text-zinc-500 font-bold flex justify-between items-center">
                          <span>NICK REGISTRADO</span>
                          <span className="text-zinc-200 font-black italic uppercase tracking-widest">
                            {currentUser.gameNick}
                          </span>
                        </li>
                      </ul>
                    </div>

                    <div className="space-y-3">
                      <button
                        onClick={handleJoinTournament}
                        disabled={
                          loading || isFull || tournament.status !== "open"
                        }
                        className={`w-full font-black py-6 text-sm tracking-[0.4em] transition-all shadow-2xl flex items-center justify-center gap-4 italic uppercase
                          ${
                            isFull || tournament.status !== "open"
                              ? "bg-zinc-800 text-zinc-600 cursor-not-allowed border-zinc-700"
                              : "bg-[#FFB300] text-black hover:brightness-110 active:scale-[0.98] shadow-[#FFB300]/10"
                          }`}
                      >
                        {loading ? (
                          <div className="w-6 h-6 border-2 border-black border-t-transparent rounded-full animate-spin"></div>
                        ) : isFull ? (
                          "OPERACIONAL COMPLETO"
                        ) : (
                          <>
                            CONFIRMAR INSCRIÇÃO{" "}
                            <Play size={16} fill="currentColor" />
                          </>
                        )}
                      </button>

                      {isFull && (
                        <div className="flex items-center justify-center gap-2 text-red-500 animate-pulse">
                          <AlertTriangle size={12} />
                          <span className="text-[9px] font-black uppercase italic">
                            Limite de vagas atingido para este torneio
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
