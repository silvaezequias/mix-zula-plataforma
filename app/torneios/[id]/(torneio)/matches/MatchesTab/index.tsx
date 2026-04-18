"use client";

import React from "react";
import { Gamepad, Trophy } from "lucide-react";
import { MatchHeader, DisplayTeams, HandleGameSection } from "./Match";
import { Prisma } from "@prisma/client";

interface MatchesTabProps {
  swapTeam: boolean;
  matches: Prisma.MatchGetPayload<{
    include: {
      team1: { include: { members: { include: { participant: true } } } };
      team2: { include: { members: { include: { participant: true } } } };
      round: true;
      winnerTeam: true;
    };
  }>[];
}

export const MatchesTab: React.FC<MatchesTabProps> = ({
  matches,
  swapTeam,
}) => {
  if (matches.length === 0) {
    return (
      <div className="col-span-2 py-32 text-center border-2 border-dashed border-zinc-900">
        <Gamepad size={48} className="mx-auto text-zinc-900 mb-4" />
        <p className="text-zinc-700 font-black uppercase italic tracking-[0.4em]">
          Os jogos ainda não foram definidos
        </p>
      </div>
    );
  }

  return (
    <div className="py-10 px-4 space-y-24 flex flex-col items-center italic tracking-widest">
      {matches.map((match) => {
        return (
          <div key={match.id}>
            <MatchHeader match={match} />
            <DisplayTeams match={match} swapTeam={swapTeam} />
            <HandleGameSection match={match} />
          </div>
        );
      })}

      {matches.length > 0 && matches.every((m) => m.status === "FINISHED") && (
        <div className="py-24 text-center space-y-6 animate-in zoom-in duration-1000">
          <div className="relative inline-block">
            <div className="absolute inset-0 bg-primary blur-3xl opacity-5"></div>
            <Trophy size={80} className="text-primary mx-auto relative z-10" />
          </div>
          <div className="space-y-2">
            <h2 className="text-4xl font-black italic text-white tracking-tighter uppercase">
              CAMPANHA ENCERRADA
            </h2>
            <p className="text-zinc-500 font-bold uppercase tracking-[0.4em] text-sm italic">
              O Grande Vencedor foi Coroado
            </p>
          </div>
        </div>
      )}
    </div>
  );
};
