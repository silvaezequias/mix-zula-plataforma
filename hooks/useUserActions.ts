import {
  changeParticipantRoleAction,
  changeParticipantStatusAction,
  removeParticipantAction,
} from "@/features/tournament/action";
import { ParticipantRole, ParticipantStatus } from "@prisma/client";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "react-toastify";

export type LoadingAction = "role" | "kick" | "status" | null;

export function useUserActions(onUserRemoved: () => void) {
  const router = useRouter();
  const [loadingAction, setLoadingAction] = useState<LoadingAction>(null);

  const runAction = async (action: LoadingAction, fn: () => Promise<void>) => {
    try {
      setLoadingAction(action);
      await fn();
      router.refresh();
    } catch (err: unknown) {
      toast.error((err as Error)?.message || "Erro inesperado");
    } finally {
      setLoadingAction(null);
    }
  };

  const updateRole = (participantId: string, roleId: ParticipantRole) => {
    runAction("role", async () => {
      const res = await changeParticipantRoleAction(participantId, roleId);
      if (!res.success) throw new Error(res.error);
      toast.info("Cargo atualizado com sucesso");
    });
  };

  const updateStatus = (participantId: string, statusId: ParticipantStatus) => {
    runAction("status", async () => {
      const res = await changeParticipantStatusAction(participantId, statusId);
      if (!res.success) throw new Error(res.error);
      toast.info("Status atualizado com sucesso");
    });
  };

  const kickoff = (participantId: string) => {
    runAction("kick", async () => {
      const res = await removeParticipantAction(participantId);
      if (!res.success) throw new Error(res.error);
      toast.info("Usuário foi expulso do torneio");
      onUserRemoved();
    });
  };

  return {
    updateStatus,
    updateRole,
    kickoff,
    loadingAction,
    isLoading: loadingAction !== null,
  };
}
