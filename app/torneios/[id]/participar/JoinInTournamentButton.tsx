"use client";

import { ActionButton } from "@/components/ui/ActionButton";
import { createTournamentParticipantAction } from "@/features/tournament/action";
import { Loader2 } from "lucide-react";
import { useTransition } from "react";
import { toast } from "react-toastify";

export function JoinInTournamentButton({
  canJoinInTournament,
  tournamentId,
  isFull,
}: {
  canJoinInTournament: boolean;
  isFull: boolean;
  tournamentId: string;
}) {
  const [isPending, startTransition] = useTransition();

  function handleTryToJoinTournament() {
    startTransition(async () => {
      const result = await createTournamentParticipantAction(tournamentId);

      if (!result.success) toast.error(result.error);
    });
  }

  canJoinInTournament = canJoinInTournament && !isPending;

  return (
    <ActionButton
      onClick={handleTryToJoinTournament}
      disabled={canJoinInTournament}
      className={`w-full sm:w-full font-black py-6 text-sm tracking-[0.4em] transition-all shadow-2xl flex items-center justify-center gap-4 uppercase
      ${
        canJoinInTournament
          ? "bg-zinc-800 text-zinc-600 cursor-not-allowed border-zinc-700"
          : "bg-primary text-black hover:brightness-110 active:scale-[0.98] shadow-primary/10"
      }`}
    >
      {isPending ? (
        <Loader2 className="animate-spin" />
      ) : isFull ? (
        "SEM VAGAS"
      ) : (
        "CONFIRMAR INSCRIÇÃO"
      )}
    </ActionButton>
  );
}
