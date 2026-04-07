// app/torneios/[id]/page.tsx
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { redirect } from "next/navigation";

import { MOCK_TOURNAMENTS } from "@/constants/data";
import { Tournament } from "./Tournament";
import { AlertTriangle } from "lucide-react";
import Link from "next/link";

export default async function TournamentPage(props: {
  params: Promise<{ id: string }>;
}) {
  const params = await props.params;
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect(`/login?redirect=/torneios/${params.id}`);
  }

  const tournamentId = params.id;

  const activeChamp =
    MOCK_TOURNAMENTS.find((c) => c.id === tournamentId) || null;

  if (!activeChamp) {
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

  return <Tournament session={session} initialChampionship={activeChamp} />;
}
