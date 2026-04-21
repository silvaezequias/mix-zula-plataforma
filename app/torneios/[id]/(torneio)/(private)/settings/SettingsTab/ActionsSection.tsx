import { Power, Users } from "lucide-react";
import { Card, HandleTournamentChange } from ".";
import { TournamentStatus } from "@prisma/client";
import { ActionButton } from "@/components/ui/ActionButton";
import { ConfigDropdown } from "@/components/ui/components";
import { tournamentStatusMap } from "@/constants/data";
import Link from "next/link";

export const ActionsSection = ({
  status,
  handleChange,
  tournamentId,
}: {
  status: TournamentStatus;
  handleChange: HandleTournamentChange;
  tournamentId: string;
}) => {
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
          <Link
            href={`/torneios/${tournamentId}/teams`}
            className="flex flex-col"
          >
            <ActionButton className="uppercase">
              Gerenciar Times
              <Users />
            </ActionButton>
          </Link>
        </div>
      </div>
    </Card>
  );
};
