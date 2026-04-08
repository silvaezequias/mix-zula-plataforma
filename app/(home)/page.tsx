"use server";

import Link from "next/link";
import { Zap } from "lucide-react";
import { HightlightedBanner } from "@/components/ui/HighlightedBanner";
import { Layout } from "@/components/Layout";
import { Page } from "@/components/Page";
import { Resources } from "./Resources";
import { Hero } from "./Hero";
import { CallToAction } from "./CallToAction";
import { TournamentService } from "@/features/tournament/service";
import getDiscordMembers from "@/lib/getDiscordMembers";
import { community } from "@/config/brand";

export default async function LandingPage() {
  const highlightedTournament =
    await TournamentService.findFirstByStatus("OPEN");

  const discordMembersCount = await getDiscordMembers(
    community.discordInviteCode,
  );

  return (
    <Page>
      {highlightedTournament && (
        <Link href={`/torneios/${highlightedTournament.id}/participar`}>
          <HightlightedBanner cta="INSCREVER AGORA">
            <Zap size={14} fill="black" />
            INSCRIÇÕES ABERTAS: {highlightedTournament.title}
            <span className="opacity-40">•</span>
            PREMIAÇÃO: {highlightedTournament.prize}
            <span className="opacity-40">•</span>
            VAGAS DISPONÍVEIS:{" "}
            {highlightedTournament.totalTeams *
              highlightedTournament.playersPerTeam -
              highlightedTournament._count.participants}
            {" DE "}
            {highlightedTournament.totalTeams *
              highlightedTournament.playersPerTeam}
            <span className="opacity-40">•</span>
          </HightlightedBanner>
        </Link>
      )}
      <Layout>
        <Hero discordMembersCount={discordMembersCount} />
        <Resources />
        <CallToAction />
      </Layout>
    </Page>
  );
}
