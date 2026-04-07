import { FullTournament } from "@/types";
import { Minus, Plus, Shuffle, Sword } from "lucide-react";
import { TeamMatchCard } from "./TeamMatchCard";
import { MatchStatus } from "@prisma/client";

export function DisplayTeams({
  match,
  tournament,
}: {
  match: FullTournament["matches"][number];
  tournament: FullTournament;
}) {
  const isCurrentMatch = match.status === "ONGOING";
  const isFinished = match.status === "FINISHED";
  const isLocked = tournament.swapTeam;
  const isStaff = true;

  return (
    <div className="flex flex-col md:flex-row items-center justify-center gap-8 md:gap-0 w-full max-w-4xl relative">
      <TeamMatchCard match={match} team={match.team1} displaySide={"CT"} />

      {/* Conector VS com Ação de Troca de Lados */}
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

      <TeamMatchCard match={match} team={match.team1} displaySide={"TR"} />
    </div>
  );
}

export function HandleGameSection({
  match,
}: {
  match: FullTournament["matches"][number];
}) {
  return (
    <div className="mt-16 animate-in fade-in duration-1000">
      <button
        onClick={() => {}}
        className={`px-10 py-3 text-[11px] font-black border transition-all uppercase italic tracking-[0.3em] ${
          match.status === "ONGOING"
            ? "bg-indigo-600 border-indigo-500 text-white shadow-[0_0_25px_rgba(99,102,241,0.3)]"
            : "bg-transparent border-primary text-primary hover:bg-primary hover:text-black"
        }`}
      >
        {match.status === "ONGOING" ? "JOGO INICIADO" : "INICIAR JOGO"}
      </button>
    </div>
  );
}

export function MatchHeader({
  match,
}: {
  match: FullTournament["matches"][number];
}) {
  const isCurrentMatch = match.status === "ONGOING";
  const isFinished = match.status === "FINISHED";

  const isStaff = true; // TODO: STAFF MANAGEMENT

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
            ? "GRANDE FINAL"
            : `CONFRONTO ${match.id.replace("m", "")}`}
        </h4>
        <div
          className={`h-px w-12 sm:w-32 transition-colors ${isCurrentMatch ? "bg-primary" : "bg-zinc-800"}`}
        ></div>
      </div>

      {/* Controle de Rounds (Apenas se em destaque) */}
      <div
        className={`flex items-center gap-4 bg-zinc-900 border px-6 py-2 mt-3 shadow-2xl transition-all ${isCurrentMatch ? "border-primary shadow-[0_0_20px_rgba(255,179,0,0.1)]" : "border-zinc-800 opacity-40"}`}
      >
        <span className="text-[10px] font-black text-zinc-500 uppercase tracking-widest italic mr-2">
          RODADA ATUAL:
        </span>
        {isStaff && !isFinished && isCurrentMatch && (
          <button
            onClick={() => {}}
            className="text-zinc-600 hover:text-primary transition-colors"
          >
            <Minus size={16} />
          </button>
        )}
        <span
          className={`text-xl font-black w-8 text-center ${isCurrentMatch ? "text-white" : "text-zinc-700"}`}
        >
          {match.status === "ONGOING"}
        </span>
        {isStaff && !isFinished && isCurrentMatch && (
          <button
            onClick={() => {}}
            className="text-zinc-600 hover:text-primary transition-colors"
          >
            <Plus size={16} />
          </button>
        )}
      </div>
    </div>
  );
}
