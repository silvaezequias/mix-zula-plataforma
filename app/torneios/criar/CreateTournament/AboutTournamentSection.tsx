import { Info, Medal } from "lucide-react";
import { ConfigField } from "./components";

export const AboutTournament = ({
  title,
  description,
  prize,
  handleChange,
}: {
  title?: string;
  description?: string;
  prize?: string;
  handleChange: (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
  ) => void;
}) => {
  return (
    <section className="lg:col-span-7 bg-[#111] border border-zinc-800 p-8 shadow-2xl relative overflow-hidden">
      <div className="absolute top-0 left-0 w-1 h-full bg-primary"></div>
      <h3 className="text-lg font-black mb-8 flex items-center gap-3 italic uppercase">
        <Info size={20} className="text-primary" /> Identificação do Campeonato
      </h3>
      <div className="grid grid-cols-1 gap-6">
        <ConfigField
          label="Título da Operação"
          name="title"
          value={title}
          onChange={handleChange}
          placeholder="NOME DO TORNEIO..."
          required
        />
        <ConfigField
          label="Descrição e Regras"
          name="description"
          value={description}
          onChange={handleChange}
          textarea
          rows={3}
        />
        <ConfigField
          label="Premiação"
          name="prize"
          value={prize}
          onChange={handleChange}
          placeholder="EX: R$ 1.000"
          icon={<Medal size={18} />}
        />
      </div>
    </section>
  );
};
