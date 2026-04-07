"use client";

import { useState } from "react";
import { FullTournament } from "@/types";
import { PayloadUser } from "@/types/next-auth";
import { TournamentDetailView } from "./TournamentDetailView";
import { Sidebar } from "@/components/layout/Sidebar";
import { Page } from "@/components/Page";
import { Logo } from "@/components/Brand";
import { Menu, X } from "lucide-react";
import { Session } from "next-auth";

export function TournamentSection({
  session,
  tournament,
}: {
  session: Session;
  tournament: FullTournament;
}) {
  const [staffList] = useState<PayloadUser[]>([]);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const isStaff = true;

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
              isStaff={isStaff}
              onRandomize={() => {}}
              onManageUser={() => {}}
            />
          </div>
        </main>

        <Sidebar
          staff={staffList}
          currentUser={session.user}
          tournament={tournament}
          isStaff={isStaff}
          isOpen={isMobileMenuOpen}
          onClose={() => setIsMobileMenuOpen(false)}
          onManageUser={() => {}}
        />
      </div>
    </Page>
  );
}
