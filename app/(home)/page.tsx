"use server";

import { Zap } from "lucide-react";
import { MOCK_TOURNAMENTS } from "@/contansts/data";
import { HightlightedBanner } from "@/components/ui/HighlightedBanner";
import { Layout } from "@/components/Layout";
import { Page } from "@/components/Page";
import { Resources } from "./Resources";
import { Hero } from "./Hero";
import { CallToAction } from "./CallToAction";
import Link from "next/link";

export default async function LandingPage() {
  const highlightedTournament = MOCK_TOURNAMENTS.find(
    (t) => t.status === "open",
  );

  return (
    <Page>
      {highlightedTournament && (
        <Link href={`/torneios/${highlightedTournament.id}/participar`}>
          <HightlightedBanner cta="INSCREVER AGORA">
            <Zap size={14} fill="black" />
            ALISTAMENTO ABERTO: {highlightedTournament.name}
            <span className="opacity-40">•</span>
            PREMIAÇÃO: {highlightedTournament.prize}
            <span className="opacity-40">•</span>
            VAGAS: {highlightedTournament.players.length}/
            {highlightedTournament.settings.totalTeams *
              highlightedTournament.settings.playersPerTeam}
            <span className="opacity-40">•</span>
          </HightlightedBanner>
        </Link>
      )}
      <Layout>
        <Hero />
        <Resources />
        <CallToAction />
      </Layout>
    </Page>
  );
}
