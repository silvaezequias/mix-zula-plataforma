"use server";

import { Layout } from "@/components/Layout";
import { Page } from "@/components/Page";
import { AlertTriangle } from "lucide-react";
import { TournamentService } from "@/features/tournament/service";
import Link from "next/link";
import { requireAuth } from "@/lib/authorization/accessControl";
import { HasRequestedStaffRole } from "./HasRequestedStaffRole";
import { redirect } from "next/navigation";
import { prisma } from "@/infra/prisma";

export default async function RequestTournamentRole(props: {
  params: Promise<{ id: string }>;
}) {
  const params = await props.params;
  const tournament = await TournamentService.findById(prisma, params.id);

  if (!tournament) {
    return (
      <div className="min-h-screen bg-[#050505] flex items-center justify-center p-6 text-white uppercase italic">
        <div className="text-center space-y-4">
          <AlertTriangle size={48} className="text-primary mx-auto" />
          <h2 className="text-2xl font-black italic tracking-tighter">
            TORNEIO NÃO LOCALIZADO
          </h2>
          <p className="text-zinc-500 text-xs uppercase tracking-widest">
            O ID DO TORNEIO É INVÁLIDO OU EXPIRADO
          </p>
          <Link href="/torneios">
            <button className="text-primary hover:text-white transition-colors underline text-xs font-bold mt-4 uppercase">
              Voltar à lista
            </button>
          </Link>
        </div>
      </div>
    );
  }

  const { session } = await requireAuth({
    forceRedirect: `/torneios/${tournament.id}/staff/resultado`,
  });

  const requestedRole = await TournamentService.findTournamentRoleRequest(
    tournament?.id,
    session.user.id,
  );

  if (!requestedRole) redirect(`/torneios/${tournament.id}/staff`);

  return (
    <Page>
      <Layout>
        <HasRequestedStaffRole
          requestedRole={requestedRole}
          tournament={tournament}
        />
      </Layout>
    </Page>
  );
}
