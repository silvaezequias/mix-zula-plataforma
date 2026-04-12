import { UserCheck } from "lucide-react";
import {
  ConfigField,
  ConfigSwitch,
} from "../../../../components/ui/components";

export const PresenceConfirmation = ({
  confirmationSystem,
  confirmationTime,
  hasSubstitutes,
  substitutesLimit,
  handleChange,
  handleToggle,
}: {
  confirmationSystem?: boolean;
  confirmationTime?: number;
  hasSubstitutes?: boolean;
  substitutesLimit?: number;
  handleToggle: (key: string) => void;
  handleChange: (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
  ) => void;
}) => {
  return (
    <section className="bg-[#111] border border-zinc-800 p-8 shadow-2xl">
      <h3 className="text-lg font-black mb-8 flex items-center uppercase gap-3 italic text-zinc-400">
        <UserCheck size={20} className="text-primary" /> Presença & Reservas
      </h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="space-y-4">
          <ConfigSwitch
            label="Sistema de Confirmação"
            checked={!!confirmationSystem}
            onChange={() => handleToggle("confirmationSystem")}
          />
          {confirmationSystem && (
            <ConfigField
              label="Tempo de Check-in (Minutos)"
              name="confirmationTime"
              type="number"
              value={confirmationTime}
              onChange={handleChange}
            />
          )}
        </div>
        <div className="space-y-4">
          <ConfigSwitch
            label="Jogadores Reservas"
            checked={!!hasSubstitutes}
            onChange={() => handleToggle("hasSubstitutes")}
          />
          {hasSubstitutes && (
            <ConfigField
              label="Máximo de Suplentes"
              name="substitutesLimit"
              type="number"
              value={substitutesLimit}
              onChange={handleChange}
            />
          )}
        </div>
      </div>
    </section>
  );
};
