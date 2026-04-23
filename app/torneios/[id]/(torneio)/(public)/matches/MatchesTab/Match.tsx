import { Shuffle, Sword } from "lucide-react";
import { TeamMatchCard } from "./TeamMatchCard";
import { Match, MatchStatus, Prisma } from "@prisma/client";
import { ActionButton } from "@/components/ui/ActionButton";
import { useCountdown } from "@/hooks/useCooldown";
import { updateMatchStatusAction } from "@/features/tournament/action";
import { toast } from "react-toastify";

export function DisplayTeams({
  match,
  swapTeam,
  isStaff,
}: {
  match: Prisma.MatchGetPayload<{
    include: {
      team1: { include: { members: { include: { participant: true } } } };
      team2: { include: { members: { include: { participant: true } } } };
    };
  }>;
  swapTeam: boolean;
  isStaff: boolean;
}) {
  const isCurrentMatch = match.status === "ONGOING";
  const isFinished = match.status === "FINISHED";
  const isLocked = !swapTeam;

  return (
    <div className="flex flex-col md:flex-row items-center justify-center gap-8 md:gap-0 w-full max-w-4xl relative">
      <TeamMatchCard
        isStaff={isStaff}
        match={match}
        team={match.team1}
        displaySide={"CT"}
      />
      <div className="flex flex-row md:flex-col mb-10 md:mb-0 items-center justify-center h-full min-w-25 relative">
        <div
          className={`hidden md:block w-px h-32 transition-colors ${isCurrentMatch ? "bg-primary/40" : "bg-zinc-800"}`}
        ></div>
        <div
          className={`md:hidden h-px w-16 transition-colors ${isCurrentMatch ? "bg-primary/40" : "bg-zinc-800"}`}
        ></div>

        <div className="flex flex-col items-center gap-4 z-10 mx-15">
          <div
            className={`p-3 border-2 transform rotate-45 transition-all ${isCurrentMatch ? "bg-primary border-primary shadow-[0_0_15px_rgba(255,179,0,0.3)]" : "bg-zinc-900 border-zinc-800"}`}
          >
            <Sword
              size={20}
              className={`transform -rotate-45 transition-colors ${isCurrentMatch ? "text-black" : "text-zinc-700"}`}
            />
          </div>
          {isStaff && !isLocked && !isFinished && isCurrentMatch && (
            <button
              onClick={() => {}}
              className="bg-zinc-900 p-2 border border-zinc-800 hover:border-primary hover:text-primary text-zinc-500 transition-all rounded-full shadow-xl animate-in fade-in"
              title="Inverter Lados (TR/CT)"
            >
              <Shuffle size={14} />
            </button>
          )}
        </div>

        <div
          className={`hidden md:block w-px h-32 transition-colors ${isCurrentMatch ? "bg-primary/40" : "bg-zinc-800"}`}
        ></div>
        <div
          className={`md:hidden h-px w-16 transition-colors ${isCurrentMatch ? "bg-primary/40" : "bg-zinc-800"}`}
        ></div>

        {/* Status Badge */}
        <div
          className={`absolute -bottom-10 md:-bottom-[-25%] md:left-1/2 md:-translate-x-1/2 px-4 py-1.5 border text-[9px] font-black whitespace-nowrap uppercase tracking-[0.2em] italic transition-all ${
            match.status === MatchStatus.ONGOING
              ? "bg-indigo-600 border-indigo-400 text-white animate-pulse shadow-[0_0_15px_rgba(99,102,241,0.4)]"
              : isCurrentMatch
                ? "bg-zinc-900 border-primary text-primary"
                : "bg-zinc-950 border-zinc-800 text-zinc-700"
          }`}
        >
          {match.status}
        </div>
      </div>

      <TeamMatchCard
        isStaff={isStaff}
        match={match}
        team={match.team2}
        displaySide={"TR"}
      />
    </div>
  );
}

export function HandleGameSection({ match }: { match: Match }) {
  const initGameCooldown = useCountdown(3);
  const finishGameCooldown = useCountdown(3);

  const handleClick = (status: MatchStatus) => {
    if (match.status !== status) {
      if (status === MatchStatus.ONGOING) {
        if (!initGameCooldown.active) return initGameCooldown.start();

        initGameCooldown.reset();
        handleStatusChange(status);
      } else {
        if (status === MatchStatus.FINISHED) {
          if (!finishGameCooldown.active) return finishGameCooldown.start();
          finishGameCooldown.reset();
          handleStatusChange(status);
        }
      }
    }
  };

  const handleStatusChange = async (status: MatchStatus) => {
    const result = await updateMatchStatusAction(match.id, status);
    if (!result.success) toast.error(result.error);
  };

  return (
    <div className="mt-16 animate-in fade-in duration-1000 gap-5 flex justify-center">
      <ActionButton
        onClick={() => handleClick(MatchStatus.ONGOING)}
        intent={initGameCooldown.active ? "success" : "default"}
        disabled={match.status === "ONGOING"}
      >
        {initGameCooldown.active
          ? `INICIAR JOGO (${initGameCooldown.time})`
          : match.status === "ONGOING"
            ? "JOGO INICIADO"
            : "INICIAR JOGO"}
      </ActionButton>
      <ActionButton
        onClick={() => handleClick(MatchStatus.FINISHED)}
        intent={finishGameCooldown.active ? "danger" : "default"}
        disabled={match.status === "FINISHED"}
      >
        {finishGameCooldown.active
          ? `FINALIZAR JOGO (${finishGameCooldown.time})`
          : match.status === "FINISHED"
            ? "FINALIZADO"
            : "FINALIZAR JOGO"}
      </ActionButton>
    </div>
  );
}

export function MatchHeader({
  match,
  // isStaff,
}: {
  match: Match;
  isStaff: boolean;
}) {
  const isCurrentMatch = match.status === "ONGOING";

  return (
    <div className="flex flex-col items-center gap-2 mb-10">
      <div className="flex items-center gap-4">
        <div
          className={`h-px w-12 sm:w-32 transition-colors ${isCurrentMatch ? "bg-primary" : "bg-zinc-800"}`}
        ></div>
        <h4
          className={`font-black text-xs sm:text-sm tracking-[0.5em] uppercase italic transition-colors ${isCurrentMatch ? "text-primary" : "text-zinc-600"}`}
        >
          {match.status === "ONGOING"
            ? `ROLANDO AGORA - ${match.id.replace("m", "")}`
            : `CONFRONTO - ${match.id.replace("m", "")}`}
        </h4>
        <div
          className={`h-px w-12 sm:w-32 transition-colors ${isCurrentMatch ? "bg-primary" : "bg-zinc-800"}`}
        ></div>
      </div>
    </div>
  );
}
