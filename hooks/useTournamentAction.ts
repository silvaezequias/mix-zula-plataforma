import { updateTournament } from "@/features/tournament/action";
import { TournamentProps } from "@/features/tournament/service";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "react-toastify";

export type LoadingAction = "all" | null;

export function useTournamentActions(tournamentId: string) {
  const router = useRouter();
  const [loadingAction, setLoadingAction] = useState<LoadingAction>(null);

  const runAction = async (action: LoadingAction, fn: () => Promise<void>) => {
    try {
      setLoadingAction(action);
      await fn();
      router.refresh();
    } catch (err: unknown) {
      toast.error(
        (err as Error)?.message ||
          "Erro inesperado. Tente novamente mais tarde",
      );
    } finally {
      setLoadingAction(null);
    }
  };

  const updateAll = (data: TournamentProps, then?: () => void) => {
    runAction("all", async () => {
      const res = await updateTournament(tournamentId, data);
      if (!res.success) throw new Error(res.error);
      toast.info("Torneio atualizado com sucesso");
      then?.();
    });
  };

  return {
    updateAll,
    loadingAction,
    isLoading: loadingAction !== null,
  };
}
