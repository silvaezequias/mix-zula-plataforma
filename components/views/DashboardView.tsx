import { Championship } from "@/types";

interface DashboardProps {
  championships: Championship[];
  onSelect: (id: string) => void;
}

export const DashboardView: React.FC<DashboardProps> = ({
  championships,
  onSelect,
}) => (
  <div className="animate-in fade-in duration-500">
    <h2 className="text-3xl sm:text-5xl font-black italic uppercase tracking-tighter mb-6 sm:mb-10">
      TORNEIOS
    </h2>
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8">
      {championships.map((champ) => (
        <div
          key={champ.id}
          className="bg-[#111] border-l-4 border-zinc-800 p-6 sm:p-8 hover:bg-zinc-900 transition-all group relative overflow-hidden"
        >
          <h3 className="text-2xl sm:text-3xl font-black italic mb-2 tracking-tighter uppercase">
            {champ.name}
          </h3>
          <p className="text-[#FFB300] text-xs font-bold uppercase italic mb-6">
            {champ.prize}
          </p>
          <div className="flex gap-2 mt-auto">
            <button
              onClick={() => onSelect(champ.id)}
              className="bg-zinc-800 px-6 py-3 text-[10px] font-black italic group-hover:bg-[#FFB300] group-hover:text-black transition-all uppercase"
            >
              {champ.status === "finished" ? "RESULTADOS" : "DETALHES"}
            </button>
          </div>
        </div>
      ))}
    </div>
  </div>
);
