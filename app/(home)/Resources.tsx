import { Globe, Sword, Target } from "lucide-react";

export const Resources = () => {
  return (
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
  );
};
