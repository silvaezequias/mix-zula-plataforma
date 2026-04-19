import { Sliders } from "lucide-react";
import { Card, HandleTournamentChange } from ".";
import { ConfigField, ConfigInput } from "@/components/ui/components";

export const AboutTournament = ({
  title,
  description,
  prize,
  handleChange,
}: {
  title: string;
  description: string;
  prize: string;
  handleChange: HandleTournamentChange;
}) => {

  return (
    <Card
      icon={Sliders}
      title="Identificação do Torneio"
      className="col-span-1"
    >
      <div className="grid grid-cols-1 gap-6">
        <ConfigInput
          label="Título da Operação"
          value={title}
          onChange={(v) => handleChange("title", v)}
        />
        <ConfigField
          label="Descrição e Regras"
          value={description}
          onChange={(v) => handleChange("description", v.target.value)}
          textarea
          rows={5}
        />
        <ConfigInput
          label="Premiação"
          value={prize}
          onChange={(v) => handleChange("prize", v)}
        />
      </div>
    </Card>
  );
};
