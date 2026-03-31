"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  Trophy,
  ShieldCheck,
  Gamepad2,
  ChevronRight,
  AlertTriangle,
  Info,
  Users,
} from "lucide-react";
import { Player } from "@/types";

/* ===============================================================================
  PÁGINA: LOGIN / IDENTIFICAÇÃO
===============================================================================
*/

export default function LoginPage() {
  const router = useRouter();

  // Estados do formulário
  const [gameNick, setGameNick] = useState("");
  const [discordData, setDiscordData] = useState<{
    name: string;
    id: string;
  } | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  // Verificação inicial: Se já estiver logado, vai para a home
  useEffect(() => {
    const savedUser = localStorage.getItem("arena_user");
    if (savedUser) {
      router.push("/torneios/1");
    }
  }, [router]);

  // Simulação de autenticação com Discord
  const handleDiscordConnect = () => {
    setLoading(true);
    setError(null);

    // Simula o popup/redirecionamento do Discord
    setTimeout(() => {
      setDiscordData({
        name: "WZ_TA_NA_AREA",
        id: Math.floor(Math.random() * 9000 + 1000).toString(),
      });
      setLoading(false);
    }, 1200);
  };

  // Finalizar login e salvar no localStorage
  const handleFinalLogin = (e: React.FormEvent) => {
    e.preventDefault();

    if (!discordData) {
      setError("Conecte seu Discord antes de prosseguir.");
      return;
    }
    if (!gameNick.trim()) {
      setError("O Nick no jogo é obrigatório.");
      return;
    }

    const newUser: Player = {
      id: `u-${Math.random().toString(36).substr(2, 9)}`,
      discordName: discordData.name,
      discordId: discordData.id,
      gameNick: gameNick.trim(),
      role: gameNick.toLowerCase().includes("admin") ? "ADMIN" : "PLAYER",
      roundStats: [],
      stats: { kills: 0, deaths: 0, assists: 0 },
    };

    localStorage.setItem("arena_user", JSON.stringify(newUser));
    router.push("/torneios");
  };

  return (
    <div className="min-h-screen bg-[#050505] text-white font-sans uppercase italic tracking-widest flex items-center justify-center p-4 relative overflow-hidden">
      {/* Elementos de Fundo Decorativos */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-[-20%] left-[-10%] w-[60%] h-[60%] bg-[#FFB300] opacity-[0.03] blur-[120px] rounded-full"></div>
        <div className="absolute bottom-[-10%] right-[-5%] w-[40%] h-[40%] bg-zinc-800 opacity-[0.05] blur-[100px] rounded-full"></div>
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-10"></div>
      </div>

      <main className="relative z-10 w-full max-w-112.5 animate-in fade-in zoom-in-95 duration-700">
        {/* Logo / Header */}
        <div className="flex flex-col items-center mb-10">
          <div className="bg-[#FFB300] p-3 mb-4 shadow-[0_0_30px_rgba(255,179,0,0.2)]">
            <Trophy className="text-black w-10 h-10" />
          </div>
          <h1 className="text-3xl sm:text-4xl font-black italic tracking-tighter text-center leading-none">
            MIX <span className="text-[#FFB300]">ZULA</span>
          </h1>
          <p className="text-zinc-500 text-[9px] font-bold tracking-[0.4em] mt-3 uppercase">
            entre com sua conta do discord
          </p>
        </div>

        <div className="bg-[#111] border-t-4 border-[#FFB300] p-8 sm:p-10 shadow-2xl relative overflow-hidden">
          {/* Skewed decoration inside card */}
          <div className="absolute top-0 right-0 w-24 h-6 bg-[#FFB300] transform skew-x-35 translate-x-12 -translate-y-3 opacity-50"></div>

          <form onSubmit={handleFinalLogin} className="space-y-8">
            {/* Passo 1: Discord */}
            <div className="space-y-4">
              <label className="text-[10px] font-black text-zinc-500 flex items-center gap-2">
                <span className="w-4 h-4 rounded-full bg-zinc-800 text-[8px] flex items-center justify-center text-zinc-400">
                  1
                </span>
                AUTENTICAÇÃO DE SEGURANÇA
              </label>

              {!discordData ? (
                <button
                  type="button"
                  onClick={handleDiscordConnect}
                  disabled={loading}
                  className="w-full bg-[#5865F2] hover:bg-[#4752C4] text-white font-black py-4 px-6 flex items-center justify-center gap-3 transition-all active:scale-95 group"
                >
                  {loading ? (
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                  ) : (
                    <>
                      <Users size={18} />
                      <span className="text-xs tracking-widest uppercase">
                        Conectar com Discord
                      </span>
                    </>
                  )}
                </button>
              ) : (
                <div className="bg-zinc-900 border border-green-500/50 p-4 flex items-center justify-between animate-in slide-in-from-top-2">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-green-500/10 flex items-center justify-center text-green-500 rounded-full">
                      <ShieldCheck size={18} />
                    </div>
                    <div>
                      <p className="text-[10px] text-zinc-500 font-bold leading-none">
                        CONECTADO COMO
                      </p>
                      <p className="text-xs font-black text-white italic mt-1">
                        {discordData.name}#{discordData.id}
                      </p>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => setDiscordData(null)}
                    className="text-[8px] font-black text-zinc-600 hover:text-red-500 transition-colors"
                  >
                    ALTERAR
                  </button>
                </div>
              )}
            </div>

            {/* Passo 2: Nick */}
            <div className="space-y-4">
              <label className="text-[10px] font-black text-zinc-500 flex items-center gap-2 uppercase">
                <span className="w-4 h-4 rounded-full bg-zinc-800 text-[8px] flex items-center justify-center text-zinc-400">
                  2
                </span>
                Credenciais de Combate
              </label>
              <div className="relative group">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-600 group-focus-within:text-[#FFB300] transition-colors">
                  <Gamepad2 size={18} />
                </div>
                <input
                  type="text"
                  placeholder="DIGITE SEU NICK IN-GAME..."
                  value={gameNick}
                  onChange={(e) => setGameNick(e.target.value)}
                  className="w-full bg-[#1a1a1a] border border-zinc-800 p-4 pl-12 text-xs font-black italic text-white outline-none focus:border-[#FFB300] transition-all placeholder:text-zinc-700"
                />
              </div>
            </div>

            {/* Alertas de Erro */}
            {error && (
              <div className="bg-red-500/10 border border-red-500/50 p-3 flex items-center gap-3 animate-shake">
                <AlertTriangle size={14} className="text-red-500" />
                <span className="text-[9px] font-black text-red-500 uppercase">
                  {error}
                </span>
              </div>
            )}

            {/* Botão Final */}
            <div className="pt-4">
              <button
                type="submit"
                className={`w-full font-black py-5 text-sm tracking-[0.4em] transition-all flex items-center justify-center gap-3 uppercase italic
                  ${
                    !discordData || !gameNick
                      ? "bg-zinc-800 text-zinc-600 cursor-not-allowed border border-zinc-700"
                      : "bg-[#FFB300] text-black hover:brightness-110 shadow-[0_10px_20px_rgba(255,179,0,0.15)] active:scale-[0.98]"
                  }`}
              >
                ENTRAR <ChevronRight size={18} />
              </button>
            </div>
          </form>
        </div>

        {/* Footer info */}
        <div className="mt-8 flex items-center justify-center gap-4 text-zinc-600">
          <Info size={12} />
          <p className="text-[8px] font-bold uppercase tracking-widest text-center leading-relaxed">
            Ao entrar, você concorda com os protocolos de conduta e <br />
            as regras estabelecidas pelos administradores de MIX ZULA.
          </p>
        </div>
      </main>
    </div>
  );
}
