import { Power, Shuffle } from "lucide-react";
import { Card, HandleTournamentChange } from ".";
import { TournamentStatus } from "@prisma/client";
import { ActionButton } from "@/components/ui/ActionButton";
import { ConfigDropdown } from "@/components/ui/components";
import { tournamentStatusMap } from "@/constants/data";
import { useCountdown } from "@/hooks/useCooldown";

export const ActionsSection = ({
  status,
  tournamentCurrentStatus,
  handleRandomize,
  handleChange,
}: {
  status: TournamentStatus;
  tournamentCurrentStatus: TournamentStatus;
  handleRandomize: () => void;
  handleChange: HandleTournamentChange;
}) => {
  const randomizeTeamCooldown = useCountdown(5);

  const handleRandomizeClick = () => {
    if (!randomizeTeamCooldown.active) return randomizeTeamCooldown.start();
    randomizeTeamCooldown.reset();
    handleRandomize();
  };

  return (
    <Card title="Ações" icon={Power} className="col-span-1">
      <div className="space-y-4 flex-1 flex flex-col justify-between">
        <div className="space-y-3 flex flex-col">
          <p className="text-[9px] text-zinc-600 font-bold leading-relaxed uppercase">
            Controle geral de ações operacionais do torneio. Cuidado ao executar
            comandos que
          </p>

          <ConfigDropdown
            label=""
            name="status"
            options={Object.keys(tournamentStatusMap).map((id) => id)}
            labels={Object.values(tournamentStatusMap).map((s) => s.label)}
            value={status}
            onChange={(v) =>
              handleChange("status", v.target.value as TournamentStatus)
            }
          />

          {(tournamentCurrentStatus === "SETTING_TEAM" ||
            tournamentCurrentStatus === "READY" ||
            tournamentCurrentStatus === "SETTING_MATCHES") && (
            <ActionButton
              onClick={handleRandomizeClick}
              className="uppercase"
              intent={
                randomizeTeamCooldown.active
                  ? tournamentCurrentStatus === "READY" ||
                    tournamentCurrentStatus === "SETTING_MATCHES"
                    ? "danger"
                    : "success"
                  : "default"
              }
            >
              <Shuffle
                size={18}
                className="group-hover:scale-125 transition-transform "
              />
              {randomizeTeamCooldown.active
                ? `Confirmar  ${tournamentCurrentStatus === "READY" || tournamentCurrentStatus === "SETTING_MATCHES" ? "re-sorteio" : "sorteio"} em (${randomizeTeamCooldown.time}s)`
                : tournamentCurrentStatus === "READY" ||
                    tournamentCurrentStatus === "SETTING_MATCHES"
                  ? "RE-SORTEAR EQUIPES"
                  : "SORTEAR EQUIPES"}
            </ActionButton>
          )}
        </div>
      </div>
    </Card>
  );
};
