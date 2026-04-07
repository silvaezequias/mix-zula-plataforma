"use client";

import { useState } from "react";
import { FullTournament } from "@/types";
import { TournamentDetailView } from "./TournamentDetailView";
import { Sidebar } from "@/components/layout/Sidebar";
import { Page } from "@/components/Page";
import { Logo } from "@/components/Brand";
import { Menu, X } from "lucide-react";
import { Session } from "next-auth";
import { Participant } from "@prisma/client";

export function TournamentSection({
  session,
  sessionMember,
  tournament,
}: {
  session: Session;
  tournament: FullTournament;
  sessionMember: Participant | null;
}) {
  const [staffList] = useState(
    tournament.participants.filter((p) => p.role !== "PLAYER"),
  );
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <Page>
      <div className="max-w-480 mx-auto h-screen max-h-screen flex flex-col lg:flex-row">
        <div className="lg:hidden flex justify-between p-4 bg-[#111]">
          <Logo />
          <button onClick={() => setIsMobileMenuOpen((v) => !v)}>
            {isMobileMenuOpen ? <X /> : <Menu />}
          </button>
        </div>

        <main className="flex-1 overflow-y-auto h-screen bg-[radial-gradient(circle_at_top_left,#111_0%,#050505_100%)] order-2 lg:order-1">
          <div className="hidden lg:flex justify-between h-14 bg-[#111] items-center px-8 top-0 z-40 ">
            <Logo />{" "}
          </div>
          <div className="p-6">
            <TournamentDetailView
              tournament={tournament}
              sessionMember={sessionMember}
              onRandomize={() => {}}
              onManageUser={() => {}}
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
