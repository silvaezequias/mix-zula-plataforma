"use client";

import React, { useState, useEffect } from "react";

import {
  Trophy,
  ShieldCheck,
  Gamepad2,
  ChevronRight,
  AlertTriangle,
  Calendar,
} from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { signIn, useSession } from "next-auth/react";
import { brand } from "@/config/brand";
import { parseDate, parseDateString } from "@/lib/formatter";
import { easyFetch } from "@/lib/fetch";

export default function UpdateUserPage() {
  const router = useRouter();
  const { status, data: session } = useSession();

  const [formData, setFormData] = useState({
    playerNickname: "",
    birthDate: "",
  });

  const playerNickname =
    formData.playerNickname || session?.user?.player?.nickname || "";
  const birthDate = formData.birthDate || session?.user?.birthDate || "";

  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const canUpdate =
    !!(birthDate && playerNickname) &&
    (birthDate != session?.user?.birthDate ||
      playerNickname != session?.user?.player?.nickname);

  const searchParams = useSearchParams();
  const redirectUrl = searchParams.get("redirect");
  const safeRedirect = redirectUrl || "/";

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push(`/login/?redirect=${encodeURIComponent(safeRedirect)}`);
    }
  }, [router, safeRedirect, status]);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: name === "playerNickname" ? value.replace(/ /g, "") : value,
    }));
    setError(null);
  };

  const handleUpdate = (e: React.FormEvent) => {
    e.preventDefault();

    if (!playerNickname) {
      setError("O seu nome dentro do jogo é obrigatório para a identificação.");
      return;
    }
    if (!birthDate) {
      setError(
        "A data de nascimento é necessária para os protocolos de idade.",
      );
      return;
    }

    const raw = JSON.stringify({
      birthDate: parseDateString(parseDate(birthDate)),
      playerNickname: playerNickname,
    });

    setLoading(true);
    easyFetch(`/api/users/${session?.user.id}`, {
      method: "PATCH",
      body: raw,
    })
      .then((res) => res.json())
      .then(async (response) => {
        setLoading(false);

        if (response.status !== 200) return setError(response.message);

        await signIn("discord", { redirect: false });
      });
  };

  return (
    <div className="min-h-screen bg-[#050505] text-white font-sans uppercase italic tracking-widest flex items-center justify-center p-4 relative overflow-hidden selection:bg-primary selection:text-black">
      <div className="fixed inset-0 pointer-events-none opacity-20">
        <div className="absolute top-[-10%] right-[-10%] w-[50%] h-[50%] bg-primary blur-[150px] rounded-full opacity-10"></div>
        <div className="absolute bottom-[-10%] left-[-10%] w-[40%] h-[40%] bg-zinc-800 blur-[120px] rounded-full opacity-10"></div>
      </div>

      <main className="relative z-10 w-full max-w-125 animate-in fade-in zoom-in-95 duration-700">
        <div className="flex flex-col items-center mb-8">
          <div className="bg-primary p-3 mb-4 shadow-[0_0_30px_rgba(255,179,0,0.2)] transform -rotate-6">
            <Trophy className="text-black w-10 h-10" />
          </div>
          <h1 className="text-3xl sm:text-4xl font-black italic tracking-tighter text-center leading-none">
            ATUALIZE SEU <span className="text-primary">CADASTRO</span>
          </h1>
          <p className="text-zinc-500 text-[9px] font-bold tracking-[0.4em] mt-3 uppercase italic">
            Atualize suas informações de Registro
          </p>
        </div>

        <div className="bg-[#111] border-t-4 border-primary p-8 sm:p-10 shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-8 bg-primary transform skew-x-35 translate-x-16 -translate-y-4 opacity-50"></div>
          <form onSubmit={handleUpdate} className="space-y-6">
            <div className="space-y-2">
              <label className="text-[10px] font-black text-zinc-500 flex items-center gap-2">
                <Gamepad2 size={14} className="text-primary" /> Nome (NICK
                IN-GAME) *
              </label>
              <input
                type="text"
                name="playerNickname"
                placeholder="EX: GHOST_STRIKE"
                value={playerNickname}
                onChange={handleInputChange}
                className="w-full bg-[#1a1a1a] border border-zinc-800 p-4 text-xs font-black italic text-white outline-none focus:border-primary transition-all placeholder:text-zinc-700"
              />
            </div>

            <div className="gap-6">
              <div className="space-y-2">
                <label className="text-[10px] font-black text-zinc-500 flex items-center gap-2">
                  <Calendar size={14} className="text-primary" /> DATA DE
                  NASCIMENTO *
                </label>
                <input
                  type="date"
                  name="birthDate"
                  value={birthDate}
                  onChange={handleInputChange}
                  className="w-full bg-[#1a1a1a] border border-zinc-800 p-4 text-xs font-black italic text-white outline-none focus:border-primary transition-all scheme-dark"
                />
              </div>
            </div>

            {error && (
              <div className="bg-red-500/10 border border-red-500/50 p-4 flex items-center gap-3 animate-in fade-in slide-in-from-top-1">
                <AlertTriangle size={16} className="text-red-500" />
                <span className="text-[10px] font-black text-red-500 uppercase italic tracking-tight leading-tight">
                  {error}
                </span>
              </div>
            )}

            <div className="pt-4">
              <button
                type="submit"
                disabled={!canUpdate}
                className={`w-full font-black py-5 text-sm tracking-[0.4em] transition-all flex items-center justify-center gap-4 uppercase italic
                  ${
                    canUpdate
                      ? "bg-primary text-black hover:brightness-110 shadow-[0_10px_30px_rgba(255,179,0,0.15)] active:scale-[0.98] border-b-4 border-black/20"
                      : "bg-zinc-800 text-zinc-600 cursor-not-allowed border-zinc-700"
                  }`}
              >
                {loading ? (
                  <div className="w-6 h-6 border-2 border-black/30 border-t-black rounded-full animate-spin"></div>
                ) : (
                  <>
                    Atualizar <ChevronRight size={18} />
                  </>
                )}
              </button>
            </div>
          </form>
        </div>

        <div className="mt-8 flex flex-col items-center gap-4 opacity-40">
          <div className="flex items-center gap-4 text-zinc-500">
            <div className="h-px w-12 bg-zinc-800"></div>
            <ShieldCheck size={16} />
            <div className="h-px w-12 bg-zinc-800"></div>
          </div>
          <p className="text-[8px] font-bold uppercase tracking-[0.5em] text-center leading-relaxed px-4">
            Dados protegidos pela central de segurança {brand.name}. <br />
            suas informações pessoais são confidenciais.
          </p>
        </div>
      </main>
    </div>
  );
}
