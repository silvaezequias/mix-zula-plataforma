"use server";

import Link from "next/link";
import { Trophy, Clock, LayoutGrid, Plus } from "lucide-react";
import { TournamentCard } from "./TournamentCard";
import { Page } from "@/components/Page";
import { Layout } from "@/components/Layout";
import { brand } from "@/config/brand";
import { TournamentService } from "@/features/tournament/service";
import { BETA_WHITELIST } from "@/constants/data";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { ActionButton } from "@/components/ui/ActionButton";
import { TournamentAtList } from "@/types";

export default async function TournamentListPage() {
  const session = await getServerSession(authOptions);
  const tournaments = (
    await TournamentService.list({ _count: { select: { participants: true } } })
  ).sort((a, b) => {
    return Number(b.status === "OPEN") - Number(a.status === "OPEN");
  });

  const canCreateTournament =
    session && BETA_WHITELIST.includes(session.user.discordId);

  return (
    <Page>
      <Layout>
        <div className="relative h-[40vh] flex items-center justify-center border-b border-zinc-900 overflow-hidden">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-primary opacity-10 blur-[150px] rounded-full"></div>

          <div className="relative z-10 px-10 text-center flex flex-col justify-center items-center space-y-4 animate-in fade-in zoom-in-95 duration-1000">
            <div className="flex items-center justify-center gap-4 mb-2">
              <div className="h-0.5 w-8 bg-primary"></div>
              <Trophy size={24} className="text-primary" />
              <div className="h-0.5 w-8 bg-primary"></div>
            </div>
            <h1 className="text-5xl sm:text-7xl font-black italic tracking-tighter uppercase leading-none">
              {brand.name} <span className="text-primary">TORNEIOS</span>
            </h1>
            <p className="text-zinc-500 text-[10px] max-w-[80%] font-bold tracking-[0.5em] uppercase">
              Participe de um torneio e testes suas habilidades, pode levar a
              melhor.
            </p>

            {canCreateTournament && (
              <Link href="/torneios/criar">
                <ActionButton className="uppercase font-black mt-5">
                  <Plus /> Criar campeonato
                </ActionButton>
              </Link>
            )}
          </div>
        </div>

        <main className="max-w-7xl mx-auto px-6 py-16 sm:py-24">
          <div className="flex flex-col sm:flex-row justify-between items-center mb-12 gap-6 border-b border-zinc-900 pb-8">
            <div className="flex items-center gap-6">
              <div className="flex items-center gap-2 border-b-2 border-primary pb-2 cursor-pointer">
                <LayoutGrid size={16} className="text-primary" />
                <span className="text-xs font-black uppercase">
                  Todos os Torneios
                </span>
              </div>
            </div>

            <div className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">
              {tournaments.length} TORNEIOS LOCALIZADOS
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-2 gap-8 animate-in slide-in-from-bottom-4 duration-700">
            {tournaments.map((tournament) => (
              <Link key={tournament.id} href={`/torneios/${tournament.id}`}>
                <TournamentCard tournament={tournament as TournamentAtList} />
              </Link>
            ))}
          </div>
          <div className="mt-24 text-center space-y-6 opacity-30">
            <Clock size={32} className="mx-auto text-zinc-700" />
            <p className="text-[10px] font-bold uppercase tracking-[0.4em]">
              Novos torneios em breve em {brand.name}
            </p>
          </div>
        </main>
      </Layout>
    </Page>
  );
}
