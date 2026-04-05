"use client";

import { useState } from "react";
import { Championship, Team, Match } from "@/types";
import { PayloadUser } from "@/types/next-auth";
import { ChampionshipDetailView } from "./ChampionshipDetailView";
import { Sidebar } from "@/components/layout/Sidebar";
import { Page } from "@/components/Page";
import { Logo } from "@/components/Brand";
import { Menu, X } from "lucide-react";
import { Session } from "next-auth";
import Container from "@/components/ui/Container";

export function Tournament({
  session,
  initialChampionship,
}: {
  session: Session;
  initialChampionship: Championship;
}) {
  const [championship, setChampionship] =
    useState<Championship>(initialChampionship);

  const [staffList] = useState<PayloadUser[]>([]);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const isStaff = true;

  const handleRandomize = () => {
    setChampionship((c) => {
      const shuffled = [...c.players].sort(() => 0.5 - Math.random());

      const teams: Team[] = [];
      for (let i = 0; i < c.settings.totalTeams; i++) {
        teams.push({
          id: `team-${i + 1}`,
          name: `EQUIPE ${String.fromCharCode(65 + i)}`,
          players: shuffled.slice(
            i * c.settings.playersPerTeam,
            (i + 1) * c.settings.playersPerTeam,
          ),
          side: i % 2 === 0 ? "TR" : "CT",
        });
      }

      const matches: Match[] = [];
      for (let i = 0; i < teams.length; i += 2) {
        matches.push({
          id: "m" + i,
          currentRound: 1,
          order: i,
          phase: 4,
          status: "desligado",
          swappedSides: false,
          teamAId: teams[i].id,
          teamBId: teams[i + 1].id,
        });
      }

      if (matches[0]) matches[0].status = "iniciado";

      return {
        ...c,
        status: "live",
        teams,
        matches,
      };
    });
  };

  return (
    <Page>
      <Container>
        <div className="max-w-480 mx-auto min-h-screen flex flex-col lg:flex-row">
          <div className="lg:hidden flex justify-between p-4 bg-[#111]">
            <Logo />
            <button onClick={() => setIsMobileMenuOpen((v) => !v)}>
              {isMobileMenuOpen ? <X /> : <Menu />}
            </button>
          </div>

          <main className="flex-1 overflow-y-auto bg-[radial-gradient(circle_at_top_left,#111_0%,#050505_100%)] order-2 lg:order-1">
            <div className="hidden lg:flex justify-between h-14 bg-[#111] items-center px-8 top-0 z-40">
              <Logo />{" "}
            </div>
            <div className="p-6">
              <ChampionshipDetailView
                players={championship.players}
                tournamentId={championship.id}
                activeChamp={championship}
                isStaff={isStaff}
                onRandomize={handleRandomize}
                onManageUser={() => {}}
                setChampionships={() => {}}
              />
            </div>
          </main>

          <Sidebar
            staff={staffList}
            currentUser={session.user}
            activeChamp={championship}
            isStaff={isStaff}
            isOpen={isMobileMenuOpen}
            onClose={() => setIsMobileMenuOpen(false)}
            onManageUser={() => {}}
          />
        </div>
      </Container>
    </Page>
  );
}
