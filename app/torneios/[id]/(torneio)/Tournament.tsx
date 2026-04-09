"use client";

import { useState } from "react";
import { FullTournament, FullTournamentRoleRequest } from "@/types";
import { TournamentDetailView } from "./TournamentDetailView";
import { Sidebar } from "@/components/Sidebar";
import { Page } from "@/components/Page";
import { Logo } from "@/components/Brand";
import { Menu, X } from "lucide-react";
import { Session } from "next-auth";
import { Participant } from "@prisma/client";

export function TournamentSection({
  session,
  sessionMember,
  tournament,
  tournamentRoleRequests,
}: {
  session: Session;
  tournament: FullTournament;
  sessionMember: Participant | null;
  tournamentRoleRequests: FullTournamentRoleRequest[] | null;
}) {
  const staffList = tournament.participants.filter((p) => p.role !== "PLAYER");
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <Page>
      <div className="max-w-480 mx-auto h-screen max-h-screen flex flex-col lg:flex-row">
        <main className="flex-1 overflow-y-auto h-screen bg-[radial-gradient(circle_at_top_left,#111_0%,#050505_100%)] order-2 lg:order-1">
          <div className="lg:hidden flex justify-between p-4 bg-[#111]">
            <Logo />
            <button onClick={() => setIsMobileMenuOpen((v) => !v)}>
              {isMobileMenuOpen ? <X /> : <Menu />}
            </button>
          </div>
          <div className="hidden lg:flex justify-between h-14 bg-[#111] items-center px-8 top-0 z-40 ">
            <Logo />{" "}
          </div>
          <div className="p-6">
            <div className="inline-block bg-primary text-black px-4 py-1 text-[10px] font-black mb-4 skew-x-[-15deg]">
              <span className="inline-block skew-x-15">
                INFORMAÇÕES DO TORNEIO
              </span>
            </div>
            <h1 className="text-4xl sm:text-5xl font-black italic tracking-tighter leading-none mb-6 uppercase">
              {tournament.title}
            </h1>

            <TournamentDetailView
              tournament={tournament}
              sessionMember={sessionMember}
              tournamentRoleRequests={tournamentRoleRequests}
              onRandomize={() => {}}
            />
          </div>
        </main>

        <Sidebar
          staff={staffList}
          currentUser={session.user}
          tournament={tournament}
          sessionMember={sessionMember}
          isOpen={isMobileMenuOpen}
          onClose={() => setIsMobileMenuOpen(false)}
          onManageUser={() => {}}
        />
      </div>
    </Page>
  );
}
