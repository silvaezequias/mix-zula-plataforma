"use client";

import { useSearchParams, useRouter } from "next/navigation";
import React, { useState } from "react";
import {
  Trophy,
  ShieldCheck,
  ChevronRight,
  AlertTriangle,
  Info,
} from "lucide-react";
import { signIn, signOut, useSession } from "next-auth/react";
import { PayloadUser } from "@/types/next-auth";
import { BsDiscord } from "react-icons/bs";

const BackgroundEffects = () => (
  <div className="fixed inset-0 pointer-events-none">
    <div className="absolute top-[-20%] left-[-10%] w-[60%] h-[60%] bg-primary opacity-[0.03] blur-[120px] rounded-full"></div>
    <div className="absolute bottom-[-10%] right-[-5%] w-[40%] h-[40%] bg-zinc-800 opacity-[0.05] blur-[100px] rounded-full"></div>
  </div>
);

const Header = () => (
  <div className="flex flex-col items-center mb-10">
    <div className="bg-primary p-3 mb-4 shadow-[0_0_30px_rgba(255,179,0,0.2)]">
      <Trophy className="text-black w-10 h-10" />
    </div>
    <h1 className="text-3xl sm:text-4xl font-black italic tracking-tighter text-center leading-none">
      MIX <span className="text-primary">ZULA</span>
    </h1>
    <p className="text-zinc-500 text-[9px] font-bold tracking-[0.4em] mt-3 uppercase">
      entre com sua conta do discord
    </p>
  </div>
);

const StepLabel = ({ number, title }: { number: string; title: string }) => (
  <label className="text-[10px] font-black text-zinc-500 flex items-center gap-2 uppercase">
    <span className="w-4 h-4 rounded-full bg-zinc-800 text-[8px] flex items-center justify-center text-zinc-400">
      {number}
    </span>
    {title}
  </label>
);

const DiscordSection = ({
  discordData,
  loading,
  onSignIn,
}: {
  discordData: PayloadUser | null;
  loading: boolean;
  onSignIn: () => void;
}) => {
  if (!discordData) {
    return (
      <button
        type="button"
        onClick={onSignIn}
        disabled={loading}
        className="w-full bg-[#5865F2] hover:bg-[#4752C4] text-white font-black py-4 px-6 flex items-center justify-center gap-3 transition-all active:scale-95 group"
      >
        {loading ? (
          <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
        ) : (
          <>
            <BsDiscord size={18} />
            <span className="text-xs tracking-widest uppercase">
              Conectar com Discord
            </span>
          </>
        )}
      </button>
    );
  }

  return (
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
            {discordData.name}
          </p>
        </div>
      </div>
      <button
        type="button"
        onClick={() => signOut()}
        className="text-[8px] font-black text-zinc-600 hover:text-red-500 transition-colors"
      >
        SAIR
      </button>
    </div>
  );
};

export default function LoginPage() {
  const router = useRouter();
  const { data: session, status } = useSession();

  const isAuthenticated = status === "authenticated";
  const isOnboarded = isAuthenticated && (session?.user.isOnboarded || false);

  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const searchParams = useSearchParams();
  const redirectUrl = searchParams.get("redirect");
  const safeRedirect = redirectUrl || "/";

  const discordData: PayloadUser | null = session?.user ?? null;

  const handleFinalLogin = (e: React.FormEvent) => {
    e.preventDefault();

    if (!isAuthenticated)
      return setError("Conecte seu Discord antes de prosseguir.");
    if (!isOnboarded) return setError("Preencha sua ficha para prosseguir.");

    router.push(safeRedirect);
  };

  return (
    <div className="min-h-screen bg-[#050505] text-white font-sans uppercase italic tracking-widest flex items-center justify-center p-4 relative overflow-hidden">
      <BackgroundEffects />

      <main className="relative z-10 w-full max-w-112.5 animate-in fade-in zoom-in-95 duration-700">
        <Header />

        <div className="bg-[#111] border-t-4 border-primary p-8 sm:p-10 shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-24 h-6 bg-primary transform skew-x-35 translate-x-12 -translate-y-3 opacity-50"></div>

          <form onSubmit={handleFinalLogin} className="space-y-8">
            <div className="space-y-4">
              <StepLabel number="1" title="AUTENTICAÇÃO DE SEGURANÇA" />
              <DiscordSection
                discordData={discordData}
                loading={loading}
                onSignIn={() => {
                  setLoading(true);
                  signIn("discord", { callbackUrl: window.location.href });
                }}
              />
            </div>

            <div className="space-y-4">
              <StepLabel number="2" title="Credenciais de Segurança" />
              <div className="relative group">
                <button
                  type="button"
                  onClick={() => {
                    if (isAuthenticated && !isOnboarded) {
                      router.push(
                        `/atualizar-cadastro?redirect=${encodeURIComponent(safeRedirect)}`,
                      );
                    }
                  }}
                  disabled={loading}
                  className={`w-full bg-primary text-black hover:brightness-110 font-black py-4 px-6 flex items-center justify-center gap-3 transition-all active:scale-95 group ${
                    (!isAuthenticated || isOnboarded) &&
                    "bg-zinc-800 text-zinc-600 cursor-not-allowed border border-zinc-700 active:scale-0"
                  }`}
                >
                  <span className="text-xs tracking-widest uppercase">
                    {isAuthenticated
                      ? isOnboarded
                        ? "Cadastro Atualizado"
                        : "Atualize seu cadastro"
                      : "Conecte sua Conta antes"}
                  </span>
                </button>
              </div>
            </div>

            {error && (
              <div className="bg-red-500/10 border border-red-500/50 p-3 flex items-center gap-3 animate-shake">
                <AlertTriangle size={14} className="text-red-500" />
                <span className="text-[9px] font-black text-red-500 uppercase">
                  {error}
                </span>
              </div>
            )}
            <div className="pt-4">
              <button
                type="submit"
                className={`w-full font-black py-5 text-sm tracking-[0.4em] transition-all flex items-center justify-center gap-3 uppercase italic
                  ${
                    !isOnboarded
                      ? "bg-zinc-800 text-zinc-600 cursor-not-allowed border border-zinc-700"
                      : "bg-primary text-black hover:brightness-110 shadow-[0_10px_20px_rgba(255,179,0,0.15)] active:scale-[0.98]"
                  }`}
              >
                ENTRAR <ChevronRight size={18} />
              </button>
            </div>
          </form>
        </div>

        {/* Footer */}
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
