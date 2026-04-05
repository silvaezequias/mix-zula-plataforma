"use client";

import { ChevronRight, Medal } from "lucide-react";
import { useRouter } from "next/navigation";

export const CallToAction = () => {
  const router = useRouter();

  return (
    <section className="py-32 px-6 text-center relative overflow-hidden">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-primary opacity-5 blur-[120px] rounded-full"></div>
      <div className="relative z-10 space-y-8">
        <Medal size={48} className="text-primary mx-auto animate-bounce" />
        <h3 className="text-4xl sm:text-6xl font-black italic tracking-tighter uppercase">
          PRONTO PARA O <br />{" "}
          <span className="text-primary">PRÓXIMO NÍVEL?</span>
        </h3>
        <p className="text-zinc-500 text-xs sm:text-sm font-bold uppercase tracking-widest max-w-lg mx-auto leading-loose">
          Não perca tempo. Os melhores agentes já estão em campo. <br />
          Garanta sua vaga na próxima operação.
        </p>
        <button
          onClick={() => router.push("/torneios")}
          className="group relative bg-white text-black px-12 py-5 font-black text-sm tracking-widest uppercase transition-all hover:bg-primary overflow-hidden"
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
  );
};
