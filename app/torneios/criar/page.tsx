"use server";

import CreateTournament from "./CreateTournament";
import { Layout } from "@/components/Layout";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { redirect } from "next/navigation";
import { BETA_WHITELIST } from "@/constants/data";

export default async function CreateTournamentPage() {
  const session = await getServerSession(authOptions);

  if (!session) redirect(`/login?redirect=/torneios/criar`);

  if (!session.user.isOnboarded) {
    redirect(`/atualizar-cadastro?redirect=/torneios/criar`);
  }

  if (!BETA_WHITELIST.includes(session?.user.discordId as string))
    redirect(`/torneios`);

  return (
    <Layout>
      <CreateTournament />
    </Layout>
  );
}
