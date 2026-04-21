"use client";

import { Card } from "../settings/SettingsTab";
import {
  Check,
  ClipboardList,
  Copy,
  Shield,
  TextAlignStart,
} from "lucide-react";
import { roleColors } from "@/constants/data";
import { useState, useTransition } from "react";
import { Button } from "@/components/ui/Button";
import { CardPlayer } from "@/components/ui/CardPlayer";
import { handleTournamentRoleRequestAction } from "@/features/tournament/action";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import { useSelectedParticipantContext } from "@/providers/SelectedParticipantContext";
import { Participant, Tournament, TournamentRoleRequest } from "@prisma/client";

type StaffTabProps = {
  tournament: Tournament;
  roleRequests?: TournamentRoleRequest[];
  participants?: Participant[];
};

export const StaffTab = ({
  tournament,
  roleRequests,
  participants,
}: StaffTabProps) => {
  const { selectParticipant } = useSelectedParticipantContext();

  const filteredStaff = participants?.filter((p) => p.role !== "PLAYER") ?? [];

  const router = useRouter();
  const [copied, setCopied] = useState(false);
  const [isPending, startTransition] = useTransition();

  const link = `${window.location.origin}/torneios/${tournament.id}/seja/staff`;

  const handleCopyLink = () => {
    navigator.clipboard.writeText(link);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleRequest = (requestId: string, result: boolean) => {
    startTransition(async () => {
      const response = await handleTournamentRoleRequestAction(
        requestId,
        result,
      );

      if (response.success) router.refresh();
      else toast.error(response.error);
    });
  };

  return (
    <div className="space-y-4 animate-in fade-in duration-300 grid grid-cols-1 lg:grid-cols-2 gap-8">
      <Card
        icon={Shield}
        title="Lista de Staff"
        className="h-[75vh] max-h-[80vh] overflow-y-auto"
      >
        <div className="pt-4 border-t border-zinc-800">
          <label className="text-[9px] font-bold text-zinc-500 uppercase block mb-3 italic">
            Link de Recrutamento pra Staff
          </label>
          <div className="flex gap-2">
            <div className="flex-1 bg-zinc-900 border border-zinc-800 p-3 text-[10px] text-zinc-500 truncate font-mono italic">
              {link}
            </div>
            <button
              onClick={handleCopyLink}
              className={`px-6 transition-all flex items-center justify-center ${copied ? "bg-green-600 text-white" : "bg-zinc-800 text-primary hover:bg-zinc-700"}`}
            >
              {copied ? <Check size={18} /> : <Copy size={18} />}
            </button>
          </div>
          <p className="text-[8px] text-zinc-700 mt-2 font-semibold">
            Note: esse link deve ser compartilhado somente com sua equipe de
            staffs
          </p>
        </div>

        <div className="flex flex-col gap-5">
          {filteredStaff.map((p) => (
            <CardPlayer key={p.id} name={p.name!} nickname={p.nickname!}>
              <span className="text-white text-xs uppercase font-bold place-self-end self-center">
                Cargo: <span className={roleColors[p.role]}>{p.role}</span>
              </span>
              <span className="flex gap-2 place-self-center self-center col-span-2 w-full">
                <Button onClick={() => selectParticipant(p)} className="w-full">
                  Gerenciar
                </Button>
              </span>
            </CardPlayer>
          ))}
        </div>
      </Card>

      <Card
        icon={ClipboardList}
        title="Solicitações"
        className="h-[75vh] max-h-[80vh] overflow-y-auto"
      >
        <div className="flex flex-col gap-5">
          {roleRequests && roleRequests.length > 0 ? (
            roleRequests.map((p) => (
              <CardPlayer key={p.id} name={p.name} nickname={p.nickname}>
                <span className="text-white text-xs uppercase font-bold place-self-end self-center">
                  Solicitado:{" "}
                  <span className={roleColors[p.requestedRole]}>
                    {p.requestedRole}
                  </span>
                </span>

                {p.status === "PENDING" ? (
                  <span className="flex gap-2 place-self-center self-center col-span-2 w-full text-end">
                    <Button
                      intent="success"
                      variant="default"
                      className="w-full"
                      disabled={isPending}
                      onClick={() => handleRequest(p.id, true)}
                    >
                      Aceitar
                    </Button>
                    <Button
                      intent="danger"
                      variant="default"
                      className="w-full"
                      disabled={isPending}
                      onClick={() => handleRequest(p.id, false)}
                    >
                      Negar
                    </Button>
                  </span>
                ) : (
                  <span className="flex gap-2 place-self-center self-center col-span-2 w-full text-end">
                    <Button
                      intent={p.status === "ACCEPTED" ? "success" : "danger"}
                      variant="default"
                      className="w-full"
                      disabled
                    >
                      {p.status === "ACCEPTED" ? "ACEITO" : "NEGADO"}
                    </Button>
                  </span>
                )}
              </CardPlayer>
            ))
          ) : (
            <div className="col-span-2 py-32 text-center border-2 border-dashed border-zinc-900">
              <TextAlignStart
                size={48}
                className="mx-auto text-zinc-900 mb-4"
              />
              <p className="text-zinc-700 font-black uppercase italic tracking-[0.4em]">
                Nenhum solicitação foi encontrada
              </p>
            </div>
          )}
        </div>
      </Card>
    </div>
  );
};
