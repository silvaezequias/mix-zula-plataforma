"use client";

import { Activity, Play, Shield } from "lucide-react";
import { useRouter } from "next/navigation";

export const Hero = () => {
  const router = useRouter();

  return (
    <section className="relative min-h-[85vh] flex items-center px-6 lg:px-12 overflow-hidden">
      <div className="relative z-10 max-w-4xl space-y-8 animate-in fade-in slide-in-from-left-8 duration-1000">
        <div className="flex flex-col md:flex-row items-center gap-3 text-primary text-xs font-black">
          <Shield size={16} />
          <span className="tracking-[0.5em] text-center uppercase">
            Plataforma Oficial de Competição
          </span>
        </div>

        <h2 className="text-5xl sm:text-8xl text-center md:text-start font-black italic tracking-tighter leading-tight uppercase">
          DOMINE A <br />
          <span className="text-primary">OPERAÇÃO.</span>
        </h2>

        <p className="text-zinc-500 font-bold max-w-xl text-xs text-center md:text-start sm:text-base leading-relaxed uppercase">
          Participe de torneios táticos, suba no ranking global e garanta
          premiações exclusivas. O Único lugar onde diversão e competitividade
          estão juntas.
        </p>

        <div className="flex flex-col sm:flex-row items-center gap-6 pt-4">
          <button
            onClick={() => router.push("/torneios")}
            className="w-full sm:w-auto bg-primary text-black px-12 py-5 font-black text-sm tracking-widest flex items-center justify-center gap-4 hover:brightness-110 transition-all shadow-[0_10px_30px_rgba(255,179,0,0.2)] active:scale-95 uppercase"
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
  );
};
