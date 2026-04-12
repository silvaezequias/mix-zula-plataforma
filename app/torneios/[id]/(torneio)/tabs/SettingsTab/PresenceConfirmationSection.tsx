import { ConfigField, ConfigSwitch } from "@/components/ui/components";
import { UserCheck } from "lucide-react";
import { Card, HandleTournamentChange, HandleTournamentToggle } from ".";

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
  handleToggle: HandleTournamentToggle;
  handleChange: HandleTournamentChange;
}) => {
  return (
    <Card icon={UserCheck} title="Presença e Reservas">
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
              onChange={(v) =>
                handleChange("confirmationTime", +v.target.value)
              }
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
              onChange={(v) =>
                handleChange("substitutesLimit", +v.target.value)
              }
            />
          )}
        </div>
      </div>
    </Card>
  );
};
