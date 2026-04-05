"use client";

import { Suspense, useState } from "react";
import { Trophy, Info } from "lucide-react";
import { LoginUserForm } from "./LoginUserForm";
import { brand } from "@/config/brand";

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
      {brand.splittedName[0]}{" "}
      <span className="text-primary">{brand.splittedName[1]}</span>
    </h1>
    <p className="text-zinc-500 text-[9px] font-bold tracking-[0.4em] mt-3 uppercase">
      Entre com sua conta do discord
    </p>
  </div>
);

export default function LoginPage() {
  const [loading, setLoading] = useState(false);

  return (
    <div className="min-h-screen bg-[#050505] text-white font-sans uppercase italic tracking-widest flex items-center justify-center p-4 relative overflow-hidden">
      <BackgroundEffects />

      <main className="relative z-10 w-full max-w-112.5 animate-in fade-in zoom-in-95 duration-700">
        <Header />

        <div className="bg-[#111] border-t-4 border-primary p-8 sm:p-10 shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-24 h-6 bg-primary transform skew-x-35 translate-x-12 -translate-y-3 opacity-50"></div>
          <Suspense fallback={<div>Loading...</div>}>
            <LoginUserForm loading={loading} setLoading={setLoading} />
          </Suspense>
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
